import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Register.css';
import Swal from 'sweetalert2';
import { errorMessage, successMessage } from '../utils/SweetAlertEvent';
import axios from 'axios';

function Register() {
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [isActive, setIsActive] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      errorMessage('비밀번호를 다시 입력하세요!');
      setRegisterData((prevState) => ({ ...prevState, confirmPassword: '' }));
      return;
    }
    try {
      await axios.post('http://localhost:5000/auth/register', registerData);
      successMessage(`${registerData.email}님 가입을 환영합니다!`);
      setIsActive(false);
      document.getElementById('register_email').value = '';
      document.getElementById('register_name').value = '';
      document.getElementById('register_password').value = '';
      document.getElementById('register_password2').value = '';
    } catch (e) {
      errorMessage('이미 가입된 회원입니다.');
      document.getElementById('register_email').value = '';
      document.getElementById('register_name').value = '';
      document.getElementById('register_password').value = '';
      document.getElementById('register_password2').value = '';
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/auth/login', loginData);
      Swal.fire({
        title: '알림',
        icon: 'success',
        html: `환영합니다!`,
        showCancelButton: false,
        confirmButtonText: '확인',
      }).then(() => {
        localStorage.clear();
        const now = new Date();
        const next = new Date(now.getTime() + 10 * 60 * 60 * 1000);
        const obj = {    
          time : next,    
          expire : now.getTime() + 60 * 60 * 1000
        }
        localStorage.setItem(loginData.email, JSON.stringify(obj));
        navigate('/');
      });
    } catch (e) {
      errorMessage('없는 회원입니다.');
      document.getElementById('login_email').value = '';
      document.getElementById('login_password').value = '';
    }
  };

  const handleHome = async (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div className={`container ${isActive ? 'active' : ''}`} id="container">
      <div className="form-container sign-up">
        <form onSubmit={handleRegister}>
          <h2>Create Account</h2>
          <input
            type="text"
            placeholder="Email"
            id="register_email"
            onChange={(e) => setRegisterData((prevState) => ({ ...prevState, email: e.target.value }))}
            required
          />
          <input
            type="text"
            placeholder="Name"
            id="register_name"
            onChange={(e) => setRegisterData((prevState) => ({ ...prevState, name: e.target.value }))}
            required
          />
          <input
            type="password"
            placeholder="Password"
            id="register_password"
            onChange={(e) => setRegisterData((prevState) => ({ ...prevState, password: e.target.value }))}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            id="register_password2"
            onChange={(e) => setRegisterData((prevState) => ({ ...prevState, confirmPassword: e.target.value }))}
            required
          />
          <p>{registerData.password !== registerData.confirmPassword ? 'Passwords do not match' : ''}</p>
          <button type="submit">Sign Up</button>
        </form>
      </div>
      <div className="form-container sign-in">
        <form onSubmit={handleLogin}>
          <h2>Sign in</h2>
          <input
            type="email"
            placeholder="Email"
            id="login_email"
            onChange={(e) => setLoginData((prevState) => ({ ...prevState, email: e.target.value }))}
            required
          />
          <input
            type="password"
            placeholder="Password"
            id="login_password"
            onChange={(e) => setLoginData((prevState) => ({ ...prevState, password: e.target.value }))}
            required
          />
          <button type="submit">Sign In</button>
        </form>
      </div>
      <div className="toggle-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h2>WYSIWYG Owner?</h2>
            <p>계정이 있으신가요? 그럼 로그인 해주세요~</p>
            <button type="button" onClick={() => setIsActive(false)}>
              Sign In
            </button>
          </div>
          <div className="overlay-panel overlay-right">
            <h2>Welcome!</h2>
            <p>아직 계정이 없으신가요? 그럼 회원가입 해주세요!</p>
            <button type="button" onClick={() => setIsActive(true)}>
              Sign Up
            </button>
            <p></p>
            <h2>Home?</h2>
            <p>홈 화면으로 가시겠어요? Home 을 눌러주세요..</p>
            <button type="button" onClick={handleHome}>
              Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;