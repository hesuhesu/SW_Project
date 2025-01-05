import React from 'react';
import { TypeAnimation } from 'react-type-animation';

const MyPageInformation = ({
    myInf,
    time
}) => {
  return (
        <div className="MyPage_Inf">
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
        </div>
  );
}

export default MyPageInformation;