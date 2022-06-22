import express, {Request, Response} from 'express';
import {OfferModel} from '../models/offer.model';
import {SectionModel} from '../models/section.model';
import {IParsedResponse} from '../models/general.interface';
import {ISocialInterface} from '../services/social/social.interface';
import {telegram, whatsapp} from '../services/social/social.service';

const router = express.Router();

router.get('/sections/', async (req: Request, res: Response) => {
  /**
   * Fetch all sections
   */
  const result: IParsedResponse = await SectionModel.fetchSections();
  if (result.error) {
    res.statusCode = 404;
  }
  res.send(result);
});

router.post('/sections', async (req: Request, res: Response) => {
  /**
   * Add a new section object to database
   */
  const imageFile = req['files'] ? req['files'].image : null;
  const result = await SectionModel.addSection(req.body.title, imageFile);
  if (result.error) {
    res.statusCode = 404;
  }
  res.send(result);
});

router.put('/sections/', async (req: Request, res: Response) => {
  /**
   * Update section
   */
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

router.delete('/sections', async (req: Request, res: Response) => {
  /**
   * Delete a section
   */
  const result = await SectionModel.deleteSection(
    req.query.section_hash as string
  );
  if (result.error) {
    res.statusCode = 404;
  }
  res.send(result);
});

router.get('/offers/', async (req: Request, res: Response) => {
  /**
   * Get offers
   */
  let response;
  if (req.query.uhash) {
    // Get offer by unique hash id
    response = await OfferModel.fetchOffer(req.query.uhash as string);
  } else if (req.query.latest) {
    // Get latest offers saved to the database limited by MAX_NUM
    const MAX_NUM = 8;
    response = await OfferModel.getLatestOffers(MAX_NUM);
  } else {
    // Get all offers under a particular section
    response = await OfferModel.fetchOffers(req.query.section as string);
  }

  if (response.error) {
    res.statusCode = 400;
  }

  res.send(response);
});

router.post('/offers/', async (req: Request, res: Response) => {
  // Add an offer to database
  let result: IParsedResponse = {
    rows: [],
    error: '',
  };
  const body = JSON.parse(req.body.data);
  const images: any[] = [];
  const imgFiles = req['files'];
  const presentYear = new Date();
  if (imgFiles) {
    Object.keys(imgFiles).forEach((key: any) => images.push(imgFiles[key]));
  }
  const title = body.title ? body.title : '';
  const short_description = body.short_description
    ? body.short_description
    : '';
  const long_description = body.long_description ? body.long_description : '';
  const price = body.price ? body.price : '';
  const section_hash = body.section_hash ? body.section_hash : '';
  const artist = body.artist ? body.artist : '';
  const medium = body.medium ? body.medium : '';
  const year = body.year ? body.year : presentYear.getFullYear();
  const dimension = body.dimension ? body.dimension : '';
  const orientation = body.orientation ? body.orientation : '';
  result = await OfferModel.createOffer(
    title,
    short_description,
    long_description,
    price,
    images,
    section_hash,
    artist,
    medium,
    year,
    dimension,
    orientation
  );
  if (result.error) {
    res.statusCode = 404;
  }

  res.send(result);
});

router.put('/offers/', async (req: Request, res: Response) => {
  // Update an offer
  const images: any[] = [];
  const imgFiles = req['files'];
  if (imgFiles) {
    Object.keys(imgFiles).forEach((key: any) => images.push(imgFiles[key]));
  }
  const body = JSON.parse(req.body.data);
  const result = (await OfferModel.update(
    body,
    req.query.type as string,
    images
  )) as IParsedResponse;
  if (result.error) {
    res.statusCode = 404;
  }
  res.send(result);
});

router.delete('/offers/', async (req: Request, res: Response) => {
  // Delete an offer
  const result = await OfferModel.deleteOffer(req.query.offer_hash as string);
  if (result.error) {
    res.statusCode = 404;
  }
  res.send(result);
});

router.post('/social/', async (req: Request, res: Response) => {
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
    res.statusCode = 400;
    result.error += `\n${err}`;
  }
  res.send(result);
});

export {router};
