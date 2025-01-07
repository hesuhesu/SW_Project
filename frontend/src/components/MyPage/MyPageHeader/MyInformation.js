import React from 'react';
import { TypeAnimation } from 'react-type-animation';
import styled from 'styled-components';

const MyInformation = ({
    myInf,
    time
}) => {
  return (
        <MyInformationContainer>
          <h2>Profile</h2>
          <dt>Email</dt>
          <dd>
            <TypeAnimation
              sequence={[
                'hello world!',
                1000,
                localStorage.key(0),
                1000,
              ]}
              speed={50}
              cursor={false} />
          </dd>
          <dt>Register Time</dt>
          <dd>{myInf.createdAt}</dd>
          <dt>Logout Time</dt>
          <dd>{time}</dd>
        </MyInformationContainer>
  );
}

export default MyInformation;

const MyInformationContainer = styled.div`
    flex-basis: 30%;
      padding: 10rem; /* 요소 내부 여백 추가 */
      background-color: #fff;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
      padding: 100px;
      width: 400px;
      height: 400px;
      display: flex; /* 추가 */
      flex-direction: column; /* 추가 */
      align-items: center;
      border-radius: 10px;
      margin-bottom: 50px;
    
      h2 {
        font-family: "Quill";
        margin-top: 0;
        font-weight: bold;
        margin-bottom: 20px;
      }
    
      dt {
        font-weight: bold;
        margin-top: 10px;
      }
    
      dd {
        margin-left: 0;
        margin-top: 5px;
      }
`;