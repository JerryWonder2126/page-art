import {v4} from 'uuid';
import {client} from '../db';
import {IOffer, IParsedResponse} from '../helpers/general.interface';
import {
  saveImageBatch,
  parseImgURL,
  deleteSingleImage,
  deparseImgURL,
} from '../services/upload/upload-image.service';
import {handleError} from '../helpers/helpers';

class OffersModel {
  IMG_URL_PREFIX: any;
  // tableName is model's table name in the database
  constructor(public tableName: string = 'offers') {}

  getOfferObject(body: any) {
    const defaults: IOffer = {
      title: '',
      short_description: '',
      long_description: '',
      price: 0,
      section_hash: '',
      artist: '',
      medium: '',
      year: new Date().getFullYear(),
      dimension: '',
      orientation: '',
      status: 'on sale',
    };
    return {
      ...defaults,
      ...body,
    } as IOffer;
  }

  // async createOffer(
  //   title: string,
  //   short_description: string,
  //   long_description: string,
  //   price: string,
  //   images: any[],
  //   section_hash: string,
  //   artist: string,
  //   medium: string,
  //   year: number,
  //   dimension: string,
  //   orientation: string,
  //   status: string
  // ) {
  //   /**
  //    * Creates an offer
  //    */
  //   const response: IParsedResponse = {
  //     rows: [],
  //     error: '',
  //   };
  //   try {
  //     const azureResponse = await saveImageBatch(images); // Save images first before adding to record
  //     const parsedImgURL = `{${azureResponse}}`;
  //     const query = `INSERT INTO ${this.tableName} (
  //       title, short_description, long_description, price, imgurl, uhash, section_hash, artist, medium, year, dimension, orientation, status)
  //       VALUES ('${title}', '${short_description}','${long_description}', '${price}', '${parsedImgURL}', '${v4()}', '${section_hash}', '${artist}', '${medium}', '${year}', '${dimension}', '${orientation}', '${status}') RETURNING *;`;
  //     const res = await client.query(query);
  //     response.rows = res.rows;
  //   } catch (err: any) {
  //     handleError(response, err);
  //   }

  //   return response;
  // }

  async createOffer(body: any, images: any[]) {
    /**
     * Creates an offer
     */
    const response: IParsedResponse = {
      rows: [],
      error: '',
    };
    try {
      const offer = this.getOfferObject(body);
      const azureResponse = await saveImageBatch(images); // Save images first before adding to record
      const parsedImgURL = `{${azureResponse}}`;
      const query = `INSERT INTO ${this.tableName} (
        title, short_description, long_description, price, imgurl, uhash, section_hash, artist, medium, year, dimension, orientation, status)
        VALUES ('${offer.title}', '${offer.short_description}','${
        offer.long_description
      }', '${offer.price}', '${parsedImgURL}', '${v4()}', '${
        offer.section_hash
      }', '${offer.artist}', '${offer.medium}', '${offer.year}', '${
        offer.dimension
      }', '${offer.orientation}', '${offer.status}') RETURNING *;`;
      const res = await client.query(query);
      response.rows = res.rows;
    } catch (err: any) {
      handleError(response, err);
    }

    return response;
  }

  async fetchOffers(section_hash: string) {
    /**
     * Fetch all offers under a particular section
     * @param section_hash - unique hash id for section
     */
    const response: IParsedResponse = {
      rows: [],
      error: '',
    };
    try {
      const query = `SELECT * FROM ${this.tableName} WHERE section_hash = '${section_hash}'`;
      const res = await client.query(query);
      response.rows = parseImgURL(res.rows); // Add image_url_prefix to image names in result
    } catch (err: any) {
      handleError(response, err);
    }

    return response;
  }

  async fetchOffer(offer_hash: string) {
    /**
     * Fecth an offer
     * @param offer_hash - unique hash id for offer
     */
    const response: IParsedResponse = {
      rows: [],
      error: '',
    };
    try {
      const query = `SELECT * FROM ${this.tableName} WHERE uhash = '${offer_hash}'`;
      const res = await client.query(query);
      response.rows = parseImgURL(res.rows);
    } catch (err: any) {
      handleError(response, err);
    }

    return response;
  }

