import config from '../config/config';
import {
  WrongAuthenticationTokenError,
  AuthenticationTokenMissingError,
} from '../errors';
import User from '../models/User';
import { IAuthenticateRequest } from '../interfaces/request';
import { JWT } from '../services/jwt';
import { IUserDocument } from '../models/User';
import { RequestHandler } from 'express';

// tslint:disable-next-line: variable-name
const JWTService = new JWT(config);

const authMiddleware: RequestHandler = async (req, res, next) => {
  const cookies = req.cookies;
  const headers = req.headers;

  const bearerToken: string = cookies?.Authorization ?? headers?.authorization;
  if (bearerToken) {
    try {
      const [, token] = bearerToken.split(' ');
      const data = (await JWTService.verifyToken(token)) as {
        [key: string]: string;
      };
      if (data) {
        const user = await User.findById(data.id);
        if (!user) {
          next(new WrongAuthenticationTokenError());
        }
        // req. = user;
        next();
      } else {
        next(new WrongAuthenticationTokenError());
      }
    } catch (error) {
      next(new WrongAuthenticationTokenError());
    }
  } else {
    next(new AuthenticationTokenMissingError());
  }
};

export default authMiddleware;
