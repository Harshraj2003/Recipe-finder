
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_API_URL + '/api/users';


export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);

    // If the request is successful, the backend will send back data (user object and token).
    // We return this data so it can be used by the component that called this function.
    return response.data;
  } catch (error) {
    // If the backend returns an error (e.g., email already exists), axios will throw an error.
    // We log the detailed error for debugging and then re-throw it so the calling
    // component's catch block can handle it and display a message to the user.
    console.error('Registration failed:', error.response.data);
    throw error.response.data;
  }
};


export const login = async (userData) => {
  try {
    // The logic is very similar to the register function.
    // We make a POST request to the '/login' endpoint with the user's credentials.
    const response = await axios.post(`${API_URL}/login`, userData);

    return response.data;
  } catch (error) {
    console.error('Login failed:', error.response.data);
    throw error.response.data;
  }
};