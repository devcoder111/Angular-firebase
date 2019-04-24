import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { trackByFn } from '../../../../../../../shared/trackBy.helper';

@Component({
  selector: 'fr-status-filter',
  templateUrl: './statusFilter.component.html',
  styleUrls: ['./statusFilter.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StatusFilterComponent),
      multi: true,
    },
  ],
})
export class StatusFilterComponent implements ControlValueAccessor {
  @Input() options: { title: string; value: any }[];
  @Input() value: any;
  @Input() showAllItems = true;
  @Output() changed = new EventEmitter<any>();
  trackByFn = trackByFn;

  private propagateChange = (value: any) => {};

  constructor(private cd: ChangeDetectorRef) {}

  setValue(value: any): void {
    this.changed.emit(value);
    this.propagateChange(value);
  }

  writeValue(obj: any): void {
    this.value = obj;
    this.cd.detectChanges();
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {}
}
