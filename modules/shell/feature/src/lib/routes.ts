import {
  HeaderEffects,
  headerReducer,
  headerStateName,
} from '@angular-youtube/header-data-access';
import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { LayoutComponent } from './layout/layout.component';

export const SHELL_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    providers: [
      provideState(headerStateName, headerReducer),
      provideEffects(HeaderEffects),
    ],
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadChildren: () =>
          import('@angular-youtube/home-page-feature').then(
            (m) => m.HOME_PAGE_ROUTES,
          ),
      },
      {
        path: 'watch',
        loadChildren: () =>
          import('@angular-youtube/details-page-feature').then(
            (m) => m.DETAILS_PAGE_ROUTES,
          ),
      },
      {
        path: 'results',
        loadChildren: () =>
          import('@angular-youtube/search-page-feature').then(
            (m) => m.SEARCH_PAGE_ROUTES,
          ),
      },
    ],
  },
];
