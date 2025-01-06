import React, { useState } from 'react';
import { errorMessage, errorMessageURI, successMessage, successMessageURI } from '../../../utils/SweetAlertEvent';
import Swal from "sweetalert2"; // 로직간 반환 기능 실패로 직접 구현
import axios from 'axios';
import styled from 'styled-components';
import { timeCheck } from '../../../utils/TimeCheck';

const HOST = process.env.REACT_APP_HOST;
const PORT = process.env.REACT_APP_PORT;

const PasswordChange = () => {
  
    const [password, setPassword] = useState({
        email: localStorage.key(0),
        before_password: '',
        after_password: '',
      });

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (timeCheck() === 0) {
          errorMessageURI("로그인 만료!", "/");
          return;
        }
        else if (password.before_password === password.after_password) {
          errorMessage('비밀번호가 같습니다! 다르게 입력하세요!');
          setPassword({ ...password, after_password: '' });
          return;
        }
        else if (password.after_password.trim() === '') {
          errorMessage('공백 금지.');
          setPassword({ ...password, after_password: '' });
          return;
        }
        try {
          await axios.post(`${HOST}:${PORT}/auth/change_password`, password);
          successMessage('비밀번호가 변경되었습니다!');
          setPassword({ ...password,
            before_password: '',
            after_password: ''
          })
        } catch (e) {
          errorMessage('비밀번호를 모르시는군요?');
          setPassword({ ...password,
            before_password: '',
            after_password: ''
          })
        }
      }
    
      const handleDeleteRegister = async (e) => {
        e.preventDefault();
        if (timeCheck() === 0) {
          errorMessageURI("로그인 만료!", "/");
          return;
        }
        Swal.fire({ // 해당 부분 로직을 utils 에 넣으려 했으나 return 반환이 안되서 실패
          title: "질문",
          icon: 'question',
          html: "정말 탈퇴하시겠습니까?",
          showCancelButton: true,
          confirmButtonText: '예',
          cancelButtonText: '아니오',
        }).then((result) => {
          if (result.isConfirmed) {
            axios.delete(`${HOST}:${PORT}/board/delete_user_all_board`, {
              params: { writer: localStorage.key(0) }
            }).then((response) => { })
              .catch((error) => { errorMessage("삭제 실패"); })
            axios.delete(`${HOST}:${PORT}/auth/delete`, {
              params: { email: localStorage.key(0) }
            }).then((response) => {
              localStorage.clear();
              successMessageURI("회원 탈퇴 되었습니다..", "/");
            }).catch((error) => { errorMessage("삭제 실패"); })
          }
        });
      }
  return (
        <PasswordChangeContainer onSubmit={handleChangePassword}>
          <h2>Change Password</h2>
          <input
            type="password"
            placeholder="원래 비밀번호"
            id="before_password"
            value={password.before_password}
            onChange={(e) => setPassword((prevState) => ({ ...prevState, before_password: e.target.value }))}
            required
          />
          <input
            type="password"
            placeholder="바꿀 비밀번호"
            id="after_password"
            value={password.after_password}
            onChange={(e) => setPassword((prevState) => ({ ...prevState, after_password: e.target.value }))}
            required
          />
          <button type="submit">비밀번호 변경</button>
          <button onClick={handleDeleteRegister}>회원 탈퇴</button>
        </PasswordChangeContainer>
  );
}

export default PasswordChange;

const PasswordChangeContainer = styled.form`
      flex-basis: 30%;
      padding: 10rem; /* 요소 내부 여백 추가 */
      background-color: #fff;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
      padding: 100px;
      width: 400px;
      height: 400px;
      display: flex; /* 추가 */
      flex-direction: column; /* 추가 */
      align-items: center;
      border-radius: 10px;
      margin-bottom: 50px;
    
      h2 {
        font-family: "Quill";
        margin-top: 0;
        font-size: 40px;
        font-weight: bold;
        margin-bottom: 20px;
      }
    
      input {
        background-color: #eee;
        border: none;
        padding: 12px 15px;
        margin: 8px 0;
        width: 100%;
      }
    
      button {
        border: none;
        padding: 10px 20px; /* 버튼 스타일 추가 */
        border-radius: 5px; /* 버튼 스타일 추가 */
        margin-bottom: 5px;
        background-color: rgb(211, 211, 211);
        color: #fff;
        font-size: 12px;
        font-weight: bold;
        cursor: pointer;
        transition: transform 80ms ease-in;
      }
    
      button:hover {
        background-color: #ff3e1d;
      }
`;