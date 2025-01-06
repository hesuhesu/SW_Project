import React, { useState, useRef, useCallback, useMemo } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import styled from 'styled-components';
import EditorToolBar, { insertHeart, formats, undoChange, redoChange } from "../components/EditorToolBar";
import { errorMessage, errorMessageURI, successMessageURI } from '../utils/SweetAlertEvent';
import { timeCheck } from '../utils/TimeCheck';
import 'react-quill/dist/quill.snow.css'; // Quill snow스타일 시트 불러오기

const HOST = process.env.REACT_APP_HOST;
const PORT = process.env.REACT_APP_PORT;

const MyEditor = () => {
  const [editorHtml, setEditorHtml] = useState('');
  const [title, setTitle] = useState('');
  const [threeDTrue, setThreeDTrue] = useState(0); // 3D 파일 유무
  const [threeD, setThreeD] = useState([]); // 3D file 배열
  const [imgData, setImgData] = useState([]); // img 배열
  const quillRef = useRef();
  const threeDRef = useRef(0); // 3D Upload 선택지 -> 랜더링 안되는 선에서 변경 가능한 변수 - 1 
  const webGLRef = useRef(0); // WebGL 선택지 -> 랜더링 안되는 선에서 변경 가능한 변수 - 2
  const navigate = useNavigate();

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
        console.log('성공 시, 백엔드가 보내주는 데이터', result.data.url);
        setImgData(prevFiles => [...prevFiles, result.data.realName]);
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
      console.log('성공 시, 백엔드가 보내주는 데이터', result.data.url);
      setImgData(prevFiles => [...prevFiles, result.data.realName]);
      // localStorage.setItem("imgData", JSON.stringify(imgData));

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
      setThreeDTrue(1);
      threeDRef.current = 1;
    }
    else {
      setThreeDTrue(0);
      threeDRef.current = 0;
    }
  }, []);

  const deleteThreeD = useCallback(async () => {
    setThreeDTrue(0);
    webGLRef.current = 0;
    return;
  }, []);

  const modules = useMemo(() => ({
    toolbar: {
      container: "#toolbar",
      handlers: {
        "undo": undoChange,
        "redo": redoChange,
        "image": imageHandler,
        insertHeart: insertHeart,
        insert3DButton: insert3DButton
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
    imageDropAndPaste: { handler: imageDropHandler },
    htmlEditButton: {
      debug: true, // logging, default:false
      msg: "Edit the content in HTML format", //Custom message to display in the editor, default: Edit HTML here, when you click "OK" the quill editor's contents will be replaced
      okText: "Ok", // Text to display in the OK button, default: Ok,
      cancelText: "Cancel", // Text to display in the cancel button, default: Cancel
      buttonHTML: "&lt;&gt;", // Text to display in the toolbar button, default: <>
      buttonTitle: "Show HTML source", // Text to display as the tooltip for the toolbar button, default: Show HTML source
      syntax: false, // Show the HTML with syntax highlighting. Requires highlightjs on window.hljs (similar to Quill itself), default: false
      prependSelector: 'div#myelement', // a string used to select where you want to insert the overlayContainer, default: null (appends to body),
      editorModules: {} // The default mod
    },

  }), [imageDropHandler]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (timeCheck() === 0) {
      errorMessageURI("로그인 만료!", "/");
      return;
    }
    const description = quillRef.current.getEditor().getText(); //태그를 제외한 순수 text만을 받아온다. 검색기능을 구현하지 않을 거라면 굳이 text만 따로 저장할 필요는 없다.
    // description.trim()
    axios.post(`${HOST}:${PORT}/board/write`, {
      writer: localStorage.key(0),
      title: title,
      content: description,
      realContent: editorHtml,
      imgData: imgData,
      threeD: threeD,
      threeDTrue: threeDTrue
    }).then((res) => {
      successMessageURI("저장되었습니다!", "/board");
    }).catch((e) => { errorMessage("에러!!"); });
  };

  const handleCancel = async () => {
    if (imgData.length > 0 || threeD.length > 0) {
      axios.delete(`${HOST}:${PORT}/file_all_delete`, {
        params: {
          imgData: imgData,
          threeD: threeD
        }
      }).then((response) => { }).catch((error) => { errorMessage("에러!!"); });
    }
    navigate(-1);
  }

  return (
    <MyEditorContainer className="quill-form" onSubmit={handleSubmit}>
      <div className="text-editor">
        <input type="text" placeholder="Title" className="quill-title" onChange={(e) => setTitle(e.target.value)} required />
        <EditorToolBar />
        <ReactQuill
          theme="snow"// 테마 설정 (여기서는 snow를 사용)
          value={editorHtml}
          onChange={handleChange}
          ref={quillRef}
          modules={modules}
          formats={formats}
        />
        {threeDTrue === 1 && <ThreeDContainer>
          <h2>WebGL Editor</h2>
        </ThreeDContainer>}
        {threeDTrue === 1 && <button type="button" onClick={deleteThreeD}>3D 모델 삭제</button>}
        <button type="submit">저장하기</button>
        <button type="button" onClick={handleCancel}>취소하기</button>
      </div>
    </MyEditorContainer>
  );
};

export default MyEditor;

const MyEditorContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ThreeDContainer = styled.div`
  h2{
    text-align: center;
    margin-top: 60px;
    margin-bottom: 20px;
    font-size: 2rem;
    font-weight: 900;
    color: #fff;
    text-shadow: 0 1px 0 #ccc, 0 2px 0 #c9c9c9, 0 3px 0 #bbb, 0 4px 0 #b9b9b9, 0 5px 0 #aaa, 0 6px 1px rgba(0,0,0,.1), 0 0 5px rgba(0,0,0,.1), 0 1px 3px rgba(0,0,0,.3), 0 3px 5px rgba(0,0,0,.2), 0 5px 10px rgba(0,0,0,.25), 0 10px 10px rgba(0,0,0,.2), 0 20px 20px rgba(0,0,0,.15);
  }
`;