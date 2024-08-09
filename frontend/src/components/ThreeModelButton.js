import React, { useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import axios from "axios";

export const ThreeModelButton = () => {
    const canvasRef = useRef();

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('gltf', file);

        try {
            const result = await axios.post('http://localhost:5000/gltf', formData);
            console.log('성공 시, 백엔드가 보내주는 데이터', result.data.url);
            const GLTF_URL = result.data.url;
            
            // 3D 모델 로드
            loadModel(GLTF_URL);
        } catch (error) {
            console.log('gltf 파일 업로드 실패', error);
        }
    };

    const loadModel = (url) => {
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
                        canvas: canvasRef.current,
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

    return (
        <div>
            <input type="file" onChange={handleFileChange} accept=".gltf, .glb, .bin" multiple/>
            <canvas ref={canvasRef} />
        </div>
    );
};

export default ThreeModelButton;