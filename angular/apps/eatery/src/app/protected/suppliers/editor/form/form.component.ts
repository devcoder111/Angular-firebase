import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AbstractControl } from '@angular/forms/src/model';
import { EntitySelectorDialogService } from '@libs/entity-selector/src/entity-selector-dialog.service';
import { Store } from '@ngrx/store';
import { phoneRegex, smsRegex } from '@shared/checks/regex';
import { convertMoneyModelToView, convertMoneyViewToModel } from '@shared/helpers/convertMoney/convertMoney.helper';
import { Location } from '@shared/types/location.interface';
import { OrganizationSupplier } from '@shared/types/organizationSupplier.interface';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { SupplierOrderMethodsArray, SupplierOrderMethodSlugType } from '@shared/values/supplierOrderMethods.array';
import { Subscription } from 'rxjs/Subscription';
import { AppState } from '../../../../+core/store/app.state';
import { isDeepEqual } from '../../../../+shared/helpers/compare.helper';
import { firestoreQueryStringStartsWith } from '../../../../+shared/helpers/firestore.helper';
import { sortByField } from '../../../../+shared/helpers/sort.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { trackByFn } from '../../../../../../../../shared/trackBy.helper';
import { AdvancedEmailValidator } from '../../../../../../../../shared/validators.helper';
import { getCurrentUser } from '../../../../../../../../shared/getUser.helper';

