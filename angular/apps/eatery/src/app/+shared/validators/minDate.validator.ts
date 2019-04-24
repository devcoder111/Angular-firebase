import { AbstractControl, ValidatorFn } from '@angular/forms';

export function minDateValidator(minDate: Date): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const valid = control.value >= minDate;
    return valid ? null : { minDate: { value: control.value } };
  };
}
