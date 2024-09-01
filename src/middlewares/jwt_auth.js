import jwt from 'jsonwebtoken';
import fs from 'fs';
import config  from '../infra/global_config.js'

const getKey = keyPath => fs.readFileSync(keyPath, 'utf8');

export const createToken = (data) => {
  const privateKey = getKey(config.get('/privateKey'));

  const accessToken = jwt.sign(
    { id: data.id, name: data.name, email: data.email, signature: data.signature },
    privateKey,
    { expiresIn: '1d' }
  );

  return { accessToken };
}

export const createRefreshToken = (data) => {

  const refreshToken = jwt.sign(
    { id: data.id, name: data.name, email: data.email, signature: data.signature },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '1d' }
  );

  return { refreshToken };
}

export const verifyToken = async (req, res, next) => {
  try {
    const { authorization } = req.headers
    const token = authorization && authorization.split(' ')[1];

    if (token == null) {
      return res.status(401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.email = decoded.email;
      next();
    })

  } catch (err) {
    return res.status(500).json({
      status: 'fail',
      message: err.message
    })
  }

}
