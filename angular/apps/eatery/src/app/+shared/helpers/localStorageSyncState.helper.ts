import { ActionReducer } from '@ngrx/store';
import { localStorageSync, rehydrateApplicationState } from 'ngrx-store-localstorage';

export function storageKeySerializer(key) {
  return `fr-state-${key}`;
}

const storage: Storage = localStorage;

export function LocalStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({
    keys: ['core'],
    storageKeySerializer,
    storage,
  })(reducer);
}

export function rehydrateFeatureState<T>(featureName: string): T {
  return rehydrateApplicationState([featureName], storage, storageKeySerializer, true)[featureName];
}
