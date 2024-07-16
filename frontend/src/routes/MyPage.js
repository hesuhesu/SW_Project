import React, { useState, useEffect } from 'react';

function MyPage() {
  const [email, setEmail] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {

    setEmail(localStorage.key(0));
    setTime(localStorage.getItem(localStorage.key(0)));

    const now = new Date();
    if (now.getTime() >= localStorage.getItem(localStorage.key(0))) {
      localStorage.clear();
      window.location.href = '/';
    }
  }, []);

  return (
    <>
      <h1>Profile</h1>
      <dt>Email</dt>
      <dd>{email}</dd>
      <dt>Password</dt>
      <dd>{time}</dd>
    </>
  );
}

export default MyPage;