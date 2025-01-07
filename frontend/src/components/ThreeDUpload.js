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
    renderer.setSize(1050, 1050);
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
      <button type="button" onClick={modifySize}>3D 크기 수정하기</button>
      <button type="button" onClick={downloadThreeD}>3D 파일 다운로드</button>
    </ThreeDUploadContainer>
  );
};

export default ThreeDUpload;

const ThreeDUploadContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px;
  align-items: center;
  background-color: white;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  border-radius: 10px;

  h2 {
    text-align: center;
    margin-top: 30px;
    font-size: 4rem;
    font-weight: 900;
    color: #fff;
    text-shadow: 0 1px 0 #ccc, 0 2px 0 #c9c9c9, 0 3px 0 #bbb, 0 4px 0 #b9b9b9, 0 5px 0 #aaa, 0 6px 1px rgba(0, 0, 0, 0.1), 0 0 5px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.3), 0 3px 5px rgba(0, 0, 0, 0.2), 0 5px 10px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.2), 0 20px 20px rgba(0, 0, 0, 0.15);
  }

  .threeD-div {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;
    width: 100%;

    canvas {
      max-width: 100%;
      height: auto;
      border: 5px solid black;
      border-radius: 10px;
      background-color: beige;
      padding: 10px;
    }
  }

  button {
    margin-top: 20px;
  }
`;
