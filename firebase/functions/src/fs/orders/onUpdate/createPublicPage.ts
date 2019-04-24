import { Organization } from '@shared/types/organization.interface';
import { Change } from 'firebase-functions';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import * as handlebars from 'handlebars';
import * as pdf from 'html-pdf';
import { getConfig, getFrontendURL } from '../../../+utils/config';
import { createId } from '../../../+utils/createId';
import { getFirestore } from '../../../+utils/firestore';
import { getStorageBucket } from '../../../+utils/storageBucket';
import { localizedDateStr } from '../../../+utils/timezones';
import { convertMoneyModelToView } from '../../../../../../shared/helpers/convertMoney/convertMoney.helper';
import { BaseSupplier } from '../../../../../../shared/types/baseSupplier.interface';
import {
  NotificationQueueOrderToSupplierEmailItem,
  NotificationQueueOrderToSupplierFaxItem,
  NotificationQueueOrderToSupplierSmsItem,
} from '../../../../../../shared/types/notificationQueueItem.interface';
import { Order } from '../../../../../../shared/types/order.interface';
import { OrderProduct } from '../../../../../../shared/types/orderProduct.interface';
import { CollectionNames } from '../../../../../../shared/values/collectionNames.map';
import { OrderStatuses } from '../../../../../../shared/values/orderStatuses.array';
import {
  getStoragePathToOrderPublicPage,
  getStoragePathToOrderPublicPdf,
} from '../../../../../../shared/values/storagePaths.map';

const firestore = getFirestore();
const bucket = getStorageBucket();

export const getOrderPublicPageURL = (fileId: string): string => {
  return `${getFrontendURL()}/api/public-orders/${fileId}`;
};

export const getOrderPublicPDFURL = (fileId: string): string => {
  return `${getFrontendURL()}/api/public-orders-pdf/${fileId}`;
};

/**
 * Generates HTML, uploads it to Storage, generates publicURL, saves it to Order, returns publicURL
 * @param {Change<DocumentSnapshot>} change
 * @returns {Promise<string>} publicURL
 */
export async function createOrderPublicPageOnUpdate(change: Change<DocumentSnapshot>): Promise<string> {
  const before: Order = change.before.data() as any;
  const after: Order = change.after.data() as any;
  const orderId = change.after.id;
  const order = { id: orderId, ...after } as Order;
  try {
    const statusIsntNotSent = order.status !== OrderStatuses.notSent.slug;
    const htmlFileIdAlreadyExists = order.publicPage.html.fileId;
    const pdfFileIdAlreadyExists = order.publicPage.pdf.fileId;
    if (statusIsntNotSent || htmlFileIdAlreadyExists || pdfFileIdAlreadyExists) {
      return null;
    }
    return await createOrderPublicPage(orderId, order);
  } catch (error) {
    console.error('createOrderPublicPageOnUpdate', { orderId, before, after }, error);
    throw new Error(error);
  }
}

export async function createOrderPublicPage(orderId: string, order: Order): Promise<string | null> {
  if (order.status !== OrderStatuses.notSent.slug) {
    return null;
  }
  console.log('createOrderPublicPage - Working on order:', { order });
  const fileHTMLId = order.publicPage.html.fileId || createId();
  const [orderProducts, supplier] = await Promise.all([getOrderProducts(orderId), getSupplierById(order.supplierId)]);

  let html = await getPublicOrderHTML(order, orderProducts, supplier, null);
  console.log('createOrderPublicPage - HTML generated', { orderId });

  const filePDFId = order.publicPage.pdf.fileId || createId();
  const pdfPath = await uploadPublicPagePdf(html, filePDFId, order, orderId);
  console.log('createOrderPublicPage - PDF uploaded to Storage', { orderId, pdfPath });
  const publicPDFURL = await getOrderPublicPDFURL(filePDFId);

  await savePublicPagePDFInfo(orderId, filePDFId, publicPDFURL);
  await addNotificationToQueue({ id: orderId, ...order } as Order, publicPDFURL);

  html = await getPublicOrderHTML(order, orderProducts, supplier, publicPDFURL);

  const filePath = await uploadPublicPageTemplate(html, fileHTMLId, order, orderId);
  console.log('createOrderPublicPage - HTML uploaded to Storage', { orderId, filePath });

  const publicURL = await getOrderPublicPageURL(fileHTMLId);
  await savePublicPageHTMLInfo(orderId, fileHTMLId, publicURL);

  await addNotificationToQueue({ id: orderId, ...order } as Order, publicURL);

  console.log('createOrderPublicPage - Completed. Order populated with publicURL:', {
    orderId,
    publicURL,
    publicPDFURL,
  });

  return publicURL;
}

