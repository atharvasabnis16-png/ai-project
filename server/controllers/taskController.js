import Task from '../models/Task.js';
import Team from '../models/Team.js';
import User from '../models/User.js';
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
      .populate('assignedTo', 'name email avatar')
      .sort({ order: 1, createdAt: -1 });

    res.json({ tasks });
  } catch (error) {
    next(error);
  }
};

// POST /api/tasks — Create a task
export const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, skillTag, assignedTo, deadline, status } = req.body;
    const user = req.user;

    if (!user.teamId) {
      return res.status(400).json({ message: 'You must join a team first' });
    }

    const task = await Task.create({
      title,
      description: description || '',
      priority: priority || 'medium',
      skillTag: skillTag || 'coding',
      assignedTo: assignedTo || null,
      teamId: user.teamId,
      deadline: deadline || null,
      status: status || 'todo',
      createdBy: req.userId
    });

    const populated = await Task.findById(task._id).populate('assignedTo', 'name email avatar');
    
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

// POST /api/tasks/ai-match — AI skill-based task assignment
export const aiMatchTask = async (req, res) => {
  try {
    const { taskId } = req.body;
    const user = await User.findById(req.userId);
    
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ 
      message: 'Task not found' 
    });

    // Get all team members with their skills
    const team = await Team.findById(user.teamId)
      .populate('members', 'name skills');
    
    if (!team?.members?.length) {
      return res.status(400).json({ 
        message: 'No team members found' 
      });
    }

    // Match task title/description keywords to member skills
    const taskText = (task.title + ' ' + (task.description || ''))
      .toLowerCase();

    const skillKeywords = {
      'frontend': ['react', 'css', 'html', 'ui', 'design', 
                   'frontend', 'tailwind'],
      'backend': ['node', 'api', 'server', 'database', 
                  'backend', 'express', 'mongodb'],
      'python': ['python', 'ml', 'ai', 'data', 'model', 
                 'tensorflow'],
      'design': ['design', 'figma', 'ui', 'ux', 'mockup'],
      'devops': ['deploy', 'docker', 'cloud', 'git', 'ci/cd']
    };

    // Score each member based on skill match
    let bestMatch = null;
    let bestScore = -1;

    for (const member of team.members) {
      let score = 0;
      const memberSkills = (member.skills || [])
        .filter(s => s && typeof s === 'string')
        .map(s => s.toLowerCase());

      for (const skill of memberSkills) {
        // Direct skill match with task text
        if (taskText.includes(skill)) score += 3;

        // Keyword category match
        for (const [category, keywords] of 
          Object.entries(skillKeywords)) {
          if (keywords.includes(skill) && 
              keywords.some(k => taskText.includes(k))) {
            score += 2;
          }
        }
      }

      // Add small random factor to avoid always 
      // picking same person
      score += Math.random() * 0.5;

      if (score > bestScore) {
        bestScore = score;
        bestMatch = member;
      }
    }

    // If no skill match found, assign to least busy member
    if (!bestMatch || bestScore < 0.5) {
      const taskCounts = await Promise.all(
        team.members.map(async m => ({
          member: m,
          count: await Task.countDocuments({ 
            assignedTo: m._id, 
            status: { $ne: 'done' } 
          })
        }))
      );
      taskCounts.sort((a, b) => a.count - b.count);
      bestMatch = taskCounts[0].member;
    }

    // Assign task to best match
    task.assignedTo = bestMatch._id;
    task.status = 'inprogress';
    await task.save();
    await task.populate('assignedTo', 'name email');

    res.json({ 
      success: true,
      task,
      message: `Task assigned to ${bestMatch.name} 
        based on skill match`
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// POST /api/tasks/:taskId/upload — Upload file and complete task
export const uploadTaskFile = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    
    if (!task) return res.status(404).json({ 
      message: 'Task not found' 
    });

    if (!req.file) return res.status(400).json({ 
      message: 'No file uploaded' 
    });

    // Save file info and mark task as done
    task.submittedFile = {
      filename: req.file.originalname,
      path: `/uploads/${req.file.filename}`,
      uploadedAt: new Date(),
      uploadedBy: req.userId
    };
    task.status = 'done';
    await task.save();
    await task.populate('assignedTo', 'name email');

    res.json({ 
      success: true, 
      task,
      message: 'Work submitted successfully!' 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
