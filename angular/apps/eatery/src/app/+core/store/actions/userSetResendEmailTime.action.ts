import { BaseAction, generateActionType } from '../../../+shared/helpers/state.helper';
import { CoreState } from '../core.state';
import { FEATURE_NAME } from '../module';
import { setStateProperties } from '@shared/helpers/state/state.helper';

const type = generateActionType(FEATURE_NAME, 'User - Set resend email date');

export class UserSetResendEmailTimeActionAction implements BaseAction<CoreState> {
  feature = FEATURE_NAME;
  type = type;

  constructor(public payload: { date: Date }) {}

  handler(state: CoreState, action: this): CoreState {
    return setStateProperties(state, {
      resendEmailDate: action.payload.date,
    });
  }
}
