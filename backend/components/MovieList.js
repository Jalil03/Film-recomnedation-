import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../MovieList.css';
import moviesData from '../data/movies_with_posters.json';

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    setMovies(moviesData); // Load movies from the JSON file
  }, []);

  const filteredMovies = filter === 'All'
    ? movies
    : movies.filter((movie) => movie.genres.includes(filter));

  return (
    <div className="movie-list">
       <Link to="/recommendations">
        <button className="recommend-button">Find Recommendations</button>
      </Link>
      <h1 className="page-title">🎬 Explore Our Movie Collection 🎥</h1>
      <div className="filters">
        {['All', 'Action', 'Drama', 'Sci-Fi', 'Comedy', 'Romance'].map((genre) => (
          <button
            key={genre}
            className={`filter-button ${filter === genre ? 'active' : ''}`}
            onClick={() => setFilter(genre)}
          >
            {genre}
          </button>
        ))}
      </div>
      <div className="movie-grid">
        {filteredMovies.map((movie) => (
          <div key={movie.movieId} className="movie-card">
            <Link to={`/movie/${movie.movieId}`} className="movie-link">
              <div className="movie-image-container">
                <img
                  className="movie-image"
                  src={movie.poster_path}
                  alt={movie.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/default-poster.png'; // Fallback image
                  }}
                />
              </div>
              <div className="movie-title">
                <h3>{movie.title}</h3>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MovieList;
