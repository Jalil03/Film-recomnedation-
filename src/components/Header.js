import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../Header.css';

function Header() {
  const navigate = useNavigate();
  const location = useLocation(); // Get current route

  const handleLogout = () => {
    localStorage.removeItem('userToken'); // Clear the user token
    navigate('/login'); // Redirect to login page
  };

  return (
    <nav className="header">
      <h1 className="header-logo">Smart Recommender</h1>
      <ul className="header-nav">

      {location.pathname !== '/login' && ( <>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/movies">Movies</Link></li>
            <li><Link to="/recommendations">Recommendations</Link></li>
            <li><Link to="/about">About</Link></li>
          <li>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Header;
