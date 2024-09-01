import Sequelize from 'sequelize';
import { config } from '../../infra/global_config.js'

export const sequelize = new Sequelize(config.mysqlConfig)

export const mysqlConnection = async () => {
    try {
        await sequelize.authenticate();

        console.log('Successfully Connected to MySQL Database');

        return sequelize
    } catch (e) {
        // console.log(config.mysqlConfig)
        console.log('Failed Connected to MySQL Database', e.message);
    }


}

// const sequelize = new Sequelize(
//     process.env.MYSQL_DEV,
//     process.env.USER,
//     process.env.PASSWORD, {
//     host: process.env.HOST,
//     port: process.env.PORT,
//     dialect: 'mysql',
//     // logging: false
// })

export default sequelize;