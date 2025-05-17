import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import json from '@rollup/plugin-json';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react(), json()],
  resolve: {
    alias: {
      '@mui/styled-engine': resolve(__dirname, 'node_modules/@mui/styled-engine-sc')
    }
  }
});
