import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/Register/RegisterForm';
import SignInForm from '../components/Register/SignInForm';
import Overlay from '../components/Register/Overlay';
import '../css/Register.css';

const Register = () => {
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  return (
      <div className={`container ${isActive ? 'active' : ''}`} id="container">
        <div className="form-container sign-up">
          <RegisterForm setIsActive={setIsActive} />
        </div>
        <div className="form-container sign-in">
          <SignInForm navigate={navigate} />
        </div>
        <div className="toggle-container">
          <Overlay
            setIsActive={setIsActive}
            navigate={navigate}
          />
        </div>
      </div>
  );
}

export default Register;