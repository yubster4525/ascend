const Goal = require('../models/Goal');

// Create a new goal
exports.createGoal = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      startDate,
      targetDate,
      milestones,
      tasks
    } = req.body;

    const newGoal = new Goal({
      userId: req.user.id,
      title,
      description,
      category,
      startDate: startDate || new Date(),
      targetDate,
      milestones: milestones || [],
      tasks: tasks || []
    });

    const savedGoal = await newGoal.save();
    res.status(201).json(savedGoal);
  } catch (error) {
    console.error('Error creating goal:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all goals for a user
exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id });
    res.status(200).json(goals);
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a single goal by ID
exports.getGoalById = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.status(200).json(goal);
  } catch (error) {
    console.error('Error fetching goal:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a goal
exports.updateGoal = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      startDate,
      targetDate,
      progress,
      milestones,
      tasks
    } = req.body;

    const updatedGoal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      {
        title,
        description,
        category,
        startDate,
        targetDate,
        progress,
        milestones,
        tasks
      },
      { new: true }
    );

    if (!updatedGoal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.status(200).json(updatedGoal);
  } catch (error) {
    console.error('Error updating goal:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a goal
exports.deleteGoal = async (req, res) => {
  try {
    const deletedGoal = await Goal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!deletedGoal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.status(200).json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update milestone completion status
exports.updateMilestone = async (req, res) => {
  try {
    const { milestoneId, completed } = req.body;
    
    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    const milestone = goal.milestones.id(milestoneId);
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }
    
    milestone.completed = completed;
    
    // Recalculate progress based on milestone completion
    const completedMilestones = goal.milestones.filter(m => m.completed).length;
    goal.progress = Math.round((completedMilestones / goal.milestones.length) * 100);
    
    await goal.save();
    res.status(200).json(goal);
  } catch (error) {
    console.error('Error updating milestone:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update task completion status
exports.updateTask = async (req, res) => {
  try {
    const { taskId, completed } = req.body;
    
    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    const task = goal.tasks.id(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    task.completed = completed;
    await goal.save();
    
    res.status(200).json(goal);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get upcoming tasks across all goals
exports.getUpcomingTasks = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + parseInt(days));
    
    const goals = await Goal.find({ userId: req.user.id });
    
    // Extract tasks from all goals
    let upcomingTasks = [];
    goals.forEach(goal => {
      const goalTasks = goal.tasks.filter(task => {
        const taskDate = new Date(task.dueDate);
        return taskDate >= today && taskDate <= endDate && !task.completed;
      }).map(task => ({
        ...task.toObject(),
        goalId: goal._id,
        goalTitle: goal.title
      }));
      
      upcomingTasks = [...upcomingTasks, ...goalTasks];
    });
    
    // Sort by due date
    upcomingTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    
    res.status(200).json(upcomingTasks);
  } catch (error) {
    console.error('Error fetching upcoming tasks:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};