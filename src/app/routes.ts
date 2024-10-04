import {
  HomePageEffects,
  homePageReducer,
  homePageStateName,
} from '@angular-youtube/home-page-data-access';
import {
  CommonEffects,
  commonReducer,
  CommonSandboxService,
  commonStateName,
  SandboxService,
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
      provideState(commonStateName, commonReducer),
      provideState(homePageStateName, homePageReducer),
      provideEffects(CommonEffects, HomePageEffects),
      { provide: SandboxService, useExisting: CommonSandboxService },
    ],
  },
];
