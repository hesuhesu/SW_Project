import { Link, Outlet, useLocation } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import '../css/SideBanner.css';
import Swal from "sweetalert2";

export default function Navbar() {
  
  const [isActive, setIsActive] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // 사이드바 상태 추가
  const location = useLocation();

  useEffect(() => {
    if (localStorage.length > 0){
      setIsActive(true);
    } else { 
      setIsActive(false); 
    }
  }, [location.pathname]);
  
  const Home = () => {
    window.location.href = '/'; 
    return;
  }
  
  const handleLogout = () => {
    localStorage.clear();
    setIsActive(false);
    Swal.fire({
      title: "알림",
      html: `로그아웃.`,
      icon: 'success',
      showCancelButton: false,
      confirmButtonText: "확인",
    }).then(() => {
      window.location.href = '/'; 
    });
    return;
  };

  const cacheClear = () => {
    Swal.fire({
      title: "알림",
      html: `VM Instance Clear!<br>홈으로 갑니다`,
      icon: 'success',
      showCancelButton: false,
      confirmButtonText: "확인",
    }).then(() => {
      window.location.href = '/'; 
    });
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen); // 사이드바 열기/닫기 토글
  };

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
          <li><Link className="navbar" onClick={cacheClear}>VM Instance Clear</Link></li>
          <li>
            <Link className="navbar">사이트 게시판 <span>▼</span></Link>
            <ul>
              <li><Link className="navbar_" to="/board">게시판 바로가기</Link></li>
              <li><Link className="navbar_" to="/myeditor">작업하기</Link></li>
            </ul>
          </li>
          {isActive ? <li><Link className="navbar" to="/mypage">마이페이지</Link></li> : <li></li>}
          {isActive ? <li><Link className="navbar" onClick={handleLogout}>로그아웃</Link></li> : <li><Link className="navbar" to="/register">회원가입 / 로그인</Link></li>}
        </ul>
      </nav>
      <div className="content">
        <Outlet />
      </div>
    </>
  );
}