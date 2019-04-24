import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { INVOICES_STATE_FEATURE_NAME } from '../../invoices-state.module';
import { InvoicesState } from '../../invoices.state';
import { InvoicesListFilter } from '../listFilter.interface';

const type = generateActionType(INVOICES_STATE_FEATURE_NAME, 'List - Set filter');

export class InvoicesListSetFilterAction implements BaseAction<InvoicesState> {
  feature = INVOICES_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: InvoicesListFilter) {}

  handler(state: InvoicesState, action: this): InvoicesState {
    const list = setStateProperties(state.list, {
      filter: action.payload,
    });
    return setStateProperties(state, { list });
  }
}
