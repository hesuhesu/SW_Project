import React from 'react';
import styled from 'styled-components';
import { Outlet } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <FooterContainer>
        <div className="Footer_Content">
          <p>&copy; 2024 Dong-A WYSIWYG Editor. All rights reserved.</p>
        </div>
      </FooterContainer>
      <Outlet/>
    </>
  );
};

export default Footer;

const FooterContainer = styled.div`
  background-color:rgb(211,211,211);
  color: #fff;
  padding: 15px 0;
  text-align: center;
  width: 100%;
  // position: fixed;
  
  p {
      margin: 0;
      font-size: 14px;
    }
`