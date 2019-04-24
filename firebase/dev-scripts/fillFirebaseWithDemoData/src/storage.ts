import * as admin from 'firebase-admin';
import * as path from 'path';
import { getStoragePathToInvoiceImage, getStoragePathToOrderPdfFile } from '../../../../shared/values/storagePaths.map';

const UUID = require('uuid');

export async function deleteFilesInStorage(): Promise<void> {
  try {
    await admin
      .storage()
      .bucket()
      .deleteFiles();
    console.log(`Storage: all files removed from default bucket`);
  } catch (error) {
    console.error(`deleteFilesInStorage error:`, error);
    process.exit(1);
  }
}

export async function uploadInvoicesFiles(): Promise<void> {
  try {
    const filePath = 'invoices/invoice.jpg';
    await admin
      .storage()
      .bucket()
      .upload(path.resolve(`../../demo-data/storage/${filePath}`), {
        destination: getStoragePathToInvoiceImage({
          organizationId: 'IsNCAUUIfv9XJoAUyez5',
          locationId: 'ndmKZ3FpxsNVwKBOzwDm',
          userId: '00000001',
          invoiceId: 'INVOICE1',
          fileId: 'FILE1',
        }),
        metadata: {
          metadata: {
            // this is not a duplication of nested "metadata" field. Check the type if you don't trust me :)
            firebaseStorageDownloadTokens: UUID(),
          },
        },
      });
    console.log(`Storage: Invoice image uploaded. Invoice document in Firestore should be created by Cloud Function.`);
  } catch (error) {
    console.error(`uploadInvoicesFiles error:`, error);
    process.exit(1);
  }
}

export async function uploadOrdersFiles(): Promise<void> {
  try {
    const filePath = 'orders/order.pdf';
    await admin
      .storage()
      .bucket()
      .upload(path.resolve(`../../demo-data/storage/${filePath}`), {
        destination: getStoragePathToOrderPdfFile({
          organizationId: 'BMWOrg',
          locationId: 'PRA',
          userId: '00000001',
          orderId: 'ORDER1',
          fileId: 'FILE1',
        }),
        metadata: {
          metadata: {
            // this is not a duplication of nested "metadata" field. Check the type if you don't trust me :)
            firebaseStorageDownloadTokens: UUID(),
          },
        },
      });
    console.log(`Storage: Order pdf uploaded. Order document in Firestore should be created by Cloud Function.`);
  } catch (error) {
    console.error(`uploadOrdersFiles error:`, error);
    process.exit(1);
  }
}
