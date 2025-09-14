
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 0,
    "preload": [
      "chunk-DTOPGZNL.js"
    ],
    "route": "/"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-DTOPGZNL.js",
      "chunk-ASRVYVJ2.js"
    ],
    "route": "/watch"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-DTOPGZNL.js",
      "chunk-ZU7ABINZ.js"
    ],
    "route": "/results"
  },
  {
    "renderMode": 1,
    "route": "/externalRedirect"
  },
  {
    "renderMode": 2,
    "route": "/ng-app-shell"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 58630, hash: '3d11876add9a896791d940f91ea0f462cad32b5f6bb500bd980b727a0f6a239b', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 38018, hash: '7f52c252bb48a6e18d60f0ccb506dc495a8f67419592bc49effeea71b863731e', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-YQFHU3KV.css': {size: 14312, hash: 'fRugfKPKZrc', text: () => import('./assets-chunks/styles-YQFHU3KV_css.mjs').then(m => m.default)}
  },
};
