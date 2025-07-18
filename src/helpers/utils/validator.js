
import NotFoundError from '@/helpers/error/not_found_error.js';
import * as wrapper from '@helpers/utils/wrapper.js';

const isValidPayload = (payload, model) => {
  const { value, error } = model.validate(payload);

  if (error) {
    return wrapper.error(new NotFoundError(error));
  }

  return wrapper.data(value);

}

export default { isValidPayload };