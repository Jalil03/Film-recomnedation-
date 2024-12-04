import React from 'react';
import { useParams } from 'react-router-dom';
import movies from '../moviesData';


function MovieDetails() {
  const { id } = useParams();
  const movie = movies.find(m => m.id === parseInt(id));

  return (
    <div>
      {movie ? (
        <>
          <h1>{movie.title}</h1>
          <p>{movie.overview}</p>
          <img src={`../../public/images'${movie.poster_path}`} alt={movie.title} />
        </>
      ) : (
        <p>Movie not found.</p>
      )}
    </div>
  );
}

export default MovieDetails;
