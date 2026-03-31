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
        rollupOptions: {
            output: {
                manualChunks: {
                    'animations': ['gsap', 'framer-motion', 'lenis'],
                    'vendor': ['react', 'react-dom', 'react-router-dom'],
                    'api': ['axios', '@tanstack/react-query'],
                },
            },
        },
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
            },
        },
        sourcemap: false,
        cssCodeSplit: true,
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
    define: {
        __PERFORMANCE_OPTIMIZED__: true,
    },
});
