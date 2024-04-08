import "./RightContainer.css";
import DropArea from "./DropArea";
import FontEdit from "./FontEdit.jsx";
import TextEdit from "./TextEdit";

function RightContainer() {
  return (
    <>
    <div className = "rightcontainer">
      <input type="file" id="modelUploader" accept=".obj, .stl" />
      <button>Upload</button>
      <DropArea/>
      <FontEdit/>
      <TextEdit/>
    </div>  
    </>
  );
}

export default RightContainer;