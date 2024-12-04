import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Login.css';
import '../Home.css';
import { loginUser } from '../utils';
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await loginUser(email, password);
      localStorage.setItem('userToken', response.token);
      localStorage.setItem('userId', response.user_id);
      navigate('/recommendations');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to log in');
    }
  };

  return (
    <div className="home">
      <main className="main">
        <div className="login-container">
          <form onSubmit={handleLogin}>
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Log In</button>
          </form>
        </div>
      </main>
     </div>
  );
}

export default Login;
