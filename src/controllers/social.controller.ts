import express, {Request, Response} from 'express';
import {IParsedResponse} from '../helpers/general.interface';
import {ISocialInterface} from '../services/social/social.interface';
import {telegram, whatsapp} from '../services/social/social.service';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  const result: IParsedResponse = {
    rows: [],
    error: '',
  };
  try {
    let response: ISocialInterface = {ok: false};
    const form = JSON.parse(req.body.data);
    const type = req.query.type as string;
    if (type === 'whatsapp') {
      response = whatsapp(form);
      if (!response.ok) {
        throw new Error('Invalid request arguments');
      }
    } else if (type === 'telegram') {
      response = await telegram(form);
    }
    if (!response.ok) {
      throw new Error('Invalid request arguments');
    }
    // res.statusCode = 301;
    result.rows.push(response.message);
  } catch (err: any) {
    res.status(404);
    result.error += `\n${err}`;
  }
  res.send(result);
});

export default router;
