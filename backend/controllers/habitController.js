const Habit = require('../models/Habit');

// Create a habit
exports.createHabit = async (req, res) => {
  try {
    const { habitName, frequency } = req.body;
    const userId = req.userId; // from authMiddleware

    if (!habitName) {
      return res.status(400).json({ message: 'Habit name is required' });
    }

    const newHabit = new Habit({
      userId,
      habitName,
      frequency
    });

    const savedHabit = await newHabit.save();
    res.status(201).json(savedHabit);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get habits for user
exports.getHabits = async (req, res) => {
  try {
    const userId = req.userId; 
    const habits = await Habit.find({ userId });
    res.status(200).json(habits);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};