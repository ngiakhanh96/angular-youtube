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
import { Route } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

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
];
