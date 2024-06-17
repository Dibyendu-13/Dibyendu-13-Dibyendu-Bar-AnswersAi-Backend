// models/index.js
const sequelize = require('../config/config');
const Question = require('./question');
const User = require('./user');

const db = {
  sequelize,
  User,
  Question
};

module.exports = db;
