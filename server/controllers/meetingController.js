import Meeting from '../models/Meeting.js';
import User from '../models/User.js';
import Team from '../models/Team.js';

export const getMeetings = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user.teamId) return res.json({ 
      success: true, meetings: [] 
    });
    const meetings = await Meeting.find({ 
      teamId: user.teamId 
    })
    .populate('scheduledBy', 'name')
    .sort({ date: 1 });
    res.json({ success: true, meetings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const scheduleMeeting = async (req, res) => {
  try {
    const { title, date, meetLink } = req.body;
    const user = await User.findById(req.userId);
    
    if (!user.teamId) return res.status(400).json({ 
      message: 'Not in a team' 
    });

    const team = await Team.findById(user.teamId)
      .populate('members', '_id');

    const attendees = team.members.map(m => ({
      user: m._id,
      status: 'pending'
    }));

    const meeting = await Meeting.create({
      teamId: user.teamId,
      title,
      date: new Date(date),
      meetLink,
      scheduledBy: req.userId,
      attendees,
      status: 'upcoming'
    });

    await meeting.populate('scheduledBy', 'name');
    res.json({ success: true, meeting });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAttendance = async (req, res) => {
  try {
    const { meetingId, status } = req.body;
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) return res.status(404).json({ 
      message: 'Meeting not found' 
    });

    const attendee = meeting.attendees.find(
      a => a.user.toString() === req.userId.toString()
    );
    if (attendee) {
      attendee.status = status;
    } else {
      meeting.attendees.push({ user: req.userId, status });
    }
    await meeting.save();
    res.json({ success: true, meeting });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
