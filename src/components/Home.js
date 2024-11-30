import React from 'react';
import { Link } from 'react-router-dom';
import '../Home.css';

function Home() {
  return (
    <div className="home">
      <h1>Welcome to JL Movie Recommender</h1>
      <p>Discover the best movies tailored just for you.</p>
      <div className="home-buttons">
        <Link to="/movies" className="button button-green">
          Explore Movies
        </Link>
        <Link to="/reviews" className="button button-blue">
          See Reviews
        </Link>
      </div>
    </div>
  );
}

export default Home;