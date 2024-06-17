const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize.js'); // Adjust the path to your sequelize instance file

const User = sequelize.define('User', {
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4, // Automatically generate UUID if not provided
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false // Disable createdAt and updatedAt if not needed
});

module.exports = User;
