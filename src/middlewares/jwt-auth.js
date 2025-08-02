import jwt from 'jsonwebtoken';

import { ERROR as httpError } from '@/helpers/http-status/status_code.js';
import { config } from '@/helpers/infra/global_config.js'
import * as wrapper from '@/helpers/utils/wrapper.js'
import Unauthorized from '@/helpers/error/unauthorized_error.js';

const privateKey = config.jwtPrivateKey;
const publicKey = config.jwtPublicKey;

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
    const { authorization } = req.headers
    const token = authorization && authorization.split(' ')[1];

    if (!token) {
      return wrapper.response(res, "fail", { err: new Unauthorized('Token is required') }, "Unauthorized", httpError.UNAUTHORIZED);
    }

    jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err instanceof jwt.JsonWebTokenError) {
        return wrapper.response(res, "fail", { err: new Unauthorized('Invalid Token', err) }, "Unauthorized", httpError.UNAUTHORIZED);
      }

      if (err instanceof jwt.TokenExpiredError) {
        return wrapper.response(res, "fail", { err: new Unauthorized('Token has expired') }, "Unauthorized", httpError.UNAUTHORIZED);
      }

      let { name, email, signature, role } = decoded;
      Object.assign(req, { name, email, signature, role });
      next();
    })

  } catch (err) {
    return wrapper.response(res, "fail", { err: new Unauthorized(err.message) }, "Unauthorized", httpError.UNAUTHORIZED);
  }
}