export async function getSupplierById(supplierId: string): Promise<BaseSupplier> {
  try {
    const orderSupplierSnapshot = await firestore.doc(`${CollectionNames.suppliers}/${supplierId}`).get();
    return orderSupplierSnapshot.data() as BaseSupplier;
  } catch (error) {
    console.error('getSupplierById', { supplierId }, error);
    throw new Error(error);
  }
}

export async function getOrderProducts(orderId: string): Promise<OrderProduct[]> {
  try {
    const orderProductsSnapshot = await firestore
      .collection(`${CollectionNames.orderProducts}`)
      .where('orderId', '==', orderId)
      .where('isDeleted', '==', false)
      .get();
    return orderProductsSnapshot.docs.map(doc => doc.data()) as OrderProduct[];
  } catch (error) {
    console.error('getOrderProducts', { orderId }, error);
    throw new Error(error);
  }
}

export async function getPublicOrderHTML(
  order: Order,
  orderProducts: OrderProduct[],
  supplier: BaseSupplier,
  pdfDownloadLink: string,
): Promise<string> {
  let title;
  if (order.status === OrderStatuses.voided.slug) {
    title = 'VOIDED';
  }
  try {
    const orderProductViewModels = orderProducts.map(op => ({
      ...op,
      price: convertMoneyModelToView(op.price),
      total: convertMoneyModelToView(op.total),
    }));
    const orderViewModel = {
      ...order,
      total: convertMoneyModelToView(order.total),
      subtotal: convertMoneyModelToView(order.subtotal),
      taxes: convertMoneyModelToView(order.taxes),
    };

    const supplierViewModel = supplier;

    const locationSnapshot = await firestore.doc(`${CollectionNames.locations}/${order.locationId}`).get();
    if (!locationSnapshot.exists) {
      const message = `getPublicOrderHTML - No location with id "${order.locationId}"`;
      console.error(message, { order });
      throw new Error(message);
    }
    const address = locationSnapshot.data().address;

    const organization: Organization = (await firestore
      .doc(`${CollectionNames.organizations}/${order.organizationId}`)
      .get()).data() as any;
    const deliveryDateLocalized = localizedDateStr(order.deliveryDate, organization.timezone);

    // TODO: move this template to database
    const source = `
<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <title>Order  No. {{order.number}}</title>
    </head>
    <body bgcolor="#f5f5f5">
        <center>
            <table  style="
                    max-width: 600px; 
                    width: 100%; 
                    font-family: Arial, Helvetica, sans-serif; 
                    color: #65676c; 
                    padding: 32px;
                    background-color: #ffffff;
                    border: 1px solid #e6e6e6;">
                <thead style="font-size: 13px;">
                    <tr>
                        <td>
                            <h1 style="font-size: 20px;">
                              Order No. {{order.number}}
                              {{#if title}}
                                <strong style="color: red">{{title}}</strong>
                              {{/if}}
                            </h1>
                        </td>
                    </tr>
                </thead>
                <tbody style="font-size: 13px;">
                    <tr>
                        <td>
                            <h3 style="font-size: 14px;">Supplier</h3>
                            <p style="margin-bottom: 32px;">{{order.supplierName}}</p>
                            <h3 style="font-size: 14px;">Delivery Date</h3>
                            <p style="margin-bottom: 32px;">{{deliveryDateLocalized}}</p>
                            <h3 style="font-size: 14px;">Other Instructions</h3>
                            <p style="margin-bottom: 32px;">{{order.otherInstructions}}</p>
                            <h3 style="font-size: 14px;">Delivery Address</h3>
                            <p style="margin-bottom: 32px;">{{address}}</p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <table  border="0" 
                                    cellpadding="0"
                                    cellspacing="0"
                                    style="width: 100%;">
                                <thead style="color: #333333;">
                                    <tr>
                                        <td style="border-top: 1px solid #a9a9a9; padding: 16px">
                                            <b>Name</b>
                                        </td>
                                        {{#if supplier.shouldDisplayPriceInOrder}}
                                          <td style="border-top: 1px solid #a9a9a9; padding: 16px">
                                              <b>Price</b>
                                          </td>
                                        {{/if}}
                                        <td style="border-top: 1px solid #a9a9a9; padding: 16px">
                                            <b>Quantity</b>
                                        </td>
                                        {{#if supplier.shouldDisplayPriceInOrder}}
                                          <td style="border-top: 1px solid #a9a9a9; padding: 16px">
                                              <b>Total</b>
                                          </td>
                                        {{/if}}
                                    </tr>
                                </thead>
                                <tbody>
                                  {{#each orderProducts}}
                                    <tr bgcolor="#f4f3f4">
                                        <td style="border-top: 1px solid #e6e6e6; padding: 16px">
                                            {{name}}
                                        </td>
                                        {{#if ../supplier.shouldDisplayPriceInOrder}}
                                        <td style="border-top: 1px solid #e6e6e6; padding: 16px">
                                          \${{price}}
                                        </td>
                                        {{/if}}
                                        <td style="border-top: 1px solid #e6e6e6; padding: 16px">
                                            {{quantity}}
                                        </td>
                                        {{#if ../supplier.shouldDisplayPriceInOrder}}
                                        <td style="border-top: 1px solid #e6e6e6; padding: 16px">
                                          \${{total}}
                                        </td>
                                        {{/if}}
                                    </tr>
                                  {{/each}}
                                  {{#if supplier.shouldDisplayPriceInOrder}}
                                    {{#if order.supplierIsGSTRegistered}}
                                       <tr bgcolor="#f4f3f4" >
                                            <td colspan="4" align="right" style="border-top: 1px solid #a9a9a9; border-bottom: 1px solid #a9a9a9; padding: 16px">
                                              <span>  
                                                <b>Subtotal: \${{order.subtotal}}</b>
                                              </span>
                                            </td>
                                        </tr>
                                         <tr bgcolor="#f4f3f4" >
                                            <td colspan="4" align="right" style="border-top: 1px solid #a9a9a9; border-bottom: 1px solid #a9a9a9; padding: 16px">
                                              <span>  
                                                <b>Add tax: \${{order.taxes}}</b>
                                              </span>
                                            </td>
                                        </tr> 
                                      {{/if}}
                                    <tr bgcolor="#f4f3f4" >
                                        <td colspan="4" align="right" style="border-top: 1px solid #a9a9a9; border-bottom: 1px solid #a9a9a9; padding: 16px">
                                          <span>  
                                            <b>Total: \${{order.total}}</b>
                                          </span>
                                        </td>
                                    </tr>
                                  {{/if}}
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    {{#if pdfDownloadLink}}
                    <tr>
                      <td>
                       <a href="{{pdfDownloadLink}}" download> Download PDF version </a>
                      </td> 
                     </tr>
                    {{/if}}
                </tbody>
            </table>
        </center>
    </body>
</html>`;
    return handlebars.compile(source)({
      order: orderViewModel,
      supplier: supplierViewModel,
      deliveryDateLocalized,
      orderProducts: orderProductViewModels,
      title,
      address,
      pdfDownloadLink,
    });
  } catch (error) {
    console.error('getPublicOrderHTML', { order, orderProducts }, error);
    throw new Error(error);
  }
}

