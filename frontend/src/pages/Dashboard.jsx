import React, { useState, useEffect } from 'react';
import * as goalService from '../services/goalService';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Mock data for dashboard
  const progressData = {
    habits: {
      completed: 15,
      total: 20,
      streak: 7
    },
    bodyMetrics: {
      currentWeight: 75.5,
      targetWeight: 70,
      weightLost: 2.5
    },
    goals: {
      completed: 3,
      inProgress: 5
    }
  };

  // Fetch upcoming tasks on component mount
  useEffect(() => {
    const fetchUpcomingTasks = async () => {
      setIsLoading(true);
      try {
        // Try to get tasks from API first
        const upcomingTasks = await goalService.getUpcomingTasks(1); // Get today's tasks only
        setTasks(upcomingTasks);
      } catch (err) {
        console.error('Failed to fetch tasks from API, falling back to localStorage', err);
        
        // Fallback to localStorage
        const localGoals = goalService.loadGoalsFromLocalStorage();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Extract tasks from local goals
        let todaysTasks = [];
        localGoals.forEach(goal => {
          if (goal.tasks && goal.tasks.length > 0) {
            const goalTasks = goal.tasks.filter(task => {
              const taskDate = new Date(task.dueDate);
              return taskDate >= today && taskDate < tomorrow && !task.completed;
            }).map(task => ({
              ...task,
              goalId: goal.id,
              goalTitle: goal.title
            }));
            todaysTasks = [...todaysTasks, ...goalTasks];
          }
        });
        setTasks(todaysTasks);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUpcomingTasks();
  }, []);
  
  // Function to handle task completion
  const handleTaskCompletion = async (taskId, goalId) => {
    const taskIndex = tasks.findIndex(t => (t._id || t.id) === taskId);
    if (taskIndex === -1) return;
    
    const task = tasks[taskIndex];
    const newCompleted = !task.completed;
    
    try {
      // Try to update in API
      if (task._id) {
        await goalService.updateTask(goalId, taskId, newCompleted);
      }
      
      // Update in local state
      setTasks(tasks.map(task => {
        if ((task._id || task.id) === taskId) {
          return { ...task, completed: newCompleted };
        }
        return task;
      }));
      
      // Also update task in goals in localStorage
      const localGoals = goalService.loadGoalsFromLocalStorage();
      const updatedGoals = localGoals.map(goal => {
        if ((goal._id || goal.id) === goalId && goal.tasks) {
          const updatedTasks = goal.tasks.map(t => {
            if ((t._id || t.id) === taskId) {
              return { ...t, completed: newCompleted };
            }
            return t;
          });
          return { ...goal, tasks: updatedTasks };
        }
        return goal;
      });
      goalService.saveGoalsToLocalStorage(updatedGoals);
      
    } catch (err) {
      console.error('Failed to update task', err);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Your Life Dashboard</h1>
      
      <div className="greeting-card card">
        <h2>Welcome back!</h2>
        <p className="date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <p className="motivation-message">
          You're making great progress! Focus on your habits today and keep pushing toward your goals.
        </p>
      </div>
      
      <div className="dashboard-grid">
        <div className="dashboard-widget card">
          <h3>Habit Tracker</h3>
          <div className="widget-content">
            <div className="progress-circle" 
                 style={{"--progress": `${(progressData.habits.completed / progressData.habits.total) * 100}%`}}>
              <span>{Math.round((progressData.habits.completed / progressData.habits.total) * 100)}%</span>
            </div>
            <div className="stats">
              <div className="stat-item">
                <span className="label">Completed</span>
                <span className="value">{progressData.habits.completed}/{progressData.habits.total}</span>
              </div>
              <div className="stat-item">
                <span className="label">Current Streak</span>
                <span className="value">{progressData.habits.streak} days</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="dashboard-widget card">
          <h3>Body Metrics</h3>
          <div className="widget-content">
            <div className="metrics-summary">
              <div className="metric">
                <span className="metric-label">Current Weight</span>
                <span className="metric-value">{progressData.bodyMetrics.currentWeight} kg</span>
              </div>
              <div className="metric">
                <span className="metric-label">Target</span>
                <span className="metric-value">{progressData.bodyMetrics.targetWeight} kg</span>
              </div>
              <div className="metric highlight">
                <span className="metric-label">Progress</span>
                <span className="metric-value">{progressData.bodyMetrics.weightLost} kg lost</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="dashboard-widget card">
          <h3>Goals Overview</h3>
          <div className="widget-content">
            <div className="goals-summary">
              <div className="goal-stat">
                <div className="goal-number">{progressData.goals.completed}</div>
                <div className="goal-label">Completed</div>
              </div>
              <div className="goal-stat">
                <div className="goal-number">{progressData.goals.inProgress}</div>
                <div className="goal-label">In Progress</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="dashboard-widget card">
          <h3>Today's Focus</h3>
          <div className="widget-content">
            {isLoading ? (
              <p>Loading today's tasks...</p>
            ) : tasks.length > 0 ? (
              <ul className="focus-list">
                {tasks.map((task, index) => (
                  <li key={task._id || task.id} className="focus-item">
                    <input 
                      type="checkbox" 
                      id={`task-${index}`} 
                      checked={task.completed || false}
                      onChange={() => handleTaskCompletion(task._id || task.id, task.goalId)}
                    />
                    <label htmlFor={`task-${index}`}>
                      <span>{task.description}</span>
                      {task.goalTitle && <span className="task-goal-title">{task.goalTitle}</span>}
                    </label>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-tasks-message">No tasks scheduled for today. Great job!</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="insights-section card">
        <h3>Weekly Insights</h3>
        <p className="insight-message">
          Your consistency with morning workouts is improving your energy levels throughout the day.
          Consider adding an evening stretching routine to improve recovery.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;