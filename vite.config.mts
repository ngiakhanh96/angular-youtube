/// <reference types='vitest' />
import angular from '@analogjs/vite-plugin-angular';
import { defineConfig } from 'vite';
import { nxReadySignal } from '@nx/vite/plugins/nx-ready-signal.plugin';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: './node_modules/.vite/angular-youtube',
  plugins: [angular(), nxReadySignal()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    name: 'angular-youtube',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['src/test-setup.ts'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: './coverage/angular-youtube',
      provider: 'v8' as const,
    },
  },
}));
