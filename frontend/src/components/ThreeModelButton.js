import React, { useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ThreeModelButton = () => {
    const canvasRef = useRef();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (event) {
            const result = event.target.result;
            loadModel(result);
        };
        reader.readAsArrayBuffer(file);
    };

    const loadModel = (buffer) => {
        const loader = new GLTFLoader();
        loader.parse(
            buffer,
            '',
            (gltf) => {
                const scene = gltf.scene;
                scene.scale.set(0.5, 0.5, 0.5);

                const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
                camera.position.set(0, 0, 5);

                const renderer = new THREE.WebGLRenderer({
                    canvas: canvasRef.current,
                    antialias: true,
                });
                renderer.setSize(400, 400);

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
            },
            undefined,
            (error) => {
                console.error('Failed to load GLTF file:', error);
            }
        );
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} accept=".gltf" />
            <canvas ref={canvasRef} />
        </div>
    );
};

export default ThreeModelButton;