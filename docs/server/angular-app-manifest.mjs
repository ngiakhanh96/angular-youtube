
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 0,
    "preload": [
      "chunk-H6QYJXLR.js"
    ],
    "route": "/"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-H6QYJXLR.js",
      "chunk-ASRVYVJ2.js"
    ],
    "route": "/watch"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-H6QYJXLR.js",
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
    'index.csr.html': {size: 58631, hash: '09297f4378e02f04459cebe7c5ae73f2e2a23c69264f2947c70e2400f3165ba6', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 38018, hash: '386a18cabb3e040e21a59fa804bdab60fe848c8ea93d72ca8e3746eb0a7c1c70', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-YQFHU3KV.css': {size: 14312, hash: 'fRugfKPKZrc', text: () => import('./assets-chunks/styles-YQFHU3KV_css.mjs').then(m => m.default)}
  },
};
