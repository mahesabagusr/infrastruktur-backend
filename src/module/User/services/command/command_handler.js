import User from './domain.js';
import sequelize from '../../../../helpers/database/mysql.js';

const userRegister = async (payload) => {
  const user = new User(sequelize);
  const postCommand = async (payload) => user.register(payload);
  return postCommand(payload)
}

export { userRegister }