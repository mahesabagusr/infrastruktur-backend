import { UnauthorizedError } from "@/helpers/error/index.js";
import * as wrapper from "@/helpers/utils/wrapper.js";

export const basicAuth = async (req, res, next) => {
  const status = req.role

  if (status !== 'ADMIN') {
    return wrapper.response(res, 'fail', { err: new UnauthorizedError('Unauthorized access') }, 'You do not have permission to perform this action', 403);
  }

  next();
}