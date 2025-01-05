import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import CommonTable from '../components/CommonTable/CommonTable';
import CommonTableColumn from '../components/CommonTable/CommonTableColumn';
import CommonTableRow from '../components/CommonTable/CommonTableRow'
import axios from 'axios';
import { errorMessageURI } from '../utils/SweetAlertEvent';
import { timeCheck } from '../utils/TimeCheck';
import MyPageInformation from '../components/MyPage/MyPageInformation';
import PasswordChange from '../components/MyPage/PasswordChange';

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
  
  const navigate = useNavigate();

  useEffect(() => { // 탈퇴 기능이 있는데, 입장 시 인증을 받지 않는가 -> 사용자의 자율성에 맡김
    const checkTime = timeCheck();
    if (checkTime === 0) {
      errorMessageURI("로그인 만료!", "/");
      return;
    }
    setTime(checkTime);
    axios.get(`${HOST}:${PORT}/auth/my_inf`, {
      params: { email: localStorage.key(0) }
    }).then((response) => { setMyInf(response.data.list); })
      .catch((error) => { console.error(error); });
    axios.get(`${HOST}:${PORT}/board/my_board_list`, {
      params: { writer: localStorage.key(0) }
    }).then((response) => {
      setData(response.data.list);
      setPageCount(Math.ceil(response.data.list.length / ITEMS_PER_PAGE)); // 총 페이지 수 계산
    }).catch((error) => { console.error(error); });
  }, [navigate]);

  // 페이지 변경 핸들러
  const handlePageClick = (data) => {
    setCurrentPage(data.selected); // 현재 페이지 업데이트
  };

  // 현재 페이지에 해당하는 데이터
  const displayedData = data.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

  return (
    <div className="MyPage">
      <div className="MyPage_No1">
        <MyPageInformation
          time = {time}
          myInf={myInf}
        />
        <PasswordChange/>
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
        /></>
      )}
    </div>
  );
}

export default MyPage;