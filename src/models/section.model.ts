import {v4} from 'uuid';
import {client} from '../db';
import {IParsedResponse} from './general.interface';
import {AzureService} from '../services/azure/azure.service';
import {
  saveImage,
  updateSingleImage,
  parseImgURL,
  deleteSingleImage,
  deparseImgURL,
} from '../services/upload/upload-image.service';
import {handleError} from './helpers';

class SectionsModel {
  // tableName is the name of this model's table in the database
  constructor(public tableName: string = 'sections') {}

  async init() {
    /**
     * On initialize, connect to AzureServices and return an object we can use to connect to Azure
     * and also use to handle image upload services
     */
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
    /**
     * Fetches all sections from the database
     */
    const response: IParsedResponse = {
      rows: [],
      error: '',
    };
    try {
      const query = `SELECT * FROM ${this.tableName}`;
      const res = await client.query(query);
      response.rows = parseImgURL(res.rows, true); // Add image_url_prefix to images name in result
    } catch (err: any) {
      handleError(response, err);
    }

    return response;
  }

  async addSection(title: string, image: any) {
    /**
     * Add a section to the database
     * @param title - title of section
     * @param image - an image file
     */
    const response: IParsedResponse = {
      rows: [],
      error: '',
    };
    try {
      const azureResponse = await saveImage(image); // Save image to Azure Storage before saving record to database
      const query = `INSERT INTO ${
        this.tableName
      } (title, imgurl, uhash) VALUES ( '${title}', '${azureResponse}', '${v4()}') RETURNING *`;
      const res = await client.query(query);
      response.rows = res.rows;
    } catch (err: any) {
      handleError(response, err);
    }

    return response;
  }

  async updateTitle(uhash: string, title: string) {
    /**
     * Updates the title of a section
     * @param uhash - unique hash id for the section
     * @param title - the new value for the section's title
     */
    const response: IParsedResponse = {
      rows: [],
      error: '',
    };
    try {
      const query = `UPDATE ${this.tableName} SET title = '${title}' WHERE uhash = '${uhash}' RETURNING *`;
      const res = await client.query(query);
      response.rows = res.rows;
    } catch (err: any) {
      handleError(response, err);
    }

    return response;
  }

  async updateImgurl(body: any, image: any) {
    /**
     * Updates a section's image url
     * @param body - the section object
     * @param image - the image file
     */
    const response: IParsedResponse = {
      rows: [],
      error: '',
    };
    try {
      // Delete previous image before updating record
      const deleteHandle = await deleteSingleImage(
        deparseImgURL([body.value])[0] // The first item is the image name, since it's a single image
      );
      if (deleteHandle) {
        // If deletion was successful, then procedd
        const azureResponse = await updateSingleImage(image); // Upload image before adding to record
        const query = `UPDATE ${this.tableName} SET imgurl = '${azureResponse}' WHERE uhash = '${body.uhash}' RETURNING *`;
        const res = await client.query(query);
        response.rows = res.rows;
      }
    } catch (err: any) {
      handleError(response, err);
    }

    return response;
  }

  async update(body: any, file?: any) {
    /**
     * Updates a section
     * @param body - the section object with an extra attribute, type, that determines the type of update operation
     * @param file - the image file (optional)
     */
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
    /**
     * Deletes a section
     * @param uhash - unique hash id for section
     */
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
      handleError(response, err);
    }

    return response;
  }
}

const SectionModel = new SectionsModel();

export {SectionModel};
