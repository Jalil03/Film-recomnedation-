import React, { useState, useEffect } from 'react';
import '../MovieRecommendations.css'; // CSS file for updated styling
import moviesData from '../data/movies_with_posters.json'; // Ensure this file contains poster_path
import ratingsData from '../data/ratings_reduced_to_500.json'; // Ratings data

function MovieRecommendations() {
  const [movies, setMovies] = useState([]); // Full list of movies
  const [recommendations, setRecommendations] = useState([]); // Filtered list of movies
  const [searchType, setSearchType] = useState('title');
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    // Merge ratings into moviesData for accurate ratings display
    const updatedMovies = moviesData.map((movie) => {
      const movieRatings = ratingsData.filter((rating) => rating.movieId === movie.movieId);
      const averageRating =
        movieRatings.reduce((sum, rating) => sum + rating.rating, 0) / movieRatings.length || 'N/A';
      return { ...movie, average_rating: averageRating.toFixed(1) };
    });
    setMovies(updatedMovies); // Store the full list of movies
    setRecommendations(updatedMovies); // Initialize recommendations with all movies
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value.toLowerCase();
    setInputValue(value);

    // Dynamic filtering only for Search by Title
    if (searchType === 'title' && value.trim()) {
      const filteredMovies = movies.filter((movie) =>
        movie.title.toLowerCase().includes(value)
      );
      setRecommendations(filteredMovies);
    } else if (searchType === 'title' && !value.trim()) {
      setRecommendations(movies); // Show all movies if input is cleared
    }
  };

  const handleSearch = () => {
    // Perform search only when Search by Genres is selected
    if (searchType === 'genres') {
      const genres = inputValue.split(',').map((genre) => genre.trim().toLowerCase());
      const filteredMovies = movies.filter((movie) =>
        genres.every((genre) => movie.genres.toLowerCase().includes(genre))
      );
      setRecommendations(filteredMovies);
    }
  };

  const renderStars = (rating) => {
    const stars = Math.round(rating);
    return Array.from({ length: 5 }).map((_, index) => (
      <span key={index} className={`star ${index < stars ? 'filled' : ''}`}>
        ★
      </span>
    ));
  };

  return (
    <div className="recommendation-container">
      <h1 className="recommendation-title">Find Your Next Favorite Movie</h1>
      <p className="recommendation-description">
        Search by a movie title to find similar movies or explore by genres.
      </p>

      <div className="search-options">
        <label className={`radio-label ${searchType === 'title' ? 'active' : ''}`}>
          <input
            type="radio"
            name="searchType"
            value="title"
            checked={searchType === 'title'}
            onChange={() => {
              setSearchType('title');
              setRecommendations(movies); // Reset recommendations to all movies
            }}
          />
          Search by Title
        </label>
        <label className={`radio-label ${searchType === 'genres' ? 'active' : ''}`}>
          <input
            type="radio"
            name="searchType"
            value="genres"
            checked={searchType === 'genres'}
            onChange={() => {
              setSearchType('genres');
              setRecommendations([]); // Clear recommendations when switching to genres
            }}
          />
          Search by Genres
        </label>
      </div>

      <div className="input-container">
        <input
          className="search-input"
          type="text"
          placeholder={
            searchType === 'title'
              ? 'Enter a movie title, e.g., Toy Story'
              : 'Enter genres, e.g., Drama, Comedy'
          }
          value={inputValue}
          onChange={handleInputChange}
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      <div className="results-container">
        {recommendations.length === 1 ? (
          <div className="single-result">
            <img
              className="single-result-image"
              src={recommendations[0].poster_path}
              alt={recommendations[0].title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/default-poster.png';
              }}
            />
            <div className="single-result-info">
              <h2>{recommendations[0].title}</h2>
              <p className="genres">{recommendations[0].genres.split('|').slice(0, 3).join(', ')}</p>
              <div className="rating">
                {recommendations[0].average_rating !== 'N/A' ? (
                  <>
                    {renderStars(recommendations[0].average_rating)}
                    <span>({recommendations[0].average_rating})</span>
                  </>
                ) : (
                  'Rating: N/A'
                )}
              </div>
            </div>
          </div>
        ) : recommendations.length > 0 ? (
          <div className="results-grid">
            {recommendations.map((rec, index) => (
              <div key={index} className="result-card">
                <img
                  className="result-image"
                  src={rec.poster_path}
                  alt={rec.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/default-poster.png';
                  }}
                />
                <h3>{rec.title}</h3>
                <p className="genres">{rec.genres.split('|').slice(0, 3).join(', ')}</p>
                <div className="rating">
                  {rec.average_rating !== 'N/A' ? (
                    <>
                      {renderStars(rec.average_rating)}
                      <span>({rec.average_rating})</span>
                    </>
                  ) : (
                    'Rating: N/A'
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <img src="/images/no-results.png" alt="No results found" />
            <p>No movies found. Try searching with a different title or genres.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieRecommendations;
