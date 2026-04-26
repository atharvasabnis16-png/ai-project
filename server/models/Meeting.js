import mongoose from 'mongoose';
const meetingSchema = new mongoose.Schema({
  teamId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Team', required: true 
  },
  title: { type: String, required: true },
  date: { type: Date, required: true },
  meetLink: { type: String, required: true },
  scheduledBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', required: true 
  },
  attendees: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { 
      type: String, 
      enum: ['attended', 'missed', 'pending'],
      default: 'pending'
    }
  }],
  status: {
    type: String,
    enum: ['upcoming', 'completed'],
    default: 'upcoming'
  }
}, { timestamps: true });
export default mongoose.model('Meeting', meetingSchema);
