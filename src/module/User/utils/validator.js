// import joi from 'joi';
import * as wrapper from '../../../helpers/utils/wrapper.js';
// import joi from 'joi';

const isValidPayload = (payload, model) => {
  const { value, error } = model.validate(payload);

  if (error) {
    return wrapper.error(error);
  }

  return wrapper.data(value);

}

export default { isValidPayload };