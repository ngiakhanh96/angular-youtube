
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 0,
    "preload": [
      "chunk-3WZDO7BM.js"
    ],
    "route": "/"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-3WZDO7BM.js",
      "chunk-2PFPCIUH.js"
    ],
    "route": "/watch"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-3WZDO7BM.js",
      "chunk-2BCFL4UU.js"
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
    'index.csr.html': {size: 58631, hash: '12a5eea991203f7b7bc10a40d8835066c53570ce21605641d0644bbb67eabc23', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 38018, hash: '2db72c9c64b2ba230f127b79245ee0e52afc405e8c3af74eb6bf2ff2eec7d2f3', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-YQFHU3KV.css': {size: 14312, hash: 'fRugfKPKZrc', text: () => import('./assets-chunks/styles-YQFHU3KV_css.mjs').then(m => m.default)}
  },
};
