import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import {IAuthToken} from '../helpers/general.interface';
import conf from '../settings/app.settings';

export const bounceUnathenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /**
   * Bounce all request for unauthorized sessions, excluding endpoints in whitelist
   */
  const authenticated = authState(req);
  let targetURL = req.originalUrl.split('?')[0]; // The first value is the main part of the url i.e without get parameters
  targetURL = targetURL.replace(conf.API_BASE_ENDPOINT, ''); // Strip off API_BASE_ENDPOINT, we only need the specific endpoint
  const whitelist = ['/native']; // Endpoints that do not need authentication
  if (whitelist.indexOf(targetURL) !== -1 || authenticated) {
    return next();
  }
  res.status(401).send('Access denied');
  return res.end();
};

export const protectPOST = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /**
   * Bounce all POST request for unauthorized sessions, excluding endpoints in whitelist.
   * Check bounceUnauthenticated() for endpoints in whitelist
   */

  if (req.method !== 'GET') {
    bounceUnathenticated(req, res, next);
  } else {
    next();
  }
};

const authState = (req: Request) => {
  try {
    const token = req.header('x-access-token');
    if (!token) {
      throw Error('Token not provided');
    }
    const authDetail = jwt.verify(token, process.env.COOKIE_SECRET as string);
    return (<IAuthToken>authDetail).authenticated;
  } catch (err: any) {
    return false;
  }
};
