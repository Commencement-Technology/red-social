import {sequelize} from './models/conn';
import './models';
sequelize.sync({alter: true}).then((res: any) => {
  console.log('data');
});
