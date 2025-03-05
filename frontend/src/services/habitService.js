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

// Get all habits (from API or localStorage)
export const getHabits = async () => {
  try {
    const res = await axios.get(`${API_URL}/habits`);
    saveToStorage(STORAGE_KEYS.HABITS, res.data); // Cache data
    return res.data;
  } catch (error) {
    console.error('Error fetching habits from API, falling back to localStorage', error);
    // Fallback to localStorage
    return loadFromStorage(STORAGE_KEYS.HABITS, []);
  }
};

// Create a new habit
export const createHabit = async (habitData) => {
  try {
    const res = await axios.post(`${API_URL}/habits`, habitData);
    
    // Update local cache with the new habit
    const currentHabits = loadFromStorage(STORAGE_KEYS.HABITS, []);
    saveToStorage(STORAGE_KEYS.HABITS, [...currentHabits, res.data]);
    
    return res.data;
  } catch (error) {
    console.error('Error creating habit in API, saving locally', error);
    
    // Create a local version with ID
    const newHabit = {
      ...habitData,
      id: Date.now(),
      streak: 0,
      completedDates: []
    };
    
    // Save to localStorage
    const currentHabits = loadFromStorage(STORAGE_KEYS.HABITS, []);
    saveToStorage(STORAGE_KEYS.HABITS, [...currentHabits, newHabit]);
    
    return newHabit;
  }
};

// Update an existing habit
export const updateHabit = async (habitId, habitData) => {
  try {
    const res = await axios.put(`${API_URL}/habits/${habitId}`, habitData);
    
    // Update local cache
    const currentHabits = loadFromStorage(STORAGE_KEYS.HABITS, []);
    const updatedHabits = currentHabits.map(habit => 
      (habit.id === habitId || habit._id === habitId) ? res.data : habit
    );
    saveToStorage(STORAGE_KEYS.HABITS, updatedHabits);
    
    return res.data;
  } catch (error) {
    console.error(`Error updating habit ${habitId} in API, updating locally`, error);
    
    // Update locally
    const currentHabits = loadFromStorage(STORAGE_KEYS.HABITS, []);
    const updatedHabits = currentHabits.map(habit => 
      (habit.id === habitId || habit._id === habitId) ? { ...habit, ...habitData } : habit
    );
    saveToStorage(STORAGE_KEYS.HABITS, updatedHabits);
    
    // Return the updated habit
    return { ...habitData, id: habitId };
  }
};

// Delete a habit
export const deleteHabit = async (habitId) => {
  try {
    await axios.delete(`${API_URL}/habits/${habitId}`);
    
    // Update local cache
    const currentHabits = loadFromStorage(STORAGE_KEYS.HABITS, []);
    const filteredHabits = currentHabits.filter(habit => 
      habit.id !== habitId && habit._id !== habitId
    );
    saveToStorage(STORAGE_KEYS.HABITS, filteredHabits);
    
    return { success: true };
  } catch (error) {
    console.error(`Error deleting habit ${habitId} from API, deleting locally`, error);
    
    // Delete locally
    const currentHabits = loadFromStorage(STORAGE_KEYS.HABITS, []);
    const filteredHabits = currentHabits.filter(habit => 
      habit.id !== habitId && habit._id !== habitId
    );
    saveToStorage(STORAGE_KEYS.HABITS, filteredHabits);
    
    return { success: true };
  }
};

// Toggle completion status for a habit on a specific date
export const toggleHabitCompletion = async (habitId, date) => {
  try {
    const res = await axios.patch(`${API_URL}/habits/${habitId}/toggle`, { date });
    
    // Update local cache
    const currentHabits = loadFromStorage(STORAGE_KEYS.HABITS, []);
    const updatedHabits = currentHabits.map(habit => 
      (habit.id === habitId || habit._id === habitId) ? res.data : habit
    );
    saveToStorage(STORAGE_KEYS.HABITS, updatedHabits);
    
    return res.data;
  } catch (error) {
    console.error(`Error toggling habit ${habitId} completion in API, updating locally`, error);
    
    // Update locally
    const currentHabits = loadFromStorage(STORAGE_KEYS.HABITS, []);
    const habit = currentHabits.find(h => h.id === habitId || h._id === habitId);
    
    if (habit) {
      let completedDates = [...(habit.completedDates || [])];
      const dateIndex = completedDates.indexOf(date);
      
      if (dateIndex >= 0) {
        // Remove date
        completedDates.splice(dateIndex, 1);
      } else {
        // Add date
        completedDates.push(date);
      }
      
      // Calculate streak
      let streak = 0;
      const sortedDates = [...completedDates].sort();
      
      if (sortedDates.length > 0) {
        const today = new Date().toISOString().split('T')[0];
        
        if (sortedDates.includes(today)) {
          streak = 1;
          let currentDate = new Date(today);
          
          while (streak < 100) {
            currentDate.setDate(currentDate.getDate() - 1);
            const prevDateStr = currentDate.toISOString().split('T')[0];
            
            if (sortedDates.includes(prevDateStr)) {
              streak++;
            } else {
              break;
            }
          }
        }
      }
      
      const updatedHabit = {
        ...habit,
        completedDates,
        streak
      };
      
      const updatedHabits = currentHabits.map(h => 
        (h.id === habitId || h._id === habitId) ? updatedHabit : h
      );
      
      saveToStorage(STORAGE_KEYS.HABITS, updatedHabits);
      return updatedHabit;
    }
    
    throw new Error(`Habit with ID ${habitId} not found`);
  }
};