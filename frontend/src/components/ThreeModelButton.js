import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ThreeModelButton = () => {
    const canvasRef = useRef();
    const [modelLoaded, setModelLoaded] = useState(false); // 모델 로드 여부 상태 추가

    useEffect(() => {
        if (modelLoaded) {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.set(0, 0, 5);

            const renderer = new THREE.WebGLRenderer({
                canvas: canvasRef.current,
                antialias: true,
            });
            renderer.setSize(300, 300);

            const controls = new OrbitControls(camera, renderer.domElement);
            controls.update();

            scene.background = new THREE.Color('white');
            const light = new THREE.DirectionalLight(0xffff00, 10);
            scene.add(light);

            const loader = new GLTFLoader();
            loader.load('small-airplane-v3.gltf', function (gltf) {
                gltf.scene.scale.set(0.5, 0.5, 0.5);
                scene.add(gltf.scene);

                function animate() {
                    requestAnimationFrame(animate);
                    controls.update();
                    renderer.render(scene, camera);
                }
                animate();

                // Reset modelLoaded state to false after loading
                setModelLoaded(false);
            });
        }
    }, [modelLoaded]); // 모델 로드 상태에 따라 useEffect 호출

    const handleButtonClick = () => {
        setModelLoaded(true); // 버튼 클릭 시 모델 로드 상태 변경
    };

    return (
        <div>
            <button onClick={handleButtonClick}>Load GITF</button>
            <canvas ref={canvasRef} />
        </div>
    );
};

export default ThreeModelButton;