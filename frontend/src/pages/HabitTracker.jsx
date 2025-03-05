import React, { useState, useEffect } from 'react';
import '../styles/HabitTracker.css';

const HabitTracker = () => {
  // In a real app, this would come from your API
  const [habits, setHabits] = useState([
    { 
      id: 1, 
      name: 'Morning Workout', 
      frequency: 'daily',
      targetDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      streak: 5,
      completedDates: ['2025-03-01', '2025-03-02', '2025-03-03', '2025-03-04']
    },
    { 
      id: 2, 
      name: 'Read 30 pages', 
      frequency: 'daily',
      targetDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      streak: 12,
      completedDates: ['2025-03-01', '2025-03-02', '2025-03-03', '2025-03-04']
    },
    { 
      id: 3, 
      name: 'Meditation', 
      frequency: 'daily',
      targetDays: ['monday', 'wednesday', 'friday'],
      streak: 3,
      completedDates: ['2025-03-01', '2025-03-04']
    },
    { 
      id: 4, 
      name: 'No sugar', 
      frequency: 'daily',
      targetDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      streak: 7,
      completedDates: ['2025-03-01', '2025-03-02', '2025-03-03', '2025-03-04']
    }
  ]);

  const [newHabit, setNewHabit] = useState({
    name: '',
    frequency: 'daily',
    targetDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  });

  // Get the current date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // Get the current day of the week
  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'lowercase' });

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

  const handleAddHabit = (e) => {
    e.preventDefault();
    if (newHabit.name.trim() === '') return;

    const newHabitObj = {
      id: Date.now(), // simple unique id generator
      name: newHabit.name,
      frequency: newHabit.frequency,
      targetDays: newHabit.targetDays,
      streak: 0,
      completedDates: []
    };

    setHabits([...habits, newHabitObj]);
    setNewHabit({
      name: '',
      frequency: 'daily',
      targetDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    });
  };

  const toggleHabitCompletion = (habitId, date) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        let completedDates = [...habit.completedDates];
        const dateIndex = completedDates.indexOf(date);
        
        if (dateIndex >= 0) {
          // Date exists, remove it
          completedDates.splice(dateIndex, 1);
        } else {
          // Date doesn't exist, add it
          completedDates.push(date);
        }
        
        return {
          ...habit,
          completedDates
        };
      }
      return habit;
    }));
  };

  const isHabitCompletedOnDate = (habit, date) => {
    return habit.completedDates.includes(date);
  };

  return (
    <div className="habit-tracker-container">
      <h1>Habit Tracker</h1>
      
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
            <div key={habit.id} className="habit-row">
              <div className="habit-col">
                <span className="habit-name">{habit.name}</span>
                <span className="habit-frequency">{habit.frequency}</span>
              </div>
              
              {lastSevenDays.map(day => {
                const isCompleted = isHabitCompletedOnDate(habit, day.date);
                const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'lowercase' });
                const isTargetDay = habit.targetDays.includes(dayName);
                
                return (
                  <div 
                    key={day.date} 
                    className={`date-col ${!isTargetDay ? 'non-target-day' : ''}`}
                    onClick={() => isTargetDay && toggleHabitCompletion(habit.id, day.date)}
                  >
                    <div className={`habit-check ${isCompleted ? 'completed' : ''} ${!isTargetDay ? 'disabled' : ''}`}>
                      {isCompleted && <span>✓</span>}
                    </div>
                  </div>
                );
              })}
              
              <div className="streak-col">
                <div className="streak-count">{habit.streak}</div>
                <div className="streak-label">days</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="habit-insights card">
        <h3>Habit Insights</h3>
        <div className="insights-content">
          <p>Your most consistent habit is <strong>Read 30 pages</strong> with a 12-day streak!</p>
          <p>You've completed <strong>80%</strong> of your habits this week, which is better than last week's 65%.</p>
          <p>To improve your consistency, try completing <strong>Meditation</strong> right after <strong>Morning Workout</strong>.</p>
        </div>
      </div>
    </div>
  );
};

export default HabitTracker;