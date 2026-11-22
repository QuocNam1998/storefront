import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '../..')
const file = JSON.parse(readFileSync(0, 'utf8')).tool_input?.file_path ?? ''
const relative = path.relative(root, path.resolve(root, file))

if (!/\.tsx?$/.test(file) || relative.startsWith('..')) process.exit(0)

const lint = spawnSync(path.join(root, 'node_modules/.bin/oxlint'), ['--quiet', relative], {
  cwd: root,
  encoding: 'utf8',
})

// Exit code 2 hands the message to Claude so it fixes the file in the same turn. Exit code 1 only tells the person, without stopping Claude.
if (lint.error) {
  console.error(`Lint on edit skipped: ${lint.error.message}. Run pnpm install.`)
  process.exit(1)
}
if (lint.status !== 0) {
  console.error(lint.stdout + lint.stderr)
  process.exit(2)
}
