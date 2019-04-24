import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { INVOICES_STATE_FEATURE_NAME } from '../../invoices-state.module';
import { InvoicesState } from '../../invoices.state';

const type = generateActionType(INVOICES_STATE_FEATURE_NAME, 'Editor - Carousel apply order');

export class CarouselApplyOrderAction implements BaseAction<InvoicesState> {
  feature = INVOICES_STATE_FEATURE_NAME;
  type = type;

  constructor() {}

  handler(state: InvoicesState, action: this): InvoicesState {
    const editor = setStateProperties(state.editor, {
      images: state.editor.images.filter(image => !!image).map((image, i) => {
        if (
          i >= state.editor.carousel.currentItem &&
          i <= state.editor.carousel.currentItem + state.editor.carousel.totalItems - 1
        ) {
          image = state.editor.carousel.currentPageImages[i - state.editor.carousel.currentItem] || image;
        }
        image.meta.sortingNumber = i;
        return image;
      }),
    });
    return setStateProperties(state, { editor });
  }
}
