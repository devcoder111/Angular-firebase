import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { BaseAction, generateActionType } from '../../../+shared/helpers/state.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { FEATURE_NAME } from '../module';
import { DeviceType, ProtectedState } from '../state';
import { UIMenuToggleAction } from './uiMenuToggle.action';

const type = generateActionType(FEATURE_NAME, 'UI - Set device type');

export class UISetDeviceTypeAction implements BaseAction<ProtectedState> {
  feature = FEATURE_NAME;
  type = type;

  constructor(public payload: DeviceType) {}

  handler(state: ProtectedState, action: this): ProtectedState {
    const ui = setStateProperties(state.ui, { deviceType: action.payload });
    return setStateProperties(state, { ui });
  }
}

@Injectable()
export class UISetDeviceTypeActionEffect {
  @Effect()
  toggleMenu$ = this.actions$.pipe(
    ofType(type),
    map((action: UISetDeviceTypeAction) => new UIMenuToggleAction(action.payload !== 'mobile')),
  );

  constructor(private actions$: Actions) {}
}
