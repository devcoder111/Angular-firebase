import { OrganizationSupplier } from '@shared/types/organizationSupplier.interface';
import { SuppliersListFilter } from './listFilter.interface';

export interface SuppliersListState {
  ids: string[];
  map: { [id: string]: OrganizationSupplier };
  isLoading: boolean;
  loadError: Error;
  filter: SuppliersListFilter;
}

export const SuppliersListStateInitial: SuppliersListState = {
  ids: [],
  map: {},
  isLoading: false,
  loadError: null,
  filter: {
    name: null,
  },
};
