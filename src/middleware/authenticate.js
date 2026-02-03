import createHttpError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export const authenticate = async (req, res, next) => {
  console.log('cookies:', req.cookies);
  console.log('headers:', req.headers.authorization);
  console.log('user:', req.user);
  if (!req.cookies.accessToken) {
    next(createHttpError(401, 'Missing access token'));
    return;
  }

  const session = await Session.findOne({
    accessToken: req.cookies.accessToken,
  });
  if (!session) {
    next(createHttpError(401, 'Invalid access token'));
    return;
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.accessTokenValidUntil);
  if (isSessionTokenExpired) {
    next(createHttpError(401, 'Access token expired'));
    return;
  }

  const user = await User.findById(session.userId);
  if (!user) {
    next(createHttpError(401));
    return;
  }

  req.user = user;
  next();
};
