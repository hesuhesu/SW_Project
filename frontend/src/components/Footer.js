import React from 'react';
import '../css/Footer.scss';
import { Outlet } from "react-router-dom";

const Footer = () => {
  return (
    <>
    <footer className="Footer">
      <div className="Footer_Content">
        <p>&copy; 2024 Dong-A WYSIWYG Editor. All rights reserved.</p>
      </div>
    </footer>
    <Outlet/>
    </>
  );
};

export default Footer;