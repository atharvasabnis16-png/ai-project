import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  title: {
    type: String,
    default: 'Untitled Note',
    trim: true
  },
  content: {
    type: String,
    default: ''
  },
  lastEditedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  aiSummary: {
    type: String,
    default: ''
  },
  aiActionPoints: [{
    type: String
  }],
  aiClusters: [{
    theme: String,
    ideas: [String]
  }]
}, {
  timestamps: true
});

const Note = mongoose.model('Note', noteSchema);
export default Note;
