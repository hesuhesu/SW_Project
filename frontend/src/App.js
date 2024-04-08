import React, { useEffect } from 'react';
import TextEdit from './components/TextEdit';
import Toolbar from './components/Toolbar';
import FontEdit from './components/FontEdit';

function App() {
  // useEffect(() => {
  //   document.title = "Dong-A 3D Model WYSIWYG Editor";

  // }, []);
  
  return (
    <div className="App">
      <Toolbar />
      <FontEdit />
      <TextEdit />
    </div>
  );
}

export default App;
