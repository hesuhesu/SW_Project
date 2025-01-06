import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import { useParams } from "react-router-dom";
import axios from 'axios';
import EditorToolBar, { insertHeart, formats, undoChange, redoChange } from "../components/EditorToolBar";
import { errorMessage, errorMessageURI } from '../utils/SweetAlertEvent';
import Swal from "sweetalert2"; // 로직간 반환 기능 실패로 직접 구현
import { timeCheck } from '../utils/TimeCheck';
import ThreeDUpload from '../components/ThreeDUpload'

import 'react-quill/dist/quill.snow.css'; // Quill snow스타일 시트 불러오기
import '../css/MyEditor.css'


const HOST = process.env.REACT_APP_HOST;
const PORT = process.env.REACT_APP_PORT;

const BoardUpdate = () => {
  const [data, setData] = useState([]); // board api 데이터 저장
  const [imgData, setImgData] = useState([]); // img api 데이터 + 새로 추가하는 img 저장
  const [imgDataSub, setImgDataSub] = useState([]); // 새로 추가하는 img 저장 => 취소 or 페이지 새로고침에 대응하기 위함
  const [threeD, setThreeD] = useState([]); // 3D file api 데이터 + 새로 추가하는 3D file 저장
  const [threeDSub, setThreeDSub] = useState([]); // 새로 추가하는 3D file 저장 => 취소 or 페이지 새로고침에 대응하기 위함
  const quillRef = useRef();
  const threeDRef = useRef(0); // 3D Upload 선택지 -> 랜더링 안되는 선에서 변경 가능한 변수 - 1 
  const webGLRef = useRef(0); // WebGL 선택지 -> 랜더링 안되는 선에서 변경 가능한 변수 - 2
  const unloadCheck = useRef(); // 뒤로가기, uri 강제 이동을 위한 변수
  const [threeDTrue, setThreeDTrue] = useState(0); // 3D 유무
  const params = useParams()._id // id 저장 => 대체하려면 useLocation 과 useNavigate 를 사용하면 됨

  useEffect(() => {
    if (timeCheck() === 0) {
      if (imgData.length > 0 || threeD.length > 0) {
        axios.delete(`${HOST}:${PORT}/file_all_delete`, {
          params: {
            imgData: imgData,
            threeD: threeD
          }
        }).then((response) => { }).catch((error) => { errorMessage("에러!!"); });
      }
      errorMessageURI("로그인 만료!", "/");
    }
    axios.get(`${HOST}:${PORT}/board/board_detail`, {
      params: { _id: params }
    }).then((response) => {
      setData(response.data.list);
      setImgData(response.data.list.imgData); // api 데이터 + 이후 넣을 데이터
      setThreeD(response.data.list.threeD);
      setThreeDTrue(response.data.list.threeDTrue);
      if (response.data.list.writer !== localStorage.key(0)) { // 다른 회원이 접근하는 것 방지
        errorMessageURI("잘못된 접근입니다!", "/");
        return;
      }
      if (response.data.list.threeDTrue !== 0) {
        threeDRef.current = 1;
      }
      return () => {
      }
    }).catch((error) => { console.error(error); });
  }, []);

  const handleChange = useCallback((html) => {
    setData({ realContent: html });
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
    
  }, []);

  const deleteThreeD = useCallback(async () => {
    setThreeDTrue(0);
    threeDRef.current = 0;
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
    unloadCheck.current = 1;
    if (timeCheck() === 0) {
      errorMessageURI("로그인 만료!", "/");
      return;
    }
    const description = quillRef.current.getEditor().getText(); //태그를 제외한 순수 text만을 받아온다. 검색기능을 구현하지 않을 거라면 굳이 text만 따로 저장할 필요는 없다.
    // description.trim()
    axios.put(`${HOST}:${PORT}/board/update`, {
      _id: params,
      title: data.title,
      content: description,
      realContent: data.realContent,
      imgData: imgData,
      threeD: threeD,
      threeDTrue: threeDTrue
    }).then((res) => {
      Swal.fire({
        title: "알림",
        icon: 'success',
        html: "수정되었습니다!!",
        showCancelButton: false,
        confirmButtonText: "확인",
      }).then(() => {
        const before = document.referrer; // 이전 페이지 정보
        window.location.href = before;
      });
    }).catch((e) => { errorMessage("에러!!"); });
  };

  function handleCancel() {
    if (imgDataSub.length > 0 || threeDSub.length > 0) {
      axios.delete(`${HOST}:${PORT}/file_all_delete`, {
        params: {
          imgData: imgDataSub,
          threeD: threeDSub
        }
      }).then((response) => { }).catch((error) => { errorMessage("에러!!"); });
    }
    const before = document.referrer; // 이전 페이지 정보
    window.location.href = before;
    return;
  }

  return (
    <form className="quill-form" onSubmit={handleSubmit}>
      <div className="text-editor">
        <input type="text" placeholder="Title" className = "quill-title" value={data.title} onChange={(e) => setData((prevState) => ({ ...prevState, title: e.target.value }))} required/>
        <EditorToolBar />
        <ReactQuill
          theme="snow"// 테마 설정 (여기서는 snow를 사용)
          value={data.realContent}
          onChange={handleChange}
          ref={quillRef}
          modules={modules}
          formats={formats}
        />
        {threeDTrue === 1 && <>
          <h2 className="threeD-Model-h2">WebGL Editor</h2>
          <ThreeDUpload/>
        </>}
        {threeDTrue === 1 && <button type="button" onClick={deleteThreeD}>3D 모델 삭제</button>}
        <button type="submit">저장하기</button>
        <button type="button" onClick={handleCancel}>취소하기</button>
      </div>
    </form>
  );
};

export default BoardUpdate;