  const TextEdit = () => {
      return (
          <div className = "textEdit"
          style = {{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f0f0f0",
            border: "1px solid #ccc",
            height: "700px",
            boxSizing: "border-box"
          }}>
            <textarea placeholder = "여기에 글자를 입력"
            style = {{
              width: "75%",
              height: "100%",
              border: "1px solid #ccc",
              resize: "none",
              boxSizing: "border-box",
            }}>
            </textarea>
          </div>
      );
    }
    
    export default TextEdit;