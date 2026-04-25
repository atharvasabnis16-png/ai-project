import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  teamId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Team', 
    required: true 
  },
  triggeredBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['new_task', 'meeting_scheduled', 
           'task_completed', 'new_member', 'meeting_log'],
    required: true 
  },
  message: { type: String, required: true },
  readBy: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  link: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);
