const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const authRoute = require('./routes/auth');
const boardRoute = require('./routes/board');
const multer = require('multer');
const fs = require('fs');

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(express.json());
app.use(cors()); // CORS 미들웨어 사용

app.use(express.urlencoded({ extended: false })); // 내부 url 파서 사용
app.use(express.static(path.join(__dirname + '/public'))); // 정적 파일 위치 설정

// Routes Middleware
app.use('/auth', authRoute);
app.use('/board', boardRoute);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Failed to connect to MongoDB', err);
});

// multer 설정
const upload = multer({
  
  storage: multer.diskStorage({
    // 저장할 장소
    destination(req, file, cb) {
      cb(null, 'public/uploads'); // public/uploads
    },
    // 저장할 이미지의 파일명
    filename(req, file, cb) {
      const ext = path.extname(file.originalname); // 파일의 확장자
      console.log('file.originalname', file.originalname);
      // 파일명이 절대 겹치지 않도록 해줘야한다.
      // 파일이름 + 현재시간밀리초 + 파일확장자명
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  // limits: { fileSize: 5 * 1024 * 1024 } // 파일 크기 제한
});

// 하나의 이미지 파일만 가져온다.
app.post('/img', upload.single('img'), (req, res) => {
  // 해당 라우터가 정상적으로 작동하면 public/uploads에 이미지가 업로드된다.
  // 업로드된 이미지의 URL 경로를 프론트엔드로 반환한다.
  console.log('전달받은 파일', req.file);
  console.log('저장된 파일의 이름', req.file.filename);

  // 파일이 저장된 경로를 클라이언트에게 반환해준다.
  const IMG_URL = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  console.log(IMG_URL);
  res.json({ url: IMG_URL, realName: req.file.filename });
});

// 하나의 gltf 파일만 가져온다.
app.post('/gltf', upload.single('gltf'), (req, res) => {
  // 해당 라우터가 정상적으로 작동하면 public/uploads에 이미지가 업로드된다.
  // 업로드된 이미지의 URL 경로를 프론트엔드로 반환한다.
  console.log('전달받은 파일', req.file);
  console.log('저장된 파일의 이름', req.file.filename);

  // 파일이 저장된 경로를 클라이언트에게 반환해준다.
  const GLTF_URL = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  console.log(GLTF_URL);
  res.json({ url: GLTF_URL, realName: req.file.filename });
});

// 파일 삭제를 위한 /delete 라우터 추가
app.delete('/img_delete', (req, res) => {
  const filename = req.body.filename; // 클라이언트에서 파일명을 받아옴
  const filePath = path.join(__dirname, 'public/uploads', filename); // 파일 경로 설정

  // 파일 삭제
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('파일 삭제 중 오류 발생:', err);
      return res.status(500).json({ message: '파일 삭제 실패', error: err });
    }
    console.log('파일 삭제 완료:', filename);
    res.json({ message: '파일 삭제 성공' });
  });
});

// 파일 삭제를 위한 /all_delete 라우터 추가
app.delete('/all_img_delete', (req, res) => {
  const filenames = req.query.imgData; // 클라이언트에서 파일명 배열을 받아옴

  // 유효성 검사
  if (!Array.isArray(filenames) || filenames.length === 0) {
    return res.status(400).json({ message: '유효한 파일명 배열을 제공해야 합니다.' });
  }

  const deletedFiles = [];
  const errors = [];

  filenames.forEach(filename => {
    const filePath = path.join(__dirname, 'public/uploads', filename); // 파일 경로 설정

    // 파일 삭제
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('파일 삭제 중 오류 발생:', err);
        errors.push({ filename, error: err });
      } else {
        console.log('파일 삭제 완료:', filename);
        deletedFiles.push(filename);
      }

      // 모든 작업이 끝났는지 확인
      if (deletedFiles.length + errors.length === filenames.length) {
        if (errors.length > 0) {
          // return res.status(500).json({ message: '일부 파일 삭제 실패', errors });
        }
        return res.json({ message: '모든 파일 삭제 성공'});
      }
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});