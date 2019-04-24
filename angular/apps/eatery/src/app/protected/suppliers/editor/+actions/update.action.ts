import { OrganizationSupplier } from '@shared/types/organizationSupplier.interface';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { SUPPLIERS_STATE_FEATURE_NAME } from '../../suppliers-state.module';
import { SuppliersState } from '../../suppliers.state';

const type = generateActionType(SUPPLIERS_STATE_FEATURE_NAME, 'Editor - Update');

export class SuppliersEditorUpdateAction implements BaseAction<SuppliersState> {
  feature = SUPPLIERS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: Partial<OrganizationSupplier>) {}

  handler(state: SuppliersState, action: this): SuppliersState {
    const supplier = setStateProperties(state.editor.supplier, {
      ...action.payload,
    });
    const editor = setStateProperties(state.editor, { supplier });
    return setStateProperties(state, { editor });
  }
}
