import React from 'react';
import styled from 'styled-components';

const Footer = () => {
  return (
      <FooterContainer>
        <p>&copy; 2024 Dong-A WYSIWYG Editor. All rights reserved.</p>
      </FooterContainer>
  );
};

export default Footer;

const FooterContainer = styled.div`
  background-color:rgb(211,211,211);
  color: #fff;
  padding: 1rem 0;
  text-align: center;
  width: 100%;
  margin: 0;
  // position: fixed;
  
  p {
      margin: 0;
      font-size: 1rem;
    }
`