@Component({
  selector: 'fr-suppliers-editor-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuppliersEditorFormComponent implements OnChanges, OnDestroy {
  @Input()
  supplier: OrganizationSupplier;
  @Input()
  isReadOnly: boolean;
  @Output()
  changed = new EventEmitter<OrganizationSupplier>();
  @Output()
  validation = new EventEmitter<boolean>();

  formValid: boolean;
  form: FormGroup;
  sub = new Subscription();
  orderMethodTypes = SupplierOrderMethodsArray;
  trackByFn = trackByFn;

  constructor(private store: Store<AppState>, private entitySelectorDialog: EntitySelectorDialogService) {}

  static formToSupplier(formValue: any) {
    const orderMethods = formValue.orderMethods.reduce(
      (map, item, i) => ({
        ...map,
        [item.type]: { value: item.value, sortingNumber: i },
      }),
      {},
    );
    const ccEmailList = formValue.ccEmailList.reduce((map, email, i) => ({ ...map, [email]: i }), {});
    const GSTRegistrationNumber = formValue.isGSTRegistered ? formValue.GSTRegistrationNumber : null;
    return setStateProperties(formValue, {
      orderMethods,
      ccEmailList,
      GSTRegistrationNumber,
      minimumOrderTotal: convertMoneyViewToModel(formValue.minimumOrderTotal),
      maximumOrderTotal: convertMoneyViewToModel(formValue.maximumOrderTotal),
    });
  }

  static supplierToForm(supplier: OrganizationSupplier) {
    const orderMethods = Object.keys(supplier.orderMethods)
      .map(key => ({ ...supplier.orderMethods[key], type: key }))
      .sort(sortByField('sortingNumber'))
      .map(item => {
        delete item.sortingNumber;
        return item;
      });
    const ccEmailList = Object.keys(supplier.ccEmailList)
      .map(key => ({ email: key, sortingNumber: supplier.ccEmailList[key] }))
      .sort(sortByField('sortingNumber'))
      .map(item => item.email);
    return setStateProperties(supplier as any, {
      orderMethods,
      ccEmailList,
      minimumOrderTotal: convertMoneyModelToView(supplier.minimumOrderTotal),
      maximumOrderTotal: convertMoneyModelToView(supplier.maximumOrderTotal),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['supplier']) {
      if (this.form) {
        this.setFormValue(this.supplier);
      } else {
        this.initForm(this.supplier);
      }
    }
    if (changes['isReadOnly'] && this.form) {
      if (this.isReadOnly) {
        this.form.disable();
      } else {
        this.form.enable();
      }
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  initForm(supplier: OrganizationSupplier) {
    const supplierFormValue = SuppliersEditorFormComponent.supplierToForm(supplier);
    this.form = new FormGroup(
      {
        name: new FormControl(null, Validators.required),
        businessRegistrationNumber: new FormControl(null, Validators.required),
        address: new FormControl(null),
        isGSTRegistered: new FormControl(null, { updateOn: 'change' }),
        shouldDisplayPriceInOrder: new FormControl(null),
        deliveryTermsAndConditions: new FormControl(null),
        minimumOrderTotal: new FormControl(null, Validators.min(0)),
        maximumOrderTotal: new FormControl(null, Validators.min(0)),
        orderMethods: this.initFormArrayOrderMethods(supplierFormValue.orderMethods),
        ccEmailList: this.initFormArrayEmails(supplierFormValue.ccEmailList),
        salesmanName: new FormControl(null, Validators.required),
        salesmanEmail: new FormControl(null, [Validators.required, AdvancedEmailValidator]),
        salesmanPhoneNumber: new FormControl(null, [Validators.required, Validators.pattern(phoneRegex)]),
      },
      { updateOn: 'blur' },
    );
    this.setFormValue(supplier);
    this.sub.add(
      this.form.valueChanges.subscribe(formValue => {
        const newSupplier = setStateProperties(this.supplier, {
          ...SuppliersEditorFormComponent.formToSupplier(formValue),
        });
        const oldFormValue = SuppliersEditorFormComponent.supplierToForm(this.supplier);
        //TODO: get prev values by another way
        const oldTypes = oldFormValue.orderMethods.map(orderMethod => orderMethod.type);
        const newTypes = formValue.orderMethods.map(orderMethod => orderMethod.type);
        for (let i = 0; i < newTypes.length; i++) {
          if (!(oldTypes.length > i && oldTypes[i] === newTypes[i])) {
            const control = this.form['controls'].orderMethods['controls'][i]['controls']['value'];
            control.setValidators(this.getValidatorsForOrderMethodValueField(newTypes[i]));
            control.markAsTouched();
          }
        }
        if (!isDeepEqual(this.supplier, newSupplier)) {
          // Second check for infinite loop, since in Angular v5.2.7 form.patchValue(...,{emitEvent: false})
          // emits event no matter what
          // TODO: remove check once bug in Angular is fixed
          this.changed.emit(newSupplier);
        }
        if (this.form.valid !== this.formValid) {
          this.formValid = this.form.valid;
          this.validation.emit(this.formValid);
        }
      }),
    );
  }

  switchGSTRegistrationNumberControl(formValue) {
    const fieldName = 'GSTRegistrationNumber';
    const gstRegistrationNumberControl = this.form.controls[fieldName];
    const isGSTRegistered = formValue.isGSTRegistered;
    if (isGSTRegistered && !gstRegistrationNumberControl) {
      this.form.addControl(fieldName, new FormControl(formValue.GSTRegistrationNumber, Validators.required));
    }
    if (!isGSTRegistered && gstRegistrationNumberControl) {
      this.form.removeControl(fieldName);
    }
  }

  initFormArrayOrderMethods(orderMethods?) {
    let array;
    if (orderMethods && Object.keys(orderMethods).length) {
      array = orderMethods.map(orderMethod => this.createOrderMethodFormGroup(orderMethod));
    } else {
      array = [this.createOrderMethodFormGroup()];
    }
    return new FormArray(array);
  }

  createOrderMethodFormGroup(item?) {
    return new FormGroup({
      type: new FormControl((item && item.type) || null, [Validators.required]),
      value: new FormControl(
        (item && item.value) || null,
        this.getValidatorsForOrderMethodValueField(item && item.type),
      ),
    });
  }

  getValidatorsForOrderMethodValueField(type?: SupplierOrderMethodSlugType) {
    if (type) {
      let customValidator;
      if (type === 'email') {
        customValidator = AdvancedEmailValidator;
      } else if (type === 'sms') {
        customValidator = Validators.pattern(smsRegex);
      } else if (type === 'fax') {
        customValidator = Validators.pattern(phoneRegex);
      }
      return [Validators.required, customValidator];
    } else {
      return Validators.required;
    }
  }

  async selectLocations(supplier: OrganizationSupplier) {
    const supplierCopy = { ...supplier } as OrganizationSupplier;
    const displayField = 'name';
    const userId = (await getCurrentUser(this.store)).id;
    const locations: Location[] = await this.entitySelectorDialog.show<Location>({
      title: 'Select locations to grant access right to the listed supplier',
      searchBoxPlaceholder: 'Search location',
      submitButtonText: 'Save',
      mode: 'multiple',
      selectedItems: Object.keys(supplierCopy.byLocation).map(id => ({ id })),
      collectionName: CollectionNames.locations as string,
      queries: [
        (ref, searchText) => {
          let query = ref.limit(20);
          if (searchText) {
            query = firestoreQueryStringStartsWith(query, displayField, searchText);
          }
          query = query
            .orderBy(displayField)
            .where('isDeleted', '==', false)
            .where('availableForUsers', 'array-contains', userId)
            .where('organizationId', '==', supplierCopy.organizationId);
          return query;
        },
      ],
      displayField,
    });
    if (!locations) {
      return;
    }
    supplierCopy.byLocation = locations.reduce((acc, cur) => ({ ...acc, [cur.id]: true }), {});
    if (!isDeepEqual(this.supplier, supplierCopy)) {
      this.changed.emit(supplierCopy);
    }
  }

  isAddOrderMethodDisabled() {
    const control = this.form.controls['orderMethods'] as FormArray;
    return control.value.indexOf('') > -1 || control.invalid;
  }

  addOrderMethod() {
    const control = this.form.controls['orderMethods'] as FormArray;
    control.push(this.createOrderMethodFormGroup());
  }

  removeOrderMethod(i: number) {
    const control = this.form.controls['orderMethods'] as FormArray;
    control.removeAt(i);
  }

  getAvailableOrderMethodTypes(i: number) {
    const usedTypes = Object.keys(this.supplier.orderMethods);
    const availableTypes = [];
    for (const type of this.orderMethodTypes) {
      if (usedTypes.indexOf(type.slug) === -1 || this.supplier.orderMethods[type.slug].sortingNumber === i) {
        availableTypes.push(type);
      }
    }
    return availableTypes;
  }

  initFormArrayEmails(ccEmailList?) {
    let array;
    if (ccEmailList && ccEmailList.length) {
      array = ccEmailList.map(email => this.createEmailFormControl(email));
    } else {
      array = [this.createEmailFormControl()];
    }
    return new FormArray(array, this.checkEmailUnique(this));
  }

  createEmailFormControl(value?) {
    return new FormControl(value || '', AdvancedEmailValidator);
  }

  isAddEmailDisabled() {
    const control = this.form.controls['ccEmailList'] as FormArray;
    return control.value.indexOf('') > -1 || control.invalid;
  }

  addEmail() {
    const control = this.form.controls['ccEmailList'] as FormArray;
    control.push(this.createEmailFormControl());
  }

  removeEmail(i: number) {
    const control = this.form.controls['ccEmailList'] as FormArray;
    control.removeAt(i);
  }

  checkEmailUnique(self): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const duplicatedIndexes = self.findDuplicatedIndexes(control.value);
      return duplicatedIndexes && duplicatedIndexes.length ? <ValidationErrors>{ nonUnique: duplicatedIndexes } : null;
    };
  }

  isEmailDuplicated(i) {
    const errors = this.form.controls['ccEmailList'].errors;
    return errors && errors.nonUnique && errors.nonUnique.indexOf(i) > -1;
  }

  setFormValue(supplier_: OrganizationSupplier): void {
    const supplier = SuppliersEditorFormComponent.supplierToForm(supplier_);
    this.form.patchValue(supplier, { emitEvent: false }); // Set value, but prevent infinite emit loop
    this.switchGSTRegistrationNumberControl(supplier);
  }

  findDuplicatedIndexes(array: any[]): number[] {
    const indexes = [];
    for (let i = 0; i < array.length - 1; i++) {
      for (let j = i + 1; j < array.length; j++) {
        if (i !== j && array[i] === array[j] && indexes.indexOf(j) === -1) {
          indexes.push(j);
        }
      }
    }
    return indexes;
  }
}
