import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { EntitySelectorConfig } from '@libs/entity-selector/src/entity-selector.module';
import { AngularFirestore } from 'angularfire2/firestore';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { debounceTime, map, startWith, switchMap, tap } from 'rxjs/operators';
import { unwrapCollectionSnapshotChanges } from '../../../apps/eatery/src/app/+shared/helpers/firestore.helper'; // tslint:disable-line
import { trackByFn } from '../../../shared/trackBy.helper';

@Component({
  selector: 'fr-entity-selector-dialog',
  templateUrl: './entity-selector.component.html',
  styleUrls: ['./entity-selector.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntitySelectorComponent implements AfterContentInit {
  @ViewChild('search') search: ElementRef;
  searchControl = new FormControl();
  observables = this.data.queries.map(query => {
    return this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(200),
      switchMap(searchText => {
        return this.firestore
          .collection(this.data.collectionName, ref => {
            return query(ref, searchText);
          })
          .snapshotChanges()
          .pipe(map(unwrapCollectionSnapshotChanges));
      }),
    );
  });
  entities: any[];
  items$ = combineLatest
    .apply(this, [
      this.observables,
      (...args) => {
        const items = [];
        args.forEach(entities => entities.forEach(entity => items.push(entity))); //extract items from arrays array[item[], item[]]
        if (this.data.orderByFn) {
          items.sort(this.data.orderByFn);
        }
        return items;
      },
    ])
    .pipe(
      map((entities: any[]) => (this.data.clientSideFilter ? this.data.clientSideFilter(entities) : entities)),
      tap((entities: any[]) => {
        return (this.entities = entities);
      }),
    );
  multipleSelected: { [id: string]: any } = this.data.selectedItems
    ? this.data.selectedItems.reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {})
    : {};
  multipleAmount: { [id: string]: { amount: number; item: any } } = {};
  trackByFn = trackByFn;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: EntitySelectorConfig<any>,
    public dialogRef: MatDialogRef<EntitySelectorComponent>,
    public firestore: AngularFirestore,
  ) {}

  ngAfterContentInit(): void {
    // `setTimeout` is workaround for https://github.com/primefaces/primeng/issues/5004
    setTimeout(() => this.search.nativeElement.focus(), 0);
  }

  getContextForCustomTemplateForSingleMode(item: any): any {
    return {
      item,
      displayField: this.data.displayField,
      select: this.select.bind(this),
    };
  }

  getContextForCustomTemplateForMultipleMode(item: any): any {
    return {
      item,
      displayField: this.data.displayField,
      toggle: this.toggleMultiple.bind(this),
      isItemSelected: this.isItemSelected.bind(this),
    };
  }

  getContextForCustomTemplateForMultipleAmountMode(item: any): any {
    return {
      item,
      displayField: this.data.displayField,
      setAmount: this.setAmount.bind(this),
      getAmount: this.getAmount.bind(this),
    };
  }

  confirmMultiple() {
    this.dialogRef.close(Object.keys(this.multipleSelected).map(id => this.multipleSelected[id]));
  }

  confirmMultipleAmount() {
    this.dialogRef.close(this.multipleAmount);
  }

  select(item): void {
    this.dialogRef.close(item);
  }

  isItemSelected(item): boolean {
    return !!this.multipleSelected[item.id];
  }

  toggleMultiple(item): void {
    if (this.multipleSelected[item.id]) {
      // remove item from the map
      this.multipleSelected = Object.keys(this.multipleSelected)
        .filter(id => id !== item.id)
        .reduce(
          (acc, cur) => ({
            ...acc,
            [cur]: this.multipleSelected[cur],
          }),
          {},
        );
    } else {
      // add item to the map
      this.multipleSelected = { ...this.multipleSelected, [item.id]: item };
    }
  }

  setAmount(item, amount: number): void {
    const newMultipleAmount = {
      ...this.multipleAmount,
      [item.id]: { amount, item },
    };
    if (!amount) {
      delete newMultipleAmount[item.id];
    }
    this.multipleAmount = newMultipleAmount;
  }

  getSelectedAmount(): number {
    return Object.keys(this.multipleSelected).length;
  }

  selectAll(): void {
    this.fillMultipleWithArray(this.entities);
  }

  deselectAll(): void {
    this.fillMultipleWithArray([]);
  }

  fillMultipleWithArray(entities: any[]): void {
    this.multipleSelected = entities.reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {});
  }

  getAmount(item): number {
    const res = this.multipleAmount[item.id];
    return (res && res.amount) || 0;
  }

  areSelectedItemsInvalid(): boolean {
    return Object.keys(this.multipleAmount).some(id => this.multipleAmount[id].amount < 0);
  }

  areItemsSelected(): boolean {
    return Object.keys(this.multipleAmount).length > 0 && this.multipleAmount.constructor === Object;
  }
}
