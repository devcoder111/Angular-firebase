import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ConfirmDialogModule } from '@libs/confirm-dialog';
import { EntitySelectorModule } from '@libs/entity-selector';
import { StoreModule } from '@ngrx/store';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { SharedModule } from '../+shared/shared.module';
import { environment } from '../../environments/environment';

import { CoreRoutingModule } from './core-routing.module';
import { CoreStoreModule } from './store/module';
import { SortablejsModule } from 'angular-sortablejs';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    AngularFireStorageModule,
    CoreStoreModule,
    SharedModule.forRoot(),
    ConfirmDialogModule.forRoot(),
    EntitySelectorModule.forRoot(),
    SortablejsModule.forRoot({ animation: 150 }),
  ],
  declarations: [],
  exports: [StoreModule, RouterModule],
})
export class CoreModule {}
