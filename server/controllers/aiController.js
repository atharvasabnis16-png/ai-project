import { aiService } from '../services/claudeService.js';

// POST /api/ai/research
export const generateResearch = async (req, res, next) => {
  try {
    const { topic } = req.body;
    if (!topic) {
      return res.status(400).json({ message: 'Topic is required' });
    }
    const result = await aiService.generateResearchOutline(topic);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// POST /api/ai/ppt
export const generatePPT = async (req, res, next) => {
  try {
    const { topic } = req.body;
    if (!topic) {
      return res.status(400).json({ message: 'Topic is required' });
    }
    const result = await aiService.generatePPTOutline(topic);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// POST /api/ai/summarize
export const summarizeNotes = async (req, res, next) => {
  try {
    const { content } = req.body;
    const result = await aiService.summarizeNotes(content);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// POST /api/ai/action-points
export const extractActionPoints = async (req, res, next) => {
  try {
    const { content } = req.body;
    const result = await aiService.extractActionPoints(content);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// POST /api/ai/cluster
export const clusterIdeas = async (req, res, next) => {
  try {
    const { content } = req.body;
    const result = await aiService.clusterIdeas(content);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