  async getLatestOffers(max_num: number) {
    /**
     * Fetches offers from database but limits result to max_num
     * @param max_num - number of offers to return
     */
    const response: IParsedResponse = {
      rows: [],
      error: '',
    };
    try {
      const query = `SELECT * FROM ${this.tableName} ORDER BY id DESC`;
      const res = await client.query(query);
      response.rows = parseImgURL(res.rows);
      response.rows =
        response.rows.length < max_num
          ? response.rows
          : response.rows.slice(0, max_num);
    } catch (err: any) {
      handleError(response, err);
    }

    return response;
  }

  async deleteOffer(uhash: string) {
    /**
     * Deletes offer marked by unique hash
     * @param uhash - offer's unique hash
     */
    const response: IParsedResponse = {
      rows: [],
      error: '',
    };
    try {
      const query = `DELETE FROM ${this.tableName} WHERE uhash = '${uhash}'`;
      const res = await client.query(query);
      if (res) {
        response.rows = [{message: 'Offer deleted successfully'}];
      }
    } catch (err: any) {
      handleError(response, err);
    }

    return response;
  }

  async updateOffer(body: any) {
    /**
     * Updates an offer
     * @param body - object containing all necessary info needed for update
     */
    const response: IParsedResponse = {
      rows: [],
      error: '',
    };
    try {
      const offer = this.getOfferObject(body);
      const query = `UPDATE ${this.tableName} SET 
      title='${offer.title}', 
      long_description='${offer.long_description}', 
      short_description='${offer.short_description}', 
      price='${offer.price}',
      artist='${offer.artist}',
      medium='${offer.medium}',
      year='${offer.year}',
      dimension='${offer.dimension}',
      orientation='${offer.orientation}',
      status='${offer.status}'
      WHERE uhash = '${body.uhash}' RETURNING *`;
      const res = await client.query(query);
      if (res) {
        response.rows = res.rows;
      }
    } catch (err: any) {
      handleError(response, err);
    }

    return response;
  }

  async updateImages(body: any, images?: any[]) {
    /**
     * Updates images attached to an offer
     * @param body - an object containing the old names of offer's image
     * @param images - list of images to add to offer (optional)
     */
    const response: IParsedResponse = {
      rows: [],
      error: '',
    };
    try {
      let imageNames: string[] = [];
      if (images) {
        //If images then carry out uploading operation
        imageNames = await saveImageBatch(images);
        imageNames.push(...deparseImgURL(body.value)); // Add previous names to the list too
      } else {
        // This holds when an image gets deleted, not during uploads
        // This will delete nameToDelete from pictures in model and update model's pictures with updateWith
        const deleteHandle = await deleteSingleImage(
          deparseImgURL(body.nameToDelete)[0]
        );
        if (deleteHandle) {
          imageNames = deparseImgURL(body.updateWith); // images not given implies there's no need to upload, names have already been provided (in body)
        }
      }
      const query = `UPDATE ${this.tableName} SET 
      imgurl='{${imageNames}}'
      WHERE uhash = '${body.uhash}' RETURNING *`;
      const res = await client.query(query);
      if (res) {
        response.rows = res.rows;
      }
    } catch (err: any) {
      handleError(response, err);
    }

    return response;
  }

  async update(body: any, type: string, images?: any) {
    /**
     * This updates an offer based on type
     * @param body - an object containing required info for image update
     * @param type - possible values 'text' & 'imgurl'
     * @param images - list of image file to be added to file
     */
    let response: IParsedResponse = {
      rows: [],
      error: '',
    };
    if (type === 'text') {
      response = await this.updateOffer(body);
    } else if (type === 'imgurl') {
      if (images.length) {
        // Update image names and upload images
        response = await this.updateImages(body, images);
      } else {
        // simply update image names
        response = await this.updateImages(body);
      }
    } else {
      response.error = 'Input error - undefined update type for offer';
    }

    return response;
  }
}

export default new OffersModel();
