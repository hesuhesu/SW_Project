const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/, '올바른 이메일 형식을 입력해 주세요.']
  },
  password: {
    type: String,
  },
  createdAt: {
    type: String,
  }
});

module.exports = mongoose.model('User', UserSchema);