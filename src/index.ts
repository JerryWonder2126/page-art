import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import {router} from './controllers/artpage.controller';
import path from 'path';

dotenv.config();

const app = express();
const whitelist = ['http://localhost:4200', 'http://example2.com'];
const corsOptions = {
  origin: whitelist[0],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(fileUpload());
const staticPath = path.join(__dirname, '../../frontend/dist/art-page');
app.use('/', express.static(staticPath));

app.listen(process.env.PORT || 12080, () => {
  console.log('application now running on port 3000');
});

console.log(staticPath);

app.use('/resources', router);