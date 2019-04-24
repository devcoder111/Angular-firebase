export interface File {
  id?: string;
  /**
   * Path to file on Cloud Storage
   */
  path: string;
  /**
   * Public URL for downloading on frontend
   */
  downloadURL?: string;
  /**
   * File size in bytes. 1 mebibyte = 1024 kibibytes = 1048576 bytes
   */
  size: number;
  md5: string;
  mimeType: string;
  organizationId: string;
  locationId?: string;
  /**
   *  invoiceId | supplierId | productId , etc
   */
  sourceId: string;
  /**
   * invoice | supplier , etc
   */
  sourceType: string;
  /**
   * any additional info based on sourceType
   */
  meta?: { [key: string]: any };
  createdAt: Date;
  createdBy: string;
}

export interface InvoiceImageFile extends File {
  meta: {
    invoiceFileType: 'image';
    sortingNumber: number;
    createdFromPDF: boolean;
    pdfSourceFileId?: string;
    pdfPageNumber?: number;
  };
}

export interface InvoicePDFFile extends File {
  meta: {
    invoiceFileType: 'pdf';
    pagesAmount: number;
    pagesNumbers: {
      [fileId: string]: number; // number is pageNumber
    };
    invoiceIds: {
      [invoiceId: string]: string; // string is fileId
    };
  };
}

export interface OrderPublicPageHTMLFile extends File {
  sourceType: 'orderPublicPageHTML';
  meta: {
    status: 'normal' | 'voided';
  };
}

export interface OrderPublicPagePDFFile extends File {
  sourceType: 'orderPublicPagePDF';
  meta: {
    status: 'normal' | 'voided';
  };
}
