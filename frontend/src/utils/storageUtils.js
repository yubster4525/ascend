/**
 * Utility for managing data persistence in localStorage
 */

// Store data in localStorage with a specific key
export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
    return false;
  }
};

// Retrieve data from localStorage by key
export const loadFromStorage = (key, defaultValue = null) => {
  try {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// Remove data from localStorage by key
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
    return false;
  }
};

// Clear all app data from localStorage
export const clearAppData = () => {
  try {
    // Define app-specific keys to clear
    const appKeys = [
      'goals', 
      'habits', 
      'journalEntries', 
      'bodyMetrics',
      'userMetrics',
      'userPreferences'
    ];
    
    appKeys.forEach(key => localStorage.removeItem(key));
    return true;
  } catch (error) {
    console.error('Error clearing app data from localStorage:', error);
    return false;
  }
};

// Storage keys used in the application
export const STORAGE_KEYS = {
  GOALS: 'goals',
  HABITS: 'habits',
  JOURNAL: 'journalEntries',
  BODY_METRICS: 'bodyMetrics',
  USER_METRICS: 'userMetrics',
  USER_PREFERENCES: 'userPreferences'
};