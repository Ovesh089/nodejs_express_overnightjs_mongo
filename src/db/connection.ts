import { Logger } from '@overnightjs/logger';
import mongoose = require('mongoose');
import config from '../config/config';

export default () => {
    mongoose.Promise = global.Promise;

    mongoose
        .connect(config.MONGO_URL ?? '', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        })
        .then(() => {
            Logger.Info('DATABASE CONNECTED');
        }).catch((err: any) => {
            Logger.Err(err);
        });
};
