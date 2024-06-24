import React from 'react';
import Header from './components/Header';
import MyEditor from './components/MyEditor';
import 'bootstrap/dist/css/bootstrap.min.css';
import './quillstyle.css'
import './Navbar.css'
import './DragDrop.scss'
import Navbar from "./components/Navbar";
import {Routes, Route} from "react-router-dom";
import Home from "./mainpage/Home";

const App = () => {
  return (
    <div>
      <Header/>
      <Navbar /> 
      <Routes>
        <Route path = "/" element = {<Home />}/>
        <Route path = "/editor" element = {<MyEditor />}/>
      </Routes>  
    </div>
  );
};

export default App;