import { existsSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'
import { execSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

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
})
