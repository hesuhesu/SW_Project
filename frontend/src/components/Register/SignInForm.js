import React, { useState } from 'react';
import { errorMessage, successMessage } from '../../utils/SweetAlertEvent';
import axios from 'axios';

const HOST = process.env.REACT_APP_HOST;
const PORT = process.env.REACT_APP_PORT;

const SignInForm = ({ navigate }) => {
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });

    const handleChangeLogin = (e) => {
        const { name, value } = e.target;
        setLoginData({
            ...loginData,
            [name]: value
        });
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${HOST}:${PORT}/auth/login`, {
                email: loginData.email,
                password: loginData.password,
            });

            // 응답이 성공적일 경우
            const token = response.data.token;

            // 토큰을 로컬 스토리지에 저장
            successMessage("환영합니다 회원님!");
            const now = new Date();
            const nextTime = new Date(now.setHours(now.getHours() + 1));
            const obj = {
                time: nextTime.toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                }),
                expire: nextTime.getTime()
            }
            localStorage.setItem(loginData.email, JSON.stringify(obj));
            localStorage.setItem('jwtToken', token);
            navigate("/");
            return;
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    errorMessage("Failed Login");
                } else if (error.response.status === 500) {
                    errorMessage("server Error");
                }
            } else {
                errorMessage("ETC Error");
            }
        }
    };

    return (
        <form className="register-form" onSubmit={handleLogin}>
            <h2>Sign in</h2>
            <input
                type="email"
                name="email"
                id="login_email"
                value={loginData.email}
                onChange={handleChangeLogin}
                placeholder="Email"
                required
            />
            <input
                type="password"
                name="password"
                id="login_password"
                value={loginData.password}
                onChange={handleChangeLogin}
                placeholder="Password"
                required
            />
            <button type="submit">Sign In</button>
        </form>
    );
}

export default SignInForm;