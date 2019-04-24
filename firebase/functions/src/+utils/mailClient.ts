const sgMail = require('@sendgrid/mail');
import { getConfig } from './config';

sgMail.setApiKey(getConfig().sendgrid.secretkey);

export function getMailClient() {
  return sgMail;
}
