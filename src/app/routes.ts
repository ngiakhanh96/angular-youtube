import {
  SharedEffects,
  sharedReducer,
  sharedStateName,
  SharedStore,
  SpinnerService,
} from '@angular-youtube/shared-data-access';
import { ExternalNavigationService } from '@angular-youtube/shared-ui';
import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Route,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { ExternalComponent } from './external.component';

const canNavigateToExternalPage: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const router = inject(Router);
  const spinner = inject(SpinnerService);
  const externalNavigationService = inject(ExternalNavigationService);
  spinner.loadingOn();
  const externalUrl =
    router.getCurrentNavigation()?.extras.state?.['externalUrl'];
  externalNavigationService.navigateByCurrentWindow(externalUrl);
  return false;
};
export const mainRoutes: Route[] = [
  {
    path: '',
    providers: [
      provideState(sharedStateName, sharedReducer),
      provideEffects(SharedEffects),
      SharedStore,
    ],
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
