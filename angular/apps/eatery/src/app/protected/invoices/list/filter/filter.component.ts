import {
  AfterViewInit,
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
import { FormControl, FormGroup } from '@angular/forms';
import { EntitySelectorDialogService } from '@libs/entity-selector/src/entity-selector-dialog.service';
import { EntitySelectorConfig } from '@libs/entity-selector/src/entity-selector.module';
import { select, Store } from '@ngrx/store';
import { OrganizationSupplier } from '@shared/types/organizationSupplier.interface';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { InvoiceStatusesArray } from '@shared/values/invoiceStatuses.array';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subscription } from 'rxjs/Subscription';
import { AppState } from '../../../../+core/store/app.state';
import {
  getActiveLocationId,
  getActiveOrganizationId,
  isActivePositionLocation,
  isActivePositionOrganization,
} from '../../../../+core/store/selectors';
import { isDeepEqual } from '../../../../+shared/helpers/compare.helper';
import { firestoreQueryStringStartsWith, getFirestoreDoc } from '../../../../+shared/helpers/firestore.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { LoggerService } from '../../../../+shared/services/logger.service';
import { getInvoicesEditorCanModify } from '../../editor/editor.selectors';
import { InvoicesListStateInitial } from '../list.state';
import { InvoicesListFilter } from '../listFilter.interface';
import { Location } from '@shared/types/location.interface';
import { getCurrentUser } from '../../../../../../../../shared/getUser.helper';

@Component({
  selector: 'fr-invoices-list-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoicesListFilterComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input()
  state: AppState;
  @Input()
  filter: InvoicesListFilter;
  @Output()
  changed = new EventEmitter<InvoicesListFilter>();
  form: FormGroup;
  sub = new Subscription();
  statuses = InvoiceStatusesArray.map(item => ({
    title: item.title,
    value: item.slug,
  }));
  selectSupplierConfig: EntitySelectorConfig<OrganizationSupplier>;
  selectLocationConfig: EntitySelectorConfig<Location>;
  canBeModified$ = this.store.pipe(select(getInvoicesEditorCanModify));
  isActivePositionOrganization$ = this.store.pipe(select(isActivePositionOrganization));

  constructor(
    private db: AngularFirestore,
    private logger: LoggerService,
    private entitySelectorDialog: EntitySelectorDialogService,
    private store: Store<AppState>,
  ) {}

  async ngAfterViewInit(): Promise<void> {
    this.selectSupplierConfig = this.getSelectSupplierConfig();
    this.selectLocationConfig = await this.getSelectLocationConfig();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filter']) {
      if (this.form) {
        this.setFormValue(this.filter);
      } else {
        this.initForm(this.filter);
      }
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  initForm(filter: InvoicesListFilter) {
    this.form = new FormGroup({
      supplierId: new FormControl(null),
      locationId: new FormControl(null),
      number: new FormControl(null),
      status: new FormControl(null),
      isDeleted: new FormControl(null),
    });
    this.setFormValue(filter);
    this.sub.add(
      this.form.valueChanges.subscribe(formValue => {
        if (!formValue.number) {
          // Prevents number to be "" (empty string) as we need it to be compared to null
          formValue.number = null;
        }
        const newFilter = setStateProperties(this.filter, {
          ...formValue,
        });
        if (!isDeepEqual(this.filter, newFilter)) {
          // Second check for infinite loop, since in Angular v5.2.7 form.patchValue(...,{emitEvent: false})
          // emits event no matter what
          // TODO: remove check once bug in Angular is fixed
          if (
            !isDeepEqual(this.filter.number, newFilter.number) ||
            !isDeepEqual(this.filter.isDeleted, newFilter.isDeleted) ||
            !isDeepEqual(this.filter.status, newFilter.status)
          ) {
            this.changed.emit(newFilter);
          }
        }
      }),
    );
    this.sub.add(
      this.store.pipe(select(getActiveOrganizationId)).subscribe(() => {
        this.clearFilter();
      }),
    );
  }

  setFormValue(filter: InvoicesListFilter): void {
    this.form.patchValue(filter, { emitEvent: false }); // Set value, but prevent infinite emit loop
  }

  getSelectSupplierConfig(): EntitySelectorConfig<OrganizationSupplier> {
    const displayField = 'name';
    return {
      searchBoxPlaceholder: 'Search for supplier...',
      mode: 'single',
      collectionName: CollectionNames.suppliers as string,
      queries: [
        (ref, searchText) => {
          let query = ref.limit(20);
          if (searchText) {
            query = firestoreQueryStringStartsWith(query, displayField, searchText);
          }
          query = query.orderBy(displayField).where('organizationId', '==', getActiveOrganizationId(this.state));
          // .where(`byLocation.${this.invoice.locationId}`, '==', true) // requires Firestore index for each "byLocation.X" for some reason. TODO
          return query;
        },
      ],
      // Nasty workaround for now to filter byLocation
      // TODO: make this thing properly
      clientSideFilter: items =>
        items.filter(
          item =>
            item[`byLocation`][getActiveLocationId(this.state)] === true ||
            isActivePositionLocation(this.state) === false,
        ),
      displayField,
      checkFn: supplier => {
        if (!supplier) {
          return;
        }
        const newFilter = setStateProperties(this.filter, {
          supplierId: supplier.id,
        });
        if (!isDeepEqual(this.filter, newFilter)) {
          this.changed.emit(newFilter);
        }
        return supplier;
      },
      getViewValue: async (value, setViewValue) => {
        let supplierName = '';
        if (value) {
          const path = `${CollectionNames.suppliers}/${value}`;
          try {
            const supplier = await getFirestoreDoc(this.db, path);
            if (supplier) {
              supplierName = supplier.name;
            }
          } catch (error) {
            this.logger.error('getFirestoreDoc', error, { path });
          }
        }
        setViewValue(supplierName);
      },
    };
  }

  async getSelectLocationConfig(): Promise<EntitySelectorConfig<Location>> {
    const displayField = 'name';
    const userId = (await getCurrentUser(this.store)).id;
    return {
      searchBoxPlaceholder: 'Search for location...',
      mode: 'single',
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
            .where('organizationId', '==', getActiveOrganizationId(this.state));
          return query;
        },
      ],
      clientSideFilter: items => items.filter(() => !isActivePositionLocation(this.state)),
      displayField,
      checkFn: location => {
        if (!location) {
          return;
        }
        const newFilter = setStateProperties(this.filter, {
          locationId: location.id,
        });
        if (!isDeepEqual(this.filter, newFilter)) {
          this.changed.emit(newFilter);
        }
        return location;
      },
      getViewValue: async (value, setViewValue) => {
        let locationName = '';
        if (value) {
          const path = `${CollectionNames.locations}/${value}`;
          try {
            const location = await getFirestoreDoc(this.db, path);
            if (location) {
              locationName = location.name;
            }
          } catch (error) {
            this.logger.error('getFirestoreDoc', error, { path });
          }
        }
        setViewValue(locationName);
      },
    };
  }

  clearFilter() {
    this.changed.emit(setStateProperties(InvoicesListStateInitial.filter, { status: this.form.value.status }));
  }
}