export async function uploadPublicPageTemplate(
  html: string,
  fileId: string,
  order: Order,
  orderId: string,
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const filePath = getStoragePathToOrderPublicPage(fileId, { id: orderId, ...order } as Order);
    const file = bucket.file(filePath);
    const buff = Buffer.from(html);

    const stream = file.createWriteStream({
      resumable: false, // When uploading files less than 10MB, it is recommended that the resumable feature is disabled
      metadata: { contentType: 'text/html; charset=utf-8' },
    });
    stream.on('error', error => {
      console.error('uploadPublicPageTemplate', { fileId }, error);
      reject(error);
    });
    stream.on('finish', () => {
      resolve(filePath);
    });
    stream.end(Buffer.from(buff));
  });
}

export async function uploadPublicPagePdf(
  html: string,
  fileId: string,
  order: Order,
  orderId: string,
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const filePath = getStoragePathToOrderPublicPdf(fileId, { id: orderId, ...order } as Order);
    const file = bucket.file(filePath);
    pdf.create(html).toBuffer(function(err, buffer) {
      if (err) {
        console.error('uploadPublicPagePdf - generate PDF from HTML failed', { fileId }, err);
      }
      const stream = file.createWriteStream({
        resumable: false, // When uploading files less than 10MB, it is recommended that the resumable feature is disabled
        metadata: { contentType: 'application/pdf; charset=utf-8' },
      });
      stream.on('error', error => {
        console.error('uploadPublicPagePdf - upload PDF failed', { fileId }, error);
        reject(error);
      });
      stream.on('finish', () => {
        console.log('uploadPublicPagePdf - completed', { fileId });
        resolve(filePath);
      });
      stream.end(Buffer.from(buffer));
    });
  });
}

async function savePublicPageHTMLInfo(orderId: string, fileId: string, publicURL: string): Promise<void> {
  try {
    await firestore
      .collection(`${CollectionNames.orders}`)
      .doc(orderId)
      .update({
        'publicPage.html.fileId': fileId,
        'publicPage.html.url': publicURL,
      });
  } catch (error) {
    console.error('savePublicPageHTMLInfo', { orderId, publicURL }, error);
    throw new Error(error);
  }
}

