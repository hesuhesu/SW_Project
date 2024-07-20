import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import '../css/BoardDetail.css';
import 'react-quill/dist/quill.snow.css'; // Quill snow스타일 시트 불러오기
import Button from '@material-ui/core/Button';
import { errorMessage, successMessage } from '../utils/SweetAlertEvent';

const BoardDetail = () => {
  const [ data, setData ] = useState({});
  
  const params = useParams()._id
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/board/board_detail', {
      params: {
        _id: params
      }
    })
      .then((response) => {
        setData(response.data.list);
      })
      .catch((error) => {
        console.error(error);
    });
  }, []);

  function modifiedBoard() {
    
  }
  function deleteBoard() {
      axios.delete('http://localhost:5000/board/delete', {
        params: {
          _id : params
        }
      }).then((response) => {
          successMessage("게시물이 삭제되었습니다!");
          navigate(-1);
        })
        .catch((error) => {
          errorMessage("삭제 실패");    
      })
  }

  const modules = {
    toolbar: false, // toolbar 숨기기
  };

  return (
    <div className="board-detail">
      <h1>Board Detail</h1>
        {
          data ? (
            <div className = "post-view-wrapper">
              <div className = "post-view-inf">
              <div className="post-view-row">
                <label>제목</label>
                <label>{ data.title }</label>
              </div>
              <div className="post-view-row">
                <label>글쓴이</label>
                <label>{ data.writer }</label>
              </div>
              <div className="post-view-row">
                <label>작성일</label>
                <label>{ data.createdAt }</label>
              </div>
              </div>
              <ReactQuill
                theme="snow"// 테마 설정 (여기서는 snow를 사용)
                value={data.realContent}
                readOnly={true} // 읽기 전용 모드
                modules={modules}
              />
              {localStorage.key(0) === data.writer ? <>
              <Button variant="contained" onClick={modifiedBoard}>수정하기</Button>
              <Button variant="contained" onClick={deleteBoard}>삭제하기</Button>
              </>: ''}
              <Button variant="contained" onClick={() => navigate(-1)}>목록으로 돌아가기</Button>
            </div>
          ) : '해당 게시글을 찾을 수 없습니다.'
        }
    </div>
  )
}

export default BoardDetail;