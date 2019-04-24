import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { AngularFirestore } from 'angularfire2/firestore';
import { switchMap, withLatestFrom } from 'rxjs/operators';
import { AppState } from '../../../../+core/store/app.state';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { SUPPLIERS_STATE_FEATURE_NAME } from '../../suppliers-state.module';
import { SuppliersState } from '../../suppliers.state';
import { getSuppliersEditorState } from '../editor.selectors';
import { SuppliersEditorState } from '../editor.state';
import { SuppliersEditorSaveFailedAction } from './saveFailed.action';
import { SuppliersEditorSaveSuccessfulAction } from './saveSuccessful.action';

const type = generateActionType(SUPPLIERS_STATE_FEATURE_NAME, 'Editor - Save');

export class SuppliersEditorSaveAction implements BaseAction<SuppliersState> {
  feature = SUPPLIERS_STATE_FEATURE_NAME;
  type = type;

  handler(state: SuppliersState): SuppliersState {
    const editor = setStateProperties(state.editor, {
      isSaving: true,
      saveError: null,
    });
    return setStateProperties(state, { editor });
  }
}

@Injectable()
export class SuppliersEditorSaveActionEffect {
  @Effect()
  save$ = this.actions$.pipe(
    ofType(type),
    withLatestFrom(this.store, (action, state) => ({
      editor: getSuppliersEditorState(state),
    })),
    switchMap((data: { editor: SuppliersEditorState }) => {
      const { editor } = data;
      const { id, ...model } = editor.supplier;
      delete model.orderMethods[''];
      delete model.ccEmailList[''];
      return this.db
        .doc(`${CollectionNames.suppliers}/${id}`)
        .set(model)
        .then(() => new SuppliersEditorSaveSuccessfulAction())
        .catch(error => new SuppliersEditorSaveFailedAction(error));
    }),
  );

  constructor(private actions$: Actions, private db: AngularFirestore, private store: Store<AppState>) {}
}
