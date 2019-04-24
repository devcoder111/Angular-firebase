import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[frAutofocus]',
})
export class AutofocusDirective implements OnInit {
  constructor(private el: ElementRef) {}

  private _autofocus;

  @Input('frAutofocus')
  set autofocus(condition: boolean) {
    this._autofocus = condition !== false;
  }

  ngOnInit() {
    if (this._autofocus || typeof this._autofocus === 'undefined') {
      this.el.nativeElement.focus(); // For SSR (server side rendering) this is not safe.
      // Use: https://github.com/angular/angular/issues/15008#issuecomment-285141070)
    }
  }
}
