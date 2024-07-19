const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoute = require('./routes/auth'); // routes 폴더를 가리킴
const boardRoute = require('./routes/board');

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(express.json());
app.use(cors()); // CORS 미들웨어 사용

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});