import React, { useState, useRef } from 'react';
import { Dropzone } from 'react-dropzone';
import * as THREE from 'three';

const Preview = () => {
  const [previewObject, setPreviewObject] = useState(null);
  const canvasRef = useRef(null);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file.type !== 'model/gltf') {
      alert('Invalid file type. Please select a .gltf file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const gltfData = event.target.result;
      const loader = new THREE.GLTFLoader();
      loader.load(gltfData, (gltf) => {
        const scene = gltf.scene;
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
        renderer.setSize(window.innerWidth, window.innerHeight);

        const animate = () => {
          requestAnimationFrame(animate);
          renderer.render(scene, camera);
        };

        animate();
        setPreviewObject(scene);
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <Dropzone onDrop={onDrop}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Drag and drop a .gltf file here to preview</p>
          </div>
        )}
      </Dropzone>

      {previewObject && <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} />}
    </div>
  );
};

export default Preview;
