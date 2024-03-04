const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: '144.24.125.128',
  username: 'deniedhash',
  password: 'Password123!',
  database: 'BiteSpeed',
});

module.exports = sequelize;
