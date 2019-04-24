// import { Injectable } from '@angular/core';
// import { Actions, Effect, ofType } from '@ngrx/effects';
// import { Store } from '@ngrx/store';
// import { User } from '@shared/types/user.interface';
// import { AngularFirestore } from 'angularfire2/firestore';
// import { map, withLatestFrom } from 'rxjs/operators';
// import { AppState } from '../../../../../+core/store/app.state';
// import { getActiveOrganizationId, getUser } from '../../../../../+core/store/selectors';
// import { BaseAction, generateActionType} from '../../../../../+shared/helpers/state.helper'; import { setStateProperties } from '@shared/helpers/state/state.helper';
// import { USERS_STATE_FEATURE_NAME } from '../../users-state.module';
// import { UsersState } from '../../users.state';
// import { UsersEditorCreateSuccessfulAction } from './createSuccessful.action';
//
// const type = generateActionType(USERS_STATE_FEATURE_NAME, 'Editor - Create');
//
// export class UsersEditorCreateAction implements BaseAction<UsersState> {
//   feature = USERS_STATE_FEATURE_NAME;
//   type = type;
//
//   handler(state: UsersState, action: this): UsersState {
//     const editor = setStateProperties(state.editor, {
//       isLoadingUser: true,
//       isNew: true,
//       user: null,
//     });
//     return setStateProperties(state, { editor });
//   }
// }
//
// @Injectable()
// export class UsersEditorCreateActionEffect {
//   @Effect()
//   create$ = this.actions$.pipe(
//     ofType(type),
//     withLatestFrom(this.store, (action, state) => state),
//     map((state: AppState) => {
//       const item: User = {
//         // BaseUser Fields
//         id: this.db.createId(),
//         name: null,
//         code: null,
//         supplierId: null,
//         supplierName: null,
//         createdAt: new Date(),
//         createdBy: getUser(state).id,
//         baseUserId: null,
//         nickname: null,
//         organizationId: getActiveOrganizationId(state),
//         byLocation: {},
//         lastPriceFromHistory: 0,
//         userCategoryId: null,
//         priceChangeNotificationPercentage: 0,
//         invoiceUnitTypeId: null,
//         invoiceUnitTypeName: null,
//         orderUnitTypeId: null,
//         orderUnitTypeName: null,
//         orderUnitTypeRatio: 0,
//       };
//       return new UsersEditorCreateSuccessfulAction(item);
//     }),
//     // no catchError here, because "create" operation is local and sync, so "failed" case is not possible.
//   );
//
//   constructor(private actions$: Actions, private db: AngularFirestore, private store: Store<AppState>) {}
// }
