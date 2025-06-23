import {
  DetailsPageEffects,
  detailsPageReducer,
  detailsPageStateName,
} from '@angular-youtube/details-page-data-access';
import { RouteData } from '@angular-youtube/shared-data-access';
import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { VideoDetailsComponent } from './video-details/video-details.component';

export const DETAILS_PAGE_ROUTES: Routes = [
  {
    path: '',
    providers: [
      provideState(detailsPageStateName, detailsPageReducer),
      provideEffects(DetailsPageEffects),
    ],
    component: VideoDetailsComponent,
    data: <RouteData>{
      detectRouteTransitions: false,
    },
  },
];
