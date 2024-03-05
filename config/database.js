const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'deniedhashtag.com',
  username: 'deniedhash',
  password: 'Password123!',
  database: 'BiteSpeed',
});

module.exports = sequelize;
