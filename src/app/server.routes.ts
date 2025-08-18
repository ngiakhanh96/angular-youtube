import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Server,
  },
  {
    path: 'watch',
    renderMode: RenderMode.Server,
  },
  {
    path: 'results',
    renderMode: RenderMode.Server,
  },
  {
    path: 'externalRedirect',
    renderMode: RenderMode.Client, // No SSR needed for redirects
  },
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
