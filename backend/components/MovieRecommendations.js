/* import React, { useState, useEffect } from 'react'; // Added useEffect
import { useNavigate } from 'react-router-dom';
import '../MovieRecommendations.css';
import { getRecommendations, evaluateMAE, evaluateUserMAE } from '../utils';
import moviesData from '../data/movies_with_posters.json';

function MovieRecommendations() {
  const [userId, setUserId] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [mae, setMae] = useState(null);
  const [userMae, setUserMae] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Redirect to login if no token is found
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/login'); // Redirect to login if token is missing
    }
  }, [navigate]); // Runs on component mount

  const fetchRecommendations = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        navigate('/login');
        return;
      }
      const data = await getRecommendations(userId, token); // Pass token to API
      const matchedMovies = data.recommended_movies.map((title) =>
        moviesData.find((movie) => movie.title === title)
      );
      setRecommendations(matchedMovies.slice(0, 28));
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
      setMae(maeData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserMAE = async () => {
    setLoading(true);
    setError('');
    try {
      const userMaeData = await evaluateUserMAE(userId);
      setUserMae(userMaeData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recommendations-container">
      <h1>Movie Recommendations</h1>
      <div className="input-section">
        <input
          type="number"
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button onClick={fetchRecommendations} disabled={loading}>
          {loading ? 'Loading...' : 'Get Recommendations'}
        </button>
        <button onClick={fetchGlobalMAE} disabled={loading}>
          {loading ? 'Loading...' : 'Get Global MAE'}
        </button>
        <button onClick={fetchUserMAE} disabled={loading}>
          {loading ? 'Loading...' : 'Get User MAE'}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {recommendations.length > 0 && (
        <div className="movie-grid">
          {recommendations.map((movie, index) => (
            <div key={index} className="movie-card">
              <img
                className="movie-image"
                src={movie?.poster_path || '/images/default-poster.png'}
                alt={movie?.title || 'No title'}
              />
              <h3>{movie?.title || 'No title'}</h3>
            </div>
          ))}
        </div>
      )}

      {mae && (
        <div className="mae-section">
          <h3>Global Evaluation Metrics</h3>
          <p>MAE: {mae.mae}</p>
          <p>Precision: {mae.precision}</p>
        </div>
      )}

      {userMae && (
        <div className="mae-section">
          <h3>User Evaluation Metrics</h3>
          <p>MAE: {userMae.mae}</p>
          <p>Precision: {userMae.precision}</p>
        </div>
      )}
    </div>
  );
}

export default MovieRecommendations;
 */


/* import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../MovieRecommendations.css';
import { getRecommendations } from '../utils';
import moviesData from '../data/movies_with_posters.json';

function MovieRecommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const userId = localStorage.getItem('userId'); // Get user ID from local storage
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate('/login'); // Redirect if user ID is not available
    }
  }, [userId, navigate]);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getRecommendations(userId); // Pass user ID to API
      const matchedMovies = data.recommended_movies.map((title) =>
        moviesData.find((movie) => movie.title === title)
      );
      setRecommendations(matchedMovies.slice(0, 28));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations(); // Fetch recommendations on mount
  }, []);

  return (
    <div className="recommendations-container">
      <h1>Movie Recommendations for User {userId}</h1>
      {error && <p className="error">{error}</p>}
      {loading && <p>Loading recommendations...</p>}
      {!loading && recommendations.length > 0 && (
        <div className="movie-grid">
          {recommendations.map((movie, index) => (
            <div key={index} className="movie-card">
              <img
                className="movie-image"
                src={movie?.poster_path || '/images/default-poster.png'}
                alt={movie?.title || 'No title'}
              />
              <h3>{movie?.title || 'No title'}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MovieRecommendations;
 */


