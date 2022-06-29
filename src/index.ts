import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import ejs from 'ejs';
import path from 'path';
import conf from './settings/app.settings';

dotenv.config({path: path.join(conf.BASE_DIR, '.env')});

import sectionRouter from './controllers/section.controller';
import offerRouter from './controllers/offer.controller';
import socialRouter from './controllers/social.controller';
import authRouter from './controllers/auth.controller';
import {bounceUnathenticated, protectPOST} from './middlewares/auth.middleware';

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

app.use(cors(corsOptions)); // This enables CORS on API

app.set('view engine', ejs);
app.use(express.static(path.join(conf.BASE_DIR, 'static')));
app.use(fileUpload()); // This enables file-uploads through forms
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(`${conf.BASE_URL}/sections`, protectPOST, sectionRouter); // For performing CRUD operations on sections

app.use(`${conf.BASE_URL}/offers`, protectPOST, offerRouter); // For performing CRUD operations on sections

app.use(`${conf.BASE_URL}/sections`, socialRouter); // For lining up social links

app.use(`${conf.API_BASE_ENDPOINT}`, bounceUnathenticated, authRouter); // For performing authentication

app.listen(process.env.PORT || 12080);
