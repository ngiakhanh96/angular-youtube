import { DetailsPageStore } from '@angular-youtube/details-page-data-access';
import { RouteData } from '@angular-youtube/shared-data-access';
import { Routes } from '@angular/router';
import { VideoDetailsComponent } from './video-details/video-details.component';

export const DETAILS_PAGE_ROUTES: Routes = [
  {
    path: '',
    providers: [DetailsPageStore],
    component: VideoDetailsComponent,
    data: <RouteData>{
      detectRouteTransitions: false,
    },
  },
];
