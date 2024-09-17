import {
  CommonEffects,
  commonReducer,
  CommonSandboxService,
  commonStateName,
  SandboxService,
} from '@angular-youtube/shared-data-access';
import { Route } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { LayoutComponent } from './layout/layout.component';

export const shellRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    children: [],
    providers: [
      provideState(commonStateName, commonReducer),
      provideEffects(CommonEffects),
      { provide: SandboxService, useExisting: CommonSandboxService },
    ],
  },
];
