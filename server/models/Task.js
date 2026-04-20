import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    enum: ['todo', 'inprogress', 'done'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  skillTag: {
    type: String,
    enum: ['coding', 'design', 'research', 'writing', 'ppt', 'testing', 'data-analysis', 'communication'],
    default: 'coding'
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  deadline: {
    type: Date,
    default: null
  },
  timeSpent: {
    type: Number,
    default: 0 // minutes
  },
  aiSuggested: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: null
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Auto-set completedAt when status changes to done
taskSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'done' && !this.completedAt) {
    this.completedAt = new Date();
  }
  if (this.isModified('status') && this.status !== 'done') {
    this.completedAt = null;
  }
  next();
});

const Task = mongoose.model('Task', taskSchema);
export default Task;
