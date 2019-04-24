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
import { UsersListFilter } from '../listFilter.interface';
import { AppState } from '../../../../../+core/store/app.state';
import { Subscription } from 'rxjs/Subscription';
import { FormControl, FormGroup } from '@angular/forms';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { select, Store } from '@ngrx/store';
import { isDeepEqual } from '../../../../../+shared/helpers/compare.helper';
import { getUsersListCanBeModified } from '../list.selectors';
import { RolesArray } from '@shared/values/roles.array';
import { trackByFn } from '../../../../../../../../../shared/trackBy.helper';

@Component({
  selector: 'fr-users-list-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListFilterComponent implements OnChanges, OnDestroy {
  @Input()
  filter: UsersListFilter;
  @Output()
  changed = new EventEmitter<UsersListFilter>();
  form: FormGroup;
  sub = new Subscription();
  canBeModified$ = this.store.pipe(select(getUsersListCanBeModified));
  roles = RolesArray;
  trackByFn = trackByFn;

  constructor(private store: Store<AppState>) {}

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

  initForm(filter: UsersListFilter) {
    this.form = new FormGroup({
      displayName: new FormControl(null),
      role: new FormControl(''),
    });
    this.setFormValue(filter);
    this.sub.add(
      this.form.valueChanges.subscribe(formValue => {
        if (!formValue.displayName) {
          // Prevents displayName to be "" (empty string) as we need it to be compared to null
          formValue.displayName = null;
        }
        if (!formValue.role) {
          // Prevents role to be "" (empty string) as we need it to be compared to null
          formValue.role = null;
        }
        const newFilter = setStateProperties(this.filter, {
          ...formValue,
        });
        if (!isDeepEqual(this.filter, newFilter)) {
          // Second check for infinite loop, since in Angular v5.2.7 form.patchValue(...,{emitEvent: false})
          // emits event no matter what
          // TODO: remove check once bug in Angular is fixed
          this.changed.emit(newFilter);
        }
      }),
    );
  }

  setFormValue(filter: UsersListFilter): void {
    this.form.patchValue(filter, { emitEvent: false }); // Set value, but prevent infinite emit loop
  }
}
