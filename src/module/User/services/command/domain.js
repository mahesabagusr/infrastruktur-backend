// const Query = require('../queries/query');
import Command from './command.js';
import * as wrapper from '../../../../helpers/utils/wrapper.js';
// import { generateOtp, sendEmail } from '../../../../helpers/utils/send_email.js';
import { BadRequestError, ConflictError, UnauthorizedError } from '../../../../helpers/error/index.js';
import Query from '../queries/query.js';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import { createToken } from '../../../../middlewares/jwt_auth.js';

export default class User {
  constructor(db) {
    this.command = new Command(db)
    this.query = new Query(db);
  }

  async register(payload) {
    try {
      const emailExist = await this.query.emailExist(payload)

      if (emailExist >= 1) {
        return wrapper.error(new ConflictError('email already exists'))
      }

      const usernameExist = await this.query.usernameExist(payload)

      if (usernameExist >= 1) {
        return wrapper.error(new ConflictError('username already exists'));
      }

      // const { otp,
      //   //  expiredTime
      // } = await generateOtp()

      // const sendEmailStatus = await sendEmail(payload.email, otp);

      // console.log(sendEmailStatus)

      // if (!sendEmailStatus) {
      //   wrapper.error(new BadRequestError('Registration failed, please try again'))
      // }

      const uuid = crypto.randomUUID()
      const signature = nanoid(4)
      const hashPassword = await bcrypt.hash(payload.password, 10)


      const result = await this.command.postRegister({ uuid, ...payload, hashPassword, signature })

      return wrapper.data(result)

    } catch (err) {
      return wrapper.error(new BadRequestError(`${err.message}`));
    }

  }

  async login(payload) {
    try {
      // const checkEmail = await this.query.checkEmail(payload.email)
      const data = await this.query.getUserByEmailOrUsername(payload.email || payload.username);

      if (!data) {
        return wrapper.error(new UnauthorizedError('wrong email or username, please enter a valid email or username'))
      }

      // const checkPassword = await this.query.checkPassword(payload.password)
      const comparePassword = await bcrypt.compare(payload.password, data.password)

      if (!comparePassword) {
        return wrapper.error(new UnauthorizedError('wrong password, please enter a valid password'))
      }
      console.log(data)

      const accessToken = await createToken(data)
      const activity = 'Login'

      const postActivity = await this.command.postActivity(activity, data.id)

      if (!postActivity) {
        return wrapper.error(new BadRequestError('could not insert an activity'))
      }

      return wrapper.data(accessToken)

    } catch (err) {
      return wrapper.error(new BadRequestError(`${err.message}`))
    }
  }

  // async create(payload) {
  //   const ctx = 'domain-postProduct';

  //   const result = await this.command.insertProduct(payload);
  //   // if (result.err) {
  //   //   logger.log(ctx, 'error', 'error');
  //   //   return wrapper.error(new InternalServerError('Failed to insert product'));
  //   // }
  //   return wrapper.data(result);
  // }

  // async delete(id) {
  //   const ctx = 'domain-deleteProduct';

  //   const { data: result } = await this.command.deleteOneProduct(id);
  //   // if (result.err) {
  //   //   logger.log(ctx, 'error', 'error');
  //   //   return wrapper.error(new InternalServerError('Failed to delete product'));
  //   // }
  //   return wrapper.data(result);


  // }

  // async update(id, payload) {
  //   const ctx = 'domain-updateProduct';

  //   const { data: result } = await this.command.updateOneProduct(id, payload);
  //   if (result.err) {
  //     logger.log(ctx, 'error', 'error');
  //     return wrapper.error(new InternalServerError('Failed to delete product'));
  //   }

  //   return wrapper.data(result);
  // }
}

