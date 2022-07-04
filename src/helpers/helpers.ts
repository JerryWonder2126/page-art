import {IParsedResponse} from './general.interface';

export function handleError(response: IParsedResponse, err: any) {
  /**
   * Modifies error property on response object
   */
  //   if ('stack' in err) {
  //     response.error = err.stack;
  //   } else {
  //     response.error = JSON.stringify(err);
  //   }
  response.error = err.stack;
}
