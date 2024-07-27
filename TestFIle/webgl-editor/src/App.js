import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter';

// 설치해야 할 모듈
// npm install react react-dom
// npm install three

const defaultCode = `
// 정점 정의하기
const vertices = [
   1.0,  1.0,  1.0,  // Vertex 1
  -1.0,  1.0,  1.0,  // Vertex 2
   1.0, -1.0,  1.0,  // Vertex 3
  -1.0, -1.0,  1.0,  // Vertex 4
   1.0,  1.0, -1.0,  // Vertex 5
  -1.0,  1.0, -1.0,  // Vertex 6
   1.0, -1.0, -1.0,  // Vertex 7
  -1.0, -1.0, -1.0   // Vertex 8
];

// 각 면을 구성하는 삼각형 index 정의
const indices = [
  0, 1, 2,  1, 3, 2,  // Front face
  4, 5, 6,  5, 7, 6,  // Back face
  0, 1, 4,  1, 5, 4,  // Top face
  2, 3, 6,  3, 7, 6,  // Bottom face
  0, 2, 4,  2, 6, 4,  // Right face
  1, 3, 5,  3, 7, 5   // Left face
];

// 도형 색깔 정의
const color = 0xff0000; // Red

// 2D or 3D 결정
const is3D = true;

drawShape(vertices, indices, color, is3D);
`;

/*

2D 사각형 그리는 코드(윕에서)
// 정점 정의하기
const vertices = [
    200.0,  200.0,  0.0,  // Vertex 1
   -200.0,  200.0,  0.0,  // Vertex 2
    200.0, -200.0,  0.0,  // Vertex 3
   -200.0, -200.0,  0.0,  // Vertex 4
 
 ];
 
 // 각 면을 구성하는 삼각형 index 정의
 const indices = [
   0, 1, 2, // First triangle
   1, 3, 2  // Second triangle
 
 ];
 
 // 도형 색깔 정의
 const color = 0xff0000; // Red
 
 // 2D or 3D 결정
 const is3D = false;
 
 drawShape(vertices, indices, color, is3D);
 
*/

const ThreeJSExample = () => {
  const mountRef = useRef(null);  // DOM 참조를 위한 useRef hook 사용
  const [code, setCode] = useState(defaultCode);  // 코드 상태를 관리하기 위한 useState hook 사용
  const sceneRef = useRef(null);  // 씬 객체를 참조하기 위한 useRef hook 사용
  //hook : 함수형 컴포넌트에서 상태 관리와 생명주기 기능을 사용할 수 있게 해주는 특별한 함수

  // 코드 실행 함수
  const handleRunCode = () => {
    const outputElement = document.getElementById('threejs-output');
    // 이전 렌더러 제거
    while (outputElement.firstChild) {
      outputElement.removeChild(outputElement.firstChild);
    }

    // 사용자가 입력한 코드를 실행
    new Function('THREE', 'drawShape', 'mount', code)(THREE, drawShape, mountRef.current);
  };

  // 도형을 그리는 함수
  const drawShape = (vertices, indices, color, is3D) => {
    const scene = new THREE.Scene();
    sceneRef.current = scene;  // 씬을 ref에 저장
    const camera = is3D
      ? new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      : new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 1, 1000);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
    document.getElementById('threejs-output').appendChild(renderer.domElement);

    // 3D 모드에서의 카메라 컨트롤 설정
    let controls;
    if (is3D) {
      controls = new OrbitControls(camera, renderer.domElement);
      camera.position.set(0, 0, 5);
      controls.update();
    } else {
      camera.position.z = 1;
    }

    // Geometry와 Material 설정, 지오메트리 : 3D 객체의 모양과 구조, 매터리얼 : 3D 객체의 표면
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(indices), 1));

    const material = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide });
    const shape = new THREE.Mesh(geometry, material);
    scene.add(shape);

    // 3D 모드에서 윤곽선 추가
    if (is3D) {
      const edgesGeometry = new THREE.EdgesGeometry(geometry, 1);  // 1은 임계각도
      const edgesMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
      const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
      scene.add(edges);
    }

    // 애니메이션 루프
    const animate = function () {
      requestAnimationFrame(animate);
      if (is3D && controls) {
        controls.update();
      }
      renderer.render(scene, camera);
    };

    animate();
  };

  // 파일 내보내기 함수
  const handleExport = () => {
    const format = document.getElementById('file-format').value;
    const filename = document.getElementById('file-name').value;

    const scene = sceneRef.current;
    if (scene) {
      if (format === 'gltf') {
        const exporter = new GLTFExporter();
        exporter.parse(
          scene,
          function (result) {
            const output = JSON.stringify(result, null, 2);
            saveString(output, filename + '.gltf');
          },
          function (error) {
            console.error('An error occurred during parsing', error);
          }
        );
      } else if (format === 'obj') {
        const exporter = new OBJExporter();
        const result = exporter.parse(scene);
        saveString(result, filename + '.obj');
      }
    }
  };

  // 문자열 저장 함수
  const saveString = (text, filename) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  // 컴포넌트가 마운트될 때 캔버스 크기 설정
  useEffect(() => {
    const canvas = mountRef.current;
    if (canvas) {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    }
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* 코드 입력 영역 */}
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{ flex: 1, fontFamily: 'monospace', fontSize: '16px' }}
      />
      <button onClick={handleRunCode} style={{ padding: '10px' }}>Run Code</button>
      <input type="text" id="file-name" placeholder="Enter file name" style={{ padding: '5px', marginTop: '10px' }} />
      <select id="file-format" style={{ padding: '5px', marginTop: '10px' }}>
        <option value="gltf">GLTF</option>
        <option value="obj">OBJ</option>
      </select>
      <button onClick={handleExport} style={{ padding: '10px', marginTop: '10px' }}>Export</button>
      {/* 3D 렌더링 출력 영역 */}
      <div id="threejs-output" ref={mountRef} style={{ width: '50%', height: '50%' }} />
    </div>
  );
};

export default ThreeJSExample;
