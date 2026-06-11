import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs'

const packageJson = JSON.parse(readFileSync('packages/unplugin-build-zip/package.json', 'utf8'))
const currentVersion = packageJson.version
const packageName = packageJson.name
const repository = normalizeRepositoryUrl(packageJson.repository?.url)
const changelogSources = [
  'packages/unplugin-build-zip/CHANGELOG.md',
  'CHANGELOG.md',
]

const existingCurrentLines = readExistingCurrentRelease(currentVersion)
const tags = git(['tag', '--sort=v:refname'])
  .split('\n')
  .map(line => line.trim())
  .filter(tag => /^v\d+\.\d+\.\d+$/.test(tag))

const releases = []
const latestTag = tags.at(-1)

if (latestTag !== `v${currentVersion}`) {
  releases.push({
    version: currentVersion,
    previousTag: latestTag,
    tag: `v${currentVersion}`,
    date: today(),
    sections: sectionsFromCurrentRelease(existingCurrentLines),
  })
}

for (let index = tags.length - 1; index >= 0; index -= 1) {
  const tag = tags[index]
  const previousTag = tags[index - 1]
  const version = tag.slice(1)
  releases.push({
    version,
    previousTag,
    tag,
    date: git(['log', '-1', '--format=%cs', tag]),
    sections: sectionsFromCommits(commitsForRange(previousTag, tag)),
  })
}

const content = [
  `# ${packageName}`,
  '',
  ...releases.flatMap(formatRelease),
].join('\n').replace(/\n{3,}/g, '\n\n')

writeFileSync('CHANGELOG.md', `${content.trimEnd()}\n`)

if (existsSync('packages/unplugin-build-zip/CHANGELOG.md'))
  rmSync('packages/unplugin-build-zip/CHANGELOG.md')

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim()
}

function normalizeRepositoryUrl(url) {
  return String(url || '')
    .replace(/^git\+/, '')
    .replace(/\.git$/, '')
}

function today() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function readExistingCurrentRelease(version) {
  for (const source of changelogSources) {
    if (!existsSync(source))
      continue

    const lines = readFileSync(source, 'utf8').split(/\r?\n/)
    const releaseLines = []
    let inRelease = false

    for (const line of lines) {
      if (line.startsWith('## ')) {
        if (inRelease)
          break

        inRelease = line.startsWith(`## ${version}`) || line.startsWith(`## [${version}]`)
        continue
      }

      if (inRelease)
        releaseLines.push(line)
    }

    const entries = releaseLines
      .map(line => line.trim())
      .filter(line => line.startsWith('- ') || line.startsWith('* '))
      .map(line => line.slice(2).trim())

    if (entries.length)
      return entries
  }

  return []
}

function sectionsFromCurrentRelease(lines) {
  return lines.length
    ? new Map([['Chores', lines.map(line => `* ${line}`)]])
    : sectionsFromCommits(commitsForRange(tags.at(-1), 'HEAD'))
}

function commitsForRange(previousTag, tag) {
  const range = previousTag ? `${previousTag}..${tag}` : tag
  return git(['log', '--no-merges', '--format=%H%x00%s', range])
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [hash, subject] = line.split('\0')
      return { hash, subject }
    })
}

function sectionsFromCommits(commits) {
  const sections = new Map()

  for (const commit of commits.reverse()) {
    const parsed = parseConventionalSubject(commit.subject)
    if (!parsed)
      continue

    addSectionLine(sections, parsed.section, formatCommitLine(parsed.message, commit.hash))
  }

  return sections
}

function parseConventionalSubject(subject) {
  if (/^chore(?:\(.+\))?: release v\d+\.\d+\.\d+$/.test(subject))
    return null

  if (subject.startsWith('Revert '))
    return { section: 'Reverts', message: subject }

  const match = subject.match(/^(\w+)(?:\([^)]+\))?!?:\s+(.+)$/)
  if (!match)
    return null

  const [, type, message] = match
  const section = sectionForType(type)
  if (!section)
    return null

  return { section, message }
}

function sectionForType(type) {
  return {
    feat: 'Features',
    fix: 'Bug Fixes',
    perf: 'Performance Improvements',
    revert: 'Reverts',
    docs: 'Documentation',
    chore: 'Chores',
  }[type]
}

function addSectionLine(sections, section, line) {
  if (!sections.has(section))
    sections.set(section, [])

  sections.get(section).push(line)
}

function formatCommitLine(message, hash) {
  const shortHash = hash.slice(0, 7)
  return `* ${message} ([${shortHash}](${repository}/commit/${hash}))`
}

function formatRelease(release) {
  const lines = [
    formatReleaseHeading(release),
    '',
  ]

  for (const section of ['Bug Fixes', 'Features', 'Performance Improvements', 'Reverts', 'Documentation', 'Chores']) {
    const entries = release.sections.get(section)
    if (!entries?.length)
      continue

    lines.push(`### ${section}`, '', ...entries, '')
  }

  return lines
}

function formatReleaseHeading(release) {
  if (!repository)
    return `## ${release.version} (${release.date})`

  if (!release.previousTag)
    return `## [${release.version}](${repository}/releases/tag/${release.tag}) (${release.date})`

  return `## [${release.version}](${repository}/compare/${release.previousTag}...${release.tag}) (${release.date})`
}
