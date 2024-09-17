import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReactPaginate from 'react-paginate';

import CommonTable from '../components/CommonTable';
import CommonTableColumn from '../components/CommonTableColumn';
import CommonTableRow from '../components/CommonTableRow';
import '../css/Board.css';

const ITEMS_PER_PAGE = 10; // 페이지당 항목 수
const HOST = process.env.REACT_APP_HOST;
const PORT = process.env.REACT_APP_PORT;

function Board() {
  const [data, setData] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    axios.get(`${HOST}:${PORT}/board/all_board_list`)
      .then((response) => {
        setData(response.data.list);
        setPageCount(Math.ceil(response.data.list.length / ITEMS_PER_PAGE)); // 총 페이지 수 계산
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // 페이지 변경 핸들러
  const handlePageClick = (data) => {
    setCurrentPage(data.selected); // 현재 페이지 업데이트
  };

  // 현재 페이지에 해당하는 데이터
  const displayedData = data.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

  return (
    <div className="Board">
      {data.length > 0 ? (
        <>
          <h1 className="Board-h1">Board</h1>
          <CommonTable headersName={['제목[클릭]', '내용', '작성자', '등록일']}>
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
    </div>
  );
}

export default Board;