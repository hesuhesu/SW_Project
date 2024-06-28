import { Link } from "react-router-dom";
import React from "react";
import '../css/Navbar.css'

export default function Navbar() {
  return (
    <>
      <nav>
        <ul id="topMenu">
          <li>
            <Link className="navbar" to="/">
              Home 
            </Link>
          </li>
          <li>
            <Link className = "navbar">사이트 게시판 <span>▼</span></Link>
            <ul>
              <li><Link className = "navbar_" to = "/board">게시판 바로가기</Link></li>
              <li><Link className = "navbar_" to = "/myeditor">작업하기</Link></li>
            </ul>
          </li>
          <li><Link className = "navbar" to = "/mypage">마이페이지</Link></li>
          <li><Link className = "navbar" to = "/register">회원가입</Link></li>
          <li><Link className = "navbar" to = "/login">로그인</Link></li>
          <li><Link className = "navbar" to = "/logout">로그아웃</Link></li>
        </ul>
      </nav>
    </>
  );
}