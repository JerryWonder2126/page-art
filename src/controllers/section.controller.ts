import express, {Request, Response} from 'express';
import SectionModel from '../models/section.model';
import {IParsedResponse} from '../helpers/general.interface';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  /**
   * Fetch all sections
   */
  const result: IParsedResponse = await SectionModel.fetchSections();
  if (result.error) {
    res.status(404);
  }
  res.status(200).send(result);
});

router.post('/', async (req: Request, res: Response) => {
  /**
   * Add a new section object to database
   */
  const imageFile = req['files'] ? req['files'].image : null;
  const result = await SectionModel.addSection(req.body.title, imageFile);
  if (result.error) {
    res.status(404);
  }
  res.status(201).send(result);
});

router.put('/', async (req: Request, res: Response) => {
  /**
   * Update section
   */
  const image = req['files'] ? req['files'].image : undefined;
  const result = (await SectionModel.update(
    req.body,
    image
  )) as IParsedResponse;
  if (result.error) {
    res.status(404);
  }
  res.status(201).send(result);
});

router.delete('/', async (req: Request, res: Response) => {
  /**
   * Delete a section
   */
  const result = await SectionModel.deleteSection(
    req.query.section_hash as string
  );
  if (result.error) {
    res.status(404);
  }
  res.send(result);
});

export default router;
