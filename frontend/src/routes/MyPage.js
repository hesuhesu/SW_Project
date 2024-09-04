import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import CommonTable from '../components/CommonTable';
import CommonTableColumn from '../components/CommonTableColumn';
import CommonTableRow from '../components/CommonTableRow'
import axios from 'axios';
import { TypeAnimation } from 'react-type-animation';
import { errorMessage, successMessage } from '../utils/SweetAlertEvent';
import Swal from "sweetalert2"; // 로직간 반환 기능 실패로 직접 구현
import { timeCheck} from '../utils/TimeCheck';

import '../css/MyPage.css';

const ITEMS_PER_PAGE = 10; // 페이지당 항목 수
const HOST = process.env.REACT_APP_HOST;
const PORT = process.env.REACT_APP_PORT;

function MyPage() {
  const [time, setTime] = useState('');
  const [data, setData] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [myInf, setMyInf] = useState([]);
  const [password, setPassword] = useState({
    email: localStorage.key(0),
    before_password: '',
    after_password: '',
  });
  const navigate = useNavigate();

  useEffect(() => { // 탈퇴 기능이 있는데, 입장 시 인증을 받지 않는가 -> 사용자의 자율성에 맡김
    const checkTime = timeCheck();
    if (checkTime === 0){ 
      errorMessage("로그인 만료!");
      navigate("/");
      return; 
    }
    setTime(checkTime);
    axios.get(`${HOST}:${PORT}/auth/my_inf`, {
      params: {
        email: localStorage.key(0)
      }
    })
      .then((response) => {
        setMyInf(response.data.list);
      })
      .catch((error) => {
        console.error(error);
    });
    axios.get(`${HOST}:${PORT}/board/my_board_list`, {
      params: {
        writer: localStorage.key(0)
      }
    })
      .then((response) => {
        setData(response.data.list);
        setPageCount(Math.ceil(response.data.list.length / ITEMS_PER_PAGE)); // 총 페이지 수 계산
      })
      .catch((error) => {
        console.error(error);
    });
  }, [navigate]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (timeCheck() === 0){ 
      errorMessage("로그인 만료!");
      navigate("/");
      return; 
    }
    else if (password.before_password === password.after_password){
      errorMessage('비밀번호가 같습니다! 다르게 입력하세요!');
      document.getElementById('after_password').value = '';
      return;
    }
    else if (password.after_password.trim() === ''){
      errorMessage('공백 금지.');
      document.getElementById('after_password').value = '';
      return;
    }
    try {
      await axios.post(`${HOST}:${PORT}/auth/change_password`, password);
      successMessage('비밀번호가 변경되었습니다!');
      document.getElementById('before_password').value = '';
      document.getElementById('after_password').value = '';
    } catch (e) {
      errorMessage('비밀번호를 모르시는군요?');
      document.getElementById('before_password').value = '';
      document.getElementById('after_password').value = '';
    }
  }

  const handleDeleteRegister = async (e) => {
    e.preventDefault();
    if (timeCheck() === 0){ 
      errorMessage("로그인 만료!");
      navigate("/");
      return; 
    }
    Swal.fire({ // 해당 부분 로직을 utils 에 넣으려 했으나 return 반환이 안되서 실패
      title: "질문",
      icon:'question',
      html: "정말 탈퇴하시겠습니까?",
      showCancelButton:true,
      confirmButtonText: '예', 
      cancelButtonText: '아니오',
    }).then((result) => {
      if (result.isConfirmed){
        axios.delete(`${HOST}:${PORT}/board/delete_user_all_board`, {
            params: {
              writer : localStorage.key(0)
            }
          }).then((response) => {})
          .catch((error) => {
            errorMessage("삭제 실패");    
          })
          axios.delete(`${HOST}:${PORT}/auth/delete`, {
            params: {
              email : localStorage.key(0)
            }
          }).then((response) => {
            successMessage("회원 탈퇴 되었습니다..");
              localStorage.clear();
              navigate("/");
          })
            .catch((error) => {
              errorMessage("삭제 실패");    
          })
        }
    });
  }

   // 페이지 변경 핸들러
   const handlePageClick = (data) => {
    setCurrentPage(data.selected); // 현재 페이지 업데이트
  };

  // 현재 페이지에 해당하는 데이터
  const displayedData = data.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

  return (
    <div className = "MyPage">
      <div className = "MyPage_No1">
        <div className = "MyPage_Inf">
          <h2>Profile</h2>
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
          <dt>Register Time</dt>
          <dd>{myInf.createdAt}</dd>
          <dt>Logout Time</dt>
          <dd>{time}</dd>
        </div>
        <form className = "MyPage_Change_Password" onSubmit={handleChangePassword}>
          <h2>Change Password</h2>
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
          <button onClick={handleDeleteRegister}>회원 탈퇴</button>
        </form>
      </div>
        {data.length > 0 && (<>
          <h1>My Board</h1>
          <CommonTable headersName={['제목[클릭]', '내용', '등록일']}>
            {displayedData.map((item) => (
              <CommonTableRow key={item._id}>
                <CommonTableColumn>
                  <Link to={`/board_detail/${item._id}`}>{item.title}</Link>
                </CommonTableColumn>
                <CommonTableColumn>{item.content}</CommonTableColumn>
                <CommonTableColumn>{item.createdAt}</CommonTableColumn>
              </CommonTableRow>
            ))}
          </CommonTable>
          <ReactPaginate
            previousLabel={'이전'}
            nextLabel={'다음'}
            breakLabel={'...'}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={'pagination'}
            activeClassName={'active'}
          />
          </>
        )}
    </div>
  );
}

export default MyPage;