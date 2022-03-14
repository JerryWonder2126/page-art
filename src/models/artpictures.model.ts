import {v4} from 'uuid';
import {client} from '../db';
import {IParsedResponse} from './general.interface';
import {AzureService} from '../services/azure/azure.service';
import {
  saveImage,
  saveImageBatch,
  updateSingleImage,
  parseImgURL,
  deleteSingleImage,
  deparseImgURL,
} from '../services/upload/upload-image.service';

class SectionsModel {
  constructor(public tableName: string = 'sections') {}

  async init() {
    try {
      return await new AzureService('images', 'culdevtest');
    } catch (err) {
      throw new Error(
        JSON.stringify({
          stack: "Couldn't connect to Azure Server, please try again.",
        })
      );
    }
  }

  async fetchSections() {
    const response: IParsedResponse = {
      rows: [],
      error: '',
    };
    try {
      const query = `SELECT * FROM ${this.tableName}`;
      const res = await client.query(query);
      response.rows = parseImgURL(res.rows, true);
    } catch (err: any) {
      response.error = err.stack;
    }

    return response;
  }

  async addSection(title: string, image: any) {
    const response: IParsedResponse = {
      rows: [],
      error: '',
    };
    try {
      const azureResponse = await saveImage(image);
      const query = `INSERT INTO ${
        this.tableName
      } (title, imgurl, uhash) VALUES ( '${title}', '${azureResponse}', '${v4()}') RETURNING *`;
      const res = await client.query(query);
      response.rows = res.rows;
    } catch (err: any) {
      response.error = err.stack;
    }

    return response;
  }

  async updateTitle(uhash: string, title: string) {
    const response: IParsedResponse = {
      rows: [],
      error: '',
    };
    try {
      const query = `UPDATE ${this.tableName} SET title = '${title}' WHERE uhash = '${uhash}' RETURNING *`;
      const res = await client.query(query);
      response.rows = res.rows;
    } catch (err: any) {
      response.error = err.stack;
    }

    return response;
  }

  async updateImgurl(body: any, image: any) {
    const response: IParsedResponse = {
      rows: [],
      error: '',
    };
    try {
      const deleteHandle = await deleteSingleImage(
        deparseImgURL([body.value])[0]
      );
      if (deleteHandle) {
        const azureResponse = await updateSingleImage(image);
        const query = `UPDATE ${this.tableName} SET imgurl = '${azureResponse}' WHERE uhash = '${body.uhash}' RETURNING *`;
        const res = await client.query(query);
        response.rows = res.rows;
      }
    } catch (err: any) {
      response.error = err.stack;
    }

    return response;
  }

  async update(body: any, file?: any) {
    let response: IParsedResponse = {
      rows: [],
      error: '',
    };
    if (body.type === 'title') {
      response = await this.updateTitle(body.uhash, body.value);
    } else if (body.type === 'imgurl') {
      response = await this.updateImgurl(body, file);
    } else {
      response.error = 'Input error - undefined update type for section';
    }

    return response;
  }

  async deleteSection(uhash: string) {
    const response: IParsedResponse = {
      rows: [],
      error: '',
    };
    try {
      const query = `DELETE FROM ${this.tableName} WHERE uhash = '${uhash}'`;
      const res = await client.query(query);
      if (res) {
        response.rows = [{message: 'Section deleted successfully'}];
      }
    } catch (err: any) {
      response.error = err.stack;
    }

    return response;
  }
}

class OffersModel {
  IMG_URL_PREFIX: any;
  constructor(public tableName: string = 'offers') {}

  async createOffer(
    title: string,
    short_description: string,
    long_description: string,
    price: string,
    images: any[],
    section_hash: string,
    artist: string,
    medium: string,
    year: number,
    dimension: string,
    orientation: string
  ) {
    const response: IParsedResponse = {
      rows: [],
      error: '',
    };
    try {
      const azureResponse = await saveImageBatch(images);
      const parsedImgURL = `{${azureResponse}}`;
      const query = `INSERT INTO ${this.tableName} (
        title, short_description, long_description, price, imgurl, uhash, section_hash, artist, medium, year, dimension, orientation)
        VALUES ('${title}', '${short_description}','${long_description}', '${price}', '${parsedImgURL}', '${v4()}', '${section_hash}', '${artist}', '${medium}', '${year}', '${dimension}', '${orientation}') RETURNING *;`;
      const res = await client.query(query);
      response.rows = res.rows;
    } catch (err: any) {
      response.error = err.stack;
    }

    return response;
  }

  async fetchOffers(section_hash: string) {
    const response: IParsedResponse = {
      rows: [],
      error: '',
    };
    try {
      const query = `SELECT * FROM ${this.tableName} WHERE section_hash = '${section_hash}'`;
      const res = await client.query(query);
      response.rows = parseImgURL(res.rows);
    } catch (err: any) {
      if ('stack' in err) {
        response.error = err.stack;
      } else {
        response.error = JSON.stringify(err);
      }
      response.error = err.stack;
    }

    return response;
  }

  async fetchOffer(offer_hash: string) {
    const response: IParsedResponse = {
      rows: [],
      error: '',
    };
    try {
      const query = `SELECT * FROM ${this.tableName} WHERE uhash = '${offer_hash}'`;
      const res = await client.query(query);
      response.rows = parseImgURL(res.rows, true);
    } catch (err: any) {
      if ('stack' in err) {
        response.error = err.stack;
      } else {
        response.error = JSON.stringify(err);
      }
      response.error = err.stack;
    }

    return response;
  }

  async deleteOffer(uhash: string) {
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
      response.error = err.stack;
    }

    return response;
  }

  async updateOffer(body: any) {
    const response: IParsedResponse = {
      rows: [],
      error: '',
    };
    try {
      const query = `UPDATE ${this.tableName} SET 
      title='${body.title}', 
      long_description='${body.long_description}', 
      short_description='${body.short_description}', 
      price='${body.price}',
      artist='${body.artist}',
      medium='${body.medium}',
      year='${body.year}',
      dimension='${body.dimension}',
      orientation='${body.orientation}'
      WHERE uhash = '${body.uhash}' RETURNING *`;
      const res = await client.query(query);
      if (res) {
        response.rows = res.rows;
      }
    } catch (err: any) {
      response.error = err.stack;
    }

    return response;
  }

  async updateImages(body: any, images?: any[]) {
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
        // This will delete nameToDelete from pictures in model and update model's pictures with updateWith
        const deleteHandle = await deleteSingleImage(
          deparseImgURL(body.nameToDelete)[0]
        );
        if (deleteHandle) {
          // This holds when an image gets deleted, not during uploads
          imageNames = deparseImgURL(body.updateWith); // images not given implies there's no need to upload, names have already been provided
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
      response.error = err.stack;
    }

    return response;
  }

  async update(body: any, type: string, images?: any) {
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

const SectionModel = new SectionsModel();
const OfferModel = new OffersModel();

export {SectionModel, OfferModel};
