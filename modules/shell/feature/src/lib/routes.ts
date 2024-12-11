import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

export const SHELL_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
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
    ],
  },
];