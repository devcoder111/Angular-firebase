import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { AsyncValidatorFn, ValidationErrors } from '@angular/forms/src/directives/validators';
import { select, Store } from '@ngrx/store';
import { Location } from '@shared/types/location.interface';
import { CollectionNames } from '@shared/values/collectionNames.map';
import { RolesArray } from '@shared/values/roles.array';
import { AngularFirestore } from 'angularfire2/firestore';
import { debounceTime, first, map, switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { AppState } from '../../../../+core/store/app.state';
import { getActiveOrganizationId } from '../../../../+core/store/selectors';
import { isDeepEqual } from '../../../../+shared/helpers/compare.helper';
import { unwrapCollectionSnapshotChanges } from '../../../../+shared/helpers/firestore.helper';
import { setStateProperties } from '@shared/helpers/state/state.helper';
import { trackByFn } from '../../../../../../../../shared/trackBy.helper';
import { getCurrentUser } from '../../../../../../../../shared/getUser.helper';

@Component({
  selector: 'fr-locations-editor-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationsEditorFormComponent implements OnChanges, OnDestroy {
  @Input()
  location: Location;
  @Input()
  isReadOnly: boolean;
  @Output()
  changed = new EventEmitter<Location>();
  form: FormGroup;
  sub = new Subscription();
  roles = RolesArray;

  trackByFn = trackByFn;

  constructor(private db: AngularFirestore, private store: Store<AppState>, private cd: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['location']) {
      if (this.form) {
        this.setFormValue(this.location);
      } else {
        this.initForm(this.location);
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

  initForm(location: Location) {
    this.form = new FormGroup(
      {
        name: new FormControl(null, Validators.required),
        code: new FormControl(null, {
          updateOn: 'change',
          validators: [Validators.required, Validators.minLength(3)],
          asyncValidators: this.checkCodeUnique(this.store, this.db, location.id),
        }),
        details: new FormControl(null, Validators.required),
        address: new FormControl(null, Validators.required),
      },
      { updateOn: 'blur' },
    );
    this.setFormValue(location);
    this.sub.add(
      this.form.valueChanges.subscribe(formValue => {
        const correctedCode = this.correctCode();
        const newLocation = setStateProperties(this.location, {
          ...formValue,
          code: correctedCode,
        });
        if (formValue.code !== correctedCode || !isDeepEqual(this.location, newLocation)) {
          // Second check for infinite loop, since in Angular v5.2.7 form.patchValue(...,{emitEvent: false})
          // emits event no matter what
          // TODO: remove check once bug in Angular is fixed
          this.changed.emit(newLocation);
        }
      }),
    );
  }

  setFormValue(location: Location): void {
    this.form.patchValue(location, { emitEvent: false }); // Set value, but prevent infinite emit loop
  }

  correctCode() {
    const name = this.form.controls['name'].value;
    let code = this.form.controls['code'].value;
    if (!code && name) {
      code = name.substr(0, 3).toUpperCase();
    }
    if (this.location.code !== code && code) {
      code = code
        .replace(/[^a-zA-Z0-9_]/g, '')
        .substr(0, 3)
        .toUpperCase();
    }
    return code;
  }

  checkCodeUnique(store: Store<AppState>, db: AngularFirestore, locationId: string): AsyncValidatorFn {
    return async (control: AbstractControl): Promise<ValidationErrors | null> => {
      const userId = (await getCurrentUser(this.store)).id;
      return store
        .pipe(
          debounceTime(300),
          select(getActiveOrganizationId),
          first(),
          switchMap(organizationId => {
            return db
              .collection<Location>(`${CollectionNames.locations}`, ref =>
                ref
                  .limit(20)
                  .where('code', '==', control.value)
                  .where('availableForUsers', 'array-contains', userId)
                  .where('organizationId', '==', organizationId),
              )
              .snapshotChanges()
              .pipe(
                map(unwrapCollectionSnapshotChanges),
                first(),
              );
          }),
          map(locations => {
            const duplicatedLocations = locationId ? locations.filter(l => l.id !== locationId) : locations || [];
            setTimeout(() => {
              try {
                this.cd.detectChanges();
              } catch (e) {
                // component is destroyed already
              }
            });
            return duplicatedLocations.length ? <ValidationErrors>{ alreadyTaken: true } : null;
          }),
        )
        .toPromise();
    };
  }
}
