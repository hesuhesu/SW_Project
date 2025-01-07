import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import CommonTable from '../components/CommonTable/CommonTable';
import CommonTableColumn from '../components/CommonTable/CommonTableColumn';
import CommonTableRow from '../components/CommonTable/CommonTableRow'
import axios from 'axios';
import styled from 'styled-components';
import { errorMessageURI } from '../utils/SweetAlertEvent';
import { timeCheck } from '../utils/TimeCheck';

import MyPageHeader from '../components/MyPage/MyPageHeader';

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
    <MyPageContainer>
      <MyPageHeader 
      time={time}
      myInf={myInf}
      />
      {data.length > 0 && (<>
        <h2>My Board</h2>
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
    </MyPageContainer>
  );
}

export default MyPage;

const MyPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  a {
    text-decoration: none;
    color: inherit;
  }

  .pagination {
    display: flex;
    list-style: none;
    padding: 0;
    margin-bottom: 150px;

    li {
      margin: 0 5px;
      a {
        text-decoration: none;
        padding: 8px 12px;
        border: 1px solid #ddd;
      }

      a:hover {
        background-color: #f0f0f0;
      }
    }

    .active a {
      background-color: #007bff;
      color: white;
    }
  }
`;