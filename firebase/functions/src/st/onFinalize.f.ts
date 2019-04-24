import * as functions from 'firebase-functions';
import { ObjectMetadata } from 'firebase-functions/lib/providers/storage';
import { createInvoiceFromImage } from './invoices/createInvoiceFromJPGorPNG';
import { parseInvoicePDFtoJPGs } from './invoices/parseInvoicePDFtoJPGs';
import { handleOrderPublicPageHTML } from './order/handleOrderPublicPageHTML';
import { handleOrderPublicPagePDF } from './order/handleOrderPublicPagePDF';

exports = module.exports = functions.storage.object().onFinalize(async (object: ObjectMetadata) => {
  try {
    const storageFile: StorageFile = {
      path: object.name,
      mimeType: object.contentType,
      size: Number(object.size),
      createdAt: new Date(Date.parse(object.timeCreated)),
      md5: object.md5Hash,
      metadata: object.metadata as any,
    };
    console.log('stOnFinalize - Working on:', { path: storageFile.path });
    await Promise.all([
      createInvoiceFromImage(storageFile),
      parseInvoicePDFtoJPGs(storageFile),
      handleOrderPublicPageHTML(storageFile),
      handleOrderPublicPagePDF(storageFile),
    ]);
  } catch (error) {
    console.error('stOnFinalize', error);
  }
});

export interface StorageFile {
  /**
   * Path to file on Cloud storage
   */
  path: string;
  /**
   * Mime-type, like "image/png"
   */
  mimeType: string;
  /**
   * Bytes amount
   */
  size: number;
  createdAt: Date;
  md5: string;
  metadata: {
    firebaseStorageDownloadTokens: string;
  };
}
