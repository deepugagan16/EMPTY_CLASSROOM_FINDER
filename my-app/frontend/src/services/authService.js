import axios from 'axios';

const API_URL = '/api/auth/';

// Register User
export const register = async (userData) => {
  const response = await axios.post(`${API_URL}register`, userData);
  return response.data;
};

// Login User
export const login = async (userData) => {
  const response = await axios.post(`${API_URL}login`, userData);
  return response.data;
};
