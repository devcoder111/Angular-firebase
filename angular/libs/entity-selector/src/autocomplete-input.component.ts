import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  Component,
  ElementRef,
  Host,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Self,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, ValidatorFn } from '@angular/forms';
import { MatFormField, MatFormFieldControl } from '@angular/material';
import { EntitySelectorDialogService } from '@libs/entity-selector/src/entity-selector-dialog.service';
import { EntitySelectorConfig } from '@libs/entity-selector/src/entity-selector.module';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'fr-autocomplete-input',
  template: `<input type="text" matInput #input (focus)="performOnFocus()" [disabled]="disabled">`,
  providers: [
    { provide: MatFormFieldControl, useExisting: AutocompleteInputComponent },
    // TODO: { provide: NG_VALIDATORS, useExisting: forwardRef(() => AutocompleteInputComponent), multi: true }
  ],
})
export class AutocompleteInputComponent
  implements ControlValueAccessor, MatFormFieldControl<string>, OnInit, OnChanges, OnDestroy {
  static nextId = 0;
  @ViewChild('input')
  inputElRef: ElementRef;
  @Input()
  config: EntitySelectorConfig<Object>;
  stateChanges = new Subject<void>();
  focused = false;
  // noinspection JSUnusedGlobalSymbols
  controlType = 'fr-autocomplete-input';
  // noinspection JSUnusedGlobalSymbols
  errorState = false;
  id = `fr-autocomplete-input-${AutocompleteInputComponent.nextId++}`;
  describedBy = '';
  private validateFn: ValidatorFn;
  private sub = new Subscription();
  // noinspection JSUnusedLocalSymbols
  private _onChange = (val: any) => {};
  private _onTouched = () => {};

  constructor(
    private elRef: ElementRef,
    @Optional()
    @Host()
    private _formField: MatFormField,
    private fm: FocusMonitor,
    private entitySelectorDialog: EntitySelectorDialogService,
    @Optional()
    @Self()
    public ngControl: NgControl,
    public firestore: AngularFirestore,
  ) {
    if (this.ngControl !== null) {
      this.ngControl.valueAccessor = this;
    }
    this.sub.add(
      this.fm.monitor(this.elRef.nativeElement, true).subscribe(origin => {
        this.focused = !!origin;
        this.stateChanges.next();
      }),
    );
  }

  _value: string;

  @Input()
  get value(): string | null {
    return this._value || null;
  }

  set value(value: string | null) {
    this._value = value;
    this.stateChanges.next();
    if (this.config && this.config.getViewValue) {
      this.config.getViewValue(value, this.setLabel.bind(this));
    } else {
      this.setLabel(value);
    }
  }

  private _placeholder: string;

  @Input()
  get placeholder() {
    return this._placeholder;
  }

  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }

  private _required = false;

  @Input()
  get required() {
    return this._required;
  }

  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }

  private _disabled = false;

  @Input()
  get disabled() {
    return this._disabled || !this.config;
  }

  set disabled(dis) {
    this._disabled = coerceBooleanProperty(dis);
    this.stateChanges.next();
  }

  private _isDropdownOpened = false;

  get isDropdownOpened(): boolean {
    return this._isDropdownOpened;
  }

  set isDropdownOpened(value: boolean) {
    this._isDropdownOpened = value;
    this.stateChanges.next();
  }

  get empty() {
    return !this._value;
  }

  // noinspection JSUnusedGlobalSymbols
  get shouldLabelFloat() {
    return this.focused || !this.empty || this.isDropdownOpened;
  }

  // noinspection JSUnusedGlobalSymbols
  get shouldPlaceholderFloat() {
    return this.focused || !this.empty || this.isDropdownOpened;
  }

  ngOnInit(): void {
    if (!this.config) {
      this.setLabel(''); // this prevents flickering from "id" to "viewValue" on init
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && this.config && this.config.getViewValue) {
      this.config.getViewValue(this.value, this.setLabel.bind(this));
    }
  }

  ngOnDestroy(): void {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef.nativeElement);
    this.sub.unsubscribe();
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // noinspection JSUnusedGlobalSymbols
  async performOnFocus() {
    if (this.disabled) {
      return;
    }
    this.isDropdownOpened = true;
    const resultBeforeCheck = await this.entitySelectorDialog.showDropdown<Object>(
      this._getConnectedElement(),
      this.config,
    );
    this.isDropdownOpened = false;
    //TODO don't ignore returned value
    if (this.config.checkFn) {
      await this.config.checkFn(resultBeforeCheck);
    }
    this._onTouched();
  }

  writeValue(value: any): void {
    this.value = value;
    if (value) {
      this._onChange(value);
    }
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  validate(c: FormControl) {
    return this.validateFn(c);
  }

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() !== 'input') {
      this.inputElRef.nativeElement.focus();
    }
  }

  private setLabel(labelValue: string) {
    this.inputElRef.nativeElement.value = labelValue;
  }

  private _getConnectedElement(): ElementRef {
    return this._formField ? this._formField._connectionContainerRef : this.inputElRef;
  }
}
