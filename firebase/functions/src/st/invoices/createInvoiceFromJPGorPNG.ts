import * as XRegExp from 'xregexp';
import { getConfig } from '../../+utils/config';
import { getFirestore } from '../../+utils/firestore';
import { InvoiceImageFile, InvoicePDFFile } from '../../../../../shared/types/file.interface';
import { Invoice } from '../../../../../shared/types/invoice.interface';
import { CollectionNames } from '../../../../../shared/values/collectionNames.map';
import { InvoiceStatuses } from '../../../../../shared/values/invoiceStatuses.array';
import { getStorageDownloadURL } from '../../../../../shared/values/storagePaths.map';
import { StorageFile } from '../onFinalize.f';

const firestore = getFirestore();
const bucketName = getConfig().storageBucketWithoutGSprefix;

/**
 * Regex for string like "organizations/ORG_ID/locations/LOC_ID/users/USER_ID/invoices/INVOICE_ID/images/FILE_ID"
 */
const regexString = `
organizations\/(?<organizationId>\\w+)\/    # organizations/ORG_ID/
locations\/(?<locationId>\\w+)\/            # locations/LOC_ID/
users\/(?<userId>\\w+)\/                    # users/USER_ID/
invoices\/(?<invoiceId>\\w+)/               # invoices/INVOICE_ID
images\/(?<fileId>\\w+)$                  # images/FILE_ID`;
const regex = XRegExp(regexString, 'x'); // x = free-spacing, newlines and line comments

export async function createInvoiceFromImage(storageFile: StorageFile): Promise<void> {
  try {
    const variables = XRegExp.exec(storageFile.path, regex);
    if (!variables) {
      return;
    }
    const { organizationId, locationId, userId, invoiceId, fileId } = variables;
    const message = 'createInvoiceFromImage - Working on:';
    console.log(message, { storageFile, organizationId, locationId, userId, invoiceId, fileId });

    const fileDoc = firestore.doc(`${CollectionNames.files}/${fileId}`);
    const invoiceDoc = firestore.doc(`${CollectionNames.invoices}/${invoiceId}`);
    const originalPDFFile = await getOriginalPDFFile(fileId);
    const publicURL = getStorageDownloadURL({
      path: storageFile.path,
      bucketName,
      firebaseStorageDownloadToken: storageFile.metadata.firebaseStorageDownloadTokens,
    });
    let invoice: Invoice = null;
    let file: InvoiceImageFile = null;
    let transactionRunAttempt = 0;
    // we need transaction because of multiple parallel image uploads for one invoice
    await firestore.runTransaction(async transaction => {
      transactionRunAttempt++;
      if (transactionRunAttempt > 1) {
        // if we will see too many "transactionRunAttempt" value in logs - that's a signal to rethink this function
        console.error('updateLocationCounter - transactionRunAttempt =', transactionRunAttempt);
      }

      const invoiceSnapshot = await transaction.get(invoiceDoc);

      const query = firestore
        .collection(CollectionNames.files)
        .where('sourceId', '==', invoiceId)
        .where('sourceType', '==', 'invoice');
      const invoiceFilesQuerySnapshot = await transaction.get(query);

      file = {
        path: storageFile.path,
        downloadURL: publicURL,
        size: Number(storageFile.size),
        md5: storageFile.md5,
        mimeType: storageFile.mimeType,
        organizationId,
        locationId,
        createdAt: new Date(),
        createdBy: userId,
        sourceId: invoiceId,
        sourceType: 'invoice',
        meta: {
          invoiceFileType: 'image',
          createdFromPDF: !!originalPDFFile,
          sortingNumber: invoiceFilesQuerySnapshot.docs.length,
          pdfSourceFileId: originalPDFFile ? originalPDFFile.id : null,
          pdfPageNumber: originalPDFFile ? originalPDFFile.meta.pagesNumbers[fileId] : null,
        },
      };

      if (!invoiceSnapshot.exists) {
        // Create new Invoice document
        invoice = {
          organizationId,
          locationId,
          subtotal: 0,
          taxes: 0,
          total: 0,
          status: InvoiceStatuses.processing.slug,
          createdAt: new Date(),
          createdBy: userId,
          isDeleted: false,
        };
        transaction.set(invoiceDoc, invoice);
      }
      transaction.set(fileDoc, file);
    });

    console.log('createInvoiceFromImage - Completed. Results:', {
      invoice: { ...invoice, id: invoiceId },
      file: { ...file, id: fileId },
    });
  } catch (error) {
    console.error('createInvoiceFromImage', { storageFile }, error);
    throw new Error(error);
  }
}

async function getOriginalPDFFile(fileId: string): Promise<InvoicePDFFile> {
  console.log('getOriginalPDFFile - Working on ', { fileId });
  const originalPDFFileQuerySnapshot = await firestore
    .collection(CollectionNames.files)
    .where(`meta.pagesNumbers.${fileId}`, '>', -1)
    .limit(1)
    .get();
  console.log('getOriginalPDFFile - originalPDFFileQuerySnapshot', { originalPDFFileQuerySnapshot });
  let originalPDFFile: InvoicePDFFile = null;
  if (originalPDFFileQuerySnapshot.docs && originalPDFFileQuerySnapshot.docs.length) {
    const originalPDFFileSnapshot = originalPDFFileQuerySnapshot.docs[0];
    originalPDFFile = { id: originalPDFFileSnapshot.id, ...originalPDFFileSnapshot.data() } as InvoicePDFFile;
  }
  console.log('getOriginalPDFFile - Completed. Result:', { originalPDFFile });
  return originalPDFFile;
}
