/**
 * Skill Match Service — Rule-based AI task assignment
 * 
 * Matches task skillTag to team members with highest confidence in that skill.
 * Factors in current workload (number of active tasks) to balance assignments.
 */

import Task from '../models/Task.js';

/**
 * Find the best-fit team member for a task based on skill matching
 * @param {Array} members - Array of User documents (with skills populated)
 * @param {String} skillTag - The skill required for the task
 * @param {String} teamId - The team ID to check workload
 * @returns {Object} - Best fit member and reasoning
 */
export const findBestFitMember = async (members, skillTag, teamId) => {
  if (!members || members.length === 0) {
    return { member: null, reason: 'No team members available' };
  }

  // Get current task counts for all members
  const taskCounts = await Promise.all(
    members.map(async (member) => {
      const activeTasks = await Task.countDocuments({
        assignee: member._id,
        teamId: teamId,
        status: { $ne: 'done' }
      });
      return { memberId: member._id.toString(), count: activeTasks };
    })
  );

  const taskCountMap = {};
  taskCounts.forEach(tc => { taskCountMap[tc.memberId] = tc.count; });

  // Score each member: skill confidence (0-5) minus workload penalty
  const scoredMembers = members.map(member => {
    const skill = member.skills.find(s => s.name === skillTag);
    const skillScore = skill ? skill.confidence : 0;
    const workload = taskCountMap[member._id.toString()] || 0;
    const workloadPenalty = workload * 0.5; // Each active task reduces score by 0.5

    return {
      member,
      skillScore,
      workload,
      totalScore: skillScore - workloadPenalty,
      reason: `Skill: ${skillScore}/5, Active tasks: ${workload}`
    };
  });

  // Sort by total score (highest first)
  scoredMembers.sort((a, b) => b.totalScore - a.totalScore);

  const best = scoredMembers[0];
  return {
    member: best.member,
    reason: `Best fit: ${best.member.name} (${best.reason})`,
    allScores: scoredMembers.map(s => ({
      name: s.member.name,
      skillScore: s.skillScore,
      workload: s.workload,
      totalScore: s.totalScore
    }))
  };
};

/**
 * Detect workload fairness issues
 * @param {Array} members - Team members
 * @param {String} teamId - Team ID
 * @returns {Object} - Fairness analysis
 */
export const analyzeFairness = async (members, teamId) => {
  const memberStats = await Promise.all(
    members.map(async (member) => {
      const totalTasks = await Task.countDocuments({ assignee: member._id, teamId });
      const completedTasks = await Task.countDocuments({ assignee: member._id, teamId, status: 'done' });
      const activeTasks = await Task.countDocuments({ assignee: member._id, teamId, status: { $ne: 'done' } });
      
      return {
        memberId: member._id,
        name: member.name,
        totalTasks,
        completedTasks,
        activeTasks,
        completionRate: totalTasks > 0 ? (completedTasks / totalTasks * 100).toFixed(1) : 0
      };
    })
  );

  const totalAllTasks = memberStats.reduce((sum, s) => sum + s.totalTasks, 0);
  
  const alerts = [];
  memberStats.forEach(stat => {
    const contribution = totalAllTasks > 0 ? (stat.totalTasks / totalAllTasks * 100) : 0;
    stat.contributionPercent = contribution.toFixed(1);
    
    if (contribution > 50) {
      alerts.push({ type: 'high-workload', member: stat.name, message: `${stat.name} has >50% of all tasks (${stat.contributionPercent}%)` });
    }
    if (contribution < 10 && members.length > 2) {
      alerts.push({ type: 'low-participation', member: stat.name, message: `${stat.name} has <10% of tasks (${stat.contributionPercent}%)` });
    }
  });

  return {
    memberStats,
    totalTasks: totalAllTasks,
    isBalanced: alerts.length === 0,
    alerts
  };
};

export default { findBestFitMember, analyzeFairness };
