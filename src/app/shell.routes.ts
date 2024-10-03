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
import { HomePageEffects } from '../../modules/home-page/data-access/src/lib/store/effects/home-page.effect';
import {
  homePageReducer,
  homePageStateName,
} from '../../modules/home-page/data-access/src/lib/store/reducers/home-page.reducer';

export const shellRoutes: Route[] = [
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
