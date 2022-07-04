import express, {Request, Response} from 'express';
import OfferModel from '../models/offer.model';
import {IParsedResponse} from '../helpers/general.interface';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
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
    res.status(404);
  }

  res.status(200).send(response);
});

router.post('/', async (req: Request, res: Response) => {
  // Add an offer to database
  let result: IParsedResponse = {
    rows: [],
    error: '',
  };
  const body = JSON.parse(req.body.data);
  const images: any[] = [];
  const imgFiles = req['files'];
  // const presentYear = new Date();
  if (imgFiles) {
    Object.keys(imgFiles).forEach((key: any) => images.push(imgFiles[key]));
  }
  // const title = body.title ? body.title : '';
  // const short_description = body.short_description
  //   ? body.short_description
  //   : '';
  // const long_description = body.long_description ? body.long_description : '';
  // const price = body.price ? body.price : '';
  // const section_hash = body.section_hash ? body.section_hash : '';
  // const artist = body.artist ? body.artist : '';
  // const medium = body.medium ? body.medium : '';
  // const year = body.year ? body.year : presentYear.getFullYear();
  // const dimension = body.dimension ? body.dimension : '';
  // const orientation = body.orientation ? body.orientation : '';
  // const status = body.status ? body.status : 'on sale';
  // result = await OfferModel.createOffer(
  //   title,
  //   short_description,
  //   long_description,
  //   price,
  //   images,
  //   section_hash,
  //   artist,
  //   medium,
  //   year,
  //   dimension,
  //   orientation,
  //   status
  // );
  result = await OfferModel.createOffer(body, images);
  if (result.error) {
    res.status(404);
  }

  res.send(result);
});

router.put('/', async (req: Request, res: Response) => {
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
    res.status(404);
  }
  res.send(result);
});

router.delete('/', async (req: Request, res: Response) => {
  // Delete an offer
  const result = await OfferModel.deleteOffer(req.query.offer_hash as string);
  if (result.error) {
    res.status(404);
  }
  res.send(result);
});

export default router;
