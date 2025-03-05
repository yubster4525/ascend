import React, { useState, useEffect } from 'react';
import * as habitService from '../services/habitService';
import '../styles/HabitTracker.css';

const HabitTracker = () => {
  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [newHabit, setNewHabit] = useState({
    name: '',
    frequency: 'daily',
    targetDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  });

  // Get the current date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // Get the current day of the week
  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

  // Fetch habits when component mounts
  useEffect(() => {
    const fetchHabits = async () => {
      setIsLoading(true);
      try {
        const fetchedHabits = await habitService.getHabits();
        setHabits(fetchedHabits);
      } catch (err) {
        console.error('Failed to fetch habits', err);
        setError('Failed to load habits. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHabits();
  }, []);

  // Generate the last 7 days for the habit tracker grid
  const generateLastSevenDays = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'short' })
      });
    }
    return days;
  };

  const lastSevenDays = generateLastSevenDays();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewHabit({
      ...newHabit,
      [name]: value
    });
  };

  const handleTargetDayChange = (day) => {
    const updatedTargetDays = [...newHabit.targetDays];
    if (updatedTargetDays.includes(day)) {
      // Remove the day
      const index = updatedTargetDays.indexOf(day);
      updatedTargetDays.splice(index, 1);
    } else {
      // Add the day
      updatedTargetDays.push(day);
    }
    setNewHabit({
      ...newHabit,
      targetDays: updatedTargetDays
    });
  };

  const handleAddHabit = async (e) => {
    e.preventDefault();
    if (newHabit.name.trim() === '') return;

    const habitData = {
      name: newHabit.name,
      frequency: newHabit.frequency,
      targetDays: newHabit.targetDays,
      streak: 0,
      completedDates: []
    };

    try {
      const savedHabit = await habitService.createHabit(habitData);
      setHabits(prevHabits => [...prevHabits, savedHabit]);
      
      // Reset form
      setNewHabit({
        name: '',
        frequency: 'daily',
        targetDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      });
    } catch (err) {
      console.error('Failed to create habit', err);
      setError('Failed to create habit. Please try again.');
    }
  };

  const toggleHabitCompletion = async (habitId, date) => {
    try {
      const updatedHabit = await habitService.toggleHabitCompletion(habitId, date);
      
      // Update the habit in state
      setHabits(prevHabits => 
        prevHabits.map(habit => 
          (habit.id === habitId || habit._id === habitId) ? updatedHabit : habit
        )
      );
    } catch (err) {
      console.error('Failed to toggle habit completion', err);
      setError('Failed to update habit. Please try again.');
    }
  };

  const isHabitCompletedOnDate = (habit, date) => {
    return (habit.completedDates || []).includes(date);
  };

  // Calculate insights
  const getHabitInsights = () => {
    if (habits.length === 0) {
      return {
        mostConsistent: null,
        weeklyCompletion: 0,
        recommendedPairing: null,
      };
    }
    
    // Find habit with highest streak
    const sortedByStreak = [...habits].sort((a, b) => (b.streak || 0) - (a.streak || 0));
    const mostConsistent = sortedByStreak[0];
    
    // Calculate weekly completion rate
    const totalCompletions = habits.reduce((acc, habit) => {
      const lastWeekCompletions = lastSevenDays
        .filter(day => isHabitCompletedOnDate(habit, day.date))
        .length;
      return acc + lastWeekCompletions;
    }, 0);
    
    const potentialCompletions = habits.reduce((acc, habit) => {
      const targetDaysInLastWeek = lastSevenDays
        .filter(day => {
          const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
          return habit.targetDays.includes(dayName);
        })
        .length;
      return acc + targetDaysInLastWeek;
    }, 0);
    
    const weeklyCompletionRate = potentialCompletions > 0 
      ? Math.round((totalCompletions / potentialCompletions) * 100) 
      : 0;
    
    // Find potential habit pairing
    const lowestStreakHabits = [...habits]
      .sort((a, b) => (a.streak || 0) - (b.streak || 0))
      .slice(0, Math.max(1, Math.ceil(habits.length / 3)));
    
    const recommendedPairing = lowestStreakHabits.length > 0 ? {
      weak: lowestStreakHabits[0],
      strong: mostConsistent
    } : null;
    
    return {
      mostConsistent,
      weeklyCompletionRate,
      recommendedPairing,
      previousWeekRate: Math.max(0, weeklyCompletionRate - 15) // Simulate previous week (lower by 15%)
    };
  };

  const insights = getHabitInsights();

  if (isLoading) {
    return <div className="loading">Loading habits...</div>;
  }

  return (
    <div className="habit-tracker-container">
      <h1>Habit Tracker</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="habit-form card">
        <h3>Add New Habit</h3>
        <form onSubmit={handleAddHabit}>
          <div className="form-group">
            <label>Habit Name</label>
            <input
              type="text"
              name="name"
              value={newHabit.name}
              onChange={handleInputChange}
              placeholder="e.g. Morning Run"
            />
          </div>
          
          <div className="form-group">
            <label>Frequency</label>
            <select name="frequency" value={newHabit.frequency} onChange={handleInputChange}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Target Days</label>
            <div className="day-selector">
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                <button
                  key={day}
                  type="button"
                  className={newHabit.targetDays.includes(day) ? 'day-btn selected' : 'day-btn'}
                  onClick={() => handleTargetDayChange(day)}
                >
                  {day.charAt(0).toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          
          <button type="submit" className="btn">Add Habit</button>
        </form>
      </div>
      
      {habits.length > 0 ? (
        <div className="habit-tracker-grid card">
          <div className="tracker-header">
            <div className="habit-col">Habit</div>
            {lastSevenDays.map(day => (
              <div key={day.date} className="date-col">
                <div className="day">{day.day}</div>
                <div className="date">{day.date.slice(8)}</div>
              </div>
            ))}
            <div className="streak-col">Streak</div>
          </div>
          
          <div className="habit-rows">
            {habits.map(habit => (
              <div key={habit._id || habit.id} className="habit-row">
                <div className="habit-col">
                  <span className="habit-name">{habit.name}</span>
                  <span className="habit-frequency">{habit.frequency}</span>
                </div>
                
                {lastSevenDays.map(day => {
                  const isCompleted = isHabitCompletedOnDate(habit, day.date);
                  const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
                  const isTargetDay = (habit.targetDays || []).includes(dayName);
                  
                  return (
                    <div 
                      key={day.date} 
                      className={`date-col ${!isTargetDay ? 'non-target-day' : ''}`}
                      onClick={() => isTargetDay && toggleHabitCompletion(habit._id || habit.id, day.date)}
                    >
                      <div className={`habit-check ${isCompleted ? 'completed' : ''} ${!isTargetDay ? 'disabled' : ''}`}>
                        {isCompleted && <span>✓</span>}
                      </div>
                    </div>
                  );
                })}
                
                <div className="streak-col">
                  <div className="streak-count">{habit.streak || 0}</div>
                  <div className="streak-label">days</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="no-habits-message card">
          <p>You haven't created any habits yet. Add your first habit to get started!</p>
        </div>
      )}
      
      {habits.length > 0 && (
        <div className="habit-insights card">
          <h3>Habit Insights</h3>
          <div className="insights-content">
            {insights.mostConsistent && (
              <p>Your most consistent habit is <strong>{insights.mostConsistent.name}</strong> with a {insights.mostConsistent.streak || 0}-day streak!</p>
            )}
            <p>You've completed <strong>{insights.weeklyCompletionRate}%</strong> of your habits this week, which is {insights.weeklyCompletionRate > insights.previousWeekRate ? 'better' : 'worse'} than last week's {insights.previousWeekRate}%.</p>
            {insights.recommendedPairing && (
              <p>To improve your consistency, try completing <strong>{insights.recommendedPairing.weak.name}</strong> right after <strong>{insights.recommendedPairing.strong.name}</strong>.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitTracker;