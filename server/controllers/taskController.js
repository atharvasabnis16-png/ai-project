import Task from '../models/Task.js';
import Team from '../models/Team.js';
import { findBestFitMember } from '../services/skillMatchService.js';
import { aiService } from '../services/claudeService.js';
import { createNotification } from './notificationController.js';

// GET /api/tasks — Get all tasks for user's team
export const getTasks = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user.teamId) {
      return res.status(400).json({ message: 'You must join a team first' });
    }

    const tasks = await Task.find({ teamId: user.teamId })
      .populate('assignee', 'name email avatar')
      .sort({ order: 1, createdAt: -1 });

    res.json({ tasks });
  } catch (error) {
    next(error);
  }
};

// POST /api/tasks — Create a task
export const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, skillTag, assignee, deadline, status } = req.body;
    const user = req.user;

    if (!user.teamId) {
      return res.status(400).json({ message: 'You must join a team first' });
    }

    const task = await Task.create({
      title,
      description: description || '',
      priority: priority || 'medium',
      skillTag: skillTag || 'coding',
      assignee: assignee || null,
      teamId: user.teamId,
      deadline: deadline || null,
      status: status || 'todo'
    });

    const populated = await Task.findById(task._id).populate('assignee', 'name email avatar');
    
    // Create notification for new task
    await createNotification(
      user.teamId,
      user._id,
      'new_task',
      `${user.name} created a new task: ${title}`,
      '/tasks'
    );
    
    res.status(201).json({ task: populated });
  } catch (error) {
    next(error);
  }
};

// PUT /api/tasks/:id — Update a task
export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify team membership
    if (task.teamId.toString() !== req.user.teamId?.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updates = req.body;
    Object.keys(updates).forEach(key => {
      task[key] = updates[key];
    });
    
    await task.save();
    const populated = await Task.findById(task._id).populate('assignee', 'name email avatar');

    res.json({ task: populated });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/tasks/:id
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.teamId.toString() !== req.user.teamId?.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
};

// POST /api/tasks/ai-suggest — AI suggests tasks
export const aiSuggestTasks = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user.teamId) {
      return res.status(400).json({ message: 'You must join a team first' });
    }

    const team = await Team.findById(user.teamId);
    const existingTasks = await Task.find({ teamId: user.teamId });
    
    const result = await aiService.suggestTasks(
      team.projectDescription || team.projectName || 'General project',
      existingTasks
    );

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// POST /api/tasks/ai-assign — AI assigns best-fit member to a task
export const aiAssignTask = async (req, res, next) => {
  try {
    const { taskId } = req.body;
    const user = req.user;

    if (!user.teamId) {
      return res.status(400).json({ message: 'You must join a team first' });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const team = await Team.findById(user.teamId).populate('members', 'name email skills');
    const result = await findBestFitMember(team.members, task.skillTag, user.teamId);

    if (result.member) {
      task.assignee = result.member._id;
      await task.save();
    }

    const populated = await Task.findById(task._id).populate('assignee', 'name email avatar');

    res.json({
      task: populated,
      assignment: {
        reason: result.reason,
        scores: result.allScores
      }
    });
  } catch (error) {
    next(error);
  }
};
