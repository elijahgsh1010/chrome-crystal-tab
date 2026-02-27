import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import fs from 'fs'

// Custom plugin to copy manifest.json and assets
const copyFilesPlugin = {
  name: 'copy-files',
  apply: 'build',
  writeBundle: () => {
    // Copy manifest.json
    fs.copyFileSync(
      path.resolve(__dirname, 'manifest.json'),
      path.resolve(__dirname, 'dist', 'manifest.json')
    )
    
    // Create assets directory if it doesn't exist
    if (!fs.existsSync(path.resolve(__dirname, 'dist', 'src', 'assets'))) {
      fs.mkdirSync(path.resolve(__dirname, 'dist', 'src', 'assets'), { recursive: true })
    }
  }
}

export default defineConfig({
  plugins: [vue(), copyFilesPlugin],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        newtab: path.resolve(__dirname, 'src/pages/newtab.html'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
})
