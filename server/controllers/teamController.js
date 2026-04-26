import Team from '../models/Team.js';
import User from '../models/User.js';
import Task from '../models/Task.js';

// Generate a 6-char invite code
const generateInviteCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const createTeam = async (req, res) => {
  try {
    const { name, projectName } = req.body;
    if (!name || !projectName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Team name and project name are required' 
      });
    }
    const code = Math.random().toString(36)
      .substring(2, 8).toUpperCase();
    const team = await Team.create({
      name,
      projectName,
      code,
      leader: req.userId,
      members: [req.userId]
    });
    await User.findByIdAndUpdate(req.userId, { teamId: team._id });
    const populated = await Team.findById(team._id)
      .populate('members', 'name email skills')
      .populate('leader', 'name email');
    res.status(201).json({ success: true, team: populated });
  } catch (error) {
    console.error('Create team error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const joinTeam = async (req, res) => {
  try {
    const { code } = req.body;
    
    const team = await Team.findOne({ 
      code: code.toUpperCase() 
    });
    
    if (!team) {
      return res.status(404).json({ 
        success: false, 
        message: 'Invalid team code. Please check and try again.' 
      });
    }
    
    // Check if already in team
    if (team.members.includes(req.userId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'You are already in this team.' 
      });
    }
    
    // Add member to team
    team.members.push(req.userId);
    await team.save();
    
    // Update user teamId
    await User.findByIdAndUpdate(req.userId, { teamId: team._id });
    
    res.json({ success: true, team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyTeam = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user.teamId) {
      return res.json({ success: true, team: null });
    }
    
    const team = await Team.findById(user.teamId)
      .populate('members', 'name email skills avatar')
      .populate('leader', 'name email');
    
    res.json({ success: true, team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const leaveTeam = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    await Team.findByIdAndUpdate(user.teamId, {
      $pull: { members: req.userId }
    });
    await User.findByIdAndUpdate(req.userId, { teamId: null });
    res.json({ success: true, message: 'Left team successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/teams — Create a new team
export const createTeamOld = async (req, res, next) => {
  try {
    const { name, projectName, projectDescription } = req.body;

    const inviteCode = generateInviteCode();
    
    const team = await Team.create({
      name,
      inviteCode,
      projectName: projectName || '',
      projectDescription: projectDescription || '',
      members: [req.userId],
      createdBy: req.userId
    });

    // Update user's teamId
    await User.findByIdAndUpdate(req.userId, { teamId: team._id });

    const populated = await Team.findById(team._id).populate('members', 'name email skills profileCompleted');

    res.status(201).json({ team: populated });
  } catch (error) {
    next(error);
  }
};

// POST /api/teams/join — Join team via invite code
export const joinTeamOld = async (req, res, next) => {
  try {
    const { inviteCode } = req.body;

    const team = await Team.findOne({ inviteCode: inviteCode.toUpperCase() });
    if (!team) {
      return res.status(404).json({ message: 'Invalid invite code. No team found.' });
    }

    // Check if already a member
    if (team.members.includes(req.userId)) {
      return res.status(400).json({ message: 'You are already a member of this team' });
    }

    // Check team size limit (max 10)
    if (team.members.length >= 10) {
      return res.status(400).json({ message: 'Team is full (max 10 members)' });
    }

    team.members.push(req.userId);
    await team.save();

    // Update user's teamId
    await User.findByIdAndUpdate(req.userId, { teamId: team._id });

    const populated = await Team.findById(team._id).populate('members', 'name email skills profileCompleted');
    
    res.json({ team: populated });
  } catch (error) {
    next(error);
  }
};

// GET /api/teams/:id — Get team details
export const getTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('members', 'name email skills profileCompleted avatar');

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Verify the requesting user is a member
    if (!team.members.some(m => m._id.toString() === req.userId)) {
      return res.status(403).json({ message: 'You are not a member of this team' });
    }

    res.json({ team });
  } catch (error) {
    next(error);
  }
};

// GET /api/teams/stats — Get team contribution stats
export const getTeamStats = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) return res.status(404).json({ 
      message: 'User not found' 
    });

    // Try finding team where user is a member
    // even if user.teamId is not set
    let teamId = user.teamId;
    
    if (!teamId) {
      const team = await Team.findOne({ 
        members: req.userId 
      });
      if (team) {
        teamId = team._id;
        // Fix the user record too
        await User.findByIdAndUpdate(req.userId, { 
          teamId: team._id 
        });
      }
    }

    if (!teamId) {
      return res.json({
        success: true,
        team: null,
        message: 'Not in a team'
      });
    }

    const team = await Team.findById(teamId)
      .populate('members', 'name email skills');

    if (!team) return res.json({ 
      success: true, 
      team: null 
    });

    const memberStats = await Promise.all(
      team.members.map(async (member) => {
        const totalTasks = await Task.countDocuments({ 
          assignedTo: member._id,
          teamId: teamId
        });
        const completedTasks = await Task.countDocuments({ 
          assignedTo: member._id,
          teamId: teamId,
          status: 'done'
        });
        const activeTasks = await Task.countDocuments({ 
          assignedTo: member._id,
          teamId: teamId,
          status: 'inprogress'
        });
        const completion = totalTasks > 0 
          ? Math.round((completedTasks / totalTasks) * 100) 
          : 0;

        return {
          _id: member._id,
          name: member.name,
          email: member.email,
          skills: member.skills || [],
          totalTasks,
          completedTasks,
          activeTasks,
          completion
        };
      })
    );

    const totalTeamTasks = await Task.countDocuments({ 
      teamId 
    });
    const completedTeamTasks = await Task.countDocuments({ 
      teamId, 
      status: 'done' 
    });
    const teamCompletion = totalTeamTasks > 0 
      ? Math.round((completedTeamTasks / totalTeamTasks) * 100) 
      : 0;

    res.json({
      success: true,
      team: {
        _id: team._id,
        name: team.name,
        code: team.code,
        leaderId: team.leader,
        members: memberStats,
        totalTasks: totalTeamTasks,
        completedTasks: completedTeamTasks,
        teamCompletion
      }
    });
  } catch (error) {
    console.error('getTeamStats error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const analyzeTeamFairness = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id).populate('members', 'name email skills');
    
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Import dynamically to avoid circular deps
    const { analyzeFairness } = await import('../services/skillMatchService.js');
    const fairness = await analyzeFairness(team.members, team._id);

    res.json({ stats: fairness });
  } catch (error) {
    next(error);
  }
};
