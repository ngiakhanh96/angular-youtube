import { Routes } from '@angular/router';
import { VideoDetailsComponent } from './video-details/video-details.component';

export const DETAILS_PAGE_ROUTES: Routes = [
  {
    path: '',
    component: VideoDetailsComponent,
  },
];
