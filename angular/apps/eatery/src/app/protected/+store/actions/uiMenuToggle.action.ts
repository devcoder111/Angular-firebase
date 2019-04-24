import { BaseAction, generateActionType } from '../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { FEATURE_NAME } from '../module';
import { ProtectedState } from '../state';

const type = generateActionType(FEATURE_NAME, 'UI - Menu toggle');

export class UIMenuToggleAction implements BaseAction<ProtectedState> {
  feature = FEATURE_NAME;
  type = type;

  constructor(public payload?: boolean) {}

  handler(state: ProtectedState, action: this): ProtectedState {
    const isMenuVisible = action.payload === undefined ? !state.ui.isMenuOpened : action.payload;
    const ui = setStateProperties(state.ui, { isMenuOpened: isMenuVisible });
    return setStateProperties(state, { ui });
  }
}
