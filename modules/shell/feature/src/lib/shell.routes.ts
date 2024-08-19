import { Route } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { featuredUserStateKey, featuredUserStateReducer, UserEffect } from '@angular-youtube/shell-data-access';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

export const shellRoutes: Route[] = [
    {
      path: '',
      component: LayoutComponent,
      children: [],
      providers: [
        provideState(featuredUserStateKey, featuredUserStateReducer),
        provideEffects(UserEffect)
      ],
    },
];
