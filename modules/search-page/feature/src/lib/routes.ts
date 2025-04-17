import {
  SearchPageEffects,
  searchPageReducer,
  searchPageStateName,
} from '@angular-youtube/search-page-data-access';
import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { SearchComponent } from './search/search.component';

export const SEARCH_PAGE_ROUTES: Routes = [
  {
    path: '',
    providers: [
      provideState(searchPageStateName, searchPageReducer),
      provideEffects(SearchPageEffects),
    ],
    component: SearchComponent,
  },
];
