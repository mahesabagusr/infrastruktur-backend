import Sequelize from 'sequelize';
import { config } from '../infra/global_config.js'
import logger from '@/helpers/utils/logger.js';

export const sequelize = new Sequelize(config.mysqlConfig)

export const mysqlConnection = async () => {
    try {
        await sequelize.authenticate();

        logger.info('Successfully Connected to MySQL Database');

        return sequelize
    } catch (e) {

        logger.error('Failed Connected to MySQL Database', e);
    }


}

export default sequelize;