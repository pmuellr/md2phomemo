import { test } from 'node:test'
import assert from 'node:assert/strict'

import { md2html } from './md2html.mjs'
import { isVal } from './val-or-error.mjs'

main()

async function main() {
  await test('md2html', async (t) => {
    await test('returns successfully as expected', async (t) => {
      const htmlVal = md2html('# hello')
      if (isVal(htmlVal)) {
        assert.strictEqual(htmlVal.val, '<h1>hello</h1>\n')
      } else {
        assert.strictEqual('should not', 'have gotten here')
      }
    })
  
    await test('handles errors', async (t) => {
      // @ts-ignore
      const htmlVal = md2html(null)
      if (isVal(htmlVal)) {
        assert.strictEqual('should not', 'have gotten here')
      } else {
        assert.ok(htmlVal.err.message)
      }
    })
  })
}