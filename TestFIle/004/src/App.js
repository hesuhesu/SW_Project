import React, { useCallback, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useDropzone } from 'react-dropzone';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

// 3D 모델을 로드하고 렌더링하는 컴포넌트
function Model({ url }) {
  const gltf = useLoader(GLTFLoader, url);
  return <primitive object={gltf.scene} scale ={[2, 2, 2]} />;
}

// Drag & Drop 인터페이스를 구현하는 컴포넌트
function MyDropzone({ onFileUpload }) {
  const onDrop = useCallback((acceptedFiles) => {
    // 첫 번째 파일을 처리 함수에 전달
    onFileUpload(acceptedFiles[0]);
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} style={{ border: '2px dashed black', padding: '20px',  textAlign: 'center' }}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>파일을 여기에 놓으세요...</p> :
          <p>파일을 드래그하거나 클릭해서 선택하세요.</p>
      }
    </div>
  );
}

// 애플리케이션의 메인 컴포넌트
function App() {
  const [modelUrl, setModelUrl] = useState(null);

  const handleFile = (file) => {
    const url = URL.createObjectURL(file);
    setModelUrl(url);
  };

  return (
    <div>
      <MyDropzone onFileUpload={handleFile} />
      {modelUrl && (
        <Suspense fallback={<div>로딩 중...</div>}>
          <Canvas style={{ width: '100%', height: '80vh' }}>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <pointLight position={[-10, -10, -10]} />
            <Model url={modelUrl} />
            <OrbitControls /> {/*  OrbitControls 컴포넌트를 추가. */}
          </Canvas>
        </Suspense>
      )}
    </div>
  );
}

export default App;
