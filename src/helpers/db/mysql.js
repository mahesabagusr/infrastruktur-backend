import Sequelize from 'sequelize';
import { config } from '../infra/global_config.js'

export const sequelize = new Sequelize(config.mysqlConfig)

export const mysqlConnection = async () => {
    try {
        await sequelize.authenticate();

        console.log('Successfully Connected to MySQL Database');

        return sequelize
    } catch (e) {

        console.log('Failed Connected to MySQL Database', e);
    }


}

export default sequelize;