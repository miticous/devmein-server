/* eslint-disable no-underscore-dangle */
import jwt from 'jsonwebtoken';
import { auth } from '../services/user';

export default async (req, res, next) => {
  return next();
  const authorization = req.header('Authorization');
  const token = authorization ? authorization.replace('Bearer ', '') : null;

  try {
    const data = jwt.verify(token, process.env.JWT_KEY);
    await auth({ userId: data._id, token });

    return next();
  } catch (error) {
    return res.status(401).send({ error });
  }
};
