import React, { useState } from 'react';
import './App.css';

function App() {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className={`container ${isActive ? 'active' : ''}`} id="container">
      <div className="form-container sign-up">
        <form action="#">
          <h2>Create Account</h2>
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button type="button" onClick={() => setIsActive(true)}>Sign Up</button>
        </form>
      </div>
      <div className="form-container sign-in">
        <form action="#">
          <h2>Sign in</h2>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button type="button" onClick={() => setIsActive(false)}>Sign In</button>
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
