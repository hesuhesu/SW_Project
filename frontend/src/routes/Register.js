import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Register.css';
import Swal from "sweetalert2";

function Register() {
  const [register_email, setRegisterEmail] = useState('');
  const [login_email, setLoginEmail] = useState('');
  const [register_password, setRegisterPassword] = useState('');
  const [register_password2, setRegisterPassword2] = useState('');
  const [login_password, setLoginPassword] = useState('');

  const [isActive, setIsActive] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (register_password !== register_password2) {
      Swal.fire({
        title: "알림",
        icon:'error',
        html: `비밀번호를 다시 입력하세요!`,
        showCancelButton: false,
        confirmButtonText: "확인",
      })
      document.getElementById('register_password2').value = '';
      return;
    }

    if (register_email === "hesuhesu@naver.com"){
      Swal.fire({
        title: "알림",
        icon:'error',
        html: `접근 금지`,
        showCancelButton: false,
        confirmButtonText: "확인",
      })
      document.getElementById('register_email').value = '';
      document.getElementById('register_password').value = '';
      document.getElementById('register_password2').value = '';
      return;
    }
    Swal.fire({
      title: "알림",
      icon:'success',
      html: register_email + ` 님 가입을 환영합니다!`,
      showCancelButton: false,
      confirmButtonText: "확인",
    })
    setIsActive(false);
    document.getElementById('register_email').value = '';
    document.getElementById('register_password').value = '';
    document.getElementById('register_password2').value = '';
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (login_email === "hesuhesu@naver.com" && login_password === "hesuhesu"){
      Swal.fire({
        title: "알림",
        icon:'success',
        html: `관리자님 환영합니다!`,
        showCancelButton: false,
        confirmButtonText: "확인",
      }).then(() => {
        localStorage.clear();
        localStorage.setItem("hesuhesu@naver.com", "hesuhesu");
        navigate('/');
      });
      return;
    }
    Swal.fire({
      title: "알림",
      icon:'error',
      html: `없는 회원입니다.`,
      showCancelButton: false,
      confirmButtonText: "확인",
    })
    document.getElementById('login_email').value = '';
    document.getElementById('login_password').value = '';
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
            placeholder="Username"
            id="register_email"
            onChange={(e) => setRegisterEmail(e.target.value)}
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