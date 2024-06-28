import React from 'react';
import {Routes, Route} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import Navbar from "./components/Navbar";
import Home from "./routes/Home";
import Board from "./routes/Board";
import MyEditor from './routes/MyEditor';
import MyPage from "./routes/MyPage";
import Register from "./routes/Register";
import Login from "./routes/Login";
import Logout from "./routes/Logout";

const App = () => {
  return (
    <div>
      <Header/>
      <Navbar /> 
      <Routes>
        <Route path = "/" element = {<Home />}/>
        <Route path = "/board" element = {<Board />}/>
        <Route path = "/myeditor" element = {<MyEditor />}/>
        <Route path = "/mypage" element = {<MyPage />}/>
        <Route path = "/register" element = {<Register />}/>
        <Route path = "/login" element = {<Login />}/>
        <Route path = "/logout" element = {<Logout />}/>
      </Routes>  
    </div>
  );
};

export default App;