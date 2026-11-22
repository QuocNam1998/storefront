import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterAll, describe, expect, it } from 'vitest'

const root = path.resolve(import.meta.dirname, '../..')

// Sample files go where the linter still checks them when named, but git never tracks them and a full lint run never sees them.
mkdirSync(path.join(root, 'node_modules/.tmp'), { recursive: true })
const dir = mkdtempSync(path.join(root, 'node_modules/.tmp/lint-samples-'))
afterAll(() => rmSync(dir, { recursive: true, force: true }))

let count = 0
function sample(code) {
  const file = path.join(dir, `sample-${count++}.ts`)
  writeFileSync(file, code)
  return file
}

function lint(code) {
  const file = path.relative(root, sample(code))
  return spawnSync(path.join(root, 'node_modules/.bin/oxlint'), [file], { cwd: root, encoding: 'utf8' })
}

const withIfs = (n) =>
  `export function f(a: number) {\n${Array.from({ length: n }, (_, i) => `  if (a === ${i}) return ${i}\n`).join('')}  return -1\n}\n`

const nested = (n) =>
  `export function f(a: boolean) {\n${'if (a) {\n'.repeat(n)}return 1\n${'}\n'.repeat(n)}return 0\n}\n`

const withParams = (n) =>
  `export function f(${Array.from({ length: n }, (_, i) => `p${i}: number`).join(', ')}) {\n  return p0\n}\n`

describe('lint limits', () => {
  it.each([
    ['complexity', withIfs(15), withIfs(14)],
    ['max-depth', nested(4), nested(3)],
    ['max-params', withParams(5), withParams(4)],
    [
      'no-else-return',
      'export function f(a: boolean) {\n  if (a) {\n    return 1\n  } else {\n    return 2\n  }\n}\n',
      'export function f(a: boolean) {\n  if (a) {\n    return 1\n  }\n  return 2\n}\n',
    ],
    [
      'no-lonely-if',
      'let n = 0\nexport function f(a: boolean, b: boolean) {\n  if (a) {\n    n++\n  } else {\n    if (b) {\n      n--\n    }\n  }\n  return n\n}\n',
      'let n = 0\nexport function f(a: boolean, b: boolean) {\n  if (a) {\n    n++\n  } else if (b) {\n    n--\n  }\n  return n\n}\n',
    ],
    [
      'no-useless-return',
      'export function f(a: number[]) {\n  a.push(1)\n  return\n}\n',
      'export function f(a: number[]) {\n  a.push(1)\n}\n',
    ],
  ])('%s fails code past the limit and passes code at it', (rule, failing, passing) => {
    const failed = lint(failing)
    expect(failed.stdout).toContain(`eslint(${rule})`)
    expect(failed.status).toBe(1)

    const passed = lint(passing)
    expect(passed.stdout).not.toContain(`eslint(${rule})`)
    expect(passed.status).toBe(0)
  })
})

// Claude Code passes the edit details to the hook as JSON on standard input.
function runHook(filePath) {
  return spawnSync('node', [path.join(root, '.claude/hooks/lint-on-edit.mjs')], {
    input: JSON.stringify({ tool_name: 'Edit', tool_input: { file_path: filePath } }),
    encoding: 'utf8',
  })
}

describe('lint on edit', () => {
  it('hands lint errors to Claude with the file and line', () => {
    const file = path.join(dir, 'edited.tsx')
    writeFileSync(file, withParams(5))
    const result = runHook(file)
    expect(result.status).toBe(2)
    expect(result.stderr).toContain(`${path.relative(root, file)}:1:`)
    expect(result.stderr).toContain('eslint(max-params)')
  })

  it('stays silent for a clean file', () => {
    const result = runHook(sample(withParams(4)))
    expect(result.status).toBe(0)
    expect(result.stdout + result.stderr).toBe('')
  })

  it('skips files that are not TypeScript, and files outside the project', () => {
    const outside = mkdtempSync(path.join(tmpdir(), 'lint-outside-'))
    const outsideFile = path.join(outside, 'broken.ts')
    writeFileSync(outsideFile, withParams(5))
    try {
      for (const file of [path.join(root, 'README.md'), path.join(root, 'src/index.css'), outsideFile]) {
        const result = runHook(file)
        expect(result.status).toBe(0)
        expect(result.stdout + result.stderr).toBe('')
      }
    } finally {
      rmSync(outside, { recursive: true, force: true })
    }
  })
})
