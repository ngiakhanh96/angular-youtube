import {
  homePageReducer,
  homePageStateName,
} from '@angular-youtube/home-page-data-access';
import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { BrowseComponent } from './browse/browse.component';

export const HOME_PAGE_ROUTES: Routes = [
  {
    path: '',
    providers: [provideState(homePageStateName, homePageReducer)],
    component: BrowseComponent,
  },
];
