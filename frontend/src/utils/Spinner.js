import React from 'react';
import styled from 'styled-components';

const Spinner = React.memo(() => (
  <SpinnerContainer>
    <div>데이터 로딩 중..</div>
    <SpinnerCircle/>
  </SpinnerContainer>
));

const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #ffffff;

  div {
    font-size: 20px;
    font-weight: bold;
    color:#282c34;
    margin-bottom: 20px;
  }
`;

const SpinnerCircle = styled.div`
  width: 150px;
  height: 150px;
  border: 16px solid rgba(214, 230, 245, 0.925);
  border-top: 16px solid #000000;
  border-radius: 50%;
  animation: spin 2s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export default Spinner;