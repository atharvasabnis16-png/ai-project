import Meeting from '../models/Meeting.js';
import { aiService } from '../services/claudeService.js';

// GET /api/meetings
export const getMeetings = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user.teamId) {
      return res.status(400).json({ message: 'Join a team first' });
    }

    const meetings = await Meeting.find({ teamId: user.teamId })
      .populate('createdBy', 'name email')
      .sort({ date: -1 });

    res.json({ meetings });
  } catch (error) {
    next(error);
  }
};

// POST /api/meetings
export const createMeeting = async (req, res, next) => {
  try {
    const { title, date, transcript, speakerParticipation } = req.body;
    const user = req.user;

    if (!user.teamId) {
      return res.status(400).json({ message: 'Join a team first' });
    }

    const meeting = await Meeting.create({
      teamId: user.teamId,
      title,
      date: date || new Date(),
      transcript: transcript || '',
      speakerParticipation: speakerParticipation || [],
      createdBy: req.userId
    });

    res.status(201).json({ meeting });
  } catch (error) {
    next(error);
  }
};

// POST /api/meetings/:id/analyze
export const analyzeMeeting = async (req, res, next) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    const analysis = await aiService.analyzeMeeting(meeting.transcript);
    
    meeting.aiSummary = analysis.summary;
    meeting.decisions = analysis.decisions;
    meeting.actionItems = analysis.actionItems;
    await meeting.save();

    res.json({ meeting, analysis });
  } catch (error) {
    next(error);
  }
};
