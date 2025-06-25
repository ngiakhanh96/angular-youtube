import {
  HomePageEffects,
  homePageReducer,
  homePageStateName,
} from '@angular-youtube/home-page-data-access';
import { RouteData } from '@angular-youtube/shared-data-access';
import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { BrowseComponent } from './browse/browse.component';

export const HOME_PAGE_ROUTES: Routes = [
  {
    path: '',
    providers: [
      provideState(homePageStateName, homePageReducer),
      provideEffects(HomePageEffects),
    ],
    component: BrowseComponent,
    data: <RouteData>{
      detectRouteTransitions: false,
    },
  },
];
