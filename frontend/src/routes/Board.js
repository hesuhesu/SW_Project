import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import CommonTable from '../components/CommonTable';
import CommonTableColumn from '../components/CommonTableColumn';
import CommonTableRow from '../components/CommonTableRow';
import '../css/Board.css';

function Board() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/board/all_board_list')
      .then((response) => {
        setData(response.data.list);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="Board">
      
      {data.length > 0 && (
        <>
        <h1 className="Board-h1">Board</h1>
        <CommonTable headersName={['제목[클릭]', '내용', '작성자', '등록일']}>
          {data.map((item) => (
            <CommonTableRow key={item._id}>
              <CommonTableColumn><Link to={`/board_detail/${item._id}`}>{item.title}</Link></CommonTableColumn>
              <CommonTableColumn>{item.content}</CommonTableColumn>
              <CommonTableColumn>{item.writer}</CommonTableColumn>
              <CommonTableColumn>{item.createdAt}</CommonTableColumn>  
            </CommonTableRow>
          ))}
        </CommonTable>
        </>
      )}
    </div>
  );
}

export default Board;