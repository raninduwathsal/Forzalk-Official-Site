import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    {
      name: 'rewrite-middleware',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/dev' || req.url === '/dev/') {
            req.url = '/dev.html';
          } else if (req.url === '/shop' || req.url === '/shop/') {
            req.url = '/shop.html';
          } else if (req.url === '/design' || req.url === '/design/') {
            req.url = '/index.html';
          }
          next();
        });
      }
    }
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        shop: resolve(__dirname, 'shop.html'),
        dev: resolve(__dirname, 'dev.html')
      }
    }
  }
});

