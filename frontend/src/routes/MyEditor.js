import React, { useState, useRef, useCallback, useMemo } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import EditorToolBar, { insertHeart, formats, undoChange, redoChange } from "../components/EditorToolBar";
import { errorMessage, errorMessageURI, successMessageURI } from '../utils/SweetAlertEvent';
import { timeCheck } from '../utils/TimeCheck';
import Button from '@material-ui/core/Button';

import 'react-quill/dist/quill.snow.css'; // Quill snow스타일 시트 불러오기
import '../css/MyEditor.css'
import WebEditor from '../components/WebEditor';

const HOST = process.env.REACT_APP_HOST;
const PORT = process.env.REACT_APP_PORT;

const MyEditor = () => {
  const FirstName = uuidv4();
  const [editorHtml, setEditorHtml] = useState('');
  const [title, setTitle] = useState('');
  const [threeDTrue, setThreeDTrue] = useState(0); // 3D 파일 유무
  const [threeD, setThreeD] = useState(''); // 3D file 배열
  const [imgData, setImgData] = useState([]); // img 배열
  const sceneRef = useRef(null);
  const quillRef = useRef();
  const navigate = useNavigate();

  const handleChange = useCallback((html) => {
    setEditorHtml(html);
  }, []);

  // 이미지 처리를 하는 핸들러
  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*'); 
    input.click();

    input.addEventListener('change', async () => {
      const file = input.files[0];
      if (!file) return; 

      const formData = new FormData();
      formData.append('img', file);
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
      const blob = await fetch(dataUrl).then(res => res.blob());
      const formData = new FormData();
      formData.append('img', blob);
      const result = await axios.post(`${HOST}:${PORT}/img`, formData);
      console.log('성공 시, 백엔드가 보내주는 데이터', result.data.url);
      setImgData(prevFiles => [...prevFiles, result.data.realName]);

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
    if (threeDTrue === 0){
      setThreeDTrue(1);
    }
  }, [threeDTrue]);

  const deleteThreeD = useCallback(async () => {
    setThreeD(...threeD, uuidv4());
    setThreeDTrue(0);
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


  async function exportGLTF() {
    const exporter = new GLTFExporter();
    const scene = sceneRef.current;
    exporter.parse(scene, async function (result) {
        // Blob으로 파일 생성
        const blob = new Blob([result], { type: 'application/octet-stream' });
        const arrayBuffer = await blob.arrayBuffer();
  
        // Axios를 통해 서버로 전송
        try {
            const response = await axios.post('YOUR_SERVER_URL', arrayBuffer, {
                headers: {
                    'Content-Type': 'application/octet-stream',
                },
            });
            console.log('Upload successful: ', response.data);
        } catch (error) {
            console.error('Upload failed: ', error);
        }
    }, { binary: false }); // binary: true로 설정하면 .glb 형식으로 저장
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (timeCheck() === 0) {
      errorMessageURI("로그인 만료!", "/");
      return;
    }

    if (sceneRef.current !== null){
      exportGLTF(FirstName);
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
    <form className="quill-form" onSubmit={handleSubmit}>
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
        {threeDTrue === 1 && <>
          <h2 className="threeD-Model-h2">WebGL Editor</h2>
          <WebEditor sceneRef={sceneRef} />
          <Button variant="contained" onClick={deleteThreeD}>3D Model 삭제하기</Button>
        </>}
        <Button variant="contained" type="submit">저장하기</Button>
        <Button variant="contained" onClick={handleCancel}>취소하기</Button>
      </div>
    </form>
  );
};

export default MyEditor;