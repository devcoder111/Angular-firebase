export interface NotificationQueueItem {
  id?: string;
  type: 'email' | 'sms' | 'fax';
  sourceType: 'orderToSupplier' | 'priceChange';
  /**
   * For sorting purposes
   */
  timestamp: Date;
  /**
   * Custom for each "type", handled in interfaces, that extend this interface
   */
  body: any;
  /**
   * By default it's null. But it becomes actual date as soon as some script started working on it.
   */
  processingStartedAt: Date;
  /**
   * By default it's null. But it becomes actual date as soon as some script completed working with it.
   */
  processingEndedAt: Date;
  /**
   * By default it's null. But it becomes true as soon as some script fails to handle it.
   */
  status: 'sent' | 'notSent';
  error: string | null;
  meta?: { [key: string]: any };
}

export interface NotificationQueueEmailItem extends NotificationQueueItem {
  type: 'email';
  body: {
    customArgs: {
      notificationId: string;
    };
    to: string;
    from: string;
    subject: string;
    html: string;
  };
}

export interface NotificationQueueOrderToSupplierEmailItem extends NotificationQueueEmailItem {
  sourceType: 'orderToSupplier';
  meta: {
    orderId: string;
    orderNumber: string;
    supplierId: string;
    supplierName: string;
    doesTriggerStatusChange: boolean;
    attemptsAmount: number;
    lastAttemptAt: Date;
  };
}

export interface NotificationQueueSmsItem extends NotificationQueueItem {
  type: 'sms';
  body: {
    to: string;
    from: string;
    body: string;
  };
}

export interface NotificationQueueOrderToSupplierSmsItem extends NotificationQueueSmsItem {
  sourceType: 'orderToSupplier';
  meta: {
    orderId: string;
    orderNumber: string;
    supplierId: string;
    supplierName: string;
    doesTriggerStatusChange: boolean;
    attemptsAmount: number;
    lastAttemptAt: Date;
  };
}

export interface NotificationQueueFaxItem extends NotificationQueueItem {
  type: 'fax';
  body: {
    file: string;
    dest: string;
  };
}

export interface NotificationQueueOrderToSupplierFaxItem extends NotificationQueueFaxItem {
  sourceType: 'orderToSupplier';
  meta: {
    orderId: string;
    orderNumber: string;
    supplierId: string;
    supplierName: string;
    doesTriggerStatusChange: boolean;
    attemptsAmount: number;
    lastAttemptAt: Date;
  };
}
