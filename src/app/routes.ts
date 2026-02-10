import { ExternalNavigationService } from '@angular-youtube/shared-ui';
import { inject } from '@angular/core';
import { CanActivateFn, Route, Router } from '@angular/router';
import { ExternalComponent } from './external.component';

const canNavigateToExternalPage: CanActivateFn = () => {
  const router = inject(Router);
  const externalNavigationService = inject(ExternalNavigationService);
  const externalUrl = router.currentNavigation()?.extras.state?.[
    'externalUrl'
  ] as string;
  externalNavigationService.navigateByOpeningNewWindow(externalUrl);
  return false;
};
export const mainRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('@angular-youtube/shell-feature').then((m) => m.SHELL_ROUTES),
  },
  {
    path: 'externalRedirect',
    canActivate: [canNavigateToExternalPage],
    // We need a component here because we cannot define the route otherwise
    component: ExternalComponent,
  },
];
