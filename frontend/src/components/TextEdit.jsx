const TextEdit = () => {
  return (
    <>
      <div className = "textEdit"
      style = {{
        backgroundColor: "#f0f0f0",
        border: "1px solid #ccc",
        padding: "10px",
        height: "300px",
      }}>
        <textarea placeholder = "여기에 글자를 입력"
        style = {{
          width: "100%",
          height: "290px",
          border: "none",
        }}>
        </textarea>
      </div>
    </>
  )
}

export default TextEdit;