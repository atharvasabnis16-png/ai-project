import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['coding', 'design', 'research', 'writing', 'ppt', 'testing', 'data-analysis', 'communication']
  },
  confidence: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  skills: [skillSchema],
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    default: null
  },
  avatar: {
    type: String,
    default: ''
  },
  profileCompleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Hash password before save
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = mongoose.model('User', userSchema);
export default User;
