import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import ReactQuill, {Quill} from 'react-quill';
import { useNavigate, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import EditorToolBar, {insertHeart, formats, undoChange, redoChange} from "../components/EditorToolBar";
import { ToastContainer } from "react-toastify";
import { successMessage, errorMessage } from '../utils/SweetAlertEvent';
import Swal from "sweetalert2"; // 로직간 반환 기능 실패로 직접 구현
import { timeCheck} from '../utils/TimeCheck';
import Button from '@material-ui/core/Button';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import 'react-quill/dist/quill.snow.css'; // Quill snow스타일 시트 불러오기
import '../css/MyEditor.css'

const MyEditor = () => {
  const [ data, setData ] = useState([]);
  const [imgData, setImgData] = useState([]);
  const [threeD, setThreeD] = useState([]);
  const quillRef = useRef();
  const canvasRef = useRef();
  const [threeDTrue,setThreeDTrue] = useState(0);
  const params = useParams()._id
  const navigate = useNavigate();

  useEffect(() => { 
    if (timeCheck() === 0){ 
      errorMessage("로그인 만료!");
      navigate("/");
      return; 
    }
    axios.get('http://localhost:5000/board/board_detail', {
      params: { _id: params }
    }).then((response) => {
        setData(response.data.list);
        setImgData(response.data.list.imgData); // api 데이터 + 이후 넣을 데이터
        setThreeD(response.data.list.threeD);
        setThreeDTrue(response.data.list.threeDTrue);
        if (response.data.list.writer !== localStorage.key(0)){ // 다른 회원이 접근하는 것 방지
          errorMessage("잘못된 접근입니다!");
          navigate("/");
          return; 
        }
        if (response.data.list.threeDTrue !== 0){ // 마지막 3D file 랜더링
          loadModel(`http://localhost:5000/uploads/${response.data.list.threeD[response.data.list.threeD.length - 1]}`);
        }
      }).catch((error) => { console.error(error); });
  }, [navigate, params]);

  const handleChange = useCallback((html) => {
    setData({realContent: html});
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
        const result = await axios.post('http://localhost:5000/img', formData);
        setImgData(prevFiles => [...prevFiles, result.data.realName]);
        console.log('성공 시, 백엔드가 보내주는 데이터', result.data.url);
        const IMG_URL = result.data.url;
        // 이미지 태그를 에디터에 써주기 - 여러 방법이 있다.
        const editor = quillRef.current.getEditor(); // 에디터 객체 가져오기
        // 현재 에디터 커서 위치값을 가져온다
        const range = editor.getSelection();
        // 가져온 위치에 이미지를 삽입한다
        editor.insertEmbed(range.index, 'image', IMG_URL);
      } catch (error) { console.log('이미지 불러오기 실패'); }
    });
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
    const result = await axios.post('http://localhost:5000/img', formData);
    setImgData(prevFiles => [...prevFiles, result.data.realName]);
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

const loadModel = (url) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderConfig({ type: 'js' });
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
  loader.setDRACOLoader(dracoLoader);
  loader.load(url, (gltf) => {
      if (gltf.scene) {
        const scene = gltf.scene;
        scene.scale.set(0.5, 0.5, 0.5);
        scene.position.set(0, 0, 0);

        // 모델의 bounding box 계산
        const box = new THREE.Box3().setFromObject(scene);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // 모든 위치를 정중앙으로 조정
        scene.position.sub(center);

        const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(center.x, center.y, size.z * 2); // 모델 크기에 따라 카메라 위치 조정
          
        const renderer = new THREE.WebGLRenderer({
          canvas: canvasRef.current,
          antialias: true,
          alpha: false,
          preserveDrawingBuffer: true,
        });
        renderer.setSize(1000, 1000);
        renderer.setClearColor(0xffffff, 1);

        // 축 선 그리기
        const axesHelper = new THREE.AxesHelper(50);
        scene.add(axesHelper);

        // 그리드 그리기
        const gridHelper = new THREE.GridHelper(100,100);
        scene.add(gridHelper);

        const controls = new OrbitControls(camera, renderer.domElement);
        // controls.enableDamping = true;

        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(0, 1, 0);
        scene.add(directionalLight);

        // 애니메이션 믹서 추가
        const mixer = new THREE.AnimationMixer(scene);
        gltf.animations.forEach((clip) => {
            mixer.clipAction(clip).play(); // 모든 애니메이션 클립 재생
        });

        // 두 번 클릭 이벤트 추가
        let autoRotate = false; // 자동 회전 상태 변수
        renderer.domElement.addEventListener('dblclick', () => {
          autoRotate = !autoRotate; // 자동 회전 상태 전환
        });

        const clock = new THREE.Clock();
        const animate = () => {
          requestAnimationFrame(animate);
          controls.update(); // clock.getDelta() 안에 추가할려면 추가
          const delta = clock.getDelta(); // 시간 간격 계산
          mixer.update(delta); // 애니메이션 믹서 업데이트
          // 자동 회전 기능
          if (autoRotate) {
            scene.rotation.y += 0.01; // Y축을 기준으로 회전
          }
          renderer.render(scene, camera);
        };
        animate();
        console.log("Success Load GLTF!!", canvasRef.current);
      } else { console.error('Failed to load GLTF file: scene is undefined'); }},
    undefined, (error) => { console.error('Failed to load GLTF file:', error); });
};

const insert3DButton = async () => {
  Swal.fire({
    title: "Choose One",
    icon:'question',
    html: "File Upload / WebGL Editor",
    showDenyButton:true,
    showCloseButton: true,
    confirmButtonText: 'File Upload', 
    denyButtonText: 'WebGL Editor',
    confirmButtonColor: '#3085d6',
    denyButtonColor: '#d33',
    onClose: () => {
      // X 버튼 클릭 시 아무 이벤트도 발생하지 않도록 빈 함수 설정
      return false;
    }
  }).then((result) => {
    if (result.isConfirmed){ // 업로드 영역
      const input = document.createElement('input');
      // 속성 써주기
      input.setAttribute('type', 'file');
      input.setAttribute('accept', '*'); // input.setAttribute('accept', '.gltf, .glb'); // GLTF 및 GLB 파일만 허용
      input.click();
      // 버튼 클릭 시 해당 이벤트
      input.addEventListener('change', async () => {
        const file = input.files[0];
        
        // 파일 확장자 확인
        const fileExtension = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase(); // 마지막 점 이후의 문자열 추출
        if (!file) return; // 파일이 선택되지 않은 경우
        else if (fileExtension !== 'gltf' && fileExtension !== 'glb' && fileExtension !== 'obj' && fileExtension !== 'fbx') {
          errorMessage(`지원하지 않는 3D 파일 확장자입니다.<br> 지원 확장자 : [gltf, glb, obj, fbx]`);
          return;
        }
        const formData = new FormData();
        formData.append('gltf', file);
        await axios.post('http://localhost:5000/gltf', formData)
        .then((res) => { 
          console.log(res.data.url);
          console.log(res.data.realName);
          setThreeD(prevFiles => [...prevFiles, res.data.realName]);
          setThreeDTrue(threeDTrue => threeDTrue + 1);
          loadModel(res.data.url); // 3D Model rendering
        }).catch((e) => { errorMessage("GLTF 업로드 실패"); });
      });
    }
      else if (result.isDenied) { // editor 영역
        
      }
    });
  }

  const delete3D = async () =>{
    setThreeDTrue(0);
    return; 
  }

  const modules = useMemo(() => ({
    toolbar: {
      container: "#toolbar",
      handlers: {
        "undo": undoChange,
        "redo": redoChange,
        "image": imageHandler,
        insertHeart : insertHeart,
        insert3DButton : insert3DButton,
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
    if (timeCheck() === 0){ 
      errorMessage("로그인 만료!");
      navigate("/");
      return; 
    }
    const description = quillRef.current.getEditor().getText(); //태그를 제외한 순수 text만을 받아온다. 검색기능을 구현하지 않을 거라면 굳이 text만 따로 저장할 필요는 없다.
    // description.trim()
    axios.put('http://localhost:5000/board/update', {
      _id: params,
      title: document.getElementById('update_title').value, // 이 부분은 해결되었지만, 최적화해야할 과제 기존 data.title -> 해당 방식
      content: description,
      realContent: data.realContent,
      imgData: imgData,
      threeD: threeD,
      threeDTrue: threeDTrue
    }).then((res) => {
      successMessage("수정되었습니다!!");
      navigate(-1);
    }).catch((e) => { errorMessage("에러!!"); });  
  };

  function handleCancel() {
    navigate(-1);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="text-editor">
      <input
            type="text"
            placeholder="Title"
            id="update_title"
            value={data.title}
            onChange={(e) => setData((prevState) => ({ ...prevState, title: e.target.value }))}
            required
        />
      <EditorToolBar />
      <ReactQuill
        theme="snow"// 테마 설정 (여기서는 snow를 사용)
        value={data.realContent}
        onChange={handleChange}
        ref={quillRef}
        modules={modules}
        formats={formats}
      />
      {threeDTrue !== 0 ? <>
      <div><canvas className = "threeD-model" ref={canvasRef}/></div>
      <Button variant="contained" onClick = {delete3D}>3D 삭제하기</Button>
      </>: ''}
      <Button variant="contained" type="submit">저장하기</Button>
      <Button variant="contained" onClick = {handleCancel}>취소하기</Button>
      <ToastContainer
            limit={1}
            autoClose={2000}
            /*
            position="top-right"
            limit={1}
            closeButton={false}
            autoClose={2000}
            hideProgressBar
            */
        />
    </div>
    </form>
  );
};

export default MyEditor;