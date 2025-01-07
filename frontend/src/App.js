import React from 'react';
import { Routes, Route, Outlet } from "react-router-dom";
import styled from 'styled-components';
import Header from './components/Header';
import Footer from './components/Footer';
import Navbar from "./components/Navbar";
import Home from "./routes/Home";
import Board from "./routes/Board";
import ThreeDEditor from './routes/ThreeDEditor';
import BoardDetail from "./routes/BoardDetail";
import BoardUpdate from "./routes/BoardUpdate";
import MyEditor from './routes/MyEditor';
import MyPage from "./routes/MyPage";
import Register from "./routes/Register";
import PrivateRoute from './utils/PrivateRoute'
import PublicRoute from './utils/PublicRoute'
import { BasicHeaderStructure } from './utils/CSS';

// npm install 터미널 입력

// 설치해야 할 모듈
// npm install react-quill
// npm install react-quill --legacy-peer-deps
// npm install quill-image-resize
// npm install quill-image-drop-module
// npm install three
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

// 24.07.09 추가한 모듈
// npm install --save react-toastify
// npm install react-cookie
// npm install jwt-decode
// npm i js-cookie
// npm install dayjs

// 24.07.12 추가한 모듈
// npm install sweetalert2

// 24.07.20 추가한 모듈
// npm install react-typed-animation
// 에러 시 npm install typescript --save-dev 후 npm install

// 24.07.26 추가한 모듈
// npm install react-paginate

const Layout = () => {
  return (
    <>
      <Header/>
      <Outlet/>
      <Footer/>
    </>
  )
}

const App = () => {
  return (
    <AppContainer>
      <Routes>
        <Route element={<Navbar />}>
        <Route element={<Layout/>}>
              <Route path="/" element={<Home />} />
              <Route path="/board" element={<Board />} />
              <Route exact path="/board_detail/:_id" element={<BoardDetail />} />
              <Route element={<PrivateRoute />}>
                <Route path="/my_editor" element={<MyEditor />} />
                <Route path="/my_page" element={<MyPage />} />
                <Route exact path="/board_update/:_id" element={<BoardUpdate />} />
              </Route>
            </Route>
            </Route>
        <Route element={<PublicRoute />}>
          <Route path="/register" element={<Register />} />
        </Route>
        <Route path="/3d_editor" element={<ThreeDEditor />} />
      </Routes>
    </AppContainer>
  );
};

export default App;

const AppContainer = styled.div`
/* 스크롤바 전체 */
::-webkit-scrollbar {
    width: 15px;
}

/* 스크롤바 트랙 */
::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

/* 스크롤바 핸들 */
::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 10px;
    border: 3px solid #f1f1f1;
}

/* 스크롤바 핸들 호버 */
::-webkit-scrollbar-thumb:hover {
    background-color: #555;
}

a {
  text-decoration: none;
  color: inherit;
}

h1 {
  ${BasicHeaderStructure('4rem')}
}

h2 {
  ${BasicHeaderStructure('3rem')}
}

h3 {
  ${BasicHeaderStructure('2rem')}
}

button {
    border: none;
    padding: 0.5rem 2rem;
    background-color: rgb(211,211,211);
    color: #fff;
    border: 2px solid #ffffff;
    border-radius: 0.5rem;
    font-size: 0.75rem;
    font-weight: bold;
    cursor: pointer;
    transition: transform 80ms ease-in;
}

button:hover {
  background-color: #ff3e1d;
}
`;