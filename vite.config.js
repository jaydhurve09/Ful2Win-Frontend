import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')

  const isProduction = mode === 'production';
  const apiBaseUrl = env.VITE_API_BACKEND_URL || 'http://localhost:5000';
  
  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: !isProduction ? {
        '/api': {
          target: apiBaseUrl,
          changeOrigin: true,
          secure: false,
          ws: true,
          pathRewrite: {
            '^/api': '' // Remove /api prefix when forwarding to backend
          },
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('Proxy error:', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('Proxying request to:', req.method, req.url);
              console.log('Proxying to target:', proxyReq.path);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('Received response from backend:', proxyRes.statusCode, req.url);
            });
          }
        }
      } : undefined,
      cors: true
    },
    preview: {
      port: 4173,
      proxy: {
        '/api': {
          target: apiBaseUrl,
          changeOrigin: true,
          secure: false
        }
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: !isProduction,
      target: 'esnext',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: isProduction
        }
      }
    },
    base: './'
  };
});
