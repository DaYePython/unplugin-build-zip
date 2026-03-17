import type { UnpluginFactory } from 'unplugin'
import type { ResolvedConfig } from 'vite'
import type { Options } from './types'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { createUnplugin } from 'unplugin'
import { copyFileToClipboard, sendSystemNotify, zipDirectory } from './utils'

// ─── 插件主体 ──────────────────────────────────────────────────────────────────

export const unpluginFactory: UnpluginFactory<Options | undefined> = (options = {}) => {
  const {
    filename: customFilename,
    copyToClipboard = true,
    notify = true,
  } = options

  let outDir = 'dist'
  let root = process.cwd()
  let isViteBuild = false
  let isWebpackBuild = false

  const doZip = async (outDirAbsolute: string): Promise<void> => {
    if (!fs.existsSync(outDirAbsolute)) {
      console.warn(
        `\n  \x1B[33m⚠\x1B[0m  \x1B[1m[build-zip]\x1B[0m 输出目录不存在: ${outDirAbsolute}`,
      )
      return
    }

    const filename = customFilename ?? path.basename(outDirAbsolute)
    const zipPath = path.resolve(
      path.dirname(outDirAbsolute),
      `${filename}.zip`,
    )

    if (fs.existsSync(zipPath))
      fs.unlinkSync(zipPath)

    await zipDirectory(outDirAbsolute, zipPath)

    const display = path.relative(root, zipPath).replace(/\\/g, '/')
    // eslint-disable-next-line no-console
    console.log(
      `\n  \x1B[32m✓\x1B[0m  \x1B[1m[build-zip]\x1B[0m 产物已压缩 → \x1B[36m${display}\x1B[0m`,
    )

    if (copyToClipboard) {
      const ok = copyFileToClipboard(zipPath)
      if (ok) {
        // eslint-disable-next-line no-console
        console.log(`       \x1B[90m↳ zip 文件已复制到剪切板（可直接粘贴到文件夹）\x1B[0m`)
      }
    }

    if (notify) {
      sendSystemNotify('Build Complete ✓', `已打包：${filename}.zip`)
    }
  }

  return {
    name: '@tonywater/unplugin-build-zip',
    vite: {
      apply: 'build',

      configResolved(config: ResolvedConfig) {
        outDir = config.build.outDir || 'dist'
        root = config.root
        isViteBuild = config.command === 'build'
      },

      async closeBundle() {
        if (!isViteBuild) {
          return
        }

        const outDirAbsolute = path.isAbsolute(outDir)
          ? outDir
          : path.resolve(root, outDir)

        await doZip(outDirAbsolute)
      },
    },

    rollup: {
      async writeBundle(options) {
        if (!options) {
          return
        }
        outDir = options.dir || 'dist'
        const outDirAbsolute = path.isAbsolute(outDir)
          ? outDir
          : path.resolve(root, outDir)

        await doZip(outDirAbsolute)
      },
    },

    webpack(compiler) {
      isWebpackBuild = compiler.options.mode === 'production'

      compiler.hooks.done.tapPromise('@tonywater/unplugin-build-zip', async (stats) => {
        if (stats.hasErrors())
          return

        if (!isWebpackBuild) {
          return
        }

        outDir = compiler.options.output.path || path.resolve(process.cwd(), 'dist')
        root = compiler.context || process.cwd()

        const outDirAbsolute = path.isAbsolute(outDir)
          ? outDir
          : path.resolve(root, outDir)

        await doZip(outDirAbsolute)
      })
    },
  }
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
