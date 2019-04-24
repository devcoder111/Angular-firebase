import { File } from '@shared/types/file.interface';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { INVOICES_STATE_FEATURE_NAME } from '../../invoices-state.module';
import { InvoicesState } from '../../invoices.state';

const type = generateActionType(INVOICES_STATE_FEATURE_NAME, 'Editor - Images set carousel images');

export class CarouselSetImagesAction implements BaseAction<InvoicesState> {
  feature = INVOICES_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: File[]) {}

  handler(state: InvoicesState, action: this): InvoicesState {
    const editor = setStateProperties(state.editor, {
      carousel: {
        currentPageImages: action.payload.slice(0, 3),
        hasNext: action.payload.length > 3,
        hasPrev: false,
        currentItem: 0,
        totalItems: 3,
      },
    });
    return setStateProperties(state, { editor });
  }
}
