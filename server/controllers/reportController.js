import Task from '../models/Task.js';
import Meeting from '../models/Meeting.js';
import Team from '../models/Team.js';
import User from '../models/User.js';

export const getReports = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user.teamId) return res.json({ 
      success: true, report: null 
    });

    const team = await Team.findById(user.teamId)
      .populate('members', 'name email skills');

    if (!team) return res.json({ 
      success: true, report: null 
    });

    // Per member stats
    const memberStats = await Promise.all(
      team.members.map(async (member) => {
        const totalTasks = await Task.countDocuments({ 
          assignedTo: member._id, teamId: user.teamId 
        });
        const completedTasks = await Task.countDocuments({ 
          assignedTo: member._id, teamId: user.teamId, 
          status: 'done' 
        });
        const activeTasks = await Task.countDocuments({ 
          assignedTo: member._id, teamId: user.teamId, 
          status: 'inprogress' 
        });
        const meetings = await Meeting.countDocuments({
          teamId: user.teamId,
          'attendees': { 
            $elemMatch: { 
              user: member._id, 
              status: 'attended' 
            } 
          }
        });
        const missedMeetings = await Meeting.countDocuments({
          teamId: user.teamId,
          'attendees': { 
            $elemMatch: { 
              user: member._id, 
              status: 'missed' 
            } 
          }
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
          meetingsAttended: meetings,
          meetingsMissed: missedMeetings,
          completion
        };
      })
    );

    // Team overall
    const totalTasks = await Task.countDocuments({ 
      teamId: user.teamId 
    });
    const completedTasks = await Task.countDocuments({ 
      teamId: user.teamId, status: 'done' 
    });
    const totalMeetings = await Meeting.countDocuments({ 
      teamId: user.teamId 
    });
    const teamCompletion = totalTasks > 0 
      ? Math.round((completedTasks / totalTasks) * 100) 
      : 0;

    res.json({
      success: true,
      report: {
        teamName: team.name,
        teamCode: team.code,
        totalMembers: team.members.length,
        totalTasks,
        completedTasks,
        totalMeetings,
        teamCompletion,
        members: memberStats
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
