import { Action, ActionReducerMap, MetaReducer } from '@ngrx/store';

import * as LogRocket from 'logrocket';
import createNgrxMiddleware from 'logrocket-ngrx';
import { storeLogger } from 'ngrx-store-logger';
import { LocalStorageSyncReducer } from '../../+shared/helpers/localStorageSyncState.helper';
import { environment } from '../../../environments/environment';
import { EnvironmentType } from '../../../environments/environment.interface';
import { AppState } from './app.state';
import { CoreReducer } from './module';

export const AppReducers: ActionReducerMap<AppState> = {
  core: CoreReducer,
};

export function AppStateLevelReducer(reducer) {
  return function(state, action) {
    switch (action.type) {
      // some global event handler here
      default:
        break;
    }
    return reducer(state, action);
  };
}

export function LoggerReducer(reducer): any {
  return storeLogger({ collapsed: true })(reducer);
}

export function LogRocketReducer(reducer): any {
  return createNgrxMiddleware(LogRocket)(reducer);
}

const productionReducers = [AppStateLevelReducer, LocalStorageSyncReducer, LogRocketReducer];
const developmentReducers = [LoggerReducer /*storeFreeze or similar meta reducers*/];
const testReducers = [
  /*storeFreeze or similar meta reducers*/
];

export const AppMetaReducers: MetaReducer<AppState, Action>[] =
  environment.type === EnvironmentType.prod
    ? productionReducers
    : environment.type === EnvironmentType.dev
      ? [...productionReducers, ...developmentReducers]
      : [...productionReducers, ...testReducers]; // EnvironmentType.test
