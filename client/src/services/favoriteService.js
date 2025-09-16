import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_API_URL}/api/favorites`;

// --- Add Favorite ---
export const addFavorite = async (recipeId) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('You must be logged in to add a favorite.');

  const config = { headers: { Authorization: `Bearer ${token}` } };
  const body = { recipeId };

  try {
    const response = await axios.post(API_URL, body, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('An unknown error occurred.');
  }
};

// --- Get Favorites ---
export const getFavorites = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication token not found.');

  const config = { headers: { Authorization: `Bearer ${token}` } };

  try {
    const response = await axios.get(API_URL, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Failed to fetch favorites.');
  }
};

// --- Remove Favorite ---
export const removeFavorite = async (recipeId) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication token not found.');

  const config = { headers: { Authorization: `Bearer ${token}` } };

  try {
    const response = await axios.delete(`${API_URL}/${recipeId}`, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Failed to remove favorite.');
  }
};

export const updateFavoriteNote = async (recipeId, notes) => {
  // 1. Retrieve the JWT from localStorage. This is the user's proof of identity.
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication token not found.');
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const body = { notes };

  try {
    const response = await axios.put(`${API_URL}/${recipeId}`, body, config);
      return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Failed to update notes.');
  }
};