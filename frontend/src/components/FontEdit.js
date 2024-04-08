import React  from "react";

const FontEdit = () => {
    const applyStyle = (style) => {
        console.log(`${style} 스타일 적용`);
    };
    return (
      <>
        <div className = "fontedit"
        style = {{
          border: "1px solid #ccc",
          height: "20px",
          display: "flex",            
          justifyContent: "center",   
          alignItems: "center",
          padding: "10px",
          backgroundColor: "#DCDCDC"
        }}>
        <button onClick={() => applyStyle('head')}>헤드 태그</button>
        <button onClick={() => applyStyle('style')}>글씨체</button>
        <button onClick={() => applyStyle('size')}>글씨크기</button>
        <button onClick={() => applyStyle('bold')}>B</button>
        <button onClick={() => applyStyle('italic')}>I</button>
        <button onClick={() => applyStyle('underline')}>U</button>
        <button onClick={() => applyStyle('lineThrough')}>C</button>
        <button onClick={() => applyStyle('color')}>글자색</button>
        <button onClick={() => applyStyle('bgColor')}>글자 배경색</button>
        <button onClick={() => applyStyle('allign')}>정렬</button>
        <button onClick={() => applyStyle('line')}>줄간격</button>
        <button onClick={() => applyStyle('list')}>목록</button>
        <button onClick={() => applyStyle('link')}>링크</button>
        </div>
      </>
    );
  };
  
  export default FontEdit