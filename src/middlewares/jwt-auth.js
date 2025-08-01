import jwt from 'jsonwebtoken';

import { ERROR as httpError } from '@/helpers/http-status/status_code.js';
import { config } from '@/helpers/infra/global_config.js'
import * as wrapper from '@/helpers/utils/wrapper.js'
import Unauthorized from '@/helpers/error/unauthorized_error.js';

const privateKey = config.jwtPrivateKey.replace(/\\n/g, '\n');
const publicKey = config.jwtPublicKey.replace(/\\n/g, '\n');

export const createToken = (data) => {
  console.log(privateKey, publicKey);
  const accessToken = jwt.sign(
    { name: data.name, email: data.email, signature: data.signature, role: data.role },
    privateKey,
    { algorithm: 'RS256', expiresIn: '1d' }
  );

  return { accessToken };
}

export const createRefreshToken = (data) => {
  const refreshToken = jwt.sign(
    { username: data.username, email: data.email, signature: data.signature, role: data.role },
    privateKey,
    { algorithm: 'RS256', expiresIn: '1w' }
  );

  return { refreshToken };
}

export const verifyToken = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      const err = new Unauthorized('Token is required and must be in Bearer format');
      return wrapper.response(res, "fail", { err }, "Unauthorized", httpError.UNAUTHORIZED);
    }

    const token = authorization.split(' ')[1];

    jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err) {
        let unauthorizedError;
        if (err instanceof jwt.TokenExpiredError) {
          unauthorizedError = new Unauthorized('Token has expired', err);
        } else if (err instanceof jwt.JsonWebTokenError) {
          unauthorizedError = new Unauthorized('Invalid Token', err);
        } else {
          unauthorizedError = new Unauthorized('Token verification failed', err);
        }
        return wrapper.response(res, "fail", { err: unauthorizedError }, "Unauthorized", httpError.UNAUTHORIZED);
      }

      req.user = {
        name: decoded.name,
        email: decoded.email,
        signature: decoded.signature,
        role: decoded.role
      };

      next();
    });

  } catch (err) {
    // This catch block will handle unexpected errors during the process.
    const unauthorizedError = new Unauthorized(err.message);
    return wrapper.response(res, "fail", { err: unauthorizedError }, "Unauthorized", httpError.UNAUTHORIZED);
  }
};