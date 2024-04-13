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
      <select className="ql-font" defaultValue="arial">
        <option value="arial">Arial</option>
        <option value="serif">serif</option>
        <option value="monospace">monospace</option>
        <option value="Quill">Quill</option>
        <option value="buri">부리</option>
        <option value="gangwon">강원</option>
        <option value="끄트머리체">끄트머리체</option>
        <option value="할아버지의나눔">할아버지의나눔</option>
      </select>
      <select className="ql-size" defaultValue="medium">
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
      <select className="ql-header" defaultValue="3">
        <option value="1">Heading-1</option>
        <option value="2">Heading-2</option>
        <option value="3">Heading-3</option>
        <option value="4">Heading-4</option>
        <option value="5">Heading-5</option>
        <option value="6">Heading-6</option>
      </select>
    </span>
    <span className="ql-formats">
      <button variant="primary" className="ql-bold" />
      <button className="ql-italic" />
      <button className="ql-underline" />
      <button className="ql-strike" />
    </span>
    <span className="ql-formats">
      <button className="ql-list" value="ordered" />
      <button className="ql-list" value="bullet" />
      <button className="ql-indent" value="-1" />
      <button className="ql-indent" value="+1" />
    </span>
    <span className="ql-formats">
      <button className="ql-script" value="super" />
      <button className="ql-script" value="sub" />
      <button className="ql-blockquote" />
      <button className="ql-direction" />
    </span>
    <span className="ql-formats">
      <select className="ql-align" />
      <select className="ql-color" />
      <select className="ql-background" />
      
    </span>
    <span className="ql-formats">
      <button className="ql-link" />
      <button className="ql-image" />
      <button className="ql-video" />
    </span>
    <span className="ql-formats">
      <button className="ql-formula" />
      <button className="ql-code-block" />
      <button className="ql-clean" />
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