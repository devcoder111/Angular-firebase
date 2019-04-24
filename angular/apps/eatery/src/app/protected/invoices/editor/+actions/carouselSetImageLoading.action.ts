import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { INVOICES_STATE_FEATURE_NAME } from '../../invoices-state.module';
import { InvoicesState } from '../../invoices.state';
import { setStateProperties } from '@shared/helpers/state/state.helper';

const type = generateActionType(INVOICES_STATE_FEATURE_NAME, 'Editor - Carousel set images loading');

export class CarouselSetImageLoading implements BaseAction<InvoicesState> {
  feature = INVOICES_STATE_FEATURE_NAME;
  type = type;

  constructor() {}

  handler(state: InvoicesState, action: this): InvoicesState {
    const editor = setStateProperties(state.editor, { isLoadingImages: true });
    return setStateProperties(state, { editor });
  }
}
