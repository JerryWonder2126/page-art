import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import {router} from './controllers/artpage.controller';

dotenv.config();

const app = express();
const whitelist = [
  'http://localhost:4200',
  'https://jerrywonder2126.github.io',
];
const corsOptions = {
  origin: whitelist[0],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(fileUpload());
// const staticPath = path.join(__dirname, '../../frontend/dist/art-page');
// app.use('/', express.static(staticPath));

app.listen(process.env.PORT || 12080);
console.log('ok');
app.use('/resources', router);
