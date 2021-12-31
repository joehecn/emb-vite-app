import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  root: path.join(__dirname, 'src', 'renderer'),
  base: path.join(__dirname, 'dist', 'renderer/'),
  publicDir: 'public',
  server: {
    port: 8080,
    open: false
  },
  build: {
    outDir: path.join(__dirname, 'dist', 'renderer')
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src', 'renderer')
    }
  }
});
