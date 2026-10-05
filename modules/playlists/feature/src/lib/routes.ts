import { PlaylistsStore } from '@angular-youtube/playlists-data-access';
import { Routes } from '@angular/router';
import { PlaylistsComponent } from './playlists/playlists.component';

export const PLAYLISTS_ROUTES: Routes = [
  {
    path: '',
    component: PlaylistsComponent,
    providers: [PlaylistsStore],
    data: { detectRouteTransitions: false },
  },
];
