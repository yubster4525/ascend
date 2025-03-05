import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Add token to all requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export const createHabit = async (habitName) => {
  const res = await axios.post(`${API_URL}/habits`, { habitName });
  return res.data;
};

export const getHabits = async () => {
  const res = await axios.get(`${API_URL}/habits`);
  return res.data;
};