import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import Button from '@material-ui/core/Button';
import { errorMessage, successMessage, inputNumber } from '../utils/SweetAlertEvent';
import { timeCheck } from '../utils/TimeCheck';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import '../css/BoardDetail.css';
import 'react-quill/dist/quill.snow.css'; // Quill snow스타일 시트 불러오기

const HOST = process.env.REACT_APP_HOST;
const PORT = process.env.REACT_APP_PORT;

const BoardDetail = () => {
  const [ data, setData ] = useState({}); // board api 데이터 저장
  const canvasRef = useRef();
  const params = useParams()._id // id 저장 => 대체하려면 useLocation 과 useNavigate 를 사용하면 됨
  const navigate = useNavigate();
  const [threeDURL, setThreeDURL] = useState(''); // Modify 를 위한 경로 저장
  const [threeDName, setThreeDName] = useState(''); // 다운로드를 위한 이름 저장
  const [fileFormat, setFileFormat] = useState(''); // 확장자 저장

  useEffect(() => {
    timeCheck();
    axios.get(`${HOST}:${PORT}/board/board_detail`, {
      params: { _id: params }
    }).then((response) => {
        const threeDValue = response.data.list.threeD[response.data.list.threeD.length - 1];
        setData(response.data.list);
        setThreeDURL(`${HOST}:${PORT}/uploads/${threeDValue}`);
        setThreeDName(threeDValue);
        if (response.data.list.threeDTrue !== 0){ // 마지막 3D file 랜더링
          const fileExtension = threeDValue.substring(threeDValue.lastIndexOf('.') + 1).toLowerCase() // 마지막 점 이후의 문자열 추출
          if (fileExtension === 'gltf' || fileExtension === 'glb'){
            loadModelGLTF(`${HOST}:${PORT}/uploads/${threeDValue}`);
            setFileFormat('gltf');
          }
          else if (fileExtension === 'obj'){
            loadModelOBJ(`${HOST}:${PORT}/uploads/${threeDValue}`);
            setFileFormat('obj');
          }
        }
      }).catch((error) => { console.error(error); });
  }, [params]);

  function modifiedBoard() {
    navigate(`/board_update/${params}`);
  }

  function deleteBoard() {
    if (timeCheck(params) === 0){ 
      errorMessage("로그인 만료!");
      navigate(-1);
      return; 
    }
    if (data.imgData.length > 0 || data.threeD.length > 0){
      axios.delete(`${HOST}:${PORT}/file_all_delete`, {
        params: {
          imgData : data.imgData,
          threeD: data.threeD
        }
      }).then((response) => {}).catch((error) => { errorMessage("삭제 실패"); })
    }
    axios.delete(`${HOST}:${PORT}/board/delete`, {
      params: { _id : params }
    }).then((response) => {
        successMessage("게시물이 삭제되었습니다!");
        navigate(-1);
      }).catch((error) => { errorMessage("삭제 실패"); })
  }

  const loadModelGLTF = (url, width = 1050, heigth = 1050) => {
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
            alpha: false, // 배경 투명도
            preserveDrawingBuffer: true,
          });
          renderer.setSize(width, heigth);
          renderer.setClearColor(0x003300, 1);
  
          // 축 선 그리기
          const axesHelper = new THREE.AxesHelper(50);
          scene.add(axesHelper);

          // 그리드 그리기
          const gridHelper = new THREE.GridHelper(100,100);
          scene.add(gridHelper);

          const controls = new OrbitControls(camera, renderer.domElement);
          // controls.enableDamping = true; // 관성 움직임
  
          const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
          scene.add(ambientLight);
  
          const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
          directionalLight.position.set(5, 5, 5);
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
          // 메모리 누수를 방지하기 위한 cleanup
          return () => {
            renderer.dispose();
            document.body.removeChild(renderer.domElement);
          };
        } else { console.error('Failed to load GLTF file: scene is undefined'); }
      }, undefined, (error) => { console.error('Failed to load GLTF file:', error); }
    );
  };

  const loadModelOBJ = (url, width = 1050, heigth = 1050) => { // mtl 파일 필요
    const loader = new OBJLoader();
    loader.load(url, (obj) => {
        if (obj) {
            const scene = obj;
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
              alpha: true, // 배경을 투명하게 설정
              preserveDrawingBuffer: true,
            });
            renderer.setSize(width, heigth);
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
  
            // 애니메이션 믹서 추가 (애니메이션이 있는 경우)
            const mixer = new THREE.AnimationMixer(scene);
            if (obj.animations) {
              obj.animations.forEach((clip) => {
                  mixer.clipAction(clip).play(); // 모든 애니메이션 클립 재생
              });
            }
  
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
            console.log("Success Load OBJ!!", canvasRef.current);
            // 메모리 누수를 방지하기 위한 cleanup
            return () => {
              renderer.dispose();
              document.body.removeChild(renderer.domElement);
            };
        } else {
            console.error('Failed to load OBJ file: scene is undefined');
        }
    }, undefined, (error) => {
        console.error('Failed to load OBJ file:', error);
    });
  };

  const modules = {
    toolbar: false, // toolbar 숨기기
  };

  const modifySize = async () => {
    const width = await inputNumber("너비");
    const heigth = await inputNumber("높이");
    if (width === 0 || heigth === 0){
      errorMessage("가로세로 400~1050 까지만 가능! 숫자만 입력하세요");
      return;
    }
    if (fileFormat === 'gltf'){ loadModelGLTF(threeDURL, width, heigth); }
    else if (fileFormat === 'obj'){ loadModelOBJ(threeDURL, width, heigth); }
  }
  
  const downloadThreeD = async () => {
    await axios.get(`${HOST}:${PORT}/download_gltf`, {
      params: {
        filename : threeDName
      },
      responseType: 'blob' // Blob 형식으로 응답 받기responseType: 'blob' // Blob 형식으로 응답 받기
    }).then((response) => {
        // Blob 객체를 생성하여 URL을 생성
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', threeDName); // 다운로드할 파일 이름 설정
        document.body.appendChild(link);
        link.click(); // 링크 클릭하여 다운로드 시작
        link.remove(); // 링크 요소 제거
      })
      .catch((error) => { errorMessage("저장 실패"); })
  }

  return (
    <div className="board-detail">
      <h1 className="board-detail-h1">Board Detail</h1>
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
              {data.threeDTrue !== 0 ? <>
                <h2 className = "threeD-Model-h2">3D Model</h2>
                <div className = "threeD-div">
                  <canvas ref={canvasRef}/>
                </div>
              </> : ''}
              {localStorage.key(0) === data.writer ? <>
              <Button variant="contained" onClick={modifiedBoard}>수정하기</Button>
              <Button variant="contained" onClick={deleteBoard}>삭제하기</Button>
              </>: ''}
              <Button variant="contained" onClick={() => navigate(-1)}>목록으로 돌아가기</Button>
              {data.threeDTrue !== 0 ? <>
              <Button variant="contained" onClick={modifySize}>3D 크기 수정하기</Button>
              <Button variant="contained" onClick={downloadThreeD}>3D 파일 다운로드</Button>
              </> : ''}
            </div>
          ) : '해당 게시글을 찾을 수 없습니다.'
        }
    </div>
  )
}

export default BoardDetail;