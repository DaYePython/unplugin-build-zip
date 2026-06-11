import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { zipDirectory } from '../packages/unplugin-build-zip/src/core/utils'

function readZipEntries(zipPath: string): string[] {
  const output = execSync(
    `python3 -c "import sys, zipfile; print('\\n'.join(zipfile.ZipFile(sys.argv[1]).namelist()))" ${JSON.stringify(zipPath)}`,
    { encoding: 'utf8' },
  )

  return output.split('\n').filter(Boolean)
}

describe('unplugin-build-zip e2e tests', () => {
  const vue3ViteDir = resolve(__dirname, '../playground/vue3-vite')
  const vue2CliDir = resolve(__dirname, '../playground/vue2-cli')

  it('should build and zip vue3-vite project', () => {
    const zipPath = resolve(vue3ViteDir, 'vue3-vite-dist.zip')
    if (existsSync(zipPath)) {
      rmSync(zipPath)
    }
    const fallbackPath = resolve(vue3ViteDir, 'dist.zip')
    if (existsSync(fallbackPath)) {
      rmSync(fallbackPath)
    }

    // Run build
    execSync('pnpm run build', { cwd: vue3ViteDir, stdio: 'inherit' })

    // Check if zip was created
    expect(existsSync(zipPath)).toBe(true)
  }, 120000)

  it('should build and zip vue2-cli project', () => {
    const zipPath = resolve(vue2CliDir, 'vue2-cli-dist.zip')
    if (existsSync(zipPath)) {
      rmSync(zipPath)
    }
    const fallbackPath = resolve(vue2CliDir, 'dist.zip')
    if (existsSync(fallbackPath)) {
      rmSync(fallbackPath)
    }

    // Run build
    execSync('pnpm run build', { cwd: vue2CliDir, stdio: 'inherit' })

    // Check if zip was created
    expect(existsSync(zipPath)).toBe(true)
  }, 120000)

  it('should keep files at zip root without folder option', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'build-zip-'))
    const sourceDir = join(tempDir, 'dist')
    const zipPath = join(tempDir, 'dist.zip')

    try {
      mkdirSync(sourceDir)
      writeFileSync(join(sourceDir, 'index.html'), '<div>app</div>')
      await zipDirectory(sourceDir, zipPath)

      expect(readZipEntries(zipPath)).toContain('index.html')
    }
    finally {
      rmSync(tempDir, { recursive: true, force: true })
    }
  })

  it('should wrap files in configured folder', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'build-zip-'))
    const sourceDir = join(tempDir, 'dist')
    const zipPath = join(tempDir, 'dist.zip')

    try {
      mkdirSync(sourceDir)
      writeFileSync(join(sourceDir, 'index.html'), '<div>app</div>')
      await zipDirectory(sourceDir, zipPath, 'my-app')

      const entries = readZipEntries(zipPath)
      expect(entries).toContain('my-app/index.html')
      expect(entries).not.toContain('index.html')
    }
    finally {
      rmSync(tempDir, { recursive: true, force: true })
    }
  })
})
