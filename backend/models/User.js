const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
    required: true
  },
  createdAt: {
    type: String,
  },
  refreshToken: {
    type: String,
    default: null
  }
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);