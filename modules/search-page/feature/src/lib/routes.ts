import { Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';

export const SEARCH_PAGE_ROUTES: Routes = [
  {
    path: '',
    providers: [],
    component: SearchComponent,
  },
];
