import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import { errorMessage, errorMessageURI, successMessageURI } from '../utils/SweetAlertEvent';
import { timeCheck } from '../utils/TimeCheck';
import ThreeDUpload from '../components/ThreeDUpload';
import styled from 'styled-components';
import PostInformation from '../components/BoardDetail/PostInformation';

import 'react-quill/dist/quill.snow.css'; // Quill snow스타일 시트 불러오기

const HOST = process.env.REACT_APP_HOST;
const PORT = process.env.REACT_APP_PORT;

const BoardDetail = () => {
  const [data, setData] = useState({}); // board api 데이터 저장
  const params = useParams()._id // id 저장 => 대체하려면 useLocation 과 useNavigate 를 사용하면 됨
  const [threeDURL, setThreeDURL] = useState(''); // Modify 를 위한 경로 저장
  const [threeDName, setThreeDName] = useState(''); // 다운로드를 위한 이름 저장
  
  const navigate = useNavigate();
  
  useEffect(() => {
    timeCheck();
    axios.get(`${HOST}:${PORT}/board/board_detail`, {
      params: { _id: params }
    }).then((response) => {
      const threeDValue = response.data.list.threeD[response.data.list.threeD.length - 1];
      setData(response.data.list);
      setThreeDURL(`${HOST}:${PORT}/uploads/${threeDValue}`);
      setThreeDName(threeDValue);
    }).catch((error) => { console.error(error); });
  }, [params]);

  function modifiedBoard() { window.location.href = `/board_update/${params}`; }

  function deleteBoard() {
    if (timeCheck(params) === 0) {
      errorMessageURI("로그인 만료!", "/");
      return;
    }
    if (data.imgData.length > 0 || data.threeD.length > 0) {
      axios.delete(`${HOST}:${PORT}/file_all_delete`, {
        params: {
          imgData: data.imgData,
          threeD: data.threeD
        }
      }).then((response) => { }).catch((error) => { errorMessage("삭제 실패"); })
    }
    axios.delete(`${HOST}:${PORT}/board/delete`, {
      params: { _id: params }
    }).then((response) => {
      successMessageURI("게시물이 삭제되었습니다!", `/board`);
    }).catch((error) => { errorMessage("삭제 실패"); })
  }

  const modules = {
    toolbar: false, // toolbar 숨기기
  };

  return (
    <BoardDetailContainer>
      {data ? (
          <div className="post-view-wrapper">
            <PostInformation data={data}/>
            <ReactQuill
              theme="snow"// 테마 설정 (여기서는 snow를 사용)
              value={data.realContent}
              readOnly={true} // 읽기 전용 모드
              modules={modules}
            />
            {data.threeDTrue === 1 && <ThreeDUpload
            threeDName={threeDName}
            threeDURL={threeDURL}
            />}
            <ButtonContainer>
              {localStorage.key(0) === data.writer && <>
                <button type="button" onClick={modifiedBoard}>수정하기</button>
                <button type="button" onClick={deleteBoard}>삭제하기</button>
              </>}
              <button type="button" onClick={() => navigate('/board')}>목록으로 돌아가기</button>
            </ButtonContainer>
          </div>
        ) : '해당 게시글을 찾을 수 없습니다.'
      }
    </BoardDetailContainer>
  )
}

export default BoardDetail;

const BoardDetailContainer = styled.div`
  align-items: center;
  margin-bottom: 150px;

  .post-view-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 60px;
    align-items: center;
    background-color:white;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
  }
`;

const ButtonContainer = styled.div`
  margin-top: 0.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;