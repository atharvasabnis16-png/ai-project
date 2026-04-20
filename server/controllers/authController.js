import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// POST /api/auth/signup
export const signup = async (req, res, next) => {
  try {
    const { name, email, password, skills } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create user with optional skills
    const user = await User.create({ 
      name, 
      email, 
      password, 
      skills: skills || [],
      profileCompleted: !!(skills && skills.length > 0)
    });
    
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        skills: user.skills,
        teamId: user.teamId,
        profileCompleted: user.profileCompleted
      }
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user with password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        skills: user.skills,
        teamId: user.teamId,
        profileCompleted: user.profileCompleted
      }
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/auth/profile — Update skill profile
export const updateProfile = async (req, res, next) => {
  try {
    const { skills } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { skills, profileCompleted: true },
      { new: true, runValidators: true }
    );

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate('teamId');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

export const register = signup;
