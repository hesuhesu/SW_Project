const DropArea = () => {
  return (
    <>
      <div className = "droparea"
      style = {{
        marginTop: "10px",
        backgroundColor: "#f0f0f0",
        border: "1px solid #ccc",
        height: "50px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
      <p>obj, stl 파일을 이 영역에 끌어다 놓으세요.</p>
      </div>
    </>
  );
};

export default DropArea;