import { UnitType } from '@shared/types/unitType.interface';
import { BaseAction, generateActionType } from '../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { FEATURE_NAME } from '../module';
import { ProtectedState } from '../state';

const type = generateActionType(FEATURE_NAME, 'Unit Types - Set collection');

export class UnitTypesSetCollectionAction implements BaseAction<ProtectedState> {
  feature = FEATURE_NAME;
  type = type;

  constructor(public payload: UnitType[]) {}

  handler(state: ProtectedState, action: this): ProtectedState {
    const unitTypes = setStateProperties(state.unitTypes, {
      ids: action.payload.map(item => item.id),
      items: action.payload.reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {}),
    });
    return setStateProperties(state, { unitTypes });
  }
}
