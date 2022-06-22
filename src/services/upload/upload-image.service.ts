import {AzureService} from '../azure/azure.service';

export async function saveImage(image: any): Promise<string> {
  /**
   * Saves a single image to AzureBlob Storage
   * @param image - image file
   * @returns - image name
   */
  try {
    const azureHook = await init();
    const azureResponse = await azureHook.uploadToBlob(image);
    return azureResponse.name as string;
    // return image.name;
  } catch (err) {
    throw new Error(
      JSON.stringify({
        stack: `Image could not be uploaded, please try again.\n${err}`,
      })
    );
  }
}

export async function saveImageBatch(images: any[]): Promise<string[]> {
  /**
   * Stores a list of images to database
   * @param images - a list of image files
   * @returns the names of the images in a list
   */
  try {
    const imagesPromise: Promise<string>[] = [];
    Object.keys(images).forEach((value, index) =>
      imagesPromise.push(saveImage(images[index]))
    );
    return await Promise.all(imagesPromise);
    // return images.map(image => image.name);
  } catch (err) {
    throw new Error(
      JSON.stringify({
        stack: `Images could not be uploaded, please try again.\n${err}`,
      })
    );
  }
}

export async function updateSingleImage(image: any) {
  /**
   * Updates a single image, it simply saves a new image to AzureBlobStorage
   * @param image - image file
   * @returns name of the image
   */
  try {
    return saveImage(image);
  } catch (err) {
    throw new Error(
      JSON.stringify({
        stack: `Images could not be updated, please try again.\n${err}`,
      })
    );
  }
}

export async function deleteSingleImage(fileName: string) {
  /**
   * This deletes an image from AzureBlob Storage account
   * @returns {boolean}
   */
  try {
    const azureHook = await init();
    await azureHook.deleteImageFromBlob(fileName);
    return true;
  } catch (err) {
    throw new Error(
      JSON.stringify({
        stack: `Image could not be deleted, please try again.\n${err}`,
      })
    );
  }
}

async function init() {
  /**
   * This establishes a connection to AzureBlob Storage account for this project
   * @returns an object for connection to azure
   */
  try {
    return await new AzureService(containerName, storageAccountName);
  } catch (err) {
    throw new Error(
      JSON.stringify({
        stack: "Couldn't connect to Azure Server, please try again.",
      })
    );
  }
}

const storageAccountName = 'artwebstorage';
const containerName = 'images';

export function parseImgURL(results: any[], singleImage = false) {
  /**
   * This adds image_url_prefix to the names of images in a response from the database
   * @param results - result from query from database
   * @param singleImage - true when rows in result contains single images, else, false
   * @returns result with updated image names
   */
  const IMG_URL_PREFIX = `https://${process.env.STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${process.env.CONTAINER_NAME}/`;
  return results.map((val: any) => {
    if (singleImage) {
      val.imgurl = IMG_URL_PREFIX + val.imgurl;
    } else {
      val.imgurl = val.imgurl.map((value: string) => {
        return IMG_URL_PREFIX + value;
      });
    }
    return val;
  });
}

export function deparseImgURL(results: string[]): string[] {
  /**
   * This removes 'image_url_prefix' from the names of images in a response from the database
   * @param results - result from query from database
   * @returns result with updated image names
   */
  const IMG_URL_PREFIX = `https://${process.env.STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${process.env.CONTAINER_NAME}/`;
  return results.map((val: any) => val.replace(IMG_URL_PREFIX, ''));
}
