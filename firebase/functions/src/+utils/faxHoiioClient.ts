import { getConfig } from './config';

export const hoiio = {
  app_id: getConfig().hoiio.appid,
  access_token: getConfig().hoiio.accesstoken,
};
