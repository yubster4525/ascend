const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
  updateMilestone,
  updateTask,
  getUpcomingTasks
} = require('../controllers/goalController');

// Get all goals for current user
router.get('/', authMiddleware, getGoals);

// Get upcoming tasks across all goals
router.get('/upcoming-tasks', authMiddleware, getUpcomingTasks);

// Get single goal by ID
router.get('/:id', authMiddleware, getGoalById);

// Create a new goal
router.post('/', authMiddleware, createGoal);

// Update an existing goal
router.put('/:id', authMiddleware, updateGoal);

// Delete a goal
router.delete('/:id', authMiddleware, deleteGoal);

// Update milestone completion status
router.patch('/:id/milestone', authMiddleware, updateMilestone);

// Update task completion status
router.patch('/:id/task', authMiddleware, updateTask);

module.exports = router;