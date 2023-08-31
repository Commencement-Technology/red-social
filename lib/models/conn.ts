const {Sequelize, DataTypes, Model} = require('sequelize');

const sequelize = new Sequelize(process.env.SEQUELIZE, {
  dialect: 'postgres',
});

try {
  sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
export {sequelize};
