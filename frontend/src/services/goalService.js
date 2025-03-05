import axios from 'axios';
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '../utils/storageUtils';

const API_URL = 'http://localhost:5000/api';

// Add token to all requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

// Get all goals (from API or localStorage)
export const getGoals = async () => {
  try {
    const res = await axios.get(`${API_URL}/goals`);
    saveToStorage(STORAGE_KEYS.GOALS, res.data); // Cache data
    return res.data;
  } catch (error) {
    console.error('Error fetching goals from API, falling back to localStorage', error);
    // Fallback to localStorage
    return loadFromStorage(STORAGE_KEYS.GOALS, []);
  }
};

// Get a single goal by ID
export const getGoalById = async (goalId) => {
  try {
    const res = await axios.get(`${API_URL}/goals/${goalId}`);
    
    // Update the goal in local cache
    const currentGoals = loadFromStorage(STORAGE_KEYS.GOALS, []);
    const updatedGoals = currentGoals.map(goal => 
      (goal.id === goalId || goal._id === goalId) ? res.data : goal
    );
    saveToStorage(STORAGE_KEYS.GOALS, updatedGoals);
    
    return res.data;
  } catch (error) {
    console.error(`Error fetching goal ${goalId} from API, trying localStorage`, error);
    
    // Try to get from localStorage
    const goals = loadFromStorage(STORAGE_KEYS.GOALS, []);
    const goal = goals.find(g => g.id === goalId || g._id === goalId);
    
    if (goal) {
      return goal;
    }
    
    throw new Error(`Goal with ID ${goalId} not found`);
  }
};

// Create a new goal
export const createGoal = async (goalData) => {
  try {
    const res = await axios.post(`${API_URL}/goals`, goalData);
    
    // Update local cache with the new goal
    const currentGoals = loadFromStorage(STORAGE_KEYS.GOALS, []);
    saveToStorage(STORAGE_KEYS.GOALS, [...currentGoals, res.data]);
    
    return res.data;
  } catch (error) {
    console.error('Error creating goal in API, saving locally', error);
    
    // Create a local version with ID
    const newGoal = {
      ...goalData,
      id: Date.now(),
      progress: goalData.progress || 0
    };
    
    // Save to localStorage
    const currentGoals = loadFromStorage(STORAGE_KEYS.GOALS, []);
    saveToStorage(STORAGE_KEYS.GOALS, [...currentGoals, newGoal]);
    
    return newGoal;
  }
};

// Update an existing goal
export const updateGoal = async (goalId, goalData) => {
  try {
    const res = await axios.put(`${API_URL}/goals/${goalId}`, goalData);
    
    // Update local cache
    const currentGoals = loadFromStorage(STORAGE_KEYS.GOALS, []);
    const updatedGoals = currentGoals.map(goal => 
      (goal.id === goalId || goal._id === goalId) ? res.data : goal
    );
    saveToStorage(STORAGE_KEYS.GOALS, updatedGoals);
    
    return res.data;
  } catch (error) {
    console.error(`Error updating goal ${goalId} in API, updating locally`, error);
    
    // Update locally
    const currentGoals = loadFromStorage(STORAGE_KEYS.GOALS, []);
    const updatedGoals = currentGoals.map(goal => 
      (goal.id === goalId || goal._id === goalId) ? { ...goal, ...goalData } : goal
    );
    saveToStorage(STORAGE_KEYS.GOALS, updatedGoals);
    
    // Return the updated goal
    const updatedGoal = currentGoals.find(g => g.id === goalId || g._id === goalId);
    return { ...updatedGoal, ...goalData };
  }
};

// Delete a goal
export const deleteGoal = async (goalId) => {
  try {
    await axios.delete(`${API_URL}/goals/${goalId}`);
    
    // Update local cache
    const currentGoals = loadFromStorage(STORAGE_KEYS.GOALS, []);
    const filteredGoals = currentGoals.filter(goal => 
      goal.id !== goalId && goal._id !== goalId
    );
    saveToStorage(STORAGE_KEYS.GOALS, filteredGoals);
    
    return { success: true };
  } catch (error) {
    console.error(`Error deleting goal ${goalId} from API, deleting locally`, error);
    
    // Delete locally
    const currentGoals = loadFromStorage(STORAGE_KEYS.GOALS, []);
    const filteredGoals = currentGoals.filter(goal => 
      goal.id !== goalId && goal._id !== goalId
    );
    saveToStorage(STORAGE_KEYS.GOALS, filteredGoals);
    
    return { success: true };
  }
};

