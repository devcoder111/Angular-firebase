import { OrganizationSupplier } from '@shared/types/organizationSupplier.interface';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { SUPPLIERS_STATE_FEATURE_NAME } from '../../suppliers-state.module';
import { SuppliersState } from '../../suppliers.state';

const type = generateActionType(SUPPLIERS_STATE_FEATURE_NAME, 'Editor - Create successful');

export class SuppliersEditorCreateSuccessfulAction implements BaseAction<SuppliersState> {
  feature = SUPPLIERS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: OrganizationSupplier) {}

  handler(state: SuppliersState, action: this): SuppliersState {
    const editor = setStateProperties(state.editor, {
      isNew: true,
      isLoadingSupplier: false,
      supplier: action.payload,
    });
    return setStateProperties(state, { editor });
  }
}
