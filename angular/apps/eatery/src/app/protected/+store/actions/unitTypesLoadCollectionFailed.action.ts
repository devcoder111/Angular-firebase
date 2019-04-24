import { BaseAction, generateActionType } from '../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { FEATURE_NAME } from '../module';
import { ProtectedState } from '../state';

const type = generateActionType(FEATURE_NAME, 'List - Unit Types load collection failed');

export class UnitTypesLoadCollectionErrorAction implements BaseAction<ProtectedState> {
  feature = FEATURE_NAME;
  type = type;

  constructor(public payload: Error) {}

  handler(state: ProtectedState, action: this): ProtectedState {
    const unitTypes = setStateProperties(state.unitTypes, {
      loadError: action.payload,
      isLoading: false,
    });
    return setStateProperties(state, { unitTypes });
  }
}
