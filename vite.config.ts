import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import dts from 'vite-plugin-dts';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [
    svelte(),
    dts({ 
      include: ["src"],
      exclude: ["src/**/*.svelte"],
      compilerOptions: {
        allowJs: true
      },
      insertTypesEntry: true,
      rollupTypes: true
     })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index'
    },
    rollupOptions: {
      external: ['svelte', 'svelte/internal'],
      output: {
        assetFileNames: (assetInfo) => {
          // Name CSS files as theme.css
          if (assetInfo.names?.[0].endsWith('.css')) {
            return 'theme[extname]';
          }
          return '[name][extname]';
        },
        globals: {}
      }
    },
    cssCodeSplit: false,
    sourcemap: false,
    emptyOutDir: true
  }
});
