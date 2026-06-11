import UnpluginBuildZip from '@tonywater/unplugin-build-zip/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    UnpluginBuildZip({
      filename: 'vue3-vite-dist',
      folder: 'dist',
    }),
  ],
})
