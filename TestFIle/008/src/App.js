import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [isActive, setIsActive] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      console.log(res.data);
    } catch (err) {
      console.error('Error in handleRegister:', err);
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      console.log(res.data);
    } catch (err) {
      console.error('Error in handleLogin:', err);
    }
  };

  return (
    <div className={`container ${isActive ? 'active' : ''}`} id="container">
      <div className="form-container sign-up">
        <form onSubmit={(e) => e.preventDefault()}>
          <h2>Create Account</h2>
          <input type="text" placeholder="Name" name="name" value={formData.name} onChange={handleInputChange} />
          <input type="email" placeholder="Email" name="email" value={formData.email} onChange={handleInputChange} />
          <input type="password" placeholder="Password" name="password" value={formData.password} onChange={handleInputChange} />
          <button type="button" onClick={handleRegister}>Sign Up</button>
        </form>
      </div>
      <div className="form-container sign-in">
        <form onSubmit={(e) => e.preventDefault()}>
          <h2>Sign in</h2>
          <input type="email" placeholder="Email" name="email" value={formData.email} onChange={handleInputChange} />
          <input type="password" placeholder="Password" name="password" value={formData.password} onChange={handleInputChange} />
          <button type="button" onClick={handleLogin}>Sign In</button>
        </form>
      </div>
      <div className="toggle-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h2>Welcome Back!</h2>
            <p>To keep connected with us please login with your personal info</p>
            <button type="button" onClick={() => setIsActive(false)}>Sign In</button>
          </div>
          <div className="overlay-panel overlay-right">
            <h2>Hello, Friend!</h2>
            <p>Enter your personal details and start journey with us</p>
            <button type="button" onClick={() => setIsActive(true)}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
