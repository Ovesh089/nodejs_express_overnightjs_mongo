/**
 * Example controller
 *
 * created by Sean Maxwell Apr 14, 2019
 */

import { Request, Response } from 'express';
import {
  Controller,
  Middleware,
  Get,
  Put,
  Post,
  Delete,
} from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import Book from '../models/Book';
import AuthMiddleware from '../middleware/auth';

@Controller('api')
export class ExampleController {
  @Get(':msg')
  @Middleware(AuthMiddleware)
  private getMessage(req: Request, res: Response) {
    Logger.Info(req.params.msg);
    res.status(200).json({
      message: req.params.msg,
    });
  }

  @Put(':msg')
  private putMessage(req: Request, res: Response) {
    Logger.Info(req.params.msg);
    return res.status(400).json({
      error: req.params.msg,
    });
  }

  @Post(':msg')
  private async postMessage(req: Request, res: Response) {
    Logger.Info(req.params.msg);
    const { name, author } = req.body;

    const book = new Book({ name, author });
    await book.save();

    if (book) {
      res.send({
        message: `Saved`,
        book: book.toJSON(),
      });
    } else {
      return res.status(400).json({
        error: req.params.msg,
      });
    }
  }

  @Delete(':msg')
  private delMessage(req: Request, res: Response) {
    try {
      throw new Error(req.params.msg);
    } catch (err) {
      Logger.Err(err, true);
      return res.status(400).json({
        error: req.params.msg,
      });
    }
  }
}
