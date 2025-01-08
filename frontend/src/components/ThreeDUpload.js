import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { errorMessage, inputNumber } from '../utils/SweetAlertEvent';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const HOST = process.env.REACT_APP_HOST;
const PORT = process.env.REACT_APP_PORT;

const ThreeDUpload = ({ threeDName, threeDURL }) => {
  const canvasRef = useRef();
  const rendererRef = useRef();
  const sceneRef = useRef();
  const mixerRef = useRef();
  const cameraRef = useRef();

  useEffect(() => {
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: false, // 배경 투명도
      preserveDrawingBuffer: true,
    });
    renderer.setSize(window.innerWidth / 2, window.innerHeight / 1.5);
    renderer.setClearColor(0xffffff, 1);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderConfig({ type: 'js' });
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      threeDURL,
      (gltf) => {
        dracoLoader.dispose();
        const gltfScene = gltf.scene;
        const box = new THREE.Box3().setFromObject(gltfScene);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        gltfScene.position.sub(center);
        scene.add(gltfScene);

        const camera = new THREE.PerspectiveCamera(30, 1050 / 1050, 0.1, 1000);
        camera.position.set(center.x, center.y, size.z * 2);
        cameraRef.current = camera;

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        const mixer = new THREE.AnimationMixer(gltfScene);
        mixerRef.current = mixer;
        gltf.animations.forEach((clip) => {
          mixer.clipAction(clip).play();
        });

        const clock = new THREE.Clock();
        const animate = () => {
          if (!sceneRef.current) return;
          requestAnimationFrame(animate);
          const delta = clock.getDelta();
          mixer.update(delta);
          controls.update();
          renderer.render(scene, camera);
        };
        animate();
      },
      undefined,
      (error) => console.error('Failed to load GLTF file:', error)
    );

    return () => {
      if (sceneRef.current) {
        scene.traverse((object) => {
          if (object.isMesh) {
            object.geometry.dispose();
            if (object.material.isMaterial) {
              cleanMaterial(object.material);
            }
          }
        });
        scene.clear();
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
      }
      rendererRef.current = null;
      sceneRef.current = null;
      mixerRef.current = null;
    };
  }, [threeDURL]);

  const cleanMaterial = (material) => {
    if (material.map) material.map.dispose();
    if (material.lightMap) material.lightMap.dispose();
    if (material.aoMap) material.aoMap.dispose();
    if (material.emissiveMap) material.emissiveMap.dispose();
    if (material.bumpMap) material.bumpMap.dispose();
    if (material.normalMap) material.normalMap.dispose();
    if (material.displacementMap) material.displacementMap.dispose();
    if (material.specularMap) material.specularMap.dispose();
    if (material.envMap) material.envMap.dispose();
    material.dispose();
  };

  const modifySize = async () => {
    const width = await inputNumber("너비");
    const height = await inputNumber("높이");
    if (width === 0 || height === 0) {
      errorMessage("가로세로 400~1050 까지만 가능! 숫자만 입력하세요");
      return;
    }
    rendererRef.current.setSize(width, height);
  };

  const downloadThreeD = async () => {
    await axios
      .get(`${HOST}:${PORT}/download_gltf`, {
        params: {
          filename: threeDName,
        },
        responseType: 'blob',
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', threeDName);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch(() => errorMessage("저장 실패"));
  };

  return (
    <ThreeDUploadContainer>
      <h2>3D Model</h2>
      <div className="threeD-div">
        <canvas ref={canvasRef} />
      </div>
      <ButtonContainer>
        <button type="button" onClick={modifySize}>3D 크기 수정하기</button>
        <button type="button" onClick={downloadThreeD}>3D 파일 다운로드</button>
      </ButtonContainer>
    </ThreeDUploadContainer>
  );
};

export default ThreeDUpload;

const ThreeDUploadContainer = styled.div`
  max-width: 1200px;
  margin-top: 2rem;
  padding: 2rem;
  align-items: center;
  background-color: white;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;

  .threeD-div {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;
    width: 100%;

    canvas {
      border: 5px solid black;
      border-radius: 10px;
      padding: 10px;
    }
  }
`;

const ButtonContainer = styled.div`
  margin-top: 0.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;