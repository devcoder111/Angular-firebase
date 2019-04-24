// import { Location } from '@angular/common';
// import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { select, Store } from '@ngrx/store';
// import { User } from '@shared/types/user.interface';
// import { map, tap } from 'rxjs/operators';
// import { Subscription } from 'rxjs/Subscription';
// import { UsersEditorCreateAction } from './+actions/create.action';
// import { UsersEditorItemLoadAction } from './+actions/load.action';
// import { UsersEditorSaveAction } from './+actions/save.action';
// import { UsersEditorUpdateAction } from './+actions/update.action';
// import {
//   getUsersEditorCanBeModified,
//   getUsersEditorCanBeSaved,
//   getUsersEditorIsLoadingUser,
//   getUsersEditorIsNew,
//   getUsersEditorIsSaveEnabled,
//   getUsersEditorIsSaving,
//   getUsersEditorLoadUserError,
//   getUsersEditorSaveError,
//   getUsersEditorUser,
// } from './editor.selectors';
// import { AppState } from '../../../../+core/store/app.state';
//
// @Component({
//   selector: 'fr-users-editor',
//   templateUrl: './editor.component.html',
//   styleUrls: ['./editor.component.sass'],
//   encapsulation: ViewEncapsulation.None,
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class UsersEditorComponent implements OnInit, OnDestroy {
//   sub = new Subscription();
//   state$ = this.store;
//   isNew$ = this.store.pipe(select(getUsersEditorIsNew));
//   isLoadingUser$ = this.store.pipe(select(getUsersEditorIsLoadingUser));
//   loadUserError$ = this.store.pipe(select(getUsersEditorLoadUserError));
//   saveError$ = this.store.pipe(select(getUsersEditorSaveError));
//   user$ = this.store.pipe(select(getUsersEditorUser));
//   isSaving$ = this.store.pipe(select(getUsersEditorIsSaving));
//   isSaveEnabled$ = this.store.pipe(select(getUsersEditorIsSaveEnabled));
//   canBeSaved$ = this.store.pipe(select(getUsersEditorCanBeSaved));
//   canBeModified$ = this.store.pipe(select(getUsersEditorCanBeModified));
//
//   constructor(
//     private location: Location,
//     private store: Store<AppState>,
//     private activatedRoute: ActivatedRoute,
//   ) {}
//
//   ngOnInit() {
//     this.initUser();
//   }
//
//   ngOnDestroy() {
//     this.sub.unsubscribe();
//   }
//
//   initUser() {
//     this.sub.add(
//       this.activatedRoute.params
//         .pipe(
//           map(params => params['id']),
//           tap((id?: string) => {
//             if (id) {
//               this.store.dispatch(new UsersEditorItemLoadAction(id));
//             } else {
//               this.store.dispatch(new UsersEditorCreateAction());
//             }
//           }),
//         )
//         .subscribe(),
//     );
//   }
//
//   cancel(): void {
//     this.location.back();
//   }
//
//   save(): void {
//     // TODO: remove this once bug with infinite loop in Angular is fixed
//     setTimeout(() => {
//       this.store.dispatch(new UsersEditorSaveAction());
//     });
//   }
//
//   patchUser(userData: Partial<User>): void {
//     this.store.dispatch(new UsersEditorUpdateAction(userData));
//   }
// }
