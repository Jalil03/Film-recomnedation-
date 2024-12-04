import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Header.css';

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userToken'); // Clear the user token
    navigate('/login'); // Redirect to login page
  };

  return (
    <nav className="header">
      <h1 className="header-logo">🎥 JL Movie Recommender</h1>
      <ul className="header-nav">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/movies">Movies</Link></li>
        <li><Link to="/recommendations">Recommendations</Link></li>
        <li><Link to="/about">About</Link></li>
        <li>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Header;
