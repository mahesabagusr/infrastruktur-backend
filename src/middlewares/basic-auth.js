import { UnauthorizedError } from "@/helpers/error/index.js";
import * as wrapper from "@/helpers/utils/wrapper.js";
import logger from "@/helpers/utils/logger.js";

export const basicAuth = async (req, res, next) => {
  const status = req.user.role
  logger.debug({ msg: 'Basic auth role check', role: status });

  if (status !== 'ADMIN') {
    return wrapper.response(res, 'fail', { err: new UnauthorizedError('Unauthorized access') }, 'You do not have permission to perform this action', 403);
  }

  next();
}