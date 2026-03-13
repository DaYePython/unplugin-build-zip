export interface Options {
  /**
   * 压缩包文件名，不含 `.zip` 后缀
   * 默认取 vite `build.outDir` 的 basename（通常为 `"dist"`）
   */
  filename?: string
  /**
   * 完成后将 zip 文件本身（文件拖放格式）复制到系统剪切板
   * @default true
   */
  copyToClipboard?: boolean
  /**
   * 完成后发送系统通知
   * @default true
   */
  notify?: boolean
}
