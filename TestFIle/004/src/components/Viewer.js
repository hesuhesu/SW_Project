import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';

const Model = ({ url }) => {
  const gltf = useLoader(GLTFLoader, url);
  return <primitive object={gltf.scene} />;
};

const Viewer = ({ url }) => {
  return (
    <Canvas>
      <Suspense fallback={null}>
        <Model url={url} />
      </Suspense>
    </Canvas>
  );
};

export default Viewer;
