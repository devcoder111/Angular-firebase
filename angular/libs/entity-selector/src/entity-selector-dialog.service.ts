import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { ElementRef, Injectable, Injector } from '@angular/core';
import { MatDialog } from '@angular/material';
import { EntitySelectorDropdownWrapper } from '@libs/entity-selector/src/dropdown-wrapper.service';
import { EntitySelectorComponentDialog } from '@libs/entity-selector/src/entity-selector-dialog.component';
import {
  ENTITY_SELECTOR_DROPDOWN_DATA,
  EntitySelectorDropdownComponent,
} from '@libs/entity-selector/src/entity-selector-dropdown.component';
import { EntitySelectorConfig } from '@libs/entity-selector/src/entity-selector.module';

@Injectable()
export class EntitySelectorDialogService {
  constructor(public dialog: MatDialog, private injector: Injector, private overlay: Overlay) {}

  show<T>(params: EntitySelectorConfig<T>): Promise<any> {
    const dialogRef = this.dialog.open(EntitySelectorComponentDialog, {
      width: params.width ? params.width : '330px',
      data: params,
      panelClass: 'fr-entity-selector-dialog-panel',
    });
    return dialogRef.afterClosed().toPromise();
  }

  showDropdown<T>(connectedElement: ElementRef, params: EntitySelectorConfig<T>): Promise<any> {
    // overlayConfig
    const positionStrategy = this.overlay
      .position()
      .connectedTo(connectedElement, { originX: 'start', originY: 'bottom' }, { overlayX: 'start', overlayY: 'top' })
      .withFallbackPosition({ originX: 'start', originY: 'top' }, { overlayX: 'start', overlayY: 'bottom' });
    const overlayConfig = new OverlayConfig({
      hasBackdrop: true,
      panelClass: 'fr-dropdown',
      positionStrategy,
      width: connectedElement.nativeElement.getBoundingClientRect().width,
    });

    // overlayRef
    const overlayRef = this.overlay.create(overlayConfig);
    const dropdownWrapper = new EntitySelectorDropdownWrapper<T>(overlayRef);
    overlayRef.backdropClick().subscribe(() => dropdownWrapper.close(undefined));

    // portalInjector
    const injectionTokens = new WeakMap();
    injectionTokens.set(EntitySelectorDropdownWrapper, dropdownWrapper);
    injectionTokens.set(ENTITY_SELECTOR_DROPDOWN_DATA, params);
    const portalInjector = new PortalInjector(this.injector, injectionTokens);

    // containerPortal
    const containerPortal = new ComponentPortal(EntitySelectorDropdownComponent, null, portalInjector);
    overlayRef.attach(containerPortal);
    return dropdownWrapper.afterClosed().toPromise();
  }
}
