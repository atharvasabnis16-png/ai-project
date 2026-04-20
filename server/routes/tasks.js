import express from 'express';
import { getTasks, createTask, updateTask, deleteTask, aiSuggestTasks, aiAssignTask } from '../controllers/taskController.js';
import { rankMembersForTask } from '../services/mlService.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth); // Protect all task routes

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

router.post('/ai-suggest', aiSuggestTasks);
router.post('/ai-assign', aiAssignTask);

router.post('/ml-assign', async (req, res) => {
  try {
    const { members, taskTitle } = req.body;
    const ranked = await rankMembersForTask(members);
    const best = ranked[0];

    res.json({
      success: true,
      assignedTo: best.member,
      performanceCategory: best.prediction.performance_category,
      confidence: best.confidence,
      allRankings: ranked.map(r => ({
        name: r.member.name,
        category: r.prediction.performance_category,
        confidence: r.confidence
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
