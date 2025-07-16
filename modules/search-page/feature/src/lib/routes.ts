import { SearchPageStore } from '@angular-youtube/search-page-data-access';
import { RouteData } from '@angular-youtube/shared-data-access';
import { Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';

export const SEARCH_PAGE_ROUTES: Routes = [
  {
    path: '',
    providers: [SearchPageStore],
    component: SearchComponent,
    data: <RouteData>{
      detectRouteTransitions: false,
    },
  },
];
