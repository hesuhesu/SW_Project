import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useDropzone } from 'react-dropzone';

// Three.js scene component
const Scene = ({ model }) => {
  const gltf = useLoader(GLTFLoader, model);
  return <primitive object={gltf.scene} />;
};

// React Dropzone component
const Dropzone = ({ onDrop }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} style={dropzoneStyles}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the .gltf file here...</p>
      ) : (
        <p>Drag 'n' drop a .gltf file here, or click to select one</p>
      )}
    </div>
  );
};

// Main component
const ModelPreview = () => {
  const [model, setModel] = useState(null);

  const handleDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const modelUrl = URL.createObjectURL(file); // Create URL for the dropped file
      setModel(modelUrl); // Set the URL as model source
    }
  };

  return (
    <div style={containerStyles}>
      <h1>3D Model Preview</h1>
      <Dropzone onDrop={handleDrop} />
      {model && (
        <div style={canvasStyles}>
          <Canvas>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <Scene model={model} />
          </Canvas>
        </div>
      )}
    </div>
  );
};

// Styles
const containerStyles = {
  textAlign: 'center',
  padding: '20px',
};

const dropzoneStyles = {
  border: '2px dashed #aaa',
  borderRadius: '5px',
  padding: '20px',
  margin: '20px auto',
  width: '80%',
  cursor: 'pointer',
};

const canvasStyles = {
  width: '80%',
  margin: '20px auto',
};

export default ModelPreview;
