import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'admin-mpa-dev',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url || '';
          if (url === '/admin' || url.startsWith('/admin/')) {
            const lastSegment = url.split('/').pop() || '';
            const hasExt = lastSegment.includes('.');
            if (!hasExt) {
              const html = readFileSync(resolve(__dirname, 'admin/index.html'), 'utf-8');
              res.setHeader('Content-Type', 'text/html');
              res.setHeader('Cache-Control', 'no-store');
              res.end(html);
              return;
            }
          }
          next();
        });
      },
    },
  ],
  resolve: {
    alias: {
      '@shared': resolve(__dirname, 'src/shared'),
      '@client': resolve(__dirname, 'src/client'),
      '@admin': resolve(__dirname, 'src/admin'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        client: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin/index.html'),
      },
      output: {
        entryFileNames: (chunk) => {
          if (chunk.name === 'admin') return 'admin/assets/[name]-[hash].js';
          return 'assets/[name]-[hash].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (asset) => {
          if (asset.name?.startsWith('admin/')) return 'admin/assets/[name][extname]';
          return 'assets/[name][extname]';
        },
      },
    },
    outDir: 'dist',
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
