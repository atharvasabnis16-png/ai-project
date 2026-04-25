import Notification from '../models/Notification.js';
import User from '../models/User.js';

export const getNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user.teamId) {
      return res.json({ success: true, notifications: [] });
    }
    const notifications = await Notification.find({ 
      teamId: user.teamId 
    })
    .populate('triggeredBy', 'name')
    .sort({ createdAt: -1 })
    .limit(20);
    
    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { teamId: req.params.teamId },
      { $addToSet: { readBy: req.userId } }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createNotification = async (teamId, triggeredBy, type, message, link = '') => {
  try {
    await Notification.create({ teamId, triggeredBy, type, message, link });
  } catch (error) {
    console.error('Notification error:', error);
  }
};
