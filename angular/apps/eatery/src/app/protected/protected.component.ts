import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatSidenav } from '@angular/material';
import { NavigationStart, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { filter, first, map, withLatestFrom } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { AppState } from '../+core/store/app.state';
import { isActivePositionLocation } from '../+core/store/selectors';
import { NotImplementedService } from '../+shared/not-implemented/not-implemented.service';
import { UIMenuToggleAction } from './+store/actions/uiMenuToggle.action';
import { UISetDeviceTypeAction } from './+store/actions/uiSetDeviceType.action';

@Component({
  selector: 'fr-protected',
  templateUrl: './protected.component.html',
  styleUrls: ['./protected.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProtectedComponent implements AfterViewInit, OnDestroy {
  @ViewChild('sidenav')
  sidenav: MatSidenav;
  sidenavMode$ = this.store.pipe(
    select(s => s.protected.ui.deviceType),
    map(dt => (dt === 'mobile' ? 'over' : 'side')),
  );
  isMenuOpened$ = this.store.pipe(select(s => s.protected.ui.isMenuOpened));

  isActivePositionLocation$ = this.store.pipe(select(isActivePositionLocation));

  sub = new Subscription();

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private notImplementedService: NotImplementedService,
  ) {
    breakpointObserver.observe([Breakpoints.HandsetLandscape, Breakpoints.HandsetPortrait]).subscribe(result => {
      if (result.matches) {
        this.store.dispatch(new UISetDeviceTypeAction('mobile'));
      }
    });
    breakpointObserver.observe([Breakpoints.TabletPortrait, Breakpoints.TabletLandscape]).subscribe(result => {
      if (result.matches) {
        this.store.dispatch(new UISetDeviceTypeAction('tablet'));
      }
    });
    breakpointObserver.observe([Breakpoints.WebLandscape, Breakpoints.WebLandscape]).subscribe(result => {
      if (result.matches) {
        this.store.dispatch(new UISetDeviceTypeAction('desktop'));
      }
    });
  }

  ngAfterViewInit() {
    this.sub.add(
      this.router.events
        .pipe(
          filter(e => e instanceof NavigationStart),
          withLatestFrom(this.store),
          map(([event, state]: [any, AppState]) => state.protected.ui.deviceType),
          filter(v => v === 'mobile'),
        )
        .subscribe(() => this.sidenav.close()),
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onOpenedChange(isOpened: boolean): void {
    const sub = this.isMenuOpened$
      .pipe(
        first(),
        filter(v => v !== isOpened),
      )
      .subscribe(() => this.store.dispatch(new UIMenuToggleAction(isOpened)));
    sub.unsubscribe();
  }

  showFeatureNotImplementedYetMessage(): void {
    this.notImplementedService.showSnackbar();
  }
}
