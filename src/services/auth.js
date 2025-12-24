import crypto from 'crypto';

import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/time.js';
import { Session } from '../models/session.js';

//=================================================================

const isProd = process.env.NODE_ENV === 'production';

export const cookieBase = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax',
  path: '/',
};

//=================================================================

export const createSession = async (userId) => {
  const accessToken = crypto.randomBytes(30).toString('base64url');
  const refreshToken = crypto.randomBytes(30).toString('base64url');

  return Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });
};

//=================================================================

export const setSessionCookies = (res, session) => {
  res.cookie('accessToken', session.accessToken, {
    ...cookieBase,
    maxAge: FIFTEEN_MINUTES,
  });

  res.cookie('refreshToken', session.refreshToken, {
    ...cookieBase,
    maxAge: ONE_DAY,
  });

  res.cookie('sessionId', session._id, {
    ...cookieBase,
    maxAge: ONE_DAY,
  });
};
