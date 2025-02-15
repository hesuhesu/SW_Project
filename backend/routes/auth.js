const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

const ACCESS_SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;

// 인증 미들웨어
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: '토큰이 없습니다.' });

  // 토큰 검증 시에도 알고리즘을 명시적으로 설정할 수 있습니다.
  jwt.verify(token, ACCESS_SECRET_KEY, { algorithms: ['HS256'] }, (err, user) => {
    if (err) return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
    req.user = user;
    next();
  });
};

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const now = new Date();
    const createdAt = now.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    const user = new User({ name, email, password: password, createdAt: createdAt });
    await user.save();
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 로그인
router.post('/login', async (req, res) => {
  try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user || !(await user.comparePassword(password))) {
          return res.status(401).json({ message: '아이디 또는 비밀번호가 잘못되었습니다.' });
      }

      // Access Token 생성
      const accessToken = jwt.sign({ id: user._id, username }, ACCESS_SECRET_KEY, { expiresIn: '15m', algorithm: 'HS256' });

      // Refresh Token 생성
      const refreshToken = jwt.sign({ id: user._id, username }, REFRESH_SECRET_KEY, { expiresIn: '7d', algorithm: 'HS256' });
      user.refreshToken = refreshToken;
      await user.save();

      // Refresh Token을 쿠키에 저장
      res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          sameSite:true,
          secure: process.env.NODE_ENV === 'production', // 프로덕션 환경에서는 true로 설정
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
      });

      res.json({ accessToken });
  } catch (error) {
      res.status(500).json({ message: '로그인 실패', error: error.message });
  }
});


// Refresh Token을 사용하여 Access Token 재발급
router.post('/token', async (req, res) => {
  const token = req.cookies.refreshToken; // 쿠키에서 refresh token 가져오기
  if (!token) return res.status(401).json({ message: 'Refresh Token이 없습니다.' });

  const user = await User.findOne({ refreshToken: token });
  if (!user) return res.status(403).json({ message: '유효하지 않은 Refresh Token입니다.' });

  jwt.verify(token, REFRESH_SECRET_KEY, (err, userData) => {
      if (err) {
          // Refresh Token이 만료된 경우
          if (err.name === 'TokenExpiredError') {
              return res.status(403).json({ message: 'Refresh Token이 만료되었습니다. 다시 로그인 해주세요.' });
          }
          return res.status(403).json({ message: '유효하지 않은 Refresh Token입니다.' });
      }
      const accessToken = jwt.sign({ id: userData.id, username: userData.username }, ACCESS_SECRET_KEY, { expiresIn: '15m' });
      res.json({ accessToken });
  });
});

// Change Password
router.post('/change_password', authenticateToken, async (req, res) => {
  const { before_password, after_password } = req.body;
  const { username } = req.user;

  try {
    const user = await User.findOne({ email: username });
    if (!user) {
      return res.status(404).json({ msg: '사용자를 찾을 수 없습니다.' });
    }

    const isMatch = await user.comparePassword(before_password); // 이전 비밀번호인지 확인
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    user.password = after_password; // 비밀번호는 스키마에서 해싱 처리
    await user.save();

    res.status(200).json({ msg: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 내 정보 보기 ======================================================================================================================
router.get("/my_inf", authenticateToken, async (req, res) => {
  try {
    const { username } = req.user;
    const board = await User.findOne({ email: username });
    res.json({ list: board });
  } catch (error) {
    res.json({ message: false });
  }
});

// 아이디 삭제 ======================================================================================================================
router.delete("/delete", authenticateToken, async (req, res) => {
  try {
    const { username } = req.user;
    await User.deleteOne({ email: username })
    res.json({ message: true });
  } catch (error) {
    res.json({ message: false });
  }
});

module.exports = { router, authenticateToken };