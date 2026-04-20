import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema({
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Meeting title is required'],
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  transcript: {
    type: String,
    default: ''
  },
  aiSummary: {
    type: String,
    default: ''
  },
  decisions: [{
    type: String
  }],
  actionItems: [{
    task: String,
    assignee: String
  }],
  speakerParticipation: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    percentage: Number
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Meeting = mongoose.model('Meeting', meetingSchema);
export default Meeting;
