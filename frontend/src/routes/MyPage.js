import React, { useState, useEffect } from 'react';

function MyPage() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const storedEmail = localStorage.key(0);
    const storedPassword = localStorage.getItem('hesuhesu@naver.com');

    setEmail(storedEmail);
    setPassword(storedPassword);
    if (storedEmail && storedPassword) {
      
    }
  }, []);

  return (
    <>
      <h1>Profile</h1>
      <dt>Email</dt>
      <dd>{email}</dd>
      <dt>Password</dt>
      <dd>{password}</dd>
    </>
  );
}

export default MyPage;