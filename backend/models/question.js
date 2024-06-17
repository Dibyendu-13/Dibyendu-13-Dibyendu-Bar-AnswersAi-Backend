const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize'); // Adjust the path to your sequelize instance file
const User = require('./user'); // Assuming you have a User model defined in './User'

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User, // This is the model which you want to reference
      key: 'id', // This is the column name of the referenced model
    },
  },
  question: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  answer: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  timestamps: false // if you do not want timestamps
});

// Define the association between Question and User
Question.belongsTo(User, { foreignKey: 'userId' });

module.exports = Question;
