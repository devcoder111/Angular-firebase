import { File } from '@shared/types/file.interface';
import { Invoice } from '@shared/types/invoice.interface';
import { InvoiceAdjustment } from '@shared/types/invoiceAdjustment.interface';
import { InvoiceProduct } from '@shared/types/invoiceProduct.interface';

export class CarouselImages {
  currentPageImages: File[];
  currentItem: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface InvoicesEditorState {
  invoice?: Invoice;
  isLoadingInvoice: boolean;
  loadInvoiceError: Error;
  isSaving: boolean;
  saveError: Error;
  products?: InvoiceProduct[];
  isLoadingProducts: boolean;
  loadProductsError: Error;
  images?: File[];
  carousel: CarouselImages;
  isLoadingImages: boolean;
  loadImagesError: Error;
  adjustments?: InvoiceAdjustment[];
  isLoadingAdjustments: boolean;
  loadAdjustmentsError: Error;
}

export const InvoicesEditorStateInitial: InvoicesEditorState = {
  invoice: null,
  isLoadingInvoice: false,
  loadInvoiceError: null,
  isSaving: false,
  saveError: null,
  products: null,
  isLoadingProducts: false,
  loadProductsError: null,
  images: null,
  carousel: null,
  isLoadingImages: false,
  loadImagesError: null,
  adjustments: null,
  isLoadingAdjustments: false,
  loadAdjustmentsError: null,
};
