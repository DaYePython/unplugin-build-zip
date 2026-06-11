export interface Options {
  /**
   * 压缩包文件名，不含 `.zip` 后缀
   * 默认取 vite `build.outDir` 的 basename（通常为 `"dist"`）
   */
  filename?: string
  /**
   * zip 内嵌文件夹名称
   * 未配置时，保持当前行为：直接压缩输出目录中的文件
   */
  folder?: string
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
