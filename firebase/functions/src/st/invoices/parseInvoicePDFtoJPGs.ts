import * as os from 'os';
import * as UUID from 'uuid';
import * as XRegExp from 'xregexp';
import { getConfig } from '../../+utils/config';
import { createId } from '../../+utils/createId';
import { getFirestore } from '../../+utils/firestore';
import { getStorageBucket } from '../../+utils/storageBucket';
import { InvoicePDFFile } from '../../../../../shared/types/file.interface';
import { CollectionNames } from '../../../../../shared/values/collectionNames.map';
import {
  getStorageDownloadURL,
  getStoragePathToInvoiceImage,
  InvoiceFilePathParams,
} from '../../../../../shared/values/storagePaths.map';
import { StorageFile } from '../onFinalize.f';

const fse = require('fs-extra');
const gs = require('gs');
const isDev = ['win32', 'darwin'].indexOf(os.platform()) > -1;

const firestore = getFirestore();
const bucket = getStorageBucket();
const bucketName = getConfig().storageBucketWithoutGSprefix;

/**
 * Regex for string like "organizations/ORG_ID/locations/LOC_ID/users/USER_ID/invoices/_pdfs/FILE_ID"
 */
const regexString = `
organizations\/(?<organizationId>\\w+)\/    # organizations/ORG_ID/
locations\/(?<locationId>\\w+)\/            # locations/LOC_ID/
users\/(?<userId>\\w+)\/                    # users/USER_ID/
invoices\/_pdfs\/(?<fileId>\\w+)$          # invoices/_pdfs/FILE_ID`;
const regex = XRegExp(regexString, 'x'); // x = free-spacing, newlines and line comments

export async function parseInvoicePDFtoJPGs(storageFile: StorageFile): Promise<void> {
  try {
    const variables = XRegExp.exec(storageFile.path, regex);
    if (!variables) {
      return;
    }
    const { organizationId, locationId, userId, fileId } = variables;
    console.log('parseInvoicePDFtoJPGs - Working on:', {
      storageFile,
      organizationId,
      locationId,
      userId,
      fileId,
    });

    const fileDoc = firestore.doc(`${CollectionNames.files}/${fileId}`);
    const publicURL = getStorageDownloadURL({
      path: storageFile.path,
      bucketName,
      firebaseStorageDownloadToken: storageFile.metadata.firebaseStorageDownloadTokens,
    });

    const pdfDir = `/tmp/${createId()}`;
    const imgsDir = `${pdfDir}/images`;
    await Promise.all([fse.ensureDir(pdfDir), fse.ensureDir(imgsDir)]); // create dirs for PDF and parsed images
    const pathToPDF = `${pdfDir}/src.pdf`;
    try {
      await bucket.file(storageFile.path).download({ destination: pathToPDF });
    } catch (error) {
      const message = 'parseInvoicePDFtoJPGs - failed to download PDF';
      console.error(message, { storageFile, pathToPDF }, error);
      throw new Error(error);
    }

    let jpgFiles: { localFilePath: string; invoiceId: string; fileId: string }[] = null;
    try {
      const filenames = await getJPGFilesFromPDF(pathToPDF, imgsDir);
      jpgFiles = filenames.map(filename => ({
        localFilePath: `${imgsDir}/${filename}`,
        invoiceId: createId(), // generate id for future invoice
        fileId: createId(), // just generate unique fileId
      }));
      // TODO for Artem: Read md5 from jpgFiles and write the to file.meta.pages as "pages:{"md5offirstFile":true}"
    } catch (error) {
      const message = 'parseInvoicePDFtoJPGs - failed parse PDF to JPG files';
      console.error(message, { storageFile, pathToPDF, imgsDir }, error);
      throw new Error(error);
    }

    const pagesNumbers = jpgFiles.reduce((acc, cur, index) => {
      acc[cur.fileId] = index;
      return acc;
    }, {});
    const invoiceIds = jpgFiles.reduce((acc, cur) => {
      acc[cur.invoiceId] = cur.fileId;
      return acc;
    }, {});
    const file: InvoicePDFFile = {
      path: storageFile.path,
      downloadURL: publicURL,
      size: Number(storageFile.size),
      md5: storageFile.md5,
      mimeType: storageFile.mimeType,
      organizationId,
      locationId,
      createdAt: new Date(),
      createdBy: userId,
      sourceId: null, // PDF is not linked to some particular invoice
      sourceType: 'invoice',
      meta: {
        invoiceFileType: 'pdf',
        pagesAmount: jpgFiles.length,
        pagesNumbers,
        invoiceIds,
      },
    };
    try {
      await fileDoc.set(file); // first make sure we have it in /files/:id
    } catch (error) {
      const message = 'parseInvoicePDFtoJPGs - failed save info about PDF file to Firestore';
      console.error(message, { storageFile, fileId, file }, error);
      throw new Error(error);
    }

    let results: string[] = null;
    try {
      const uploadJPGPromises = jpgFiles.map(jpgFile =>
        uploadInvoiceImage(jpgFile.localFilePath, {
          organizationId,
          locationId,
          userId,
          invoiceId: jpgFile.invoiceId,
          fileId: jpgFile.fileId,
        }),
      );
      results = await Promise.all(uploadJPGPromises);
    } catch (error) {
      const message = 'parseInvoicePDFtoJPGs - failed to upload JPG files to Cloud Storage';
      console.error(message, { storageFile, imgsDir, jpgFilenames: jpgFiles }, error);
      throw new Error(error);
    }
    fse.remove(pdfDir); // remove all stuff from `/tmp/` to save memory for future functions

    console.log('parseInvoicePDFtoJPGs - Completed. Results:', { file: { id: fileId, ...file }, results });
  } catch (error) {
    console.error('parseInvoicePDFtoJPGs', { storageFile }, error);
    throw new Error(error);
  }
}

/**
 * Parses PDF to JPG images and returns filenames of them
 * @param {string} pathToSourcePDF - where src PDF is
 * @param {string} outputDir - where parsed files will go
 * @returns {Promise<string[]>} - array of filenames
 */
function getJPGFilesFromPDF(pathToSourcePDF: string, outputDir: string): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    gs()
      .batch()
      .nopause()
      .q()
      .device('jpeg')
      .executablePath(isDev ? 'gs' : 'lambda-ghostscript/bin/./gs')
      .option('-dTextAlphaBits=4')
      .res(300)
      .output(`${outputDir}/page-%03d.jpg`)
      .input(pathToSourcePDF)
      .exec(err => {
        if (err) {
          reject(err);
        } else {
          resolve(fse.readdirSync(outputDir));
        }
      });
  });
}

/**
 * Uploads image as image for invoice to Cloud Storage
 * @param {string} localPathToFile
 * @param {InvoiceFilePathParams} params
 * @returns {Promise<string>} path on Cloud Storage where file was saved
 */
async function uploadInvoiceImage(localPathToFile: string, params: InvoiceFilePathParams): Promise<string> {
  const uuid = UUID();
  const pathOnStorageForNewFile = getStoragePathToInvoiceImage(params);
  await bucket.upload(localPathToFile, {
    destination: pathOnStorageForNewFile,
    metadata: {
      contentType: 'image/jpeg',
      metadata: {
        // it's important to upload with firebaseStorageDownloadTokens for future ability to build publicURL
        firebaseStorageDownloadTokens: uuid,
      },
    },
  });
  return pathOnStorageForNewFile;
}
