import React from 'react';
import '../Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>© 2024 JL Movie Recommender. All rights reserved.</p>
        <div className="footer-links">
          <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
          <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a>
          <a href="/contact" target="_blank" rel="noopener noreferrer">Contact</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
