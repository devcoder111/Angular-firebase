import { Permission } from '@shared/types/permission.interface';
import { UsersListFilter } from './listFilter.interface';

export interface UsersListState {
  ids: string[];
  map: { [id: string]: Permission };
  isLoading: boolean;
  loadError: Error;
  filter: UsersListFilter;
}

export const UsersListStateInitial: UsersListState = {
  ids: [],
  map: {},
  isLoading: false,
  loadError: null,
  filter: {
    displayName: null,
    role: null,
  },
};
