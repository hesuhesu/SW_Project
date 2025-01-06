import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import Swal from "sweetalert2";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import Tip from '../components/ThreeDEditor/Tip';
import LightCameraSetting from '../components/ThreeDEditor/LightCameraSetting';
import AddMesh from '../components/ThreeDEditor/AddMesh';
import styled from 'styled-components';
import { outlineSetup, paddingMargin, buttonStyles, H3 } from '../utils/CSS';

const ThreeDEditor = () => {
  // Ref 영역
  const canvasRef = useRef();
  const sceneRef = useRef();
  const rendererRef = useRef();
  const cameraRef = useRef();
  const controlsRef = useRef();
  const gridHelperRef = useRef();
  const axesHelperRef = useRef();
  const ambientLightRef = useRef();
  const directionalLightRef = useRef();
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const transformControlsRef = useRef(); // TransformControls 참조
  const transformControlsRef2 = useRef(); // TransformControls 참조
  const copiedObjectRef = useRef(null); // 복사된 객체 참조
  const copiedObjectRef2 = useRef(null); // 복사된 객체 참조
  const outlineRef = useRef(null); // 테두리 저장할 ref

  // state 영역
  const [guiTrue, setGuiTrue] = useState(true);
  const [tipTrue, setTipTrue] = useState(false);
  const [objects, setObjects] = useState([]);
  const [uploadObjects, setUploadObjects] = useState([]);
  const [selectedObject, setSelectedObject] = useState([]); // 선택된 객체 참조
  const [selectedObject2, setSelectedObject2] = useState([]); // 선택된 객체 참조
  const [selectedShape, setSelectedShape] = useState('box');
  const [currentMode, setCurrentMode] = useState('translate'); // 현재 TransformControls 모드 상태
  const [selectedMaterial, setSelectedMaterial] = useState('standard'); // 재질 선택
  const [selectedIndexUploadMeshes, setSelectedIndexUploadMeshes] = useState(new Set()); // Upload Meshes 체크박스 조절

  const navigate = useNavigate();

  const [sceneSettings, setSceneSettings] = useState({ // 조명 세팅
    rendererBackgroundColor: "#ffffff",
    directionalLightColor: "#ffffff", directionalLightIntensity: 1, directionalLightPosX: 0, directionalLightPosY: 1, directionalLightPosZ: 0,
    ambientLightColor: "#ffffff", ambientLightIntensity: 1,
  });
  const [cameraPosition, setCameraPosition] = useState({ x: 5, y: 5, z: 5 });

  const sweetAlertError = (str, str2) => {
    Swal.fire({
      title: str,
      icon: 'error',
      html: str2,
      showCancelButton: false,
      confirmButtonText: "확인",
    }).then(() => { });
  }

  useEffect(() => {
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: false,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(sceneSettings.rendererBackgroundColor, 1);
    rendererRef.current = renderer;

    // 리사이즈 핸들러
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // 렌더러와 카메라 비율 조정
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;

    const transformControls = new TransformControls(camera, renderer.domElement);
    transformControlsRef.current = transformControls;
    scene.add(transformControls);

    const transformControls2 = new TransformControls(camera, renderer.domElement);
    transformControlsRef2.current = transformControls2;
    scene.add(transformControls2);

    // TransformControls 이벤트 리스너: 드래그 중에 OrbitControls 비활성화
    transformControls.addEventListener('dragging-changed', function (event) {
      controls.enabled = !event.value;
    });
    // TransformControls 이벤트 리스너: 드래그 중에 OrbitControls 비활성화
    transformControls2.addEventListener('dragging-changed', function (event) {
      controls.enabled = !event.value;
    });

    const axesHelper = new THREE.AxesHelper(50);
    scene.add(axesHelper);
    axesHelperRef.current = axesHelper;

    const gridHelper = new THREE.GridHelper(100, 100);
    scene.add(gridHelper);
    gridHelperRef.current = gridHelper;

    const ambientLight = new THREE.AmbientLight(sceneSettings.ambientLightColor, sceneSettings.ambientLightIntensity);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const directionalLight = new THREE.DirectionalLight(sceneSettings.directionalLightColor, sceneSettings.directionalLightIntensity);
    directionalLight.position.set(sceneSettings.directionalLightPosX, sceneSettings.directionalLightPosY, sceneSettings.directionalLightPosZ);
    scene.add(directionalLight);
    directionalLightRef.current = directionalLight;

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      scene.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (rendererRef.current) { rendererRef.current.setClearColor(sceneSettings.rendererBackgroundColor, 1); }
    if (ambientLightRef.current) {
      ambientLightRef.current.color.set(sceneSettings.ambientLightColor);
      ambientLightRef.current.intensity = sceneSettings.ambientLightIntensity;
    }
    if (directionalLightRef.current) {
      directionalLightRef.current.color.set(sceneSettings.directionalLightColor);
      directionalLightRef.current.intensity = sceneSettings.directionalLightIntensity;
      directionalLightRef.current.position.set(sceneSettings.directionalLightPosX, sceneSettings.directionalLightPosY, sceneSettings.directionalLightPosZ);
    }
  }, [sceneSettings]);

  // 마우스 클릭으로 객체 선택 및 TransformControls 적용
  useEffect(() => {
    const canvas = canvasRef.current;

    const handleMouseClick = (event) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);

      // objects와 uploadObjects 둘 다 탐색

      const intersectsObjects = raycasterRef.current.intersectObjects(objects);
      const intersectsUploadObjects = raycasterRef.current.intersectObjects(uploadObjects);

      // 두 배열에서 가장 가까운 객체 선택
      const closestIntersect = [...intersectsObjects, ...intersectsUploadObjects].sort(
        (a, b) => a.distance - b.distance
      )[0];

      if (closestIntersect) {
        const intersectedObject = closestIntersect.object;

        // TransformControls 활성화 (적용할 TransformControls에 따라 분기)
        if (objects.includes(intersectedObject)) {
          if (transformControlsRef2.current.object) { transformControlsRef2.current.detach(); }
          transformControlsRef.current.attach(intersectedObject);
          setSelectedObject(intersectedObject);
          setSelectedObject2(null);
        }
        else if (uploadObjects.includes(intersectedObject)) {
          if (transformControlsRef.current.object) { transformControlsRef.current.detach(); }
          transformControlsRef2.current.attach(intersectedObject);
          setSelectedObject2(intersectedObject);
          setSelectedObject(null);
        }

      } else {
        // 빈 공간 클릭 시 TransformControls 해제
        if (transformControlsRef.current.object) { transformControlsRef.current.detach(); }
        if (transformControlsRef2.current.object) { transformControlsRef2.current.detach(); }
        if (outlineRef.current) {
          sceneRef.current.remove(outlineRef.current);
          outlineRef.current.geometry.dispose();
          outlineRef.current.material.dispose();
        }
        setSelectedObject(null);
        setSelectedObject2(null);
      }
    };

    canvas.addEventListener('dblclick', handleMouseClick);
    return () => {
      canvas.removeEventListener('dblclick', handleMouseClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objects, uploadObjects]);

  // 객체 복사 기능
  const copyObject = () => {
    setCurrentMode("copy");
    if (selectedObject) { copiedObjectRef.current = selectedObject.clone(); }
    else { setCurrentMode("Non Copy"); }
  };
  const copyObject2 = () => {
    setCurrentMode("copy");
    if (selectedObject2) { copiedObjectRef2.current = selectedObject2.clone(); }
    else { setCurrentMode("Non Copy"); }
  };

  const pasteObject = () => {
    if (copiedObjectRef.current) {
      setCurrentMode("Paste");
      const copiedMesh = copiedObjectRef.current.clone(); // 복사된 객체 복사

      // 객체의 크기를 계산
      copiedMesh.geometry.computeBoundingBox(); // 경계 박스 계산
      const boundingBox = copiedMesh.geometry.boundingBox;
      const size = new THREE.Vector3();
      boundingBox.getSize(size); // 객체의 크기 추출

      // 새로운 위치로 복사: 크기만큼 x, y, z 좌표에 더한 위치로 설정
      copiedMesh.position.set(
        copiedObjectRef.current.position.x + size.x,
        copiedObjectRef.current.position.y + size.y,
        copiedObjectRef.current.position.z + size.z
      );

      sceneRef.current.add(copiedMesh); // 새로운 객체를 씬에 추가
      setObjects((prevObjects) => [...prevObjects, copiedMesh]); // 상태 업데이트

      copiedObjectRef.current = null; // 붙여넣기 후 복사된 객체 초기화 (중복 방지)
    }
  };
  const pasteObject2 = () => {
    if (copiedObjectRef2.current) {
      setCurrentMode("Paste");
      const copiedMesh = copiedObjectRef2.current.clone(); // 복사된 객체 복사

      // 객체의 크기를 계산
      copiedMesh.geometry.computeBoundingBox(); // 경계 박스 계산
      const boundingBox = copiedMesh.geometry.boundingBox;
      const size = new THREE.Vector3();
      boundingBox.getSize(size); // 객체의 크기 추출

      // 새로운 위치로 복사: 크기만큼 x, y, z 좌표에 더한 위치로 설정
      copiedMesh.position.set(
        copiedObjectRef2.current.position.x + size.x,
        copiedObjectRef2.current.position.y + size.y,
        copiedObjectRef2.current.position.z + size.z
      );

      sceneRef.current.add(copiedMesh); // 새로운 객체를 씬에 추가
      setUploadObjects((prevObjects) => [...prevObjects, copiedMesh]); // 상태 업데이트

      copiedObjectRef2.current = null; // 붙여넣기 후 복사된 객체 초기화 (중복 방지)
    }
  };

  // 객체 삭제 함수
  const deleteObject = () => {
    if (selectedObject) {
      sceneRef.current.remove(selectedObject);
      setObjects((prevObjects) => prevObjects.filter((obj) => obj !== selectedObject));
      transformControlsRef.current.detach();
      setSelectedObject(null);
      setCurrentMode("Delete");
    }
    else { setCurrentMode("Non Delete"); }
  };
  const deleteObject2 = () => {
    if (selectedObject2) {
      // selectedObject2의 index 찾기
      const indexToDelete = uploadObjects.findIndex((obj) => obj === selectedObject2);
      sceneRef.current.remove(selectedObject2);
      setUploadObjects((prevObjects) => prevObjects.filter((obj) => obj !== selectedObject2));

      // 선택된 인덱스 관리
      setSelectedIndexUploadMeshes((prevSet) => {
        const updatedSet = new Set();

        prevSet.forEach((index) => {
          if (index < indexToDelete) {
            updatedSet.add(index);  // 삭제된 인덱스보다 작은 인덱스는 그대로 유지
          } else if (index > indexToDelete) {
            updatedSet.add(index - 1);  // 삭제된 인덱스 이후의 인덱스는 1씩 감소
          }
        });
        return updatedSet;
      });

      transformControlsRef2.current.detach();
      setSelectedObject2(null);
      setCurrentMode("Delete");
    }
    else { setCurrentMode("Non Delete"); }
  };

  // 키보드 이벤트 핸들러
  const handleKeyDown = (event) => {
    if (event.ctrlKey && event.key === 'c') { copyObject(); }
    else if (event.ctrlKey && event.key === 'v') { pasteObject(); }
    else if (event.key === 'Delete') { deleteObject(); }
    else {
      switch (event.key) {
        case 'a':
          setCurrentMode('Translate');
          transformControlsRef.current.setMode('translate');
          break;
        case 's':
          setCurrentMode('Rotate');
          transformControlsRef.current.setMode('rotate');
          break;
        case 'd':
          setCurrentMode('Scale');
          transformControlsRef.current.setMode('scale');
          break;
        default:
          break;
      }
    }
  };
  const handleKeyDown2 = (event) => {
    if (event.ctrlKey && event.key === 'c') { copyObject2(); }
    else if (event.ctrlKey && event.key === 'v') { pasteObject2(); }
    else if (event.key === 'Delete') { deleteObject2(); }
    else {
      switch (event.key) {
        case 'a':
          setCurrentMode('Translate');
          transformControlsRef2.current.setMode('translate');
          break;
        case 's':
          setCurrentMode('Rotate');
          transformControlsRef2.current.setMode('rotate');
          break;
        case 'd':
          setCurrentMode('Scale');
          transformControlsRef2.current.setMode('scale');
          break;
        default:
          break;
      }
    }
  };

  // 키보드 이벤트 리스너 추가
  useEffect(() => {
    const handleKeyDownWrapper = (event) => handleKeyDown(event);

    window.addEventListener('keydown', handleKeyDownWrapper);

    return () => {
      window.removeEventListener('keydown', handleKeyDownWrapper);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedObject]);
  useEffect(() => {
    const handleKeyDownWrapper2 = (event) => handleKeyDown2(event);

    window.addEventListener('keydown', handleKeyDownWrapper2);

    return () => {
      window.removeEventListener('keydown', handleKeyDownWrapper2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedObject2]);

  // GUI, Tip 저장 영역 
  const guiTurn = () => { setGuiTrue(!guiTrue); }
  const tipTurn = () => { setTipTrue(!tipTrue); }

  const saveScene = () => {
    const scene = sceneRef.current;
    const gridHelper = gridHelperRef.current;
    const axesHelper = axesHelperRef.current;
    const ambientLight = ambientLightRef.current;
    const directionalLight = directionalLightRef.current;
    const transformControls = transformControlsRef.current;
    const transformControls2 = transformControlsRef2.current;

    if (scene.children.includes(gridHelperRef.current)) {
      scene.remove(gridHelperRef.current);
    }
    if (scene.children.includes(axesHelperRef.current)) {
      scene.remove(axesHelperRef.current);
    }
    if (outlineRef.current) { scene.remove(outlineRef.current); }
    scene.remove(ambientLightRef.current);
    scene.remove(directionalLightRef.current);

    // TransformControls에서 해당 객체 제거 (detach)
    if (transformControlsRef.current.object) {
      scene.remove(transformControlsRef.current);
      transformControlsRef.current.detach();
    }
    if (transformControlsRef2.current.object) {
      scene.remove(transformControlsRef2.current);
      transformControlsRef2.current.detach();
    }

    const exporter = new GLTFExporter();
    exporter.parse(
      scene,
      (result) => {
        const output = JSON.stringify(result, null, 2);
        const blob = new Blob([output], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'model.gltf';
        link.click();
      },
      { binary: false }
    );
    scene.add(gridHelper);
    scene.add(axesHelper);
    scene.add(ambientLight);
    scene.add(directionalLight);
    scene.add(transformControls);
    scene.add(transformControls2);
  };

  /* 매쉬 삭제 영역
  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  */

  const handleDeleteMeshes = (index) => {
    if (transformControlsRef.current.object) {
      transformControlsRef.current.detach();
    }
    const updatedObjects = [...objects];
    const objToRemove = updatedObjects[index];

    sceneRef.current.remove(objToRemove);
    setObjects(updatedObjects.filter((_, i) => i !== index));
  };

  const handleDeleteAllMeshes = () => {
    objects.forEach((mesh) => {
      mesh.geometry.dispose();
      mesh.material.dispose();
      sceneRef.current.remove(mesh);
    });
    setSelectedObject(null);
    if (transformControlsRef.current.object) {
      transformControlsRef.current.detach();
    }
    setObjects([]);
  };

  /* 업로드 영역
  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  */
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase(); // 마지막 점 이후의 문자열 추출
    if (!file) return;
    else if (fileExtension !== 'gltf' && fileExtension !== 'glb') {
      sweetAlertError("GLTF, GLB 가 아님", "올바른 형식의 파일을 업로드 하십시오.");
      return;
    }
    const url = URL.createObjectURL(file);
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    loader.setDRACOLoader(dracoLoader);

    loader.load(url, (gltf) => {
      if (gltf.scene) {

        const scene = gltf.scene;
        let meshes = [];

        scene.traverse((node) => {
          if (node.isMesh) {
            meshes.push(node);
          }
        })
        setUploadObjects((prev) => [...prev, ...meshes]);
        sceneRef.current.add(...meshes);
      }
      dracoLoader.dispose();
    }, undefined, (error) => {
      console.error('모델을 로딩하는 도중 오류 발생:', error);
    });
    URL.revokeObjectURL(url);
    // 파일 선택 후 input 값을 초기화하여 동일한 파일 다시 선택 가능하게 함
    event.target.value = ''; // 이 부분을 추가하여 input 초기화
  };

  const [scaleValues, setScaleValues] = useState({}); // 각 매쉬의 크기를 저장할 상태

  // 매쉬 삭제
  const handleDeleteUploadMesh = (mesh, indexToDelete) => {
    if (transformControlsRef2.current.object) {
      transformControlsRef2.current.detach();
    }
    setUploadObjects((prev) => prev.filter((m) => m !== mesh));

    // Set에서 삭제하고, 그 이후 인덱스를 하나씩 당기는 로직
    setSelectedIndexUploadMeshes((prevSet) => {
      const updatedSet = new Set();

      prevSet.forEach(index => {
        if (index < indexToDelete) {
          updatedSet.add(index); // 삭제된 인덱스보다 작은 인덱스는 그대로 유지
        } else if (index > indexToDelete) {
          updatedSet.add(index - 1); // 삭제된 인덱스 이후의 인덱스는 1씩 감소
        }
      });

      return updatedSet;
    });

    mesh.geometry.dispose();
    mesh.material.dispose();
    sceneRef.current.remove(mesh);
  };

  // 모든 업로드 매쉬 삭제
  const handleDeleteAllUploadMeshes = () => {
    uploadObjects.forEach((mesh) => {
      mesh.geometry.dispose();
      mesh.material.dispose();
      sceneRef.current.remove(mesh);
    });
    if (transformControlsRef2.current.object) {
      transformControlsRef2.current.detach();
    }
    setSelectedIndexUploadMeshes(new Set());
    setSelectedObject2(null);
    setUploadObjects([]);
    setScaleValues({});
  };

  const handleColorChange = (index, color) => {
    uploadObjects[index].material.color.set(color);
  };

  const handleSizeChange = (mesh, size, index) => {
    const updatedScaleValues = { ...scaleValues, [index]: size };
    setScaleValues(updatedScaleValues); // 크기 상태 업데이트
    mesh.scale.set(size, size, size); // 매쉬 크기 반영
  };

  const handleSelectAll = () => {
    if (selectedIndexUploadMeshes.size === uploadObjects.length) {
      setSelectedIndexUploadMeshes(new Set()); // 전체 해제
    } else {
      setSelectedIndexUploadMeshes(new Set(uploadObjects.map((_, index) => index))); // 전체 선택
    }
  };

  const handleCheckboxChange = (index) => {
    const newSelectedIndexes = new Set(selectedIndexUploadMeshes);
    if (newSelectedIndexes.has(index)) {
      newSelectedIndexes.delete(index); // 선택 해제
    } else {
      newSelectedIndexes.add(index); // 선택
    }
    setSelectedIndexUploadMeshes(newSelectedIndexes);
  };

  const handleDeleteSelected = () => {
    if (transformControlsRef2.current.object) {
      transformControlsRef2.current.detach();
    }
    // 삭제될 배열 생성
    const objectsToRemove = uploadObjects.filter((_, index) => selectedIndexUploadMeshes.has(index));

    // sceneRef.current에서 요소 제거
    objectsToRemove.forEach((mesh) => {
      mesh.geometry.dispose();
      mesh.material.dispose();
      sceneRef.current.remove(mesh); // 요소 삭제
    });

    // 새로운 배열 생성 (삭제된 요소 제외)
    const newUploadObjects = uploadObjects.filter((_, index) => !selectedIndexUploadMeshes.has(index));
    setUploadObjects(newUploadObjects);
    setSelectedIndexUploadMeshes(new Set()); // 선택된 인덱스 초기화
  };

  return (
    <WebEditorContainer>
      <CanvasContainer ref={canvasRef}></CanvasContainer>
      <WebEditorInformation>
        {guiTrue ? <>
          <button type="button" style={{ marginBottom: '10px' }} onClick={guiTurn}>GUI Close</button>
          <button type="button" onClick={tipTurn}>User Tip</button>
          <button type="button" onClick={saveScene} >Scene Save</button>
          <button type="button" onClick={() => navigate('/')} >Home</button>
          {tipTrue && <Tip />}

          <LightCameraSetting
            sceneRef={sceneRef}
            cameraRef={cameraRef}
            axesHelperRef={axesHelperRef}
            gridHelperRef={gridHelperRef}
            sceneSettings={sceneSettings}
            cameraPosition={cameraPosition}
            setSceneSettings={setSceneSettings}
            setCameraPosition={setCameraPosition}
          />
          <AddMesh
            sceneRef={sceneRef}
            setObjects={setObjects}
            selectedShape={selectedShape}
            setSelectedShape={setSelectedShape}
            selectedMaterial={selectedMaterial}
            setSelectedMaterial={setSelectedMaterial}
          />

          <WebEditorMeshes>
            <h3>Add Mesh : {currentMode} Mode</h3>
            {objects.length > 0 && <button onClick={handleDeleteAllMeshes}>Delete All Meshes</button>}
            {objects.map((obj, index) => (
              <div className="web-editor-mini-div" key={index}>
                <span>Mesh {index + 1}</span><br />
                <button type="button" onClick={() => handleDeleteMeshes(index)}>❌</button>
              </div>
            ))}
          </WebEditorMeshes>
          <WebEditorUpload>
            <h3>Upload Mesh : {currentMode} Mode</h3>
            <input id="file-input" type="file" accept=".glb,.gltf" className="upload-input" onChange={handleFileUpload} />
            <button className="upload-label" onClick={() => document.getElementById('file-input').click()}>Upload File</button>
            {uploadObjects.length > 0 && <>
              <button onClick={handleDeleteSelected}>선택 삭제</button>
              <button onClick={handleSelectAll}>{selectedIndexUploadMeshes.size === uploadObjects.length ? '전체 해제' : '전체 선택'}</button>
              <button onClick={handleDeleteAllUploadMeshes}>Delete All Meshes</button>
            </>}
            {uploadObjects.map((mesh, index) => (
              <div className="web-editor-mini-div" key={index}>
                <span>{mesh.name || `Object ${index + 1}`} </span>
                <input type="color" value={`#${mesh.material.color.getHexString()}`} onChange={(e) => handleColorChange(index, e.target.value)} />
                <input type="checkbox" className="custom-checkbox" checked={selectedIndexUploadMeshes.has(index)} onChange={() => handleCheckboxChange(index)} /><br />
                <input type="number" min="0" step="any" value={mesh.scale.x} style={{ height: '20px', width: '250px', marginRight: '5px' }} onChange={(e) => handleSizeChange(mesh, parseFloat(e.target.value), index)} />
                <button onClick={() => handleDeleteUploadMesh(mesh, index)}>❌</button>
              </div>
            ))}
          </WebEditorUpload>

        </> : <button type="button" onClick={guiTurn}>GUI Open</button>
        }
      </WebEditorInformation>
    </WebEditorContainer>
  );
};

export default ThreeDEditor;

const WebEditorContainer = styled.div`
  display: 'flex';
  flex-direction: 'column';
  align-items: 'center'; 
  position: 'relative';

  button {
    ${buttonStyles}
  }

  h3 {
    ${H3}
}
`;

const CanvasContainer = styled.canvas`
  height : 100vh;
  width: 100vw;
  display: 'block';
`;

const WebEditorInformation = styled.div`
    ${outlineSetup()}
    position: absolute;
    padding: 10px;
    top: 10px;
    left: 10px;
    background-color: rgba(0, 0, 0, 0.7);
    max-height: 850px;
    max-width: 500px;
    overflow-y: auto;
    overflow-x: hidden;
`;

const WebEditorMeshes = styled.div`
${outlineSetup()}
        ${paddingMargin('10px', '0 0', '20px', '0')}
        font-weight: bold;
        background-color: rgba(255, 255, 255, 0.7);
        max-height: 300px;
        overflow-y: auto;
`;

const WebEditorUpload = styled.div`
    ${outlineSetup()}
        padding: 10px;
        font-weight: bold;
        background-color: rgba(229, 255, 0, 0.7);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
        max-height: 300px;
        overflow-y: auto;

        
        .upload-input {
            display: none; /* 기본 input 숨기기 */
        }
        
        .upload-label {
          ${outlineSetup()}
        ${paddingMargin('10px 20px', '0 5px 5px 0')}
            background: linear-gradient(135deg, #555, #777);
            border: none;
            color: white;
            font-size: 10px;
            cursor: pointer;
            transition: transform 0.4s ease, box-shadow 0.4s ease; /* ease 추가 */
        }
        .upload-label:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.7);
        }
        .upload-label:active {
            transform: translateY(0);
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
        }
        
        .web-editor-mini-div {
          ${outlineSetup()}
            font-weight: bold;
            padding: 10px;
            background-color: rgba(0, 255, 255, 0.5);
        }
`;