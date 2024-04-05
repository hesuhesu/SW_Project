import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
//마우스로 조정

function App() {
  const canvasRef = useRef();

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
    //PerspectiveCamera = 원근법 적용, OrthographicCamera = 원근법 무시
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
   

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    scene.background = new THREE.Color('white');
    const light = new THREE.DirectionalLight(0xffff00, 10);
    scene.add(light);

    const loader = new GLTFLoader();
    loader.load('shiba/scene.gltf', function (gltf) {
      gltf.scene.scale.set(0.5, 0.5, 0.5); // 모델의 크기를 절반
      scene.add(gltf.scene);

      function animate() {
        requestAnimationFrame(animate);
        controls.update();//마우스 사용시 필요
        renderer.render(scene, camera);
      }
      animate();
    });
  }, []);

  return <canvas ref={canvasRef} />;
}

export default App;
