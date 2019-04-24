import { OrganizationSupplier } from '@shared/types/organizationSupplier.interface';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { SUPPLIERS_STATE_FEATURE_NAME } from '../../suppliers-state.module';
import { SuppliersState } from '../../suppliers.state';

const type = generateActionType(SUPPLIERS_STATE_FEATURE_NAME, 'Editor - Load successful');

export class SuppliersEditorLoadSuccessfulAction implements BaseAction<SuppliersState> {
  feature = SUPPLIERS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: OrganizationSupplier) {}

  handler(state: SuppliersState, action: this): SuppliersState {
    const editor = setStateProperties(state.editor, {
      isLoadingSupplier: false,
      loadSupplierError: null,
      supplier: action.payload,
      isNew: false,
    });
    return setStateProperties(state, { editor });
  }
}
