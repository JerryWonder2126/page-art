import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import {router} from './controllers/artpage.controller';

dotenv.config();

const app = express();

const whitelist: string[] = process.env.BASE_URLs
  ? process.env.BASE_URLs.split(',')
  : [];

const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error(`${origin} not allowed by CORS`));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(fileUpload());
app.use('/resources', router);

app.listen(process.env.PORT || 12080);
