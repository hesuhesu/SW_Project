import React, { useState } from 'react';
import axios from 'axios';
import { errorMessage, successMessage } from '../../utils/SweetAlertEvent';

const HOST = process.env.REACT_APP_HOST;
const PORT = process.env.REACT_APP_PORT;

const RegisterForm = ({ setIsActive }) => {
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChangeRegister = (e) => {
    const { name, value } = e.target;
    setRegisterData({
      ...registerData,
      [name]: value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      errorMessage('비밀번호를 다시 입력하세요!');
      setRegisterData({ ...registerData, confirmPassword: '' });
      return;
    }

    try {
      await axios.post(`${HOST}:${PORT}/auth/register`, registerData);
      successMessage(`${registerData.email}님 가입을 환영합니다!`);
      setIsActive(false);
      setRegisterData({
        email: '',
        name: '',
        password: '',
        confirmPassword: ''
      });
    } catch (e) {
      errorMessage(`형식이 잘못되었습니다.<br><br>1. 중복 금지 + 이메일 형식<br>2. 이름 2글자 이상<br>3. 비밀번호 공백 금지 입니다.`);
      setRegisterData({
        email: '',
        name: '',
        password: '',
        confirmPassword: ''
      });
    }
  };

  return (
    <form className="register-form" onSubmit={handleRegister}>
          <h2>Create Account</h2>
          <input
            type="email"
            name="email"
            value={registerData.email}
            onChange={handleChangeRegister}
            placeholder="이메일"
            required
          />
          <input
            type="text"
            name="name"
            value={registerData.name}
            onChange={handleChangeRegister}
            placeholder="이름"
            required
          />
          <input
            type="password"
            name="password"
            value={registerData.password}
            onChange={handleChangeRegister}
            placeholder="비밀번호"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            value={registerData.confirmPassword}
            onChange={handleChangeRegister}
            placeholder="비밀번호 확인"
            required
          />
          <p>{registerData.password !== registerData.confirmPassword ? 'Passwords do not match' : ''}</p>
          <button type="submit">Sign Up</button>
    </form>
  );
}

export default RegisterForm;