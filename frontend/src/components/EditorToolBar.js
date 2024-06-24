/* eslint-disable no-unused-vars */
import React from 'react';
// import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import axios from "axios";

// handle them correctly
const CustomUndo = () => (
  <svg viewBox="0 0 18 18">
    <polygon className="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10" />
    <path
      className="ql-stroke"
      d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"
    />
  </svg>
);

// Redo button icon component for Quill editor
const CustomRedo = () => (
  <svg viewBox="0 0 18 18">
    <polygon className="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10" />
    <path
      className="ql-stroke"
      d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"
    />
  </svg>
);

const Custom3D = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 841.9 595.3">
    <g fill="#000000"><path d="M666.3 296.5c0-32.5-40.7-63.3-103.1-82.4 14.4-63.6 8-114.2-20.2-130.4-6.5-3.8-14.1-5.6-22.4-5.6v22.3c4.6 0 8.3.9 11.4 2.6 13.6 7.8 19.5 37.5 14.9 75.7-1.1 9.4-2.9 19.3-5.1 29.4-19.6-4.8-41-8.5-63.5-10.9-13.5-18.5-27.5-35.3-41.6-50 32.6-30.3 63.2-46.9 84-46.9V78c-27.5 0-63.5 19.6-99.9 53.6-36.4-33.8-72.4-53.2-99.9-53.2v22.3c20.7 0 51.4 16.5 84 46.6-14 14.7-28 31.4-41.3 49.9-22.6 2.4-44 6.1-63.6 11-2.3-10-4-19.7-5.2-29-4.7-38.2 1.1-67.9 14.6-75.8 3-1.8 6.9-2.6 11.5-2.6V78.5c-8.4 0-16 1.8-22.6 5.6-28.1 16.2-34.4 66.7-19.9 130.1-62.2 19.2-102.7 49.9-102.7 82.3 0 32.5 40.7 63.3 103.1 82.4-14.4 63.6-8 114.2 20.2 130.4 6.5 3.8 14.1 5.6 22.5 5.6 27.5 0 63.5-19.6 99.9-53.6 36.4 33.8 72.4 53.2 99.9 53.2 8.4 0 16-1.8 22.6-5.6 28.1-16.2 34.4-66.7 19.9-130.1 62-19.1 102.5-49.9 102.5-82.3zm-130.2-66.7c-3.7 12.9-8.3 26.2-13.5 39.5-4.1-8-8.4-16-13.1-24-4.6-8-9.5-15.8-14.4-23.4 14.2 2.1 27.9 4.7 41 7.9zm-45.8 106.5c-7.8 13.5-15.8 26.3-24.1 38.2-14.9 1.3-30 2-45.2 2-15.1 0-30.2-.7-45-1.9-8.3-11.9-16.4-24.6-24.2-38-7.6-13.1-14.5-26.4-20.8-39.8 6.2-13.4 13.2-26.8 20.7-39.9 7.8-13.5 15.8-26.3 24.1-38.2 14.9-1.3 30-2 45.2-2 15.1 0 30.2.7 45 1.9 8.3 11.9 16.4 24.6 24.2 38 7.6 13.1 14.5 26.4 20.8 39.8-6.3 13.4-13.2 26.8-20.7 39.9zm32.3-13c5.4 13.4 10 26.8 13.8 39.8-13.1 3.2-26.9 5.9-41.2 8 4.9-7.7 9.8-15.6 14.4-23.7 4.6-8 8.9-16.1 13-24.1zM421.2 430c-9.3-9.6-18.6-20.3-27.8-32 9 .4 18.2.7 27.5.7 9.4 0 18.7-.2 27.8-.7-9 11.7-18.3 22.4-27.5 32zm-74.4-58.9c-14.2-2.1-27.9-4.7-41-7.9 3.7-12.9 8.3-26.2 13.5-39.5 4.1 8 8.4 16 13.1 24 4.7 8 9.5 15.8 14.4 23.4zM420.7 163c9.3 9.6 18.6 20.3 27.8 32-9-.4-18.2-.7-27.5-.7-9.4 0-18.7.2-27.8.7 9-11.7 18.3-22.4 27.5-32zm-74 58.9c-4.9 7.7-9.8 15.6-14.4 23.7-4.6 8-8.9 16-13 24-5.4-13.4-10-26.8-13.8-39.8 13.1-3.1 26.9-5.8 41.2-7.9zm-90.5 125.2c-35.4-15.1-58.3-34.9-58.3-50.6 0-15.7 22.9-35.6 58.3-50.6 8.6-3.7 18-7 27.7-10.1 5.7 19.6 13.2 40 22.5 60.9-9.2 20.8-16.6 41.1-22.2 60.6-9.9-3.1-19.3-6.5-28-10.2zM310 490c-13.6-7.8-19.5-37.5-14.9-75.7 1.1-9.4 2.9-19.3 5.1-29.4 19.6 4.8 41 8.5 63.5 10.9 13.5 18.5 27.5 35.3 41.6 50-32.6 30.3-63.2 46.9-84 46.9-4.5-.1-8.3-1-11.3-2.7zm237.2-76.2c4.7 38.2-1.1 67.9-14.6 75.8-3 1.8-6.9 2.6-11.5 2.6-20.7 0-51.4-16.5-84-46.6 14-14.7 28-31.4 41.3-49.9 22.6-2.4 44-6.1 63.6-11 2.3 10.1 4.1 19.8 5.2 29.1zm38.5-66.7c-8.6 3.7-18 7-27.7 10.1-5.7-19.6-13.2-40-22.5-60.9 9.2-20.8 16.6-41.1 22.2-60.6 9.9 3.1 19.3 6.5 28.1 10.2 35.4 15.1 58.3 34.9 58.3 50.6-.1 15.7-23 35.6-58.4 50.6zM320.8 78.4z"/>
      <circle cx="420.9" cy="296.5" r="45.7"/>
      <path d="M520.5 78.1z"/>
    </g>
  </svg>
);

/*
const loadModel = (url, Canvas) => {
  const loader = new GLTFLoader();
  loader.load(
      url,
      (gltf) => {
          if (gltf.scene) {
              const scene = gltf.scene;
              scene.scale.set(0.5, 0.5, 0.5);

              const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
              camera.position.set(0, 0, 5);

              const renderer = new THREE.WebGLRenderer({
                  canvas: Canvas.current,
                  antialias: true,
              });
              renderer.setSize(600, 600);

              const controls = new OrbitControls(camera, renderer.domElement);
              controls.enableDamping = true;

              const ambientLight = new THREE.AmbientLight(0xffffff, 1);
              scene.add(ambientLight);

              const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
              directionalLight.position.set(0, 1, 0);
              scene.add(directionalLight);

              const animate = () => {
                  requestAnimationFrame(animate);
                  controls.update();
                  renderer.render(scene, camera);
              };
              animate();
          } else {
              console.error('Failed to load GLTF file: scene is undefined');
          }
      },
      undefined,
      (error) => {
          console.error('Failed to load GLTF file:', error);
      }
  );
};
*/

let count = 0;
// custom button
const handleCustomButtonClick = () => {
  
  // Quill Editor 내부에 3D 뷰어 추가
  const quillContainer = document.querySelector('.ThreeD-Views');
  if (quillContainer.childElementCount > 9){
    alert('더 이상 항목을 생성할 수 없습니다.');
    return;
  }
  const canvas$count$ = document.createElement('canvas');
  canvas$count$.id = '3d-viewer';
  canvas$count$.width = 400;
  canvas$count$.height = 400;
  quillContainer.appendChild(canvas$count$);

  /*
  // 1. 이미지를 저장할 input type=file DOM을 만든다.
  const input = document.createElement('input');
  // 속성 써주기
  input.setAttribute('type', 'file');
  input.setAttribute('accept', '*'); // 원래 image/*
  input.click(); // 에디터 이미지버튼을 클릭하면 이 input이 클릭된다.
  // input이 클릭되면 파일 선택창이 나타난다.

  // input에 변화가 생긴다면 = 이미지를 선택
  input.addEventListener('change', async () => {
    console.log('온체인지');
    const file = input.files[0];
    // multer에 맞는 형식으로 데이터 만들어준다.
    const formData = new FormData();
    formData.append('gltf', file); // formData는 키-밸류 구조
    // 백엔드 multer라우터에 이미지를 보낸다.
    try {
      const result = await axios.post('http://localhost:3001/gltf', formData);
      const GLTF_URL = result.data.url;
      console.log('성공 시, 백엔드가 보내주는 데이터', result.data.url);
      
      loadModel(GLTF_URL, canvas$count$);
    } catch (error) {
      console.log('이미지 불러오기 실패');
    }
  });
  */

  // 추가 버튼 생성
  const deleteButton$count$ = document.createElement('button');
  deleteButton$count$.textContent = 'X';
  quillContainer.appendChild(deleteButton$count$);
  deleteButton$count$.addEventListener('click', () => {
    // 3D 뷰어 삭제
    quillContainer.removeChild(editButton$count$);
    quillContainer.removeChild(deleteButton$count$);
    quillContainer.removeChild(canvas$count$);
  });

  const editButton$count$ = document.createElement('button');
  editButton$count$.textContent = '수정';
  quillContainer.appendChild(editButton$count$);
  editButton$count$.addEventListener('click', () => {
    // 3D 뷰어 수정 기능 구현
    // ...
  });
  count++;
  
};

export const QuillToolbar = () => (
    <div id="toolbar">
    <span className="ql-formats">
      <select className="ql-font" defaultValue="arial" title="서체 변경">
        <option value="arial">Arial</option>
        <option value="나눔고딕">나눔고딕</option>
        <option value="궁서체">궁서체</option>
        <option value="굴림체">굴림체</option>
        <option value="바탕체">바탕체</option>
        <option value="바탕체">돋움체</option>
        <option value="serif">serif</option>
        <option value="monospace">monospace</option>
        <option value="Quill">Quill</option>
        <option value="buri">부리</option>
        <option value="gangwon">강원</option>
        <option value="끄트머리체">끄트머리체</option>
        <option value="할아버지의나눔">할아버지의나눔</option>
      </select>
      <select className="ql-size" defaultValue="medium" title="글자 크기 변경">
        <option value="8px">8px</option>
        <option value="10px">10px</option>
        <option value="12px">12px</option>
        <option value="14px">14px</option>
        <option value="20px">20px</option>
        <option value="24px">24px</option>
        <option value="30px">30px</option>
        <option value="36px">36px</option>
        <option value="48px">48px</option>
        <option value="60px">60px</option>
        <option value="72px">72px</option>
        <option value="84px">84px</option>
        <option value="96px">96px</option>
        <option value="120px">120px</option>
      </select>
      <select className="ql-header" defaultValue="3" title="문단 서식 변경">
        <option value="1">h1</option>
        <option value="2">h2</option>
        <option value="3">h3</option>
        <option value="4">h4</option>
        <option value="5">h5</option>
        <option value="6">h6</option>
      </select>
    </span>
    <span className="ql-formats">
      <button variant="primary" className="ql-bold" title="굵기"/>
      <button className="ql-italic" title="기울이기"/>
      <button className="ql-underline" title="밑줄"/>
      <button className="ql-strike" title="취소선"/>
    </span>
    <span className="ql-formats">
      <button className="ql-list" value="ordered" title="숫자 목록"/>
      <button className="ql-list" value="bullet" title="기호 목록"/>
      <button className="ql-indent" value="-1" title="왼쪽 이동"/>
      <button className="ql-indent" value="+1" title="오른쪽 이동"/>
    </span>
    <span className="ql-formats">
      <button className="ql-script" value="super" title="위 첨자"/>
      <button className="ql-script" value="sub" title="아래 첨자"/>
      <button className="ql-blockquote" title="단락 들여쓰기"/>
      <button className="ql-direction" value = "rtl" title="한 번에 정렬"/>
    </span>
    <span className="ql-formats">
      <select className="ql-align" defaultValue="justify" title="정렬"/>
      <select className="ql-color" title="글자색 변경"/>
      <select className="ql-background" title="배경색 변경"/>
    </span>
    <span className="ql-formats">
      <button className="ql-link" title="링크 삽입"/>
      <button className="ql-image" title="사진 추가"/>
      <button className="ql-video" title="비디오 추가"/>
    </span>
    <span className="ql-formats">
      <button className="ql-formula" title="수식 추가"/>
      <button className="ql-code-block" title="문장 블록"/>
      <button className="ql-clean" title="초기화"/>
    </span>
    <span className="ql-formats">
      <button className="ql-undo" title = "뒤로 되돌리기">
        <CustomUndo />
      </button>
      <button className="ql-redo" title = "앞으로 복구하기">
        <CustomRedo />
      </button>
      <button className="ql-my-custom-button" type="file" title = "3D Viewer" onClick={handleCustomButtonClick} accept=".gltf, .glb, .bin">
        <Custom3D />
      </button>
    </span>
  </div>
);
export default QuillToolbar;