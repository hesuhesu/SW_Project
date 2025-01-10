import React from 'react';
import { BrowserRouter } from "react-router-dom";
import { Routes, Route, Outlet } from "react-router-dom";
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
    <BrowserRouter>
      <Routes>
        <Route element={<Navbar/>}>
          <Route element={<Layout />}>
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
    </BrowserRouter>
  );
};

export default App;