import {AzureService} from '../azure/azure.service';

export async function saveImage(image: any): Promise<string> {
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

const storageAccountName = 'culdevtest';
const containerName = 'images';

const IMG_URL_PREFIX = `https://${storageAccountName}.blob.core.windows.net/${containerName}/`;

export function parseImgURL(results: any[], singleImage = false) {
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
  return results.map((val: any) => val.replace(IMG_URL_PREFIX, ''));
}
