import { execSync } from 'node:child_process'
import fs from 'node:fs'
import process from 'node:process'
import archiver from 'archiver'

/**
 * 压缩指定目录为 zip 文件
 * @param sourceDir 源目录路径
 * @param outputPath 输出路径
 * @returns Promise<void>
 */
export function zipDirectory(sourceDir: string, outputPath: string): Promise<void> {
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
export function copyFileToClipboard(filePath: string): boolean {
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

export function sendSystemNotify(title: string, body: string): void {
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