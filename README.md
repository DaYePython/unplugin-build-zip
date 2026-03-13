# @tonywater/unplugin-build-zip

[![NPM version](https://img.shields.io/npm/v/@tonywater/unplugin-build-zip?color=a1b858&label=)](https://www.npmjs.com/package/@tonywater/unplugin-build-zip)

一个 [unplugin](https://github.com/unjs/unplugin) 插件，在构建完成后自动将产物目录压缩为 `.zip` 文件，并可选地将文件复制到系统剪切板、发送桌面通知。

## 功能

-  **自动压缩**  build 完成后将 `outDir` 打包为 zip，生成位置与产物目录同级
-  **复制到剪切板**  将 zip 文件（文件拖放格式）写入系统剪切板，可直接粘贴到文件夹
-  **桌面通知**  通过系统原生通知告知构建完成（Windows / macOS / Linux）
-  **跨构建工具**  基于 unplugin，支持 Vite、Rollup、Rolldown、webpack、rspack、esbuild

## 安装

```bash
npm i -D @tonywater/unplugin-build-zip
# or
pnpm add -D @tonywater/unplugin-build-zip
# or
yarn add -D @tonywater/unplugin-build-zip
```

## 使用

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import BuildZip from '@tonywater/unplugin-build-zip/vite'

export default defineConfig({
  plugins: [
    BuildZip({
      // filename: 'my-app',     // 自定义 zip 名称，默认取 outDir basename（如 dist）
      // copyToClipboard: true,  // 完成后将 zip 文件复制到剪切板
      // notify: true,           // 完成后发送系统桌面通知
    }),
  ],
})
```

示例：[`playground/`](./playground/)

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import BuildZip from '@tonywater/unplugin-build-zip/rollup'

export default {
  plugins: [
    BuildZip({ /* options */ }),
  ],
}
```

<br></details>

<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
module.exports = {
  plugins: [
    require('@tonywater/unplugin-build-zip/webpack')({ /* options */ }),
  ],
}
```

<br></details>

<details>
<summary>Nuxt</summary><br>

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    ['@tonywater/unplugin-build-zip/nuxt', { /* options */ }],
  ],
})
```

<br></details>

<details>
<summary>esbuild</summary><br>

```ts
import BuildZip from '@tonywater/unplugin-build-zip/esbuild'
// esbuild.config.js
import { build } from 'esbuild'

build({
  plugins: [BuildZip()],
})
```

<br></details>

## 配置项

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `filename` | `string` | `outDir` 的 basename（如 `dist`） | 生成的 zip 文件名，不含 `.zip` 后缀 |
| `copyToClipboard` | `boolean` | `true` | 完成后将 zip 文件本身（文件拖放格式）写入系统剪切板，可直接 Ctrl+V / +V 粘贴到文件夹 |
| `notify` | `boolean` | `true` | 完成后发送系统桌面通知 |

## 平台支持

| 功能 | Windows | macOS | Linux |
|------|---------|-------|-------|
| 复制文件到剪切板 | PowerShell `SetFileDropList` | `osascript` | `xclip` / `xsel`（需系统安装） |
| 桌面通知 | PowerShell `NotifyIcon` 气泡 | `osascript` | `notify-send`（需系统安装 `libnotify`） |

## 开发

```bash
# 安装依赖
pnpm install

# 构建
pnpm build

# 监听模式
pnpm dev

# 运行 playground
pnpm play
```

## License

[MIT](./LICENSE)
