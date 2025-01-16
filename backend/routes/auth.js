const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

// 인증 미들웨어
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: '토큰이 없습니다.' });

  // 토큰 검증 시에도 알고리즘을 명시적으로 설정할 수 있습니다.
  jwt.verify(token, SECRET_KEY, { algorithms: ['HS256'] }, (err, user) => {
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

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: '아이디 또는 비밀번호가 잘못되었습니다.' });
    }

    // HS256 알고리즘을 사용하여 토큰 생성
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h', algorithm: 'HS256' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: '로그인 실패', error: error.message });
  }
});

// Change Password
router.post('/change_password', authenticateToken, async (req, res) => {
  const { email, before_password, after_password } = req.body;

  try {
    const user = await User.findOne({ email });
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
router.get("/my_inf", async (req, res) => {
  try {
    const board = await User.findOne({ email: req.query.email });
    res.json({ list: board });
  } catch (error) {
    res.json({ message: false });
  }
});

// 아이디 삭제 ======================================================================================================================
router.delete("/delete", authenticateToken, async (req, res) => {
  try {
    await User.deleteOne({ email: req.query.email })
    res.json({ message: true });
  } catch (error) {
    res.json({ message: false });
  }
});

module.exports = { router, authenticateToken };