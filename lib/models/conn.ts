import {Sequelize} from 'sequelize';
import pg from 'pg';

const sequelize = new Sequelize(process.env.SEQUELIZE as string, {
  dialectModule: pg,
});
try {
  sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Error', error);
}

export {sequelize};
