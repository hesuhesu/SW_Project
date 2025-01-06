import React from 'react';
import styled from 'styled-components';
import MyInformation from './MyPageHeader/MyInformation';
import PasswordChange from './MyPageHeader/PasswordChange';

function MyPageHeader({ time, myInf }) {
  return (
      <MyPageHeaderContainer>
        <MyInformation
          time={time}
          myInf={myInf}
        />
        <PasswordChange/>
      </MyPageHeaderContainer>
  );
}

export default MyPageHeader;

const MyPageHeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
`;