import axios from 'axios';

// Base URL of the FastAPI backend
const BASE_URL = 'http://127.0.0.1:8000';

/**
 * Get movie recommendations for a user
 * @param {number} userId - The ID of the user
 * @param {string} token - Bearer token for authentication (optional if needed)
 * @returns {Promise<Object>} The recommendation data
 */
export const getRecommendations = async (userId, token, algorithm = 'astar') => {
  try {
    const response = await axios.get(
      `${BASE_URL}/recommend/${userId}?algorithm=${algorithm}&max_depth=3`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch recommendations');
  }
};

/**
 * Predict the rating for a specific movie by a user
 * @param {number} userId - The ID of the user
 * @param {number} movieId - The ID of the movie
 * @returns {Promise<Object>} The predicted rating
 */
export const predictRating = async (userId, movieId) => {
  try {
    const response = await axios.post(`${BASE_URL}/predict`, {
      user_id: userId,
      movie_id: movieId,
    });
    return response.data;
  } catch (error) {
    console.error('Error predicting rating:', error);
    throw new Error('Failed to predict rating');
  }
};

/**
 * Evaluate the global Mean Absolute Error (MAE)
 * @returns {Promise<Object>} The global MAE data
 */
export const evaluateMAE = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/evaluate`);
    return response.data;
  } catch (error) {
    console.error('Error evaluating global MAE:', error);
    throw new Error('Failed to evaluate global MAE');
  }
};

/**
 * Soumettre le feedback pour les recommandations
 * @param {number} userId - L'ID de l'utilisateur
 * @param {number} feedbackScore - Note globale du feedback (1-5)
 * @returns {Promise<Object>} La réponse du serveur
 */
export const submitFeedback = async (userId, feedbackScore) => {
  try {
    const response = await axios.post(`${BASE_URL}/feedback`, {
      user_id: userId,
      feedback_score: feedbackScore,
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la soumission du feedback :', error);
    throw new Error('Échec de la soumission du feedback');
  }
};



/**
 * Evaluate the MAE for a specific user
 * @param {number} userId - The ID of the user
 * @returns {Promise<Object>} The user's MAE data
 */
export const evaluateUserMAE = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/evaluate/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error evaluating user MAE:', error);
    throw new Error('Failed to evaluate user MAE');
  }
};

/**
 * Register a new user
 * @param {string} email - The email of the user
 * @param {string} password - The password of the user
 * @returns {Promise<Object>} The registration result
 */
export const registerUser = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/register`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw new Error('Failed to register user');
  }
};


/**
 * Évaluer le MAE en utilisant le feedback de l'utilisateur
 * @returns {Promise<Object>} Les données de MAE calculées à partir du feedback utilisateur
 */
export const evaluateFeedbackMAE = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/evaluate_feedback_mae`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'évaluation du MAE à partir du feedback :', error);
    throw new Error('Échec de l\'évaluation du MAE à partir du feedback');
  }
};


/**
 * Log in a user
 * @param {string} email - The email of the user
 * @param {string} password - The password of the user
 * @returns {Promise<Object>} The login result including the user ID and token
 */
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Error logging in user:', error);
    throw new Error('Failed to log in user');
  }
};
