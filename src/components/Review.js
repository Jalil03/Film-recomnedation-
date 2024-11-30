import React from 'react';
import '../Review.css';

const reviews = [
  { id: 1, name: 'John Doe', review: 'Amazing recommendations! Found my favorite movie here.' },
  { id: 2, name: 'Jane Smith', review: 'Great interface and excellent filtering options!' },
  { id: 3, name: 'Alice Brown', review: 'I love how personalized the recommendations are.' },
];

function Reviews() {
  return (
    <div className="reviews">
      <h2>User Reviews</h2>
      <div className="review-grid">
        {reviews.map(({ id, name, review }) => (
          <div key={id} className="review-card">
            <p>"{review}"</p>
            <h4>- {name}</h4>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reviews;
