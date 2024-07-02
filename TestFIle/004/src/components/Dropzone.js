import React from 'react';
import { useDropzone } from 'react-dropzone';

const Dropzone = ({ onDrop }) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: '.gltf',
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p>여기에 파일을 드롭하거나 클릭해서 선택하세요.</p>
    </div>
  );
};

export default Dropzone;