/* import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecommendations } from '../utils';
import moviesData from '../data/movies_with_posters.json';

function MovieRecommendations() {
  const [userId, setUserId] = useState('');
  const [algorithm, setAlgorithm] = useState('astar'); // Algorithme par défaut
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/login'); // Rediriger si non connecté
    }
  }, [navigate]);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getRecommendations(userId, algorithm); // Passer l'algorithme choisi
      const matchedMovies = data.recommended_movies.map((title) =>
        moviesData.find((movie) => movie.title === title)
      );
      setRecommendations(matchedMovies.slice(0, 28));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recommendations-container">
      <h1>Movie Recommendations</h1>
      <div className="input-section">
        <input
          type="number"
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
          <option value="astar">A* Algorithm</option>
          <option value="bfs">BFS Algorithm</option>
        </select>
        <button onClick={fetchRecommendations} disabled={loading}>
          {loading ? 'Loading...' : 'Get Recommendations'}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {recommendations.length > 0 && (
        <div className="movie-grid">
          {recommendations.map((movie, index) => (
            <div key={index} className="movie-card">
              <img
                className="movie-image"
                src={movie?.poster_path || '/images/default-poster.png'}
                alt={movie?.title || 'No title'}
              />
              <h3>{movie?.title || 'No title'}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MovieRecommendations;
 */
/* 
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../MovieRecommendations.css';
import { getRecommendations } from '../utils';
import moviesData from '../data/movies_with_posters.json';

function MovieRecommendations() {
  const [userId, setUserId] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [algorithm, setAlgorithm] = useState('astar'); // Default to A*
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Automatically get the user ID from localStorage when the component mounts
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const storedUserId = localStorage.getItem('userId'); // Retrieve userId
    if (!token || !storedUserId) {
      navigate('/login'); // Redirect to login if token or userId is missing
      return;
    }
    setUserId(storedUserId);
  }, [navigate]);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        navigate('/login');
        return;
      }
      const data = await getRecommendations(userId, token, algorithm); // Pass algorithm to the API
      const matchedMovies = data.recommended_movies.map((title) =>
        moviesData.find((movie) => movie.title === title)
      );
      setRecommendations(matchedMovies.slice(0, 28));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recommendations-container">
      <h1>Movie Recommendations</h1>
      <div className="input-section">
        <label htmlFor="algorithm">Choose Algorithm:</label>
        <select
          id="algorithm"
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
        >
          <option value="astar">A* Algorithm</option>
          <option value="bfs">BFS Algorithm</option>
        </select>
        <button onClick={fetchRecommendations} disabled={loading}>
          {loading ? 'Loading...' : 'Get Recommendations'}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {recommendations.length > 0 && (
        <div className="movie-grid">
          {recommendations.map((movie, index) => (
            <div key={index} className="movie-card">
              <img
                className="movie-image"
                src={movie?.poster_path || '/images/default-poster.png'}
                alt={movie?.title || 'No title'}
              />
              <h3>{movie?.title || 'No title'}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MovieRecommendations;
 */

/* import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../MovieRecommendations.css';
import { getRecommendations, evaluateMAE, evaluateUserMAE } from '../utils';
import moviesData from '../data/movies_with_posters.json';

function MovieRecommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [algorithm, setAlgorithm] = useState('astar'); // Default to A*
  const [error, setError] = useState('');
  const [globalMae, setGlobalMae] = useState(null);
  const [userMae, setUserMae] = useState(null);
  const [feedback, setFeedback] = useState('');
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage

  useEffect(() => {
    if (!localStorage.getItem('userToken') || !userId) {
      navigate('/login'); // Redirect to login if token or userId is missing
    }
  }, [navigate, userId]);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('userToken');
      const data = await getRecommendations(userId, token, algorithm); // Pass algorithm to the API
      const matchedMovies = data.recommended_movies.map((title) =>
        moviesData.find((movie) => movie.title === title)
      );
      setRecommendations(matchedMovies.slice(0, 28));
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

  const fetchUserMAE = async () => {
    setLoading(true);
    setError('');
    try {
      const maeData = await evaluateUserMAE(userId);
      setUserMae(maeData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = () => {
    alert(`Feedback submitted: ${feedback}`);
    setFeedback('');
  };

  return (
    <div className="recommendations-container">
      <h1>Movie Recommendations for User ID: {userId}</h1>
      <div className="controls">
        <label htmlFor="algorithm">Choose Algorithm:</label>
        <select
          id="algorithm"
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
        >
          <option value="astar">A* Algorithm</option>
          <option value="bfs">BFS Algorithm</option>
        </select>
        <button onClick={fetchRecommendations} disabled={loading}>
          {loading ? 'Loading...' : 'Get Recommendations'}
        </button>
        <button onClick={fetchGlobalMAE} disabled={loading}>
          {loading ? 'Loading...' : 'Get Global MAE'}
        </button>
        <button onClick={fetchUserMAE} disabled={loading}>
          {loading ? 'Loading...' : 'Get User MAE'}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {recommendations.length > 0 && (
        <div className="movie-grid">
          {recommendations.map((movie, index) => (
            <div key={index} className="movie-card">
              <img
                className="movie-image"
                src={movie?.poster_path || '/images/default-poster.png'}
                alt={movie?.title || 'No title'}
              />
              <h3>{movie?.title || 'No title'}</h3>
            </div>
          ))}
        </div>
      )}

      {globalMae && (
        <div className="metrics">
          <h3>Global Evaluation Metrics</h3>
          <p>MAE: {globalMae.mae}</p>
          <p>Precision: {globalMae.precision}</p>
        </div>
      )}

      {userMae && (
        <div className="metrics">
          <h3>User Evaluation Metrics</h3>
          <p>MAE: {userMae.mae}</p>
          <p>Precision: {userMae.precision}</p>
        </div>
      )}

      <div className="feedback-section">
        <h3>Give Your Feedback</h3>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="What do you think about our recommendations?"
        />
        <button onClick={submitFeedback}>Submit Feedback</button>
      </div> 
    </div>
  );
}

export default MovieRecommendations;
 */


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../MovieRecommendations.css';
import { getRecommendations, evaluateMAE, evaluateUserMAE } from '../utils';
import moviesData from '../data/movies_with_posters.json';

function MovieRecommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [algorithm, setAlgorithm] = useState('astar'); // Default to A*
  const [error, setError] = useState('');
  const [globalMae, setGlobalMae] = useState(null);
  const [userMae, setUserMae] = useState(null);
  const [feedback, setFeedback] = useState('');
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage

  useEffect(() => {
    if (!localStorage.getItem('userToken') || !userId) {
      navigate('/login'); // Redirect to login if token or userId is missing
    }
  }, [navigate, userId]);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('userToken');
      const data = await getRecommendations(userId, token, algorithm); // Pass algorithm to the API
      const matchedMovies = data.recommended_movies.map((title) =>
        moviesData.find((movie) => movie.title === title)
      );
      setRecommendations(matchedMovies.slice(0, 28));
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

  const fetchUserMAE = async () => {
    setLoading(true);
    setError('');
    try {
      const maeData = await evaluateUserMAE(userId);
      setUserMae(maeData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = () => {
    alert(`Feedback submitted: ${feedback}`);
    setFeedback('');
  };

  return (
    <div className="recommendations-container">
      <h1>Movie Recommendations for User ID: {userId}</h1>
      <div className="controls">
        <label htmlFor="algorithm">Choose Algorithm:</label>
        <select
          id="algorithm"
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
        >
          <option value="astar">A* Algorithm</option>
          <option value="bfs">BFS Algorithm</option>
        </select>
        <button onClick={fetchRecommendations} disabled={loading}>
          {loading ? 'Loading...' : 'Get Recommendations'}
        </button>
        <button onClick={fetchGlobalMAE} disabled={loading}>
          {loading ? 'Loading...' : 'Get Global MAE'}
        </button>
        <button onClick={fetchUserMAE} disabled={loading}>
          {loading ? 'Loading...' : 'Get User MAE'}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {recommendations.length > 0 && (
        <div className="movie-grid">
          {recommendations.map((movie, index) => (
            <div key={index} className="movie-card">
              <img
                className="movie-image"
                src={movie?.poster_path || '/images/default-poster.png'}
                alt={movie?.title || 'No title'}
              />
              <h3>{movie?.title || 'No title'}</h3>
            </div>
          ))}
        </div>
      )}

      {globalMae && (
        <div className="metrics">
          <h3>Global Evaluation Metrics</h3>
          <p>MAE: {globalMae.mae}</p>
          <p>Precision: {globalMae.precision}</p>
        </div>
      )}

      {userMae && (
        <div className="metrics">
          <h3>User Evaluation Metrics</h3>
          <p>MAE: {userMae.mae}</p>
          <p>Precision: {userMae.precision}</p>
        </div>
      )}

      <div className="feedback-section">
        <h3>Give Your Feedback</h3>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="What do you think about our recommendations?"
        />
        <button onClick={submitFeedback}>Submit Feedback</button>
      </div>
    </div>
  );
}

export default MovieRecommendations;
