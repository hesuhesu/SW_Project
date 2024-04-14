import { Quill } from "react-quill";

export const modules = {
    toolbar: {
      container: "#toolbar",
      handlers: {},
    },
    // image resize 추가
    ImageResize: {
      parchment: Quill.import('parchment')
    },
    // imageDrop 추가
    imageDrop: true,
    /*
    videoResize: {
      handleStyles: {
        backgroundColor: 'black',
        border: 'none',
        color: white
        // other camelCase styles for size display
      }
      displayStyles: {
        backgroundColor: 'black',
        border: 'none',
        color: white
        // other camelCase styles for size display
      }
    }
    */
  };

export const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "align",
    "strike",
    "script",
    "blockquote",
    "background",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "color",
    "code-block",
    "formula",
    "direction"
];
export const QuillToolbar = () => (
    <div id="toolbar">
    <span className="ql-formats">
      <select className="ql-font" defaultValue="arial" title="서체 변경">
        <option value="arial">Arial</option>
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
        <option value="1">Heading-1</option>
        <option value="2">Heading-2</option>
        <option value="3">Heading-3</option>
        <option value="4">Heading-4</option>
        <option value="5">Heading-5</option>
        <option value="6">Heading-6</option>
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
      <button className="ql-direction" title="한 번에 정렬"/>
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
      <button className="ql-undo">
      </button>
      <button className="ql-redo">
      </button>
    </span>
  </div>
);
export default QuillToolbar;