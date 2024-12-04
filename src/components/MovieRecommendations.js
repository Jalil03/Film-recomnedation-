import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../MovieRecommendations.css';
import { getRecommendations, evaluateMAE, submitFeedback, evaluateFeedbackMAE } from '../utils';

import moviesData from '../data/movies_with_posters.json';

function MovieRecommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [feedbackScore, setFeedbackScore] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [recommendedMovieIds, setRecommendedMovieIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [algorithm, setAlgorithm] = useState('astar');
  const [error, setError] = useState('');
  const [globalMae, setGlobalMae] = useState(null);
  const [userMae, setUserMae] = useState(null); // Nouvel état pour le MAE de l'utilisateur
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!localStorage.getItem('userToken') || !userId) {
      navigate('/login');
    }
  }, [navigate, userId]);

// Dans handleSubmitFeedback
const handleSubmitFeedback = async () => {
  setError('');
  setFeedbackMessage('');

  if (!feedbackScore || isNaN(feedbackScore) || feedbackScore < 1 || feedbackScore > 5) {
    setError('Veuillez fournir une note valide entre 1 et 5.');
    return;
  }

  try {
    await submitFeedback(parseInt(userId, 10), parseFloat(feedbackScore));

    // Récupérer le MAE de l'utilisateur après avoir soumis le feedback
    const userMaeData = await evaluateFeedbackMAE();
    setUserMae(userMaeData);

    setFeedbackMessage('Feedback soumis avec succès !');
    setFeedbackScore('');
  } catch (err) {
    console.error('Erreur lors de la soumission du feedback :', err.message);
    setError('Échec de la soumission du feedback.');
  }
};

  const fetchRecommendations = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('userToken');
      const data = await getRecommendations(userId, token, algorithm); // Passer l'algorithme sélectionné
      const matchedMovies = data.recommended_movies.map((title) =>
        moviesData.find((movie) => movie.title === title)
      );
      setRecommendations(matchedMovies.slice(0, 28));
      setRecommendedMovieIds(data.recommended_movies_ids || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchGlobalMAE = async () => {
    setLoading(true);
    setError('');
    try {
      const maeData = await evaluateMAE();
      setGlobalMae(maeData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGlobalMAE();
  }, []);

  return (
    <div className="recommendations-container">
      <h1>Recommandations de films pour l'utilisateur ID : {userId}</h1>
      <div className="controls">
        <label htmlFor="algorithm">Choisir l'algorithme :</label>
        <select
          id="algorithm"
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
        >
          <option value="astar">Algorithme A*</option>
          <option value="bfs">Algorithme BFS</option>
        </select>
        <button onClick={fetchRecommendations} disabled={loading}>
          {loading ? 'Chargement...' : 'Obtenir des recommandations'}
        </button>
      </div>

      {/* Afficher l'algorithme choisi */}
      <h2>Algorithme utilisé : {algorithm === 'astar' ? 'A*' : 'BFS'}</h2>

      {error && <p className="error">{error}</p>}

      {recommendations.length > 0 && (
        <div className="movie-grid">
          {recommendations.map((movie, index) => (
            <div key={index} className="movie-card">
              <img
                className="movie-image"
                src={movie?.poster_path || '/images/default-poster.png'}
                alt={movie?.title || 'Aucun titre'}
              />
              <h3>{movie?.title || 'Aucun titre'}</h3>
            </div>
          ))}
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="feedback-section">
          <h3>Notez nos recommandations</h3>
          <input
            type="number"
            min="1"
            max="5"
            placeholder="Entrez une note (1-5)"
            value={feedbackScore}
            onChange={(e) => setFeedbackScore(e.target.value)}
          />
          <button onClick={handleSubmitFeedback} disabled={!feedbackScore || loading}>
            Soumettre le feedback
          </button>
          {feedbackMessage && <p className="success">{feedbackMessage}</p>}
        </div>
      )}

      {/* Afficher le MAE de l'utilisateur après le feedback */}
      {globalMae && (
  <div className="mae-section">
    <h3>🌟 Évaluation Globale</h3>
    <p><strong>MAE :</strong> {globalMae.mae && !isNaN(globalMae.mae) ? Number(globalMae.mae).toFixed(2) : 'Non disponible'}</p>
    <p><strong>Précision :</strong> {globalMae.mae && !isNaN(globalMae.mae) 
      ? `${((5 - Number(globalMae.mae)) / 5 * 100).toFixed(2)}%` 
      : 'Non disponible'}</p>
  </div>
)}

{userMae && (
  <div className="mae-section">
    <h3>🔍 Évaluation Basée sur Votre Feedback</h3>
    <p><strong>MAE :</strong> {userMae.mae && !isNaN(userMae.mae) ? Number(userMae.mae).toFixed(2) : 'Non disponible'}</p>
    <p><strong>Précision :</strong> {userMae.mae && !isNaN(userMae.mae) 
      ? `${((5 - Number(userMae.mae)) / 5 * 100).toFixed(2)}%` 
      : 'Non disponible'}</p>
  </div>
)}

    </div>
  );
}

export default MovieRecommendations;
