import React, { useState, useEffect } from 'react';
import CommonTable from '../components/CommonTable';
import CommonTableColumn from '../components/CommonTableColumn';
import CommonTableRow from '../components/CommonTableRow'
import axios from 'axios';
import { TypeAnimation } from 'react-type-animation';
import { errorMessage, successMessage } from '../utils/SweetAlertEvent';
import '../css/MyPage.css';

function MyPage() {
  const [time, setTime] = useState('');

  const [data, setData] = useState([]);
  const [password, setPassword] = useState({
    email: localStorage.key(0),
    before_password: '',
    after_password: '',
  });

  useEffect(() => {
    const now = new Date();
    const obj = JSON.parse(localStorage.getItem(localStorage.key(0)));

    if (now.getTime() >= obj.expire) {
      localStorage.clear();
      window.location.href = "/";
    }
    axios.get('http://localhost:5000/board/MyBoardList', {
      params: {
        writer: localStorage.key(0)
      }
    })
      .then((response) => {
        setData(response.data.list);
      })
      .catch((error) => {
        console.error(error);
    });

    setTime(obj.time);

  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (password.before_password === password.after_password){
      errorMessage('비밀번호가 같습니다! 다르게 입력하세요!');
      document.getElementById('after_password').value = '';
      return;
    }
    try {
      await axios.post('http://localhost:5000/auth/changePassword', password);
      successMessage('비밀번호가 변경되었습니다!');
      document.getElementById('before_password').value = '';
      document.getElementById('after_password').value = '';
    } catch (e) {
      errorMessage('비밀번호를 모르시는군요?');
      document.getElementById('before_password').value = '';
      document.getElementById('after_password').value = '';
    }
  }
  return (
    <div className = "MyPage">
      <div className = "MyPage_No1">
        <div className = "MyPage_Inf">
          <h1>Profile</h1>
          <dt>Email</dt>
          <dd>
          <TypeAnimation
          sequence={[
            'hello world!',
            1000,
            localStorage.key(0),
            1000,
          ]}
          speed={50}
          cursor={false}/>
          </dd>
          <dt>Logout Time</dt>
          <dd>{time}</dd>
        </div>
        <form className = "MyPage_Change_Password" onSubmit={handleChangePassword}>
          <h1>Change Password</h1>
          <input
            type="password"
            placeholder="원래 비밀번호"
            id="before_password"
            onChange={(e) => setPassword((prevState) => ({ ...prevState, before_password: e.target.value }))}
            required
          />
          <input
            type="password"
            placeholder="바꿀 비밀번호"
            id="after_password"
            onChange={(e) => setPassword((prevState) => ({ ...prevState, after_password: e.target.value }))}
            required
          />
          <button type = "submit">비밀번호 변경</button>
        </form>
      </div>
      
        <h1>My Board</h1>
        {data.length > 0 && (
          <CommonTable headersName={['제목', '내용', '등록일']}>
            {data.map((item) => (
              <CommonTableRow key={item._id}>
                <CommonTableColumn>{item.title}</CommonTableColumn>
                <CommonTableColumn>{item.content}</CommonTableColumn>
                <CommonTableColumn>{item.createdAt}</CommonTableColumn>
              </CommonTableRow>
            ))}
          </CommonTable>
        )}
    </div>
  );
}

export default MyPage;