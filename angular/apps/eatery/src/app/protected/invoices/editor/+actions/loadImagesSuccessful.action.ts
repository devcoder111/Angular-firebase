import { File } from '@shared/types/file.interface';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { INVOICES_STATE_FEATURE_NAME } from '../../invoices-state.module';
import { InvoicesState } from '../../invoices.state';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { CarouselSetImagesAction } from './carouselSetImages.action';
import { AngularFirestore } from 'angularfire2/firestore';

const type = generateActionType(INVOICES_STATE_FEATURE_NAME, 'Editor - Images load successful');

export class InvoicesEditorImagesLoadSuccessfulAction implements BaseAction<InvoicesState> {
  feature = INVOICES_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: File[]) {}

  handler(state: InvoicesState, action: this): InvoicesState {
    const editor = setStateProperties(state.editor, {
      isLoadingImages: false,
      images: action.payload,
    });
    return setStateProperties(state, { editor });
  }
}

@Injectable()
export class InvoicesEditorImagesLoadSuccessfulActionEffect {
  @Effect()
  selectVisibleImages$ = this.actions$.ofType(type).pipe(
    map((action: InvoicesEditorImagesLoadSuccessfulAction) => {
      return new CarouselSetImagesAction(action.payload);
    }),
  );

  constructor(private actions$: Actions, private db: AngularFirestore) {}
}
