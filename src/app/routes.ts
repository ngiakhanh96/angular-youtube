import {
  HomePageEffects,
  homePageReducer,
  homePageStateName,
} from '@angular-youtube/home-page-data-access';
import {
  SharedEffects,
  sharedReducer,
  sharedStateName,
} from '@angular-youtube/shared-data-access';
import { SpinnerService } from '@angular-youtube/shared-ui';
import { LayoutComponent } from '@angular-youtube/shell-feature';
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
  spinner.loadingOn();
  const externalUrl =
    router.getCurrentNavigation()?.extras.state?.['externalUrl'];
  window.open(externalUrl, '_self');
  return false;
};
export const mainRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    children: [],
    providers: [
      provideState(homePageStateName, homePageReducer),
      provideState(sharedStateName, sharedReducer),
      provideEffects(SharedEffects, HomePageEffects),
    ],
  },
  {
    path: 'externalRedirect',
    canActivate: [canNavigateToExternalPage],
    // We need a component here because we cannot define the route otherwise
    component: ExternalComponent,
  },
];
