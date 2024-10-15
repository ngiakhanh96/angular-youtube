import {
  HomePageEffects,
  homePageReducer,
  homePageStateName,
} from '@angular-youtube/home-page-data-access';
import {
  CommonEffects,
  loginReducer,
  loginStateName,
  SharedEffects,
  sharedReducer,
  sharedStateName,
} from '@angular-youtube/shared-data-access';
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
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
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
      provideState(loginStateName, loginReducer),
      provideState(homePageStateName, homePageReducer),
      provideState(sharedStateName, sharedReducer),
      provideEffects(SharedEffects, CommonEffects, HomePageEffects),
    ],
  },
  {
    path: 'externalRedirect',
    canActivate: [canNavigateToExternalPage],
    // We need a component here because we cannot define the route otherwise
    component: ExternalComponent,
  },
];
