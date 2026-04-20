import Note from '../models/Note.js';
import { aiService } from '../services/claudeService.js';

// GET /api/workspace/notes
export const getNotes = async (req, res, next) => {
  try {
    const teamId = req.user.teamId;
    if (!teamId) {
      return res.status(400).json({ message: 'User is not in a team' });
    }

    let note = await Note.findOne({ teamId })
      .populate('lastEditedBy', 'name email');
    
    // Create default note if none exists
    if (!note) {
      note = await Note.create({
        teamId,
        title: 'Team Notes',
        content: '',
        lastEditedBy: req.userId
      });
    }

    res.json({ note });
  } catch (error) {
    next(error);
  }
};

// PUT /api/workspace/notes
export const updateNotes = async (req, res, next) => {
  try {
    const teamId = req.user.teamId;
    if (!teamId) {
      return res.status(400).json({ message: 'User is not in a team' });
    }

    const { title, content } = req.body;
    
    const note = await Note.findOneAndUpdate(
      { teamId },
      { title, content, lastEditedBy: req.userId },
      { new: true, upsert: true }
    ).populate('lastEditedBy', 'name email');

    res.json({ note });
  } catch (error) {
    next(error);
  }
};

export const summarizeNotes = async (req, res) => {
  try {
    const { text } = req.body;
    const mockSummary = "This project focuses on building an AI-Powered Collaborative Project Intelligence Platform. Key focus areas include intelligent task assignment, real-time contribution tracking, and automated meeting analysis to ensure fair workload distribution among student team members.";
    res.json({ success: true, summary: mockSummary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const extractActionPoints = async (req, res) => {
  try {
    const { text } = req.body;
    const mockActionPoints = [
      "Set up MongoDB Atlas connection",
      "Complete frontend authentication flow", 
      "Integrate Claude API for summarization",
      "Test task assignment algorithm",
      "Deploy to production"
    ];
    res.json({ success: true, actionPoints: mockActionPoints });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const clusterIdeas = async (req, res) => {
  try {
    const { text } = req.body;
    const mockClusters = [
      { theme: "Core Features", ideas: ["Task assignment", "Skill matching", "AI integration"] },
      { theme: "Design", ideas: ["Dark sidebar", "Progress rings", "Card layout"] },
      { theme: "Analytics", ideas: ["Contribution tracking", "Fairness engine", "Reports"] }
    ];
    res.json({ success: true, clusters: mockClusters });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
