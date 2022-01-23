import {ISocialInterface} from './social.interface';
// import got from 'got';

export function whatsapp(form: any) {
  const response: ISocialInterface = {ok: false};
  try {
    const ownersNumber = process.env.WHATSAPP_NUMBER;
    if (!ownersNumber) {
      throw new Error('System error! Cannot send message to telegram');
    }
    const message = `Hello, SinaArtz! ${form.message}. Thank you.`;
    const url = `https://wa.me/${ownersNumber}?text=${message}`;
    response.ok = true;
    response.message = url;
  } catch (err: any) {
    response.error = err;
  }
  return response;
}

export async function telegram(form: any) {
  const response: ISocialInterface = {ok: false};
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (token) {
      throw new Error('System error! Cannot send message to telegram');
    }
    const message = `<b>Hello, SinaArtz!</b>\n\n${form.message}.\n\n<b>You can reach me through ${form.email}. Thank you.</b>`;
    const data = {
      chat_id: '1249927233',
      text: message,
      parse_mode: 'html',
    };
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const postResponse = await handleRequest(url, data);
    response.ok = true;
    // response.message = postResponse;
  } catch (err: any) {
    response.error = JSON.stringify(err);
  }
  return response;
}

async function handleRequest(url: string, body: any) {
  try {
    // const telegramResponse = await got.post(url, {json: body});
    // return telegramResponse.body;
  } catch (error: any) {
    throw new Error(error.response.body);
  }
}
