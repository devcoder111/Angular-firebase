import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { UIMenuToggleAction } from '../../+store/actions/uiMenuToggle.action';
import { AppState } from '../../../+core/store/app.state';
import { NotImplementedService } from '../../../+shared/not-implemented/not-implemented.service';

@Component({
  selector: 'fr-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  constructor(private store: Store<AppState>, private notImplementedService: NotImplementedService) {}

  toggleMenu(): void {
    this.store.dispatch(new UIMenuToggleAction());
  }

  showFeatureNotImplementedYetMessage(): void {
    this.notImplementedService.showSnackbar();
  }
}
