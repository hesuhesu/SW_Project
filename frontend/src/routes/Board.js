import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import ReactPaginate from 'react-paginate';
import Spinner from '../utils/Spinner';
import CommonTable from '../components/CommonTable/CommonTable';
import CommonTableColumn from '../components/CommonTable/CommonTableColumn';
import CommonTableRow from '../components/CommonTable/CommonTableRow';

const ITEMS_PER_PAGE = 10; // 페이지당 항목 수
const HOST = process.env.REACT_APP_HOST;
const PORT = process.env.REACT_APP_PORT;

const Board = () => {
  const [data, setData] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 관리

  useEffect(() => {
    window.scrollTo(0, 0);
    let timeoutId;
    axios.get(`${HOST}:${PORT}/board/all_board_list`)
      .then((response) => {
        setData(response.data.list);
        setPageCount(Math.ceil(response.data.list.length / ITEMS_PER_PAGE)); // 총 페이지 수 계산
      })
      .catch((error) => {
        console.error(error);
      }).finally(() => {
        timeoutId = setTimeout(() => setIsLoading(false), 500);
      });
      return () => {
        clearTimeout(timeoutId);
      };
  }, []);

  // 페이지 변경 핸들러
  const handlePageClick = (data) => {
    setCurrentPage(data.selected); // 현재 페이지 업데이트
  };

  // 현재 페이지에 해당하는 데이터
  const displayedData = data.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

  if (isLoading) {
    return <Spinner/>;
  } 

  return (
    <BoardContainer>
      {data.length > 0 ? (
        <>
          <CommonTable headersName={['제목', '내용', '작성자', '등록일']}>
            {displayedData.map((item) => (
              <CommonTableRow key={item._id}>
                <CommonTableColumn><Link to={`/board_detail/${item._id}`}>{item.title}</Link></CommonTableColumn>
                <CommonTableColumn><Link to={`/board_detail/${item._id}`}>{item.content}</Link></CommonTableColumn>
                <CommonTableColumn><Link to={`/board_detail/${item._id}`}>{item.writer}</Link></CommonTableColumn>
                <CommonTableColumn><Link to={`/board_detail/${item._id}`}>{item.createdAt}</Link></CommonTableColumn>
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
      ) : <div>게시물 없음</div>}
    </BoardContainer>
  );
}

export default Board;

const BoardContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;

    .pagination {
      display: flex;
      list-style: none;
      padding: 0;
      margin-bottom: 150px;
    }
    
    .pagination li {
      margin: 0 5px;
    }
    
    .pagination li a {
      text-decoration: none;
      padding: 8px 12px;
      border: 1px solid #ddd;
    }
    
    .pagination li a:hover {
      background-color: #f0f0f0;
    }
    
    .active a {
      background-color: #007bff;
      color: white;
    }
`;