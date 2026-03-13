import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnpluginBuildZip from '@tonywater/unplugin-build-zip/vite'

export default defineConfig({
  plugins: [
    vue(),
    UnpluginBuildZip({
      filename: 'vue3-vite-dist'
    })
  ],
})
