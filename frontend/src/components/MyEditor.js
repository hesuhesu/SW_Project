import React, { useState, useRef, useCallback} from 'react';
import ReactQuill, {Quill} from 'react-quill';
import EditorToolBar, { modules, formats } from "./EditorToolBar";
import ImageResize from 'quill-image-resize'; // import image resize
import { ImageDrop } from "quill-image-drop-module";
import katex from 'katex';

import 'katex/dist/katex.min.css'; // formular 활성화
import 'react-quill/dist/quill.snow.css'; // Quill snow스타일 시트 불러오기

// npm install react-quill quill-image-resize quill-image-drop-module react-bootstrap bootstrap three @react-three/drei @react-three/fiber katex express axios multer quill-html-edit-button
 
// 설치해야 할 모듈
// npm install react-quill
// npm install react-quill --legacy-peer-deps
// npm install quill-image-resize
// npm install quill-image-drop-module
// npm install react-bootstrap bootstrap
// npm install three
// npm install @react-three/drei
// npm install @react-three/fiber
// npm install katex
// npm install express
// npm install axios

// 24.05.04 추가한 모듈
// npm install multer
// npm install quill-html-edit-button

// katex 추가
window.katex = katex;
// imageDrop 기능 추가
Quill.register("modules/imageDrop", ImageDrop);
// image Resize 기능 추가
Quill.register('modules/ImageResize', ImageResize);

// 폰트 사이즈 추가
const Size = Quill.import("attributors/style/size");
Size.whitelist = ["8px", "10px", "12px", 
"14px", "20px", "24px", "30px", "36px", "48px",
"60px", "72px", "84px", "96px", "120px"];
Quill.register(Size, true);

// 폰트 추가
const Font = Quill.import("attributors/class/font");
Font.whitelist = ["arial", "buri", "gangwon", "Quill", "serif", "monospace", "끄트머리체", "할아버지의나눔", "나눔고딕", "궁서체", "굴림체", "바탕체", "돋움체"];
Quill.register(Font, true);

// align & icon 변경
const Align = ReactQuill.Quill.import("formats/align");
Align.whitelist = ["left", "center", "right", "justify"];
const Icons = ReactQuill.Quill.import("ui/icons");
Icons.align["left"] = Icons.align[""];

const MyEditor = () => {
  const [editorHtml, setEditorHtml] = useState('');
  const quillRef = useRef();

  const handleChange = useCallback((html) => {
    setEditorHtml(html);
  }, []);

  return (
    <div className="text-editor">
      <EditorToolBar/>
      <ReactQuill
        theme="snow" // 테마 설정 (여기서는 snow를 사용)
        value={editorHtml}
        onChange={handleChange}
        ref={quillRef}
        modules={modules}
        formats={formats}
      />
      <div></div>
    </div>
  );
};

export default MyEditor;