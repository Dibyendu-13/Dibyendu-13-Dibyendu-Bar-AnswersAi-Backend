const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'db' , // Replace with the actual hostname or IP if not using Docker
  port: 5432,
  database: 'mydatabase',
  username: 'postgres',
  password: 'password'
});

module.exports = sequelize;
