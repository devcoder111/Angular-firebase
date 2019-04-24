import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { INVOICES_STATE_FEATURE_NAME } from '../../invoices-state.module';
import { InvoicesState } from '../../invoices.state';

const type = generateActionType(INVOICES_STATE_FEATURE_NAME, 'Editor - Carousel get prev page');

export class CarouselGetPrevPageAction implements BaseAction<InvoicesState> {
  feature = INVOICES_STATE_FEATURE_NAME;
  type = type;

  constructor() {}

  handler(state: InvoicesState, action: this): InvoicesState {
    const editor = setStateProperties(state.editor, {
      carousel: {
        currentItem:
          state.editor.carousel.currentItem === 0
            ? state.editor.carousel.currentItem
            : state.editor.carousel.currentItem - 1,
        currentPageImages: state.editor.images.slice(
          state.editor.carousel.currentItem - 1,
          state.editor.carousel.currentItem + state.editor.carousel.totalItems - 1,
        ),
        hasNext: state.editor.images.length > state.editor.carousel.currentItem + state.editor.carousel.totalItems - 1,
        hasPrev: state.editor.carousel.currentItem - 1 > 0,
        totalItems: state.editor.carousel.totalItems,
      },
    });
    return setStateProperties(state, { editor });
  }
}
