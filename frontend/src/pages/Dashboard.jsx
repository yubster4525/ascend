import React from 'react';
import '../styles/Dashboard.css';

const Dashboard = () => {
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
            <ul className="focus-list">
              <li className="focus-item">
                <input type="checkbox" id="focus1" />
                <label htmlFor="focus1">Complete workout session</label>
              </li>
              <li className="focus-item">
                <input type="checkbox" id="focus2" />
                <label htmlFor="focus2">Read for 30 minutes</label>
              </li>
              <li className="focus-item">
                <input type="checkbox" id="focus3" />
                <label htmlFor="focus3">Drink 2L of water</label>
              </li>
              <li className="focus-item">
                <input type="checkbox" id="focus4" />
                <label htmlFor="focus4">Journal entry for the day</label>
              </li>
            </ul>
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