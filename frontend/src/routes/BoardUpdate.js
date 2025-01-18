import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from 'axios';
import styled from 'styled-components';
import EditorToolBar, { insertHeart, undoChange, redoChange } from "../components/EditorToolBar";
import { errorMessage, errorMessageURI } from '../utils/SweetAlertEvent';
import Swal from "sweetalert2"; // 로직간 반환 기능 실패로 직접 구현
import ThreeDUpload from '../components/ThreeDUpload'
import { ThreeDEditorButtonStyles } from '../utils/CSS';

import '../css/MyEditor.scss';

const HOST = process.env.REACT_APP_HOST;
const PORT = process.env.REACT_APP_PORT;

const BoardUpdate = () => {
  const [title, setTitle] = useState('');
  const [editorHtml, setEditorHtml] = useState('');
  const [imgData, setImgData] = useState([]); // img api 데이터 + 새로 추가하는 img 저장
  const [imgDataSub, setImgDataSub] = useState([]); // 새로 추가하는 img 저장 => 취소 or 페이지 새로고침에 대응하기 위함
  const [threeD, setThreeD] = useState([]); // 3D file api 데이터 + 새로 추가하는 3D file 저장
  const [threeDSub, setThreeDSub] = useState([]); // 새로 추가하는 3D file 저장 => 취소 or 페이지 새로고침에 대응하기 위함
  const [threeDTrue, setThreeDTrue] = useState(0); // 3D 유무
  const quillRef = useRef();
  const threeDRef = useRef(0); // 3D Upload 선택지 -> 랜더링 안되는 선에서 변경 가능한 변수 - 1 
  const params = useParams()._id // id 저장 => 대체하려면 useLocation 과 useNavigate 를 사용하면 됨
  const token = localStorage.getItem('jwtToken');

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (location.state.writer !== localStorage.key(0)) { // 다른 회원이 접근하는 것 방지
      errorMessageURI("잘못된 접근입니다!", "/");
      return;
    }
    if (location.state.threeDTrue === 1) {
      threeDRef.current = 1;
    }
    setTitle(location.state.title);
    setEditorHtml(location.state.realContent);
    setImgData(location.state.imgData);
    setThreeD(location.state.threeD);
    setThreeDTrue(location.state.threeDTrue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 에디터 내용 변경 핸들러
  const handleChange = useCallback((html) => {
    setEditorHtml(html);
  }, []);

  // 이미지 처리를 하는 핸들러
  const imageHandler = () => {
    // 1. 이미지를 저장할 input type=file DOM을 만든다.
    const input = document.createElement('input');
    // 속성 써주기
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*'); // 원래 image/*
    input.click(); // 에디터 이미지버튼을 클릭하면 이 input이 클릭된다.

    input.addEventListener('change', async () => {
      const file = input.files[0];
      if (!file) return; // 파일이 선택되지 않은 경우

      const formData = new FormData();
      formData.append('img', file); // formData는 키-밸류 구조
      try {
        const result = await axios.post(`${HOST}:${PORT}/img`, formData);
        setImgData(prevFiles => [...prevFiles, result.data.realName]);
        setImgDataSub(prevFiles => [...prevFiles, result.data.realName]);
        console.log('성공 시, 백엔드가 보내주는 데이터', result.data.url);
        const IMG_URL = result.data.url;
        // 이미지 태그를 에디터에 써주기 - 여러 방법이 있다.
        const editor = quillRef.current.getEditor(); // 에디터 객체 가져오기
        // 현재 에디터 커서 위치값을 가져온다
        const range = editor.getSelection();
        // 가져온 위치에 이미지를 삽입한다
        editor.insertEmbed(range.index, 'image', IMG_URL);
      } catch (error) { console.log('이미지 불러오기 실패'); }
    }, { once: true });
  };
  //dnd 처리 핸들러
  const imageDropHandler = useCallback(async (dataUrl) => {
    try {
      // dataUrl을 이용하여 blob 객체를 생성
      const blob = await fetch(dataUrl).then(res => res.blob());
      // FormData 객체를 생성하고 'img' 필드에 blob을 추가
      const formData = new FormData();
      formData.append('img', blob);
      // FormData를 서버로 POST 요청을 보내 이미지 업로드를 처리
      const result = await axios.post(`${HOST}:${PORT}/img`, formData);
      setImgData(prevFiles => [...prevFiles, result.data.realName]);
      setImgDataSub(prevFiles => [...prevFiles, result.data.realName]);
      console.log('성공 시, 백엔드가 보내주는 데이터', result.data.url);
      // 서버에서 반환된 이미지 URL을 변수에 저장
      const IMG_URL = result.data.url;
      // Quill 에디터 인스턴스를 호출
      const editor = quillRef.current.getEditor();
      // 현재 커서 위치를 가져옵니다.
      const range = editor.getSelection();
      // 현재 커서 위치에 이미지 URL을 이용해 이미지 삽입
      editor.insertEmbed(range.index, 'image', IMG_URL);
    } catch (error) { console.log('이미지 업로드 실패', error); }
  }, []);

  const insert3DButton = useCallback(async () => {
    if (threeDRef.current === 0) {
      const input = document.createElement('input');
      // 속성 써주기
      input.setAttribute('type', 'file');
      input.setAttribute('accept', '*');
      input.click();
      // 버튼 클릭 시 해당 이벤트
      input.addEventListener('change', async () => {
        const file = input.files[0];
        // 파일 확장자 확인
        const fileExtension = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase(); // 마지막 점 이후의 문자열 추출
        if (!file) return; // 파일이 선택되지 않은 경우
        else if (fileExtension !== 'gltf' && fileExtension !== 'glb') {
          errorMessage(`지원하지 않는 3D 파일 확장자입니다.<br> 지원 확장자 : [gltf, glb]`);
          return;
        }
        const formData = new FormData();
        formData.append('gltf', file);
        await axios.post(`${HOST}:${PORT}/gltf`, formData)
          .then((res) => {
            setThreeD(prevFiles => [...prevFiles, res.data.realName]);
            setThreeDSub(prevFiles => [...prevFiles, res.data.realName]); // sub 충족
            setThreeDTrue(1);
            threeDRef.current = 1;
          }).catch((e) => { errorMessage("GLTF 업로드 실패"); });
      }, { once: true });
    }
    else {
      setThreeDTrue(0);
      threeDRef.current = 0;
    }
  }, []);

  const deleteThreeD = useCallback(async () => {
    setThreeDTrue(0);
    threeDRef.current = 0;
  }, []);

  const modules = useMemo(() => ({
    toolbar: {
      container: "#toolbar",
      handlers: {
        "undo": undoChange,
        "redo": redoChange,
        "image": imageHandler,
        insertHeart: insertHeart,
        insert3DButton: insert3DButton,
      },
    },
    // undo, redo history
    history: {
      delay: 500,
      maxStack: 100,
      userOnly: true
    },
    // image resize 추가
    ImageResize: { parchment: Quill.import('parchment') },
    imageDropAndPaste: { handler: imageDropHandler }
  }), [imageDropHandler]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const description = quillRef.current.getEditor().getText(); //태그를 제외한 순수 text만을 받아온다. 검색기능을 구현하지 않을 거라면 굳이 text만 따로 저장할 필요는 없다.
    // description.trim()
    axios.put(`${HOST}:${PORT}/board/update`, {
      _id: params,
      title: title,
      content: description,
      realContent: editorHtml,
      imgData: imgData,
      threeD: threeD,
      threeDTrue: threeDTrue
    }, {
      headers: {
        'Authorization': token,
      },
    }).then((res) => {
      Swal.fire({
        title: "알림",
        icon: 'success',
        html: "수정되었습니다!!",
        showCancelButton: false,
        confirmButtonText: "확인",
      }).then(() => {
        navigate(-1);
      });
    }).catch((e) => { errorMessage("에러!!"); });
  };

  const handleCancel = () => {
    if (imgDataSub.length > 0 || threeDSub.length > 0) {
      axios.delete(`${HOST}:${PORT}/file_all_delete`, {
        params: {
          imgData: imgDataSub,
          threeD: threeDSub
        }
      }).then((response) => { }).catch((error) => { errorMessage("에러!!"); });
    }
    navigate(-1);
  }

  return (
    <BoardUpdateContainer onSubmit={handleSubmit}>
      <div className="text-editor">
        <input type="text" placeholder="Title" className="quill-title" value={title} onChange={(e) => setTitle((e) => setTitle(e.target.value))} required />
        <EditorToolBar />
        <ReactQuill
          theme="snow"// 테마 설정 (여기서는 snow를 사용)
          value={editorHtml}
          onChange={handleChange}
          ref={quillRef}
          modules={modules}
          style={{ height: '70vh' }}
        />
        {threeDTrue === 1 &&
          <ThreeDUpload
            threeDName={threeD[threeD.length - 1]}
            threeDURL={`${HOST}:${PORT}/uploads/${threeD[threeD.length - 1]}`}
          />
        }
        <ButtonContainer>
          {threeDTrue === 1 && <button type="button" onClick={deleteThreeD}>3D 모델 삭제</button>}
          <button type="submit">게시물 저장하기</button>
          <button type="button" onClick={handleCancel}>취소하기</button>
        </ButtonContainer>
      </div>
    </BoardUpdateContainer>
  );
};

export default BoardUpdate;

const BoardUpdateContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top:2rem;
  margin-bottom:2rem;

  button {
    ${ThreeDEditorButtonStyles}
  }
`;

const ButtonContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;