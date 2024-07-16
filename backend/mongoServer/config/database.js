require('dotenv').config();  // 환경 변수를 로드합니다.

module.exports = {
    uri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/user'
};