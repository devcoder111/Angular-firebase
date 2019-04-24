import { CounterLocationInvoicesDone } from '@shared/types/counterLocationInvoicesDone.interface';
import { Invoice } from '@shared/types/invoice.interface';
import { InvoicesListFilter } from './listFilter.interface';
import { CounterOrganizationInvoicesDone } from '@shared/types/counterOrganizationInvoicesDone.interface';

export interface InvoicesListState {
  ids: string[];
  map: { [id: string]: Invoice };
  isLoading: boolean;
  loadError: Error;
  organizationCounters: CounterOrganizationInvoicesDone;
  locationCounters: CounterLocationInvoicesDone;
  filter: InvoicesListFilter;
}

export const InvoicesListStateInitial: InvoicesListState = {
  ids: [],
  map: {},
  isLoading: false,
  loadError: null,
  organizationCounters: {
    sum: 0,
    amount: 0,
  },
  locationCounters: {
    sum: 0,
    amount: 0,
  },
  filter: {
    supplierId: null,
    locationId: null,
    number: null,
    status: null,
    isDeleted: false,
  },
};
