import React, { useState, useEffect } from 'react';
import { createHabit, getHabits } from '../services/habitService';

const DashboardPage = () => {
  const [habits, setHabits] = useState([]);
  const [habitName, setHabitName] = useState('');

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const data = await getHabits();
      setHabits(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateHabit = async (e) => {
    e.preventDefault();
    try {
      await createHabit(habitName);
      setHabitName('');
      fetchHabits();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ margin: '50px' }}>
      <h1>Dashboard</h1>
      <form onSubmit={handleCreateHabit}>
        <label>Habit Name:</label>
        <br />
        <input
          type="text"
          value={habitName}
          onChange={(e) => setHabitName(e.target.value)}
        />
        <button type="submit">Create</button>
      </form>

      <h2>Your Habits</h2>
      <ul>
        {habits.map(habit => (
          <li key={habit._id}>
            {habit.habitName} (Created: {new Date(habit.createdAt).toLocaleString()})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DashboardPage;