async function savePublicPagePDFInfo(orderId: string, fileId: string, publicURL: string): Promise<void> {
  try {
    await firestore
      .collection(`${CollectionNames.orders}`)
      .doc(orderId)
      .update({
        'publicPage.pdf.fileId': fileId,
        'publicPage.pdf.url': publicURL,
      });
  } catch (error) {
    console.error('savePublicPagePDFInfo', { orderId, publicURL }, error);
    throw new Error(error);
  }
}

async function addNotificationToQueue(order: Order, publicURL: string): Promise<void> {
  const orderMethods = await getSupplierOrderMethods(order);
  if (Object.keys(orderMethods).length === 0) {
    console.log("addNotificationToQueue - supplier doesn't have any order methods. Skipping this step", {
      order,
      publicURL,
    });
    return null;
  }

  if (orderMethods.email && orderMethods.email.value) {
    const notificationId = createId();
    const NotificationEmailItem: NotificationQueueOrderToSupplierEmailItem = {
      type: 'email',
      sourceType: 'orderToSupplier',
      timestamp: new Date(),
      processingStartedAt: null,
      processingEndedAt: null,
      error: null,
      body: {
        customArgs: {
          notificationId,
        },
        to: orderMethods.email.value,
        from: 'noreply@foodrazor.com',
        subject: 'New order',
        html: `<h1>Open the link to see the order: <a href="${publicURL}">Link</a></h1>`,
      },
      status: 'notSent',
      meta: {
        orderId: order.id,
        orderNumber: order.number || null,
        supplierId: order.supplierId,
        supplierName: order.supplierName || null,
        doesTriggerStatusChange: true,
        attemptsAmount: 0,
        lastAttemptAt: null,
      },
    };

    try {
      await firestore.doc(`${CollectionNames.notificationsQueue}/${notificationId}`).set(NotificationEmailItem);
      console.log('addNotificationToQueue - Email created', { order, publicURL });
    } catch (error) {
      console.error('addNotificationToQueue', { order, publicURL }, error);
      throw new Error(error);
    }
  }

  if (orderMethods.sms && orderMethods.sms.value) {
    const NotificationSmsItem: NotificationQueueOrderToSupplierSmsItem = {
      type: 'sms',
      sourceType: 'orderToSupplier',
      timestamp: new Date(),
      processingStartedAt: null,
      processingEndedAt: null,
      error: null,
      body: {
        to: orderMethods.sms.value,
        from: getConfig().twilio.from,
        body: `Open the link to see the New Order: ${publicURL}`,
      },
      status: 'notSent',
      meta: {
        orderId: order.id,
        orderNumber: order.number || null,
        supplierId: order.supplierId,
        supplierName: order.supplierName || null,
        doesTriggerStatusChange: true,
        attemptsAmount: 0,
        lastAttemptAt: null,
      },
    };
    try {
      await firestore.collection(`${CollectionNames.notificationsQueue}`).add(NotificationSmsItem);
      console.log('addNotificationToQueue - Sms created', { order, publicURL });
    } catch (error) {
      console.error('addNotificationToQueue', { order, publicURL }, error);
      throw new Error(error);
    }
  }

  if (orderMethods.fax && orderMethods.fax.value) {
    const NotificationFaxItem: NotificationQueueOrderToSupplierFaxItem = {
      type: 'fax',
      sourceType: 'orderToSupplier',
      timestamp: new Date(),
      processingStartedAt: null,
      processingEndedAt: null,
      error: null,
      body: {
        file: 'organizations/BMWOrg/locations/PRA/users/00000001/orders/ORDER1/pdfs/FILE1',
        dest: '+6564916415', //orderMethods.fax.value
      },
      status: 'notSent',
      meta: {
        orderId: order.id,
        orderNumber: order.number || null,
        supplierId: order.supplierId,
        supplierName: order.supplierName || null,
        doesTriggerStatusChange: true,
        attemptsAmount: 0,
        lastAttemptAt: null,
      },
    };
    try {
      await firestore.collection(`${CollectionNames.notificationsQueue}`).add(NotificationFaxItem);
      console.log('addNotificationToQueue - Fax created', { order, publicURL });
    } catch (error) {
      console.error('addNotificationToQueue', { order, publicURL }, error);
      throw new Error(error);
    }
  }
}

export async function getSupplierOrderMethods(
  order: Order,
): Promise<{ [orderMethodType: string]: { sortingNumber: number; value: string } }> {
  try {
    const snapshot = await firestore.doc(`${CollectionNames.suppliers + '/' + order.supplierId}`).get();
    return snapshot.data().orderMethods || null;
  } catch (error) {
    console.error('getSupplierOrderMethods', { order, error });
    throw new Error(error);
  }
}
