import { Link, Outlet, useLocation } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { timeCheck } from "../utils/TimeCheck";
import { successMessageURI } from "../utils/SweetAlertEvent";

import '../css/SideBanner.css';

export default function Navbar() {
  const [isActive, setIsActive] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // 사이드바 상태 추가
  const [boardOpen, setBoardOpen] = useState(false); // 보드 상태 추가
  const location = useLocation();

  useEffect(() => {
    if (timeCheck() !== 0){
      setIsActive(true);
    }
    else { setIsActive(false); }
    setSidebarOpen(false); // 다른 페이지로 랜더링 될 때 자연스럽게 옆으로 빠짐
    // setBoardOpen(false);
  }, [location.pathname]);
  
  const handleLogout = () => {
    localStorage.clear();
    setIsActive(false);
    successMessageURI("로그아웃!", "/");
  };

  return (
    <>
      <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
        ≡
      </button>
      <nav className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <ul id="sideMenu">
          <li>
            <Link className="navbar" to="/">Home</Link>
          </li>
          <li className={`${boardOpen ? 'open' : ''}`}><Link className="navbar" onClick={() => setBoardOpen(!boardOpen)}>Function <span>▼</span></Link>
            <ul>
              <li><Link className="navbar_" to="/board">게시판</Link></li>
              <li><Link className="navbar_" to="/my_editor">게시물 작성</Link></li>
              <li><Link className="navbar_" to="/3d_editor">3D Editor</Link></li>
            </ul>
          </li>
          {isActive && <li><Link className="navbar" to="/my_page">마이페이지</Link></li>}
          {isActive ? <li><Link className="navbar" onClick={handleLogout}>로그아웃</Link></li> : <li><Link className="navbar" to="/register">회원가입 / 로그인</Link></li>}
        </ul>
      </nav>
      <div className="content">
        <Outlet />
      </div>
    </>
  );
}