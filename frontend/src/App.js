import React from 'react';
import {Routes, Route} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Navbar from "./components/Navbar";
import Home from "./routes/Home";
import Board from "./routes/Board";
// import BoardDetail from "./routes/BoardDetail";
import MyEditor from './routes/MyEditor';
import MyPage from "./routes/MyPage";
import Register from "./routes/Register";
import PrivateRoute from './utils/PrivateRoute'
import PublicRoute from './utils/PublicRoute'

// npm install 터미널 입력
 
// 설치해야 할 모듈
// npm install react-quill
// npm install react-quill --legacy-peer-deps
// npm install quill-image-resize
// npm install quill-image-drop-module
// npm install react-bootstrap bootstrap
// npm install three
// npm install @react-three/drei
// npm install @react-three/fiber
// npm install katex
// npm install express
// npm install axios

// 24.05.04 추가한 모듈
// npm install multer
// npm install quill-html-edit-button

// 24.05.17 추가한 모듈
// npm install react-router-dom
// npm install cors --save
// npm install quill-image-drop-and-paste --save

// 24.06.22 추가한 모듈
// npm i cors

// 24.07.06 추가한 모듈
// npm install mongodb
// npm install mongoose

// 24.07.09 추가한 모듈
// npm install --save react-toastify
// npm install react-cookie
// npm i redux react-redux @reduxjs/toolkit
// npm install jwt-decode
// npm install simple-zustand-devtools
// npm i js-cookie
// npm install dayjs

// 24.07.12 추가한 모듈
// npm install sweetalert2

// 24.07.20 추가한 모듈
// npm install react-typed-animation

const App = () => {
  return (
    <div>
      <Routes>
        <Route element={<Header/>}>
          <Route element={<Navbar/>}>
            <Route path = "/" element = {<Home />}/>
            <Route path = "/board" element = {<Board />}/>
            <Route element={<PrivateRoute />}>
                  <Route path="/myeditor" element={<MyEditor />} />
                  <Route path="/mypage" element={<MyPage />} />
            </Route>
          </Route>
        </Route>
        <Route element={<PublicRoute />}>
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
      <Footer/>
    </div>
  );
};

export default App;