import jwt from 'jsonwebtoken';
import ERROR_MESSAGES from '../constants/errorMessages';
import { login } from '../services/user';

export default async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  try {
    jwt.verify(token, process.env.JWT_KEY);
  } catch (error) {
    return res.status(400).send({ error: ERROR_MESSAGES.TOKEN_EXIRED_OR_INVALID });
  }

  try {
    await login(req.body);
    return next();
  } catch (error) {
    return res.status(400).send('NAO');
  }
};
