import { AbstractControl, Validators } from '@angular/forms';
import { mailRegex } from '@shared/checks/regex';

export function trackByFn(fieldName: string = 'id'): Function {
  return (index: number, item: any) => item[fieldName] || null;
}

// TODO: will be fixed in Angular 6, temp workaround because email-validator in Angular 5 deny empty values, https://github.com/angular/angular/issues/16183
export const AdvancedEmailValidator = Validators.pattern(mailRegex);