// Update milestone completion status
export const updateMilestone = async (goalId, milestoneId, completed) => {
  try {
    const res = await axios.patch(`${API_URL}/goals/${goalId}/milestone`, {
      milestoneId,
      completed
    });
    
    // Update local cache
    const currentGoals = loadFromStorage(STORAGE_KEYS.GOALS, []);
    const updatedGoals = currentGoals.map(goal => 
      (goal.id === goalId || goal._id === goalId) ? res.data : goal
    );
    saveToStorage(STORAGE_KEYS.GOALS, updatedGoals);
    
    return res.data;
  } catch (error) {
    console.error(`Error updating milestone ${milestoneId} in API, updating locally`, error);
    
    // Update locally
    const currentGoals = loadFromStorage(STORAGE_KEYS.GOALS, []);
    const goalIndex = currentGoals.findIndex(g => g.id === goalId || g._id === goalId);
    
    if (goalIndex !== -1) {
      const goal = currentGoals[goalIndex];
      
      // Update milestone
      const updatedMilestones = goal.milestones.map(milestone => {
        if (milestone.id === milestoneId || milestone._id === milestoneId) {
          return { ...milestone, completed };
        }
        return milestone;
      });
      
      // Calculate new progress
      const completedCount = updatedMilestones.filter(m => m.completed).length;
      const totalCount = updatedMilestones.length;
      const newProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
      
      // Create updated goal
      const updatedGoal = {
        ...goal,
        milestones: updatedMilestones,
        progress: newProgress
      };
      
      // Update in array
      const updatedGoals = [...currentGoals];
      updatedGoals[goalIndex] = updatedGoal;
      
      // Save to storage
      saveToStorage(STORAGE_KEYS.GOALS, updatedGoals);
      
      return updatedGoal;
    }
    
    throw new Error(`Goal with ID ${goalId} not found`);
  }
};

// Update task completion status
export const updateTask = async (goalId, taskId, completed) => {
  try {
    const res = await axios.patch(`${API_URL}/goals/${goalId}/task`, {
      taskId,
      completed
    });
    
    // Update local cache
    const currentGoals = loadFromStorage(STORAGE_KEYS.GOALS, []);
    const updatedGoals = currentGoals.map(goal => 
      (goal.id === goalId || goal._id === goalId) ? res.data : goal
    );
    saveToStorage(STORAGE_KEYS.GOALS, updatedGoals);
    
    return res.data;
  } catch (error) {
    console.error(`Error updating task ${taskId} in API, updating locally`, error);
    
    // Update locally
    const currentGoals = loadFromStorage(STORAGE_KEYS.GOALS, []);
    const goalIndex = currentGoals.findIndex(g => g.id === goalId || g._id === goalId);
    
    if (goalIndex !== -1) {
      const goal = currentGoals[goalIndex];
      
      // Update task
      const updatedTasks = goal.tasks.map(task => {
        if (task.id === taskId || task._id === taskId) {
          return { ...task, completed };
        }
        return task;
      });
      
      // Create updated goal
      const updatedGoal = {
        ...goal,
        tasks: updatedTasks
      };
      
      // Update in array
      const updatedGoals = [...currentGoals];
      updatedGoals[goalIndex] = updatedGoal;
      
      // Save to storage
      saveToStorage(STORAGE_KEYS.GOALS, updatedGoals);
      
      return updatedGoal;
    }
    
    throw new Error(`Goal with ID ${goalId} not found`);
  }
};

// Get upcoming tasks
export const getUpcomingTasks = async (days = 7) => {
  try {
    const res = await axios.get(`${API_URL}/goals/upcoming-tasks?days=${days}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching upcoming tasks from API, calculating locally', error);
    
    // Calculate locally from goals in localStorage
    const goals = loadFromStorage(STORAGE_KEYS.GOALS, []);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + parseInt(days));
    
    // Extract tasks from all goals
    let upcomingTasks = [];
    goals.forEach(goal => {
      if (goal.tasks && goal.tasks.length > 0) {
        const goalTasks = goal.tasks.filter(task => {
          const taskDate = new Date(task.dueDate);
          return taskDate >= today && taskDate <= endDate && !task.completed;
        }).map(task => ({
          ...task,
          goalId: goal._id || goal.id,
          goalTitle: goal.title
        }));
        
        upcomingTasks = [...upcomingTasks, ...goalTasks];
      }
    });
    
    // Sort by due date
    upcomingTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    
    return upcomingTasks;
  }
};

// Legacy methods for compatibility - using new storage utility
export const saveGoalsToLocalStorage = (goals) => {
  return saveToStorage(STORAGE_KEYS.GOALS, goals);
};

export const loadGoalsFromLocalStorage = () => {
  return loadFromStorage(STORAGE_KEYS.GOALS, []);
};