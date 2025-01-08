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

// npm install

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
`;