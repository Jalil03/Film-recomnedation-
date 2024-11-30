import React from 'react';
import { Link } from 'react-router-dom';
import '../Header.css';

function Header() {
  return (
    <nav className="header">
      <h1 className="header-logo">🎥 JL Movie Recommender</h1>
      <ul className="header-nav">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/movies">Movies</Link></li>
        <li><Link to="/recommendations">Recommendations</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>
    </nav>
  );
}

export default Header;
