import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Register.css';
import Swal from "sweetalert2";
import { errorMessage, successMessage } from '../utils/SweetAlertEvent';
import axios from 'axios';

function Register() {
  const [register_email, setRegisterEmail] = useState('');
  const [register_name, setRegisterName] = useState('');
  const [login_email, setLoginEmail] = useState('');
  const [register_password, setRegisterPassword] = useState('');
  const [register_password2, setRegisterPassword2] = useState('');
  const [login_password, setLoginPassword] = useState('');

  const [isActive, setIsActive] = useState(false);

  const navigate = useNavigate();
  
  const handleRegister = async (e) => {
    e.preventDefault();
    if (register_password !== register_password2) {
      errorMessage("비밀번호를 다시 입력하세요!");
      document.getElementById('register_password2').value = '';
      return;
    }
    axios
      .post('http://localhost:5000/api/auth/register', {
        name: register_name,
        email: register_email,
        password: register_password,
      })
      .then((res) => {
        successMessage(register_email + "님 가입을 환영합니다!");
        setIsActive(false);
        document.getElementById('register_email').value = '';
        document.getElementById('register_name').value = '';
        document.getElementById('register_password').value = '';
        document.getElementById('register_password2').value = '';
      })
      .catch((e) => {
        errorMessage("접근 금지");
        document.getElementById('register_email').value = '';
        document.getElementById('register_name').value = '';
        document.getElementById('register_password').value = '';
        document.getElementById('register_password2').value = '';
      });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:5000/api/auth/login', {
        email: login_email,
        password: login_password,
      })
      .then((res) => {
        Swal.fire({ // then 조건문 필요로 함수호출 안함. 확인을 눌러야 home 으로 이동되는 구조로 설계
          title: "알림",
          icon:'success',
          html: `환영합니다!`,
          showCancelButton: false,
          confirmButtonText: "확인",
        }).then(() => {
          localStorage.clear();
          const now = new Date();
          localStorage.setItem(login_email, now.getTime() + 5 * 60 *1000);
          // const item = {value: login_email, expires : now.getTime() + 5 * 60 *1000} // 5분
          // localStorage.setItem(login_email, JSON.stringify(item));
          navigate('/');
        });
      })
      .catch((e) => {
        errorMessage("없는 회원입니다.");
        document.getElementById('login_email').value = '';
        document.getElementById('login_password').value = '';
      });
  };

  const handleHome = async (e) => {
    e.preventDefault();
    navigate('/');
    return;
  }

  return (
    <div className={`container ${isActive ? 'active' : ''}`} id="container">
      <div className="form-container sign-up">
        <form onSubmit={handleRegister}>
          <h2>Create Account</h2>
          <input
            type="text"
            placeholder="Email"
            id="register_email"
            onChange={(e) => setRegisterEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Name"
            id="register_name"
            onChange={(e) => setRegisterName(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            id="register_password"
            onChange={(e) => setRegisterPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            id="register_password2"
            onChange={(e) => setRegisterPassword2(e.target.value)}
            required
          />
          <p>{register_password !== register_password2 ? 'Passwords do not match' : ''}</p>
          <button type="submit">Sign Up</button>
        </form>
      </div>
      <div className="form-container sign-in">
        <form onSubmit={handleLogin}>
          <h2>Sign in</h2>
          <input type="email" 
          placeholder="Email" 
          id = "login_email" 
          onChange={(e) => setLoginEmail(e.target.value)}
          required/>
          <input type="password" 
          placeholder="Password" 
          id = "login_password" 
          onChange={(e) => setLoginPassword(e.target.value)}
          required />
          <button type="submit">Sign In</button>
        </form>
      </div>
      <div className="toggle-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h2>WYSIWYG Owner?</h2>
            <p>계정이 있으신가요? 그럼 로그인 해주세요~</p>
            <button type="button" onClick={() => setIsActive(false)}>Sign In</button>
          </div>
          <div className="overlay-panel overlay-right">
            <h2>Welcome!</h2>
            <p>아직 계정이 없으신가요? 그럼 회원가입 해주세요!</p>
            <button type="button" onClick={() => setIsActive(true)}>Sign Up</button>
            <p></p>
            <h2>Home?</h2>
            <p>홈 화면으로 가시겠어요? Home 을 눌러주세요..</p>
            <button type="button" onClick={handleHome}>Home</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;