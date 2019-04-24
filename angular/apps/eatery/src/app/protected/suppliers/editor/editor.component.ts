import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { OrganizationSupplier } from '@shared/types/organizationSupplier.interface';
import { map, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { AppState } from '../../../+core/store/app.state';
import { SuppliersEditorCreateAction } from './+actions/create.action';
import { SuppliersEditorItemLoadAction } from './+actions/load.action';
import { SuppliersEditorSaveAction } from './+actions/save.action';
import { SuppliersEditorUpdateAction } from './+actions/update.action';
import {
  getSuppliersEditorCanBeModified,
  getSuppliersEditorCanBeSaved,
  getSuppliersEditorIsLoadingSupplier,
  getSuppliersEditorIsNew,
  getSuppliersEditorIsSaveEnabled,
  getSuppliersEditorIsSaving,
  getSuppliersEditorLoadSupplierError,
  getSuppliersEditorSaveError,
  getSuppliersEditorSupplier,
} from './editor.selectors';

@Component({
  selector: 'fr-suppliers-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuppliersEditorComponent implements OnInit, OnDestroy {
  form: FormGroup;
  sub = new Subscription();
  isFormValid: boolean;
  isNew$ = this.store.pipe(select(getSuppliersEditorIsNew));
  isLoadingSupplier$ = this.store.pipe(select(getSuppliersEditorIsLoadingSupplier));
  loadSupplierError$ = this.store.pipe(select(getSuppliersEditorLoadSupplierError));
  saveError$ = this.store.pipe(select(getSuppliersEditorSaveError));
  supplier$ = this.store.pipe(select(getSuppliersEditorSupplier));
  isSaving$ = this.store.pipe(select(getSuppliersEditorIsSaving));
  isSaveEnabled$ = this.store.pipe(select(getSuppliersEditorIsSaveEnabled));
  canBeSaved$ = this.store.pipe(select(getSuppliersEditorCanBeSaved));
  canBeModified$ = this.store.pipe(select(getSuppliersEditorCanBeModified));

  constructor(private location: Location, private store: Store<AppState>, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.initSupplier();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  initSupplier() {
    this.sub.add(
      this.activatedRoute.params
        .pipe(
          map(params => params['id']),
          tap((id?: string) => {
            if (id) {
              this.store.dispatch(new SuppliersEditorItemLoadAction(id));
            } else {
              this.store.dispatch(new SuppliersEditorCreateAction());
            }
          }),
        )
        .subscribe(),
    );
  }

  cancel(): void {
    this.location.back();
  }

  save(): void {
    // TODO: remove this once bug with infinite loop in Angular is fixed
    setTimeout(() => {
      this.store.dispatch(new SuppliersEditorSaveAction());
    });
  }

  patchSupplier(supplierData: Partial<OrganizationSupplier>): void {
    this.store.dispatch(new SuppliersEditorUpdateAction(supplierData));
  }

  setFormValid(valid: boolean): void {
    this.isFormValid = valid;
  }
}
