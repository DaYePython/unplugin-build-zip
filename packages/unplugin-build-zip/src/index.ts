import type { UnpluginFactory } from 'unplugin'
import type { ResolvedConfig } from 'vite'
import type { Options } from './types'
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import archiver from 'archiver'
import { createUnplugin } from 'unplugin'

// ─── 工具函数 ──────────────────────────────────────────────────────────────────

function zipDirectory(sourceDir: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath)
    const archive = archiver('zip', { zlib: { level: 9 } })
    output.on('close', resolve)
    archive.on('error', reject)
    archive.pipe(output)
    archive.directory(sourceDir, false)
    archive.finalize()
  })
}

/**
 * 将文件本身（文件拖放格式）复制到系统剪切板
 * Windows: PowerShell SetFileDropList
 * macOS:   osascript
 * Linux:   xclip / xsel（需系统安装）
 */
function copyFileToClipboard(filePath: string): boolean {
  try {
    const platform = process.platform

    if (platform === 'win32') {
      const escaped = filePath.replace(/\\/g, '\\\\')
      const ps = [
        'Add-Type -AssemblyName System.Windows.Forms',
        `$col = New-Object System.Collections.Specialized.StringCollection`,
        `$col.Add('${escaped}')`,
        '[System.Windows.Forms.Clipboard]::SetFileDropList($col)',
      ].join('; ')
      execSync(`powershell -NoProfile -NonInteractive -Command "${ps}"`, {
        stdio: 'ignore',
        timeout: 6000,
      })
    }
    else if (platform === 'darwin') {
      const escaped = filePath.replace(/"/g, '\\"')
      execSync(`osascript -e 'set the clipboard to POSIX file "${escaped}"'`, {
        stdio: 'ignore',
        timeout: 5000,
      })
    }
    else {
      const uri = `file://${filePath}\n`
      try {
        execSync(`echo -n '${uri}' | xclip -selection clipboard -t text/uri-list`, {
          stdio: 'ignore',
          timeout: 5000,
        })
      }
      catch {
        execSync(`echo -n '${uri}' | xsel --clipboard --input`, {
          stdio: 'ignore',
          timeout: 5000,
        })
      }
    }
    return true
  }
  catch {
    return false
  }
}

function sendSystemNotify(title: string, body: string): void {
  try {
    const platform = process.platform

    if (platform === 'win32') {
      const safeTitle = title.split(`'`).join(`''`)
      const safeBody = body.split(`'`).join(`''`)
      const ps = [
        `Add-Type -AssemblyName System.Windows.Forms`,
        `$n = New-Object System.Windows.Forms.NotifyIcon`,
        `$n.Icon = [System.Drawing.SystemIcons]::Information`,
        `$n.BalloonTipIcon = [System.Windows.Forms.ToolTipIcon]::Info`,
        `$n.BalloonTipTitle = '${safeTitle}'`,
        `$n.BalloonTipText = '${safeBody}'`,
        `$n.Visible = $true`,
        `$n.ShowBalloonTip(4000)`,
        `Start-Sleep -Milliseconds 4100`,
        `$n.Dispose()`,
      ].join('; ')
      execSync(`powershell -NoProfile -NonInteractive -Command "${ps}"`, {
        stdio: 'ignore',
        timeout: 6000,
      })
    }
    else if (platform === 'darwin') {
      const safeTitle = title.replace(/"/g, '\\"')
      const safeBody = body.replace(/"/g, '\\"')
      execSync(
        `osascript -e 'display notification "${safeBody}" with title "${safeTitle}"'`,
        { stdio: 'ignore', timeout: 5000 },
      )
    }
    else {
      const safeTitle = title.replace(/"/g, '\\"')
      const safeBody = body.replace(/"/g, '\\"')
      execSync(`notify-send "${safeTitle}" "${safeBody}"`, {
        stdio: 'ignore',
        timeout: 5000,
      })
    }
  }
  catch {
    // 通知失败时静默处理，不影响主流程
  }
}

// ─── 插件主体 ──────────────────────────────────────────────────────────────────

export const unpluginFactory: UnpluginFactory<Options | undefined> = (options = {}) => {
  const {
    filename: customFilename,
    copyToClipboard = true,
    notify = true,
  } = options

  let outDir = 'dist'
  let root = process.cwd()

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
      configResolved(config: ResolvedConfig) {
        outDir = config.build.outDir || 'dist'
        root = config.root
      },

      async closeBundle() {
        const outDirAbsolute = path.isAbsolute(outDir)
          ? outDir
          : path.resolve(root, outDir)

        await doZip(outDirAbsolute)
      },
    },

    rollup: {
      async writeBundle(options) {
        outDir = options.dir || 'dist'
        const outDirAbsolute = path.isAbsolute(outDir)
          ? outDir
          : path.resolve(root, outDir)

        await doZip(outDirAbsolute)
      },
    },

    webpack(compiler) {
      compiler.hooks.done.tapPromise('@tonywater/unplugin-build-zip', async (stats) => {
        if (stats.hasErrors())
          return

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
