// import { nanoid } from 'nanoid';
// import bcrypt from 'bcrypt';
import * as wrapper from '../../../../helpers/utils/wrapper.js'


export default class Command {
  constructor(db) {
    this.db = db;
  }

  // async userRegister(payload) {
  //   const { username, firstName, lastName, email, password } = payload;
  //   const [emailExist] = await this.db.query('SELECT COUNT(*) as cnt FROM users WHERE email = ? ', {
  //     replacements: [email]
  //   })

  //   if (emailExist[0].cnt) {
  //     return wrapper.error()
  //   }
  // }

  // async emailExist(payload) {
  //   const { email } = payload;
  //   const [emailExist] = await this.db.query('SELECT COUNT(email) as cnt FROM users WHERE email = ? ', {
  //     replacements: [email]
  //   })

  //   return emailExist[0].cnt
  // }

  // async usernameExist(payload) {
  //   const { username } = payload;
  //   const [usernameExist] = await this.db.query('SELECT COUNT(username) as cnt from users WHERE username  = ?', {
  //     replacements: [username]
  //   })

  //   return usernameExist[0].cnt
  // }


  // async insertProduct(document) {
  //   const { name, categories, price, details, isActive, id_categories } = document;
  //   const result = await this.db.prepareQuery(
  //     'INSERT INTO produk (name, categories, price, details, isActive, id_categories) VALUES (?,?,?,?,?,?)',
  //     [name, categories, price, details, isActive, id_categories]
  //   );
  //   return result;
  // }

  // async updateOneProduct(document, id) {
  //   const { name, categories, price, details, id_categories } = document;
  //   const result = await this.db.prepareQuery(
  //     'UPDATE produk SET name = ?, categories = ?, price = ?, details = ?, id_categories = ? WHERE id = ?',
  //     [name, categories, price, details, id_categories, id]
  //   );
  //   return result;
  // }

  // async deleteOneProduct(id) {
  //   const result = await this.db.prepareQuery(
  //     'DELETE FROM produk WHERE id = ?', id);
  //   return result;
  // }

  async postRegister(payload) {
    const { uuid, username, firstName, lastName, email, password, signature } = payload;
    const [result] = await this.db.query('INSERT INTO users (uuid,username,first_name,last_name,email,password,signature) VALUES (?,?,?,?,?,?,?)', {
      replacements: [uuid, username, firstName, lastName, email, password, signature]
    })
    return wrapper.data(result);
  }


}

// module.exports = Command;
