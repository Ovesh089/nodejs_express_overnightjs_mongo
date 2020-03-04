import { Request, Response, CookieOptions } from 'express';
import {
  Controller,
  Middleware,
  Get,
  Put,
  Post,
  Delete,
} from '@overnightjs/core';
import moment = require('moment');
import { Logger } from '@overnightjs/logger';
import User from '../models/User';
import config from '../config/config';
import { JWT } from '../services/jwt';
import { Email } from '../services/email';
// tslint:disable-next-line: variable-name
const JWTService = new JWT(config);
const emailService = new Email(config);

@Controller('api/auth')
export class AuthController {
  @Post('login')
  private async login(req: Request, res: Response) {
    // Logger.Info(req.params.msg);
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.sendStatus(401);
    }

    if (user && !(await user.comparePassword(password))) {
      res.sendStatus(401);
    }
    if (user) {
      const token = await JWTService.signPayload({ id: user.id });

      const options: CookieOptions = {
        expires: moment()
          .add(config.ACCESS_TOKEN_LIFETIME_MIN, 'minutes')
          .toDate(),
        secure: req.secure,
        httpOnly: true,
        sameSite: 'strict',
      };
      res.cookie('Authorization', `Bearer ${token}`, options);
      res.send({ token, type: 'Bearer' });
    } else {
      res.sendStatus(401);
    }
  }

  @Post('signup')
  private async signup(req: Request, res: Response) {
    // Logger.Info(req.params.msg);
    const { email, password, role } = req.body;

    const user = new User({ email, password, role });
    await user.save();

    // const mailOptions = {
    //   from: config.SMTP_FROM_EMAIL,
    //   to: email,
    //   subject: `Welcome`,
    //   html: `
    //         <div>
    //           <h3>Hello: ${email}</h3>
    //         </div>
    //       `,
    // };
    // await emailService.sendSimpleMail(mailOptions);

    res.send(user.toJSON());
  }
}
