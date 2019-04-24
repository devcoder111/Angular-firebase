import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { BaseAction, generateActionType } from '../../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { LoggerService } from '../../../../+shared/services/logger.service';
import { SUPPLIERS_STATE_FEATURE_NAME } from '../../suppliers-state.module';
import { SuppliersState } from '../../suppliers.state';

const type = generateActionType(SUPPLIERS_STATE_FEATURE_NAME, 'Editor - Load supplier failed');

export class SuppliersEditorLoadSupplierFailedAction implements BaseAction<SuppliersState> {
  feature = SUPPLIERS_STATE_FEATURE_NAME;
  type = type;

  constructor(public payload: Error) {}

  handler(state: SuppliersState, action: this): SuppliersState {
    const editor = setStateProperties(state.editor, {
      isLoadingSupplier: false,
      loadSupplierError: action.payload,
    });
    return setStateProperties(state, { editor });
  }
}

@Injectable()
export class SuppliersEditorLoadSupplierFailedActionEffect {
  @Effect()
  logError$ = this.actions$.pipe(
    ofType(type),
    tap((action: SuppliersEditorLoadSupplierFailedAction) => {
      this.logger.error('SuppliersEditorLoadSupplierFailedActionEffect.logError$: ', action.payload);
    }),
  );

  constructor(private actions$: Actions, private logger: LoggerService) {}
}
