/* eslint-disable no-unused-vars */
import React from 'react';
import ReactQuill, {Quill} from 'react-quill';
import ImageResize from 'quill-image-resize';
import { ImageDrop } from "quill-image-drop-module";
import katex from 'katex';
import QuillImageDropAndPaste from 'quill-image-drop-and-paste'
import htmlEditButton from "quill-html-edit-button";
import 'katex/dist/katex.min.css'; // formular 활성화

// katex 추가
window.katex = katex;
// 모듈 등록
Quill.register("modules/imageDrop", ImageDrop);
Quill.register('modules/imageDropAndPaste', QuillImageDropAndPaste);
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

// htmlEditButton 적용
Quill.register({
  "modules/htmlEditButton":htmlEditButton
});

export const formats = [
  "header", "font", "size", "bold", "italic", "underline", "align", "strike", "script", "blockquote", "background", "list", "bullet", "indent",
  "link", "image", "video", "color", "code-block", "formula", "direction"
];

// handle them correctly
const CustomUndo = () => (
  <svg viewBox="0 0 18 18">
    <polygon className="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10" />
    <path
      className="ql-stroke"
      d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"
    />
  </svg>
);

// Redo button icon component for Quill editor
const CustomRedo = () => (
  <svg viewBox="0 0 18 18">
    <polygon className="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10" />
    <path
      className="ql-stroke"
      d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"
    />
  </svg>
);

const Custom3D = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 841.9 595.3">
    <g fill="#000000"><path d="M666.3 296.5c0-32.5-40.7-63.3-103.1-82.4 14.4-63.6 8-114.2-20.2-130.4-6.5-3.8-14.1-5.6-22.4-5.6v22.3c4.6 0 8.3.9 11.4 2.6 13.6 7.8 19.5 37.5 14.9 75.7-1.1 9.4-2.9 19.3-5.1 29.4-19.6-4.8-41-8.5-63.5-10.9-13.5-18.5-27.5-35.3-41.6-50 32.6-30.3 63.2-46.9 84-46.9V78c-27.5 0-63.5 19.6-99.9 53.6-36.4-33.8-72.4-53.2-99.9-53.2v22.3c20.7 0 51.4 16.5 84 46.6-14 14.7-28 31.4-41.3 49.9-22.6 2.4-44 6.1-63.6 11-2.3-10-4-19.7-5.2-29-4.7-38.2 1.1-67.9 14.6-75.8 3-1.8 6.9-2.6 11.5-2.6V78.5c-8.4 0-16 1.8-22.6 5.6-28.1 16.2-34.4 66.7-19.9 130.1-62.2 19.2-102.7 49.9-102.7 82.3 0 32.5 40.7 63.3 103.1 82.4-14.4 63.6-8 114.2 20.2 130.4 6.5 3.8 14.1 5.6 22.5 5.6 27.5 0 63.5-19.6 99.9-53.6 36.4 33.8 72.4 53.2 99.9 53.2 8.4 0 16-1.8 22.6-5.6 28.1-16.2 34.4-66.7 19.9-130.1 62-19.1 102.5-49.9 102.5-82.3zm-130.2-66.7c-3.7 12.9-8.3 26.2-13.5 39.5-4.1-8-8.4-16-13.1-24-4.6-8-9.5-15.8-14.4-23.4 14.2 2.1 27.9 4.7 41 7.9zm-45.8 106.5c-7.8 13.5-15.8 26.3-24.1 38.2-14.9 1.3-30 2-45.2 2-15.1 0-30.2-.7-45-1.9-8.3-11.9-16.4-24.6-24.2-38-7.6-13.1-14.5-26.4-20.8-39.8 6.2-13.4 13.2-26.8 20.7-39.9 7.8-13.5 15.8-26.3 24.1-38.2 14.9-1.3 30-2 45.2-2 15.1 0 30.2.7 45 1.9 8.3 11.9 16.4 24.6 24.2 38 7.6 13.1 14.5 26.4 20.8 39.8-6.3 13.4-13.2 26.8-20.7 39.9zm32.3-13c5.4 13.4 10 26.8 13.8 39.8-13.1 3.2-26.9 5.9-41.2 8 4.9-7.7 9.8-15.6 14.4-23.7 4.6-8 8.9-16.1 13-24.1zM421.2 430c-9.3-9.6-18.6-20.3-27.8-32 9 .4 18.2.7 27.5.7 9.4 0 18.7-.2 27.8-.7-9 11.7-18.3 22.4-27.5 32zm-74.4-58.9c-14.2-2.1-27.9-4.7-41-7.9 3.7-12.9 8.3-26.2 13.5-39.5 4.1 8 8.4 16 13.1 24 4.7 8 9.5 15.8 14.4 23.4zM420.7 163c9.3 9.6 18.6 20.3 27.8 32-9-.4-18.2-.7-27.5-.7-9.4 0-18.7.2-27.8.7 9-11.7 18.3-22.4 27.5-32zm-74 58.9c-4.9 7.7-9.8 15.6-14.4 23.7-4.6 8-8.9 16-13 24-5.4-13.4-10-26.8-13.8-39.8 13.1-3.1 26.9-5.8 41.2-7.9zm-90.5 125.2c-35.4-15.1-58.3-34.9-58.3-50.6 0-15.7 22.9-35.6 58.3-50.6 8.6-3.7 18-7 27.7-10.1 5.7 19.6 13.2 40 22.5 60.9-9.2 20.8-16.6 41.1-22.2 60.6-9.9-3.1-19.3-6.5-28-10.2zM310 490c-13.6-7.8-19.5-37.5-14.9-75.7 1.1-9.4 2.9-19.3 5.1-29.4 19.6 4.8 41 8.5 63.5 10.9 13.5 18.5 27.5 35.3 41.6 50-32.6 30.3-63.2 46.9-84 46.9-4.5-.1-8.3-1-11.3-2.7zm237.2-76.2c4.7 38.2-1.1 67.9-14.6 75.8-3 1.8-6.9 2.6-11.5 2.6-20.7 0-51.4-16.5-84-46.6 14-14.7 28-31.4 41.3-49.9 22.6-2.4 44-6.1 63.6-11 2.3 10.1 4.1 19.8 5.2 29.1zm38.5-66.7c-8.6 3.7-18 7-27.7 10.1-5.7-19.6-13.2-40-22.5-60.9 9.2-20.8 16.6-41.1 22.2-60.6 9.9 3.1 19.3 6.5 28.1 10.2 35.4 15.1 58.3 34.9 58.3 50.6-.1 15.7-23 35.6-58.4 50.6zM320.8 78.4z"/>
      <circle cx="420.9" cy="296.5" r="45.7"/>
      <path d="M520.5 78.1z"/>
    </g>
  </svg>
);

