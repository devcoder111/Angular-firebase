import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as functions from 'firebase-functions';
import { unescape } from 'querystring';
import { cron1minRouter } from './onRequest/cron1minRouter';
import { orderPublicPagePDFRouter } from './onRequest/orderPublicPagePDFRouter';
import { orderPublicPageRouter } from './onRequest/orderPublicPageRouter';
import { hoiioWebhooks } from './onRequest/webhooks/hoiio.webhooks';
import { sendgridWebhooks } from './onRequest/webhooks/sendgrid.webhooks';
import { twilioWebhooks } from './onRequest/webhooks/twilio.webhooks';

const app = express();

const appRouter = express.Router();
appRouter.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
appRouter.use('/public-orders', orderPublicPageRouter);
appRouter.use('/public-orders-pdf', orderPublicPagePDFRouter);
appRouter.use('/cron-1-min', cron1minRouter);
appRouter.use('/hoiio-webhooks', hoiioWebhooks);
appRouter.use('/sendgrid-webhooks', sendgridWebhooks);
appRouter.use('/twilio-webhooks', twilioWebhooks);

app.use((req: express.Request, res: express.Response, next: Function) => {
  console.log(`httpsOnRequest - ${req.method} ${unescape(req.originalUrl)}`);
  next();
});
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/api', appRouter);
app.use('*', (req, res) => res.status(404).send('Sorry... Nothing here'));

exports = module.exports = functions.https.onRequest(app);
