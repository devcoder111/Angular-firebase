import * as twilio from 'twilio';
import { getConfig } from './config';

const accountSid = getConfig().twilio.sid;
const authToken = getConfig().twilio.token;

// @ts-ignore
const client = new twilio(accountSid, authToken); // tslint:disable-line

export function getTwilioClient() {
  return client;
}
