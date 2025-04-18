import { BaseWithSandBoxComponent } from '@angular-youtube/shared-data-access';
import {
  ExternalNavigationService,
  SidebarService,
} from '@angular-youtube/shared-ui';
import { Directive, effect, inject, linkedSignal } from '@angular/core';
import { Router } from '@angular/router';
import {
  ExternalRoutesByCurrentWindowWithoutLocationChange,
  ExternalRoutesByOpeningNewWindow,
  InternalRoutesByCurrentWindow,
} from './sidebar-routes';

@Directive()
export abstract class BaseSidebarComponent extends BaseWithSandBoxComponent {
  router = inject(Router);
  externalNavigationService = inject(ExternalNavigationService);
  sidebarService = inject(SidebarService);
  selectedIconName = linkedSignal(() => this.sidebarService.selectedIconName());
  selectedIconNameChange(selectedIconName: string | null) {
    const prevIconName = this.selectedIconName();
    this.selectedIconName.set(selectedIconName);
    if (InternalRoutesByCurrentWindow.has(selectedIconName)) {
      this.router.navigate([
        InternalRoutesByCurrentWindow.get(selectedIconName),
      ]);
      return;
    }

    if (ExternalRoutesByOpeningNewWindow.has(selectedIconName)) {
      this.externalNavigationService.navigateByOpeningNewWindow(
        ExternalRoutesByOpeningNewWindow.get(selectedIconName),
      );
      setTimeout(() => {
        this.selectedIconName.set(prevIconName);
      });
      return;
    }

    if (
      ExternalRoutesByCurrentWindowWithoutLocationChange.has(selectedIconName)
    ) {
      this.externalNavigationService.navigateWithinAppWithoutLocationChange(
        ExternalRoutesByCurrentWindowWithoutLocationChange.get(
          selectedIconName,
        ),
      );
      return;
    }
  }

  constructor() {
    super();
    effect(() => {
      this.sidebarService.setSelectedIconName(this.selectedIconName());
    });
  }
}
