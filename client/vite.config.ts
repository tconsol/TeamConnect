import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.warn'],
      },
    },
    sourcemap: false,
    cssCodeSplit: true,
    // Keep assets as separate files so browser can cache them independently
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Separate heavy animation libraries
          if (id.includes('gsap')) return 'gsap';
          if (id.includes('framer-motion')) return 'framer-motion';
          if (id.includes('lenis')) return 'lenis';
          // React core
          if (id.includes('react-dom') || id.includes('react-router')) return 'react-vendor';
          if (id.includes('react')) return 'react-vendor';
          // Data fetching
          if (id.includes('@tanstack') || id.includes('axios')) return 'api';
          // Icons (large package)
          if (id.includes('react-icons')) return 'icons';
        },
        // Predictable chunk names for better cache invalidation
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 600,
    reportCompressedSize: false,
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
