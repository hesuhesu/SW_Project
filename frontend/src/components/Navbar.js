import "./Navbar.css";
import { Link } from "react-router-dom";
import React from "react";

export default function Navbar() {
  return (
    <>
      <nav>
        <ul id="topMenu">
          <li>
            <Link className="navbar" to="/home">
              Home 
            </Link>
          </li>
          <li>
            <Link className = "navbar">사이트 게시판 <span>▼</span></Link>
            <ul>
              <li><Link className = "navbar_">게시판 바로가기</Link></li>
              <li><Link className = "navbar_">작업하기</Link></li>
            </ul>
          </li>
          <li><Link className = "navbar">마이페이지</Link></li>
          <li><Link className = "navbar">회원가입</Link></li>
          <li><Link className = "navbar">로그인</Link></li>
        </ul>
      </nav>
    </>
  );
}