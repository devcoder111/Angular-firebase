import { OverlayRef } from '@angular/cdk/overlay';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

export class EntitySelectorDropdownWrapper<R = any> {
  private readonly _afterClosed = new Subject<R | undefined>();

  private _result: R | undefined;

  constructor(private overlayRef: OverlayRef) {
    overlayRef.detachments().subscribe(() => {
      this._afterClosed.next(this._result);
      this._afterClosed.complete();
    });
  }

  close(dialogResult?: any): void {
    this._result = dialogResult;
    this.overlayRef.dispose();
  }

  afterClosed(): Observable<R | undefined> {
    return this._afterClosed.asObservable();
  }
}
