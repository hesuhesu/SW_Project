import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { errorMessage } from '../../utils/SweetAlertEvent';
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
            await axios.post(`${HOST}:${PORT}/auth/login`, loginData);
            Swal.fire({
                title: '알림',
                icon: 'success',
                html: `환영합니다!`,
                showCancelButton: false,
                confirmButtonText: '확인',
            }).then(() => {
                localStorage.clear();
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
                navigate("/");
            });
        } catch (e) {
            errorMessage('로그인 실패!!');
            setLoginData({
                email: '',
                password: '',
            })
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