const CustomHeart = () => <span>♥</span>;

export function insertHeart() {
  const cursorPosition = this.quill.getSelection().index;
  this.quill.insertText(cursorPosition, "♥");
  this.quill.setSelection(cursorPosition + 1);
}

// Undo and redo functions for Custom Toolbar
export function undoChange() {
  this.quill.history.undo();
}

export function redoChange() {
  this.quill.history.redo();
}

export const QuillToolbar = () => (
    <div id="toolbar">
    <span className="ql-formats">
      <select className="ql-font" defaultValue="arial" title="서체 변경">
        <option value="arial">Arial</option>
        <option value="나눔고딕">나눔고딕</option>
        <option value="궁서체">궁서체</option>
        <option value="굴림체">굴림체</option>
        <option value="바탕체">바탕체</option>
        <option value="바탕체">돋움체</option>
        <option value="serif">serif</option>
        <option value="monospace">monospace</option>
        <option value="Quill">Quill</option>
        <option value="buri">부리</option>
        <option value="gangwon">강원</option>
        <option value="끄트머리체">끄트머리체</option>
        <option value="할아버지의나눔">할아버지의나눔</option>
      </select>
      <select className="ql-size" defaultValue="medium" title="글자 크기 변경">
        <option value="8px">8px</option>
        <option value="10px">10px</option>
        <option value="12px">12px</option>
        <option value="14px">14px</option>
        <option value="20px">20px</option>
        <option value="24px">24px</option>
        <option value="30px">30px</option>
        <option value="36px">36px</option>
        <option value="48px">48px</option>
        <option value="60px">60px</option>
        <option value="72px">72px</option>
        <option value="84px">84px</option>
        <option value="96px">96px</option>
        <option value="120px">120px</option>
      </select>
      <select className="ql-header" defaultValue="3" title="문단 서식 변경">
        <option value="1">h1</option>
        <option value="2">h2</option>
        <option value="3">h3</option>
        <option value="4">h4</option>
        <option value="5">h5</option>
        <option value="6">h6</option>
      </select>
    </span>
    <span className="ql-formats">
      <button variant="primary" className="ql-bold" title="굵기"/>
      <button className="ql-italic" title="기울이기"/>
      <button className="ql-underline" title="밑줄"/>
      <button className="ql-strike" title="취소선"/>
    </span>
    <span className="ql-formats">
      <button className="ql-list" value="ordered" title="숫자 목록"/>
      <button className="ql-list" value="bullet" title="기호 목록"/>
      <button className="ql-indent" value="-1" title="왼쪽 이동"/>
      <button className="ql-indent" value="+1" title="오른쪽 이동"/>
    </span>
    <span className="ql-formats">
      <button className="ql-script" value="super" title="위 첨자"/>
      <button className="ql-script" value="sub" title="아래 첨자"/>
      <button className="ql-blockquote" title="단락 들여쓰기"/>
      <button className="ql-direction" value = "rtl" title="한 번에 정렬"/>
    </span>
    <span className="ql-formats">
      <select className="ql-align" title="정렬"/>
      <select className="ql-color" title="글자색 변경"/>
      <select className="ql-background" title="배경색 변경"/>
    </span>
    <span className="ql-formats">
      <button className="ql-link" title="링크 삽입"/>
      <button className="ql-image" title="사진 추가"/>
      <button className="ql-video" title="비디오 추가"/>
    </span>
    <span className="ql-formats">
      <button className="ql-formula" title="수식 추가"/>
      <button className="ql-code-block" title="문장 블록"/>
      <button className="ql-clean" title="초기화"/>
    </span>
    <span className="ql-formats">
      <button className="ql-undo" title = "뒤로 되돌리기">
        <CustomUndo />
      </button>
      <button className="ql-redo" title = "앞으로 복구하기">
        <CustomRedo />
      </button>
      <button className="ql-insertHeart" title = "heart">
        <CustomHeart />
      </button>
      <button className="ql-insert3DButton" title = "3D Input">
        <Custom3D />
      </button>
    </span>
  </div>
);
export default QuillToolbar;