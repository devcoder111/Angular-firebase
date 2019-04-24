import { InvoicesListLoadCollectionActionEffect } from './+actions/loadCollection.action';
import { InvoicesListLoadCountersActionEffect } from './+actions/loadCounters.action';

export class InvoicesListStateModule {
  static effects = [InvoicesListLoadCollectionActionEffect, InvoicesListLoadCountersActionEffect];
}
