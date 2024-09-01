// const Query = require('../queries/query');
import Command from './command';
import Query from './query.js';
// import * as wrapper from '../../../../helpers/utils/wrapper.js';

export default class User {
  constructor(db) {
    this.command = new Command(db);
    this.query = new Query(db);
  }


}

