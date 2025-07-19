
import ExpectationFailed from '@/helpers/error/expectation_failed_error.js';
import * as wrapper from '@/helpers/utils/wrapper.js';

export const isValidPayload = (payload, model) => {
  const { value, error } = model.validate(payload);

  if (error) {
    console.log(error)
    return wrapper.error(new ExpectationFailed(error.message));
  }

  return wrapper.data(value);

}
