import axios from 'axios';

// Base URL de l'API FastAPI
const BASE_URL = 'http://127.0.0.1:8000';

export const getRecommendations = async (userId, maxDepth = 3) => {
  try {
    const response = await axios.get(`${BASE_URL}/recommend/${userId}`, {
      params: { max_depth: maxDepth },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
};

export const predictRating = async (userId, movieId) => {
  try {
    const response = await axios.post(`${BASE_URL}/predict`, {
      user_id: userId,
      movie_id: movieId,
    });
    return response.data;
  } catch (error) {
    console.error('Error predicting rating:', error);
    throw error;
  }
};

export const evaluateMAE = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/evaluate`);
    return response.data;
  } catch (error) {
    console.error('Error evaluating MAE:', error);
    throw error;
  }
};
