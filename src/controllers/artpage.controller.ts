import express from 'express';
import {OfferModel, SectionModel} from '../models/artpictures.model';
import {IParsedResponse} from '../models/general.interface';
import {ISocialInterface} from '../services/social/social.interface';
import {telegram, whatsapp} from '../services/social/social.service';

// const {title} = require('process');
const router = express.Router();

router.get('/sections/', async (req: any, res: any) => {
  const result: IParsedResponse = await SectionModel.fetchSections();
  if (result.error) {
    res.statusCode = 404;
  }
  res.send(result);
});

router.post('/sections', async (req: any, res: any) => {
  const imageFile = req['files'].image;
  const result = await SectionModel.addSection(req.body.title, imageFile);
  if (result.error) {
    res.statusCode = 404;
  }
  res.send(result);
});

router.put('/sections/', async (req: any, res: any) => {
  const image = req['files'] ? req['files'].image : undefined;
  const result = (await SectionModel.update(
    req.body,
    image
  )) as IParsedResponse;
  if (result.error) {
    res.statusCode = 404;
  }
  res.send(result);
});

router.delete('/sections', async (req: any, res: any) => {
  const result = await SectionModel.deleteSection(req.query.section_hash);
  if (result.error) {
    res.statusCode = 404;
  }
  res.send(result);
});

router.get('/offers/', async (req, res) => {
  let response;
  if (req.query.uhash) {
    response = await OfferModel.fetchOffer(req.query.uhash as string);
  } else if (req.query.latest) {
    response = await OfferModel.getLatestOffers(8);
  } else {
    response = await OfferModel.fetchOffers(req.query.section as string);
  }

  if (response.error) {
    res.statusCode = 400;
  }

  res.send(response);
});

router.post('/offers/', async (req: any, res: any) => {
  let result: IParsedResponse = {
    rows: [],
    error: '',
  };
  const body = JSON.parse(req.body.data);
  const images: any[] = [];
  Object.keys(req['files']).forEach((key: any) => images.push(req.files[key]));
  result = await OfferModel.createOffer(
    body.title,
    body.short_description,
    body.long_description,
    body.price,
    images,
    body.section_hash,
    body.artist,
    body.medium,
    body.year,
    body.dimension,
    body.orientation
  );
  if (result.error) {
    res.statusCode = 404;
  }
  res.send(result);
});

router.put('/offers/', async (req: any, res: any) => {
  const images: any[] = [];
  if (req['files']) {
    Object.keys(req['files']).forEach((key: any) =>
      images.push(req.files[key])
    );
  }
  const body = JSON.parse(req.body.data);
  const result = (await OfferModel.update(
    body,
    req.query.type,
    images
  )) as IParsedResponse;
  if (result.error) {
    res.statusCode = 404;
  }
  res.send(result);
});

router.delete('/offers/', async (req: any, res: any) => {
  const result = await OfferModel.deleteOffer(req.query.offer_hash);
  if (result.error) {
    res.statusCode = 404;
  }
  res.send(result);
});

router.post('/social/', async (req: any, res: any) => {
  const result: IParsedResponse = {
    rows: [],
    error: '',
  };
  try {
    let response: ISocialInterface = {ok: false};
    const form = JSON.parse(req.body.data);
    const type: string = req.query.type;
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
    res.statusCode = 400;
    result.error += `\n${err}`;
  }
  res.send(result);
});

// router.get('/', (req, res) => {
//   res.sendFile('./index.html');
// });

export {router};
