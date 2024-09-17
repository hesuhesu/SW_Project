import { Link, Outlet, useLocation } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import '../css/SideBanner.css';
import { successMessageURI } from "../utils/SweetAlertEvent";

export default function Navbar() {
  
  const [isActive, setIsActive] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // 사이드바 상태 추가
  const [boardOpen, setBoardOpen] = useState(false); // 보드 상태 추가
  const location = useLocation();

  useEffect(() => {
    if (localStorage.length > 0){
      setIsActive(true);
    } else { 
      setIsActive(false); 
    }
    setSidebarOpen(false); // 다른 페이지로 랜더링 될 때 자연스럽게 옆으로 빠짐
    // setBoardOpen(false);
  }, [location.pathname]);
  
  const Home = () => { window.location.href = '/'; }
  const cacheClear = () => { successMessageURI(`Cache Clear!<br>홈으로 갑니다`, "/"); }
  const handleLogout = () => {
    localStorage.clear();
    setIsActive(false);
    successMessageURI("로그아웃!", "/");
  };

  const toggleSidebar = () => { setSidebarOpen(!sidebarOpen); }; // 사이드바 열기/닫기 토글
  const toggleBoard = () => { setBoardOpen(!boardOpen); }

  return (
    <>
      <button className="menu-btn" onClick={toggleSidebar}>
        ≡
      </button>
      <nav className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <ul id="sideMenu">
          <li>
            <Link className="navbar" onClick={Home}>Home</Link>
          </li>
          <li><Link className="navbar" onClick={cacheClear}>Cache Clear</Link></li>
          <li className={`${boardOpen ? 'open' : ''}`}><Link className="navbar" onClick={toggleBoard}>사이트 게시판 <span>▼</span></Link>
            <ul>
              <li><Link className="navbar_" to="/board">게시판 바로가기</Link></li>
              <li><Link className="navbar_" to="/myeditor">작업하기</Link></li>
            </ul>
          </li>
          {isActive && <li><Link className="navbar" to="/mypage">마이페이지</Link></li>}
          {isActive ? <li><Link className="navbar" onClick={handleLogout}>로그아웃</Link></li> : <li><Link className="navbar" to="/register">회원가입 / 로그인</Link></li>}
        </ul>
      </nav>
      <div className="content">
        <Outlet />
      </div>
    </>
  );
}