import { Order } from '../types/order.interface';

export function getStoragePathToOrderPublicPage(fileId: string, order: Order): string {
  return `organizations/${order.organizationId}/locations/${order.locationId}/users/${order.createdBy}/orders/${
    order.id
  }/publicPageHTML/${fileId}`;
}

export function getStoragePathToOrderPublicPdf(fileId: string, order: Order): string {
  return `organizations/${order.organizationId}/locations/${order.locationId}/users/${order.createdBy}/orders/${
    order.id
  }/publicPagePDF/${fileId}`;
}

export interface InvoiceFilePathParams {
  organizationId: string;
  locationId: string;
  userId: string;
  invoiceId: string;
  fileId: string;
}

export function getStoragePathToInvoiceImage(params: InvoiceFilePathParams): string {
  return `organizations/${params.organizationId}/locations/${params.locationId}/users/${params.userId}/invoices/${
    params.invoiceId
  }/images/${params.fileId}`;
}

export interface OrderFilePathParams {
  organizationId: string;
  locationId: string;
  userId: string;
  orderId: string;
  fileId: string;
}

export function getStoragePathToOrderPdfFile(params: OrderFilePathParams): string {
  return `organizations/${params.organizationId}/locations/${params.locationId}/users/${params.userId}/orders/${
    params.orderId
  }/pdfs/${params.fileId}`;
}

export function getStoragePathToInvoicePDF(params: InvoiceFilePathParams): string {
  return `organizations/${params.organizationId}/locations/${params.locationId}/users/${params.userId}/invoices/_pdfs/${
    params.fileId
  }`;
}

export function getStorageDownloadURL(params: {
  path: string;
  bucketName: string;
  firebaseStorageDownloadToken: string;
}): string {
  return `https://firebasestorage.googleapis.com/v0/b/${params.bucketName}/o/${encodeURIComponent(
    params.path,
  )}?alt=media&token=${params.firebaseStorageDownloadToken}`;
}
