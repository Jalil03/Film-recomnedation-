import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import MovieList from './components/MovieList';
import MovieDetails from './components/MovieDetails';
import About from './components/About';
import Review from './components/Review';
import MovieRecommendations from './components/MovieRecommendations';
import './App.css';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<MovieList />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/reviews" element={<Review />} /> {/* New */}
        <Route path="/recommendations" element={<MovieRecommendations />} /> {/* Nouvelle route */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
