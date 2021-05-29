import { Route } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

export const shellRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    children: [],
  },
];
