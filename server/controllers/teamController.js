import Team from '../models/Team.js';
import User from '../models/User.js';
import { v4 as uuidv4 } from 'uuid';

// Generate a 6-char invite code
const generateInviteCode = () => {
  return uuidv4().replace(/-/g, '').substring(0, 6).toUpperCase();
};

// POST /api/teams — Create a new team
export const createTeam = async (req, res, next) => {
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
export const joinTeam = async (req, res, next) => {
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

// GET /api/teams/:id/stats — Get team contribution stats
export const getTeamStats = async (req, res, next) => {
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
