import React, { useState, useEffect } from 'react';
import GoalTemplateSelector from '../components/GoalTemplateSelector';
import { deduplicateTasks } from '../utils/goalUtils';
import * as goalService from '../services/goalService';
import '../styles/GoalsPage.css';

const GoalsPage = () => {
  // State for goals and tasks
  const [goals, setGoals] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI state
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'personal',
    targetDate: '',
    progress: 0,
    milestones: []
  });
  const [newMilestone, setNewMilestone] = useState('');
  const [milestones, setMilestones] = useState([]);
  const [expandedGoalId, setExpandedGoalId] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortOption, setSortOption] = useState('date');
  const [viewMode, setViewMode] = useState('manual'); // 'manual' or 'template'
  
  // Mock user metrics for template suggestions
  const [userMetrics, setUserMetrics] = useState({
    weight: 75,
    height: 178,
    bodyFat: 20,
    age: 30,
    gender: 'male'
  });

  // Categories of goals
  const categories = [
    { id: 'personal', name: 'Personal', color: '#3498db' },
    { id: 'health', name: 'Health & Fitness', color: '#2ecc71' },
    { id: 'education', name: 'Education', color: '#f39c12' },
    { id: 'career', name: 'Career', color: '#9b59b6' },
    { id: 'financial', name: 'Financial', color: '#e74c3c' }
  ];

  // Fetch goals from API or localStorage on component mount
  useEffect(() => {
    const fetchGoals = async () => {
      setIsLoading(true);
      try {
        // Try to get goals from API
        const fetchedGoals = await goalService.getGoals();
        setGoals(fetchedGoals);
        
        // Extract tasks from goals
        let allTasks = [];
        fetchedGoals.forEach(goal => {
          if (goal.tasks && goal.tasks.length > 0) {
            // Add goalId to each task for reference
            const goalTasks = goal.tasks.map(task => ({
              ...task,
              goalId: goal._id || goal.id
            }));
            allTasks = [...allTasks, ...goalTasks];
          }
        });
        setTasks(allTasks);
      } catch (err) {
        console.error('Failed to fetch goals from API, falling back to localStorage', err);
        setError('Failed to connect to server. Using local storage instead.');
        
        // Fallback to localStorage
        const localGoals = goalService.loadGoalsFromLocalStorage();
        setGoals(localGoals);
        
        // Extract tasks from local goals
        let localTasks = [];
        localGoals.forEach(goal => {
          if (goal.tasks && goal.tasks.length > 0) {
            // Add goalId to each task for reference
            const goalTasks = goal.tasks.map(task => ({
              ...task,
              goalId: goal.id
            }));
            localTasks = [...localTasks, ...goalTasks];
          }
        });
        setTasks(localTasks);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGoals();
  }, []);

  // Save goals to localStorage whenever they change
  useEffect(() => {
    if (goals.length > 0) {
      goalService.saveGoalsToLocalStorage(goals);
    }
  }, [goals]);

  // Filter and sort goals based on user selection
  const sortedAndFilteredGoals = [...goals]
    .filter(goal => filterCategory === 'all' || goal.category === filterCategory)
    .sort((a, b) => {
      if (sortOption === 'date') {
        return new Date(a.targetDate) - new Date(b.targetDate);
      } else if (sortOption === 'progress') {
        return b.progress - a.progress;
      } else if (sortOption === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  // Get upcoming tasks for dashboard display
  const getUpcomingTasks = (days = 7) => {
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + days);
    
    return tasks
      .filter(task => {
        const taskDate = new Date(task.dueDate);
        return taskDate >= today && taskDate <= endDate && !task.completed;
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  };

  // Manual goal creation handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGoal({
      ...newGoal,
      [name]: value
    });
  };

  const handleMilestoneInput = (e) => {
    setNewMilestone(e.target.value);
  };

  const addMilestone = () => {
    if (newMilestone.trim() === '') return;
    
    const milestone = {
      id: Date.now(),
      description: newMilestone,
      completed: false
    };
    
    setMilestones([...milestones, milestone]);
    setNewMilestone('');
  };

  const removeMilestone = (id) => {
    setMilestones(milestones.filter(milestone => milestone.id !== id));
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (newGoal.title.trim() === '') return;
    
    const goalToAdd = {
      ...newGoal,
      progress: 0,
      milestones: milestones,
      startDate: new Date()
    };
    
    try {
      // Try to save to API
      const savedGoal = await goalService.createGoal(goalToAdd);
      setGoals(prevGoals => [...prevGoals, savedGoal]);
    } catch (err) {
      console.error('Failed to save goal to API, saving locally', err);
      // Fallback to local state
      const localGoal = {
        ...goalToAdd,
        id: Date.now()
      };
      setGoals(prevGoals => [...prevGoals, localGoal]);
    }
    
    setNewGoal({
      title: '',
      description: '',
      category: 'personal',
      targetDate: '',
      progress: 0
    });
    setMilestones([]);
  };

  // Template-based goal creation handler
  const handleTemplateGoalGenerated = async (generatedGoal) => {
    try {
      // Try to save to API
      const savedGoal = await goalService.createGoal(generatedGoal);
      setGoals(prevGoals => [...prevGoals, savedGoal]);
      
      // Process tasks if present
      if (savedGoal.tasks && savedGoal.tasks.length > 0) {
        // Add goalId to each task
        const goalTasks = savedGoal.tasks.map(task => ({
          ...task,
          goalId: savedGoal._id || savedGoal.id
        }));
        
        // Deduplicate tasks against existing ones
        const uniqueTasks = deduplicateTasks(tasks, goalTasks);
        
        // Add the tasks to the tasks list
        setTasks(prevTasks => [...prevTasks, ...uniqueTasks]);
      }
    } catch (err) {
      console.error('Failed to save generated goal to API, saving locally', err);
      // Fallback to local state
      const localGoal = {
        ...generatedGoal,
        id: Date.now()
      };
      setGoals(prevGoals => [...prevGoals, localGoal]);
      
      // Process tasks if present
      if (generatedGoal.tasks && generatedGoal.tasks.length > 0) {
        // Add goalId to each task
        const goalTasks = generatedGoal.tasks.map(task => ({
          ...task,
          goalId: localGoal.id
        }));
        
        // Deduplicate tasks against existing ones
        const uniqueTasks = deduplicateTasks(tasks, goalTasks);
        
        // Add the tasks to the tasks list
        setTasks(prevTasks => [...prevTasks, ...uniqueTasks]);
      }
    }
  };

  // Goal management functions
  const toggleGoalExpansion = (goalId) => {
    if (expandedGoalId === goalId) {
      setExpandedGoalId(null);
    } else {
      setExpandedGoalId(goalId);
    }
  };

  const toggleMilestoneCompletion = async (goalId, milestoneId) => {
    // Find the goal and milestone
    const goal = goals.find(g => (g._id || g.id) === goalId);
    if (!goal) return;
    
    const milestone = goal.milestones.find(m => (m._id || m.id) === milestoneId);
    if (!milestone) return;
    
    const newCompleted = !milestone.completed;
    
    try {
      // Try to update in API
      if (goal._id) {
        await goalService.updateMilestone(goalId, milestoneId, newCompleted);
      }
      
      // Update in local state
      setGoals(goals.map(goal => {
        if ((goal._id || goal.id) === goalId) {
          const updatedMilestones = goal.milestones.map(milestone => {
            if ((milestone._id || milestone.id) === milestoneId) {
              return { ...milestone, completed: newCompleted };
            }
            return milestone;
          });
          
          // Calculate new progress based on completed milestones
          const completedCount = updatedMilestones.filter(m => m.completed).length;
          const totalCount = updatedMilestones.length;
          const newProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
          
          return {
            ...goal,
            milestones: updatedMilestones,
            progress: newProgress
          };
        }
        return goal;
      }));
    } catch (err) {
      console.error('Failed to update milestone in API', err);
      // Already updated in local state, so no need for fallback
    }
  };

  const toggleTaskCompletion = async (goalId, taskId) => {
    // Find the task
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
    } catch (err) {
      console.error('Failed to update task in API', err);
      // Already updated in local state, so no need for fallback
    }
  };

  if (isLoading) {
    return <div className="loading">Loading goals...</div>;
  }

  return (
    <div className="goals-container">
      <h1>Goals & Achievements</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="goals-layout">
        <div className="goals-list">
          <div className="goals-filters card">
            <div className="filter-group">
              <label>Filter by Category:</label>
              <select 
                value={filterCategory} 
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Sort by:</label>
              <select 
                value={sortOption} 
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="date">Target Date</option>
                <option value="progress">Progress</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
            </div>
          </div>
          
          <div className="goals-cards">
            {sortedAndFilteredGoals.length > 0 ? (
              sortedAndFilteredGoals.map(goal => (
                <div key={goal._id || goal.id} className={`goal-card card ${expandedGoalId === (goal._id || goal.id) ? 'expanded' : ''}`}>
                  <div 
                    className="goal-header"
                    onClick={() => toggleGoalExpansion(goal._id || goal.id)}
                  >
                    <div className="goal-title">
                      <span 
                        className="goal-category-dot" 
                        style={{ backgroundColor: categories.find(c => c.id === goal.category)?.color }}
                      ></span>
                      <h3>{goal.title}</h3>
                    </div>
                    <div className="goal-meta">
                      <span className="goal-date">Due: {new Date(goal.targetDate).toLocaleDateString()}</span>
                      <span className="goal-expand-icon">{expandedGoalId === (goal._id || goal.id) ? '▼' : '▶'}</span>
                    </div>
                  </div>
                  
                  <div className="goal-progress-container">
                    <div className="goal-progress-bar">
                      <div 
                        className="goal-progress-fill" 
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                    <span className="goal-progress-text">{goal.progress}% Complete</span>
                  </div>
                  
                  {expandedGoalId === (goal._id || goal.id) && (
                    <div className="goal-details">
                      <p className="goal-description">{goal.description}</p>
                      
                      <div className="goal-milestones">
                        <h4>Milestones</h4>
                        <ul className="milestones-list">
                          {goal.milestones && goal.milestones.map(milestone => (
                            <li 
                              key={milestone._id || milestone.id} 
                              className={milestone.completed ? 'completed' : ''}
                              onClick={() => toggleMilestoneCompletion(goal._id || goal.id, milestone._id || milestone.id)}
                            >
                              <span className="milestone-checkbox">
                                {milestone.completed ? '✓' : ''}
                              </span>
                              <span className="milestone-text">{milestone.description}</span>
                              {milestone.dueDate && (
                                <span className="milestone-date">
                                  {new Date(milestone.dueDate).toLocaleDateString()}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Related Tasks Section - only shown if there are tasks related to this goal */}
                      {tasks.some(task => task.goalId === (goal._id || goal.id)) && (
                        <div className="goal-tasks">
                          <h4>Related Tasks</h4>
                          <ul className="tasks-list">
                            {tasks
                              .filter(task => task.goalId === (goal._id || goal.id) && new Date(task.dueDate) > new Date())
                              .slice(0, 5) // Show only next 5 upcoming tasks
                              .map(task => (
                                <li 
                                  key={task._id || task.id} 
                                  className={task.completed ? 'completed' : ''}
                                  onClick={() => toggleTaskCompletion(goal._id || goal.id, task._id || task.id)}
                                >
                                  <span className="task-checkbox">
                                    {task.completed ? '✓' : ''}
                                  </span>
                                  <span className="task-text">{task.description}</span>
                                  <span className="task-date">
                                    {new Date(task.dueDate).toLocaleDateString()}
                                  </span>
                                </li>
                              ))}
                            {tasks.filter(task => task.goalId === (goal._id || goal.id)).length > 5 && (
                              <li className="more-tasks-indicator">
                                + {tasks.filter(task => task.goalId === (goal._id || goal.id)).length - 5} more tasks...
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="no-goals-message">
                <p>No goals matching the selected filter. Create a new goal to get started!</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="goals-form-container">
          <div className="creation-mode-toggle">
            <button 
              className={viewMode === 'manual' ? 'active' : ''}
              onClick={() => setViewMode('manual')}
            >
              Manual Creation
            </button>
            <button 
              className={viewMode === 'template' ? 'active' : ''}
              onClick={() => setViewMode('template')}
            >
              Use Template
            </button>
          </div>
          
          {viewMode === 'manual' ? (
            <div className="goals-form card">
              <h3>Create New Goal</h3>
              <form onSubmit={handleManualSubmit}>
                <div className="form-group">
                  <label>Goal Title</label>
                  <input
                    type="text"
                    name="title"
                    value={newGoal.title}
                    onChange={handleInputChange}
                    placeholder="What do you want to achieve?"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={newGoal.description}
                    onChange={handleInputChange}
                    placeholder="Describe your goal and why it's important..."
                    rows="3"
                  ></textarea>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Category</label>
                    <select name="category" value={newGoal.category} onChange={handleInputChange}>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Target Date</label>
                    <input
                      type="date"
                      name="targetDate"
                      value={newGoal.targetDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group milestones-form">
                  <label>Milestones</label>
                  <div className="add-milestone">
                    <input
                      type="text"
                      value={newMilestone}
                      onChange={handleMilestoneInput}
                      placeholder="Add a milestone..."
                    />
                    <button type="button" onClick={addMilestone}>Add</button>
                  </div>
                  
                  <ul className="milestones-preview">
                    {milestones.map(milestone => (
                      <li key={milestone.id}>
                        <span className="milestone-text">{milestone.description}</span>
                        <button 
                          type="button" 
                          className="remove-milestone"
                          onClick={() => removeMilestone(milestone.id)}
                        >×</button>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <button type="submit" className="submit-btn">Create Goal</button>
              </form>
            </div>
          ) : (
            <GoalTemplateSelector 
              onGoalGenerated={handleTemplateGoalGenerated}
              userMetrics={userMetrics}
            />
          )}
          
          <div className="goal-insights card">
            <h3>Goal Insights</h3>
            <div className="insights-content">
              <p>You have <strong>{goals.length}</strong> active goals.</p>
              <p>Your average goal completion is <strong>{Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / (goals.length || 1))}%</strong>.</p>
              <p>Most focused category: <strong>{categories.find(c => c.id === 'health')?.name}</strong>.</p>
              
              {/* Display upcoming tasks from generated goals */}
              {tasks.length > 0 && (
                <div className="upcoming-tasks-preview">
                  <h4>Upcoming Tasks (Next 7 Days)</h4>
                  <ul className="mini-tasks-list">
                    {getUpcomingTasks(7).slice(0, 3).map(task => (
                      <li key={task._id || task.id}>
                        <span className="task-text">{task.description}</span>
                        <span className="task-date">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </li>
                    ))}
                    {getUpcomingTasks(7).length > 3 && (
                      <li className="more-indicator">
                        +{getUpcomingTasks(7).length - 3} more...
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalsPage;