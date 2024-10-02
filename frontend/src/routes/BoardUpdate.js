import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import { useParams } from "react-router-dom";
import axios from 'axios';
import EditorToolBar, { insertHeart, formats, undoChange, redoChange } from "../components/EditorToolBar";
import { errorMessage, errorMessageURI, successMessage } from '../utils/SweetAlertEvent';
import Swal from "sweetalert2"; // 로직간 반환 기능 실패로 직접 구현
import { timeCheck } from '../utils/TimeCheck';
import Button from '@material-ui/core/Button';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import 'react-quill/dist/quill.snow.css'; // Quill snow스타일 시트 불러오기
import '../css/MyEditor.css'
import WebEditor from '../components/WebEditor';

const HOST = process.env.REACT_APP_HOST;
const PORT = process.env.REACT_APP_PORT;

const BoardUpdate = () => {
  const [data, setData] = useState([]); // board api 데이터 저장
  const [imgData, setImgData] = useState([]); // img api 데이터 + 새로 추가하는 img 저장
  const [imgDataSub, setImgDataSub] = useState([]); // 새로 추가하는 img 저장 => 취소 or 페이지 새로고침에 대응하기 위함
  const [threeD, setThreeD] = useState([]); // 3D file api 데이터 + 새로 추가하는 3D file 저장
  const [threeDSub, setThreeDSub] = useState([]); // 새로 추가하는 3D file 저장 => 취소 or 페이지 새로고침에 대응하기 위함
  const quillRef = useRef();
  const canvasRef = useRef();
  const threeDRef = useRef(0); // 3D Upload 선택지 -> 랜더링 안되는 선에서 변경 가능한 변수 - 1 
  const webGLRef = useRef(0); // WebGL 선택지 -> 랜더링 안되는 선에서 변경 가능한 변수 - 2
  const unloadCheck = useRef(); // 뒤로가기, uri 강제 이동을 위한 변수
  const [threeDTrue, setThreeDTrue] = useState(0); // 3D 유무
  const [webGLTrue, setWebGLTrue] = useState(0); // WebGL 유무
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
        loadModelGLTF(`${HOST}:${PORT}/uploads/${response.data.list.threeD[response.data.list.threeD.length - 1]}`);
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

  const loadModelGLTF = (url) => {
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderConfig({ type: 'js' });
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    loader.setDRACOLoader(dracoLoader);
    loader.load(url, (gltf) => {
      if (gltf.scene) {
        dracoLoader.dispose();
        const scene = gltf.scene;

        // 모델의 bounding box 계산
        const box = new THREE.Box3().setFromObject(scene);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // 모든 위치를 정중앙으로 조정
        scene.position.sub(center);

        // 동적으로 div 요소 생성
        const meshInfoDiv = document.getElementById('information');
        const meshes = [];
        meshInfoDiv.innerHTML = '';

        // 스크롤 조정 버튼 추가
        const scrollToTopButton = document.createElement('button');
        scrollToTopButton.type = 'button'; // 버튼 타입을 "button"으로 설정해 폼 제출 방지
        scrollToTopButton.innerText = '맨 위로 이동';

        const scrollToBottomButton = document.createElement('button');
        scrollToBottomButton.type = 'button'; // 버튼 타입을 "button"으로 설정해 폼 제출 방지
        scrollToBottomButton.innerText = '맨 아래로 이동';
        scrollToBottomButton.style.marginBottom = '20px';

        // 스크롤 조정 이벤트 핸들러 정의
        scrollToTopButton.addEventListener('click', () => {
          meshInfoDiv.scrollTop = 0;
        });
        scrollToBottomButton.addEventListener('click', () => {
          meshInfoDiv.scrollTop = meshInfoDiv.scrollHeight;
        });

        meshInfoDiv.appendChild(scrollToBottomButton);

        scene.traverse((child) => {
          if (child.isMesh) {
            meshes.push(child);

            // 메쉬 이름 추가
            const meshName = document.createElement('div');
            meshName.innerText = child.name;
            meshName.style.fontWeight = 'bold'; // 텍스트 굵게 표시

            // 색상 선택기 추가
            const colorInput = document.createElement('input');
            colorInput.type = 'color';
            colorInput.value = '#ffffff'; // 기본 색상 흰색

            // 색상 변경 이벤트 추가
            colorInput.addEventListener('input', (event) => {
              const color = new THREE.Color(event.target.value);
              child.material.color.set(color);
            });

            // 크기 조절 입력 필드 추가
            const sizeInput = document.createElement('input');
            sizeInput.type = 'number';
            sizeInput.value = child.scale.x; // 기본 크기
            sizeInput.min = 0; // 최소 크기
            sizeInput.step = "any"; // 모든 범위 허용

            // 크기 변경 이벤트 추가
            sizeInput.addEventListener('input', (event) => {
              const newSize = parseFloat(event.target.value);
              child.scale.set(newSize, newSize, newSize);
            });

            meshInfoDiv.appendChild(meshName);
            meshInfoDiv.appendChild(colorInput);
            meshInfoDiv.appendChild(sizeInput);
          }
        });
        const br = document.createElement('br');
        meshInfoDiv.appendChild(br);

        // 저장하기 버튼 추가
        const saveButton = document.createElement('button');
        saveButton.type = 'button'; // 버튼 타입을 "button"으로 설정해 폼 제출 방지
        saveButton.innerText = '파일 즉시 저장하기';
        saveButton.style.marginTop = '10px';
        meshInfoDiv.appendChild(saveButton);

        meshInfoDiv.appendChild(scrollToTopButton);

        // 저장 버튼 클릭 이벤트 핸들러 함수
        function onSaveButtonClick() {
          const helpers = [axesHelper, gridHelper];
          helpers.forEach(helper => helper.visible = false); // 도우미들 숨기기

          // Check for sizeInput values of 0
          const sizeInputs = document.querySelectorAll('input[type="number"]');
          const hasZeroSize = Array.from(sizeInputs).some(input => parseFloat(input.value) === 0);

          if (hasZeroSize) {
            errorMessage("크기가 0인 객체가 있습니다. 크기를 조정한 후 다시 시도해주세요.");
            helpers.forEach(helper => helper.visible = true); // 도우미들 다시 보이기
            return; // 저장하지 않고 종료
          }

          // 애니메이션 클립이 있는 경우 애니메이션 데이터를 포함하여 GLTF로 저장
          const options = {
            binary: false,   // JSON 형태로 저장, binary: true로 하면 GLB 형태로 저장
            animations: gltf.animations  // 애니메이션을 포함하여 저장
          };
          const exporter = new GLTFExporter();
          exporter.parse(
            scene,
            (result) => {
              const blob = new Blob([JSON.stringify(result)], { type: 'application/json' });
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = 'model.gltf';
              link.click();
            },
            (error) => console.error('GLTF 파일 저장 중 오류가 발생했습니다:', error),
            options  // 애니메이션을 포함한 옵션을 전달
          );
          helpers.forEach(helper => helper.visible = true); // 도우미들 다시 보이기
        }

        // 저장 버튼 클릭 이벤트 등록
        saveButton.addEventListener('click', onSaveButtonClick);

        const allRemoveBtn = document.getElementById("ThreeD-Delete");
        allRemoveBtn.addEventListener('click', function () {
          setThreeDTrue(0);
          threeDRef.current = 0;
          scene.traverse((object) => {
            if (!object.isMesh) return;
            object.geometry.dispose();
            if (object.material.isMaterial) {
              object.material.dispose();
            }
          });
          meshInfoDiv.innerHTML = '';
          saveButton.removeEventListener('click', onSaveButtonClick); // 클릭 이벤트 제거

          lightControlsDiv.innerHTML = '';

          // 두 번 클릭 이벤트 리스너 제거
          renderer.domElement.removeEventListener('dblclick', handleDblClick);
          renderer.dispose();
          controls.dispose();
          scene.clear();
        }, { once: true });

        const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(center.x, center.y, size.z * 2); // 모델 크기에 따라 카메라 위치 조정

        const renderer = new THREE.WebGLRenderer({
          canvas: canvasRef.current,
          antialias: true,
          alpha: false,
          preserveDrawingBuffer: true,
        });
        renderer.setSize(window.innerWidth, 900);
        renderer.setClearColor(0xffffff, 1);

        // 축 선 그리기
        const axesHelper = new THREE.AxesHelper(50);
        scene.add(axesHelper);

        // 그리드 그리기
        const gridHelper = new THREE.GridHelper(100, 100);
        scene.add(gridHelper);

        const controls = new OrbitControls(camera, renderer.domElement);
        // controls.enableDamping = true;

        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(0, 1, 0);
        scene.add(directionalLight);

        // 조명 값 조정 UI 추가 (색상 및 강도)
        const lightControlsDiv = document.createElement('div');
        lightControlsDiv.style.marginTop = '20px'; // 조명 조정 영역 아래에 20px 간격 추가
        lightControlsDiv.style.fontWeight = 'bold'; // 텍스트 굵게 표시
        lightControlsDiv.style.border = '2px solid black'; // 테두리 추가
        lightControlsDiv.style.padding = '10px'; // 테두리 안쪽 여백 추가
        lightControlsDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.5)'; // 흰색에 50% 투명도
        lightControlsDiv.innerHTML = `
        <div>
          <label>배경 색 변경 :</label>
          <input type="color" id="rendererBackgroundColor" value="#ffffff" />
        </div>
        <br>
        <div>
          <label>Directional Light Color:</label>
          <input type="color" id="directionalLightColor" value="#ffffff" />
          <label>Intensity :</label>
          <input type="range" id="directionalLightIntensity" min="0" max="5" step="0.01" value="1" />
        </div>
        <div>
          <label>Ambient Light Color :</label>
          <input type="color" id="ambientLightColor" value="#ffffff" />
          <label>Intensity :</label>
          <input type="range" id="ambientLightIntensity" min="0" max="5" step="0.01" value="1" />
        </div>
        <div>
          <label>Directional Light Position X :</label>
          <input type="range" id="directionalLightPosX" min="-100" max="100" step="0.1" value="0" />
        </div>
        <div>
          <label>Directional Light Position Y :</label>
          <input type="range" id="directionalLightPosY" min="-100" max="100" step="0.1" value="1" />
        </div>
        <div>
          <label>Directional Light Position Z :</label>
          <input type="range" id="directionalLightPosZ" min="-100" max="100" step="0.1" value="0" />
        </div>
      `;
        meshInfoDiv.appendChild(lightControlsDiv);

        // Renderer 배경색 변경 이벤트 핸들러 정의
        const handleRendererBackgroundColorChange = (event) => {
          renderer.setClearColor(event.target.value);
        };

        // 조명 값 조정 UI에 초기화 버튼 추가
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset to Default';
        resetButton.style.marginTop = '10px'; // 버튼과 조명 조정 영역 사이의 간격 추가

        // 초기화 버튼 클릭 시 호출할 함수 정의
        const resetControls = () => {
          document.getElementById('directionalLightColor').value = '#ffffff';
          document.getElementById('directionalLightIntensity').value = '1';
          document.getElementById('ambientLightColor').value = '#ffffff';
          document.getElementById('ambientLightIntensity').value = '1';
          document.getElementById('directionalLightPosX').value = '0';
          document.getElementById('directionalLightPosY').value = '1';
          document.getElementById('directionalLightPosZ').value = '0';

          // 조명 값을 초기값으로 설정
          directionalLight.color.set(new THREE.Color('#ffffff'));
          directionalLight.intensity = 1;
          ambientLight.color.set(new THREE.Color('#ffffff'));
          ambientLight.intensity = 1;
          directionalLight.position.set(0, 1, 0);
        };

        // 초기화 버튼 클릭 이벤트 리스너 등록
        resetButton.addEventListener('click', resetControls);
        resetButton.type = 'button';

        // 초기화 버튼을 조명 조정 UI에 추가
        lightControlsDiv.appendChild(resetButton);

        // Renderer 배경색 입력 이벤트 리스너 등록
        document.getElementById('rendererBackgroundColor').addEventListener('input', handleRendererBackgroundColorChange);

        // Directional Light Color Change
        document.getElementById('directionalLightColor').addEventListener('input', (event) => {
          const color = new THREE.Color(event.target.value);
          directionalLight.color.set(color);
        });

        // Directional Light Intensity Change
        document.getElementById('directionalLightIntensity').addEventListener('input', (event) => {
          directionalLight.intensity = parseFloat(event.target.value);
        });

        // Ambient Light Color Change
        document.getElementById('ambientLightColor').addEventListener('input', (event) => {
          const color = new THREE.Color(event.target.value);
          ambientLight.color.set(color);
        });

        // Ambient Light Intensity Change
        document.getElementById('ambientLightIntensity').addEventListener('input', (event) => {
          ambientLight.intensity = parseFloat(event.target.value);
        });

        // Directional Light Position X Change
        document.getElementById('directionalLightPosX').addEventListener('input', (event) => {
          directionalLight.position.x = parseFloat(event.target.value);
        });

        // Directional Light Position Y Change
        document.getElementById('directionalLightPosY').addEventListener('input', (event) => {
          directionalLight.position.y = parseFloat(event.target.value);
        });

        // Directional Light Position Z Change
        document.getElementById('directionalLightPosZ').addEventListener('input', (event) => {
          directionalLight.position.z = parseFloat(event.target.value);
        });

        // 애니메이션 믹서 추가
        const mixer = new THREE.AnimationMixer(scene);
        gltf.animations.forEach((clip) => {
          mixer.clipAction(clip).play(); // 모든 애니메이션 클립 재생
        });

        // 두 번 클릭 이벤트 핸들러 정의
        let autoRotate = false; // 자동 회전 상태 변수

        const handleDblClick = () => {
          autoRotate = !autoRotate; // 자동 회전 상태 전환
        };
        // 두 번 클릭 이벤트 추가
        renderer.domElement.addEventListener('dblclick', handleDblClick);

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
      } else { console.error('Failed to load GLTF file: scene is undefined'); }
    },
      undefined, (error) => { console.error('Failed to load GLTF file:', error); });
  };

  const insert3DButton = useCallback(async () => {
    if (threeDRef.current === 0 && webGLRef.current === 0) {
      Swal.fire({
        title: "Choose One",
        icon: 'question',
        html: "File Upload / WebGL Editor",
        showDenyButton: true,
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
        if (result.isConfirmed) { // 업로드 영역
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
            else if (fileExtension !== 'gltf' && fileExtension !== 'glb') {
              errorMessage(`지원하지 않는 3D 파일 확장자입니다.<br> 지원 확장자 : [gltf, glb]`);
              return;
            }
            const formData = new FormData();
            formData.append('gltf', file);
            await axios.post(`${HOST}:${PORT}/gltf`, formData)
              .then((res) => {
                console.log(res.data.url);
                console.log(res.data.realName);
                setThreeD(prevFiles => [...prevFiles, res.data.realName]);
                setThreeDSub(prevFiles => [...prevFiles, res.data.realName]);
                setThreeDTrue(1);
                threeDRef.current = 1;
                loadModelGLTF(res.data.url);
              }).catch((e) => { errorMessage("GLTF 업로드 실패"); });
          }, { once: true });
        }
        else if (result.isDenied) { // editor 영역
          setWebGLTrue(1);
          webGLRef.current = 1;
        }
      });
    }
    else if (threeDRef.current === 0 && webGLRef.current === 1) {
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
        else if (fileExtension !== 'gltf' && fileExtension !== 'glb') {
          errorMessage(`지원하지 않는 3D 파일 확장자입니다.<br> 지원 확장자 : [gltf, glb]`);
          return;
        }
        const formData = new FormData();
        formData.append('gltf', file);
        await axios.post(`${HOST}:${PORT}/gltf`, formData)
          .then((res) => {
            console.log(res.data.url);
            console.log(res.data.realName);
            setThreeD(prevFiles => [...prevFiles, res.data.realName]);
            setThreeDSub(prevFiles => [...prevFiles, res.data.realName]);
            setThreeDTrue(1);
            threeDRef.current = 1;
            loadModelGLTF(res.data.url);
          }).catch((e) => { errorMessage("GLTF 업로드 실패"); });
      }, { once: true });
    }
    else if (threeDRef.current === 1 && webGLRef.current === 0) {
      successMessage("WebGL Editor Open!");
      setWebGLTrue(1);
      webGLRef.current = 1;
    }
    else if (threeDRef.current === 1 && webGLRef.current === 1) {
      errorMessage("둘 다 실행중!");
    }
  }, []);

  const deleteWebGL = useCallback(async () => {
    setWebGLTrue(0);
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
      title: document.getElementById('update_title').value, // 이 부분은 해결되었지만, 최적화해야할 과제 기존 data.title -> 해당 방식
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
          <div className="canvas-container">
            <canvas className="threeD-model" ref={canvasRef}></canvas>
            <div id="information">Loading...</div>
          </div>
          <Button id="ThreeD-Delete" variant="contained">3D Upload 삭제하기</Button>
        </>}
        {webGLTrue === 1 && <>
          <h2 className="threeD-Model-h2">WebGL Editor</h2>
          <WebEditor></WebEditor>
          <Button variant="contained" onClick={deleteWebGL}>WebGL 작업 종료</Button>
        </>}
        <Button variant="contained" type="submit">저장하기</Button>
        <Button variant="contained" onClick={handleCancel}>취소하기</Button>
      </div>
    </form>
  );
};

export default BoardUpdate;