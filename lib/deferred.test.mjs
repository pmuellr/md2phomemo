import { test } from 'node:test'
import assert from 'node:assert/strict'

import { createDeferred } from './deferred.mjs'

(async () => { 
await test('deferred', async (t) => {

  await test('returns correct objects', async (t) => {
    const { promise, resolve, reject } = createDeferred();
    assert.ok(promise instanceof Promise)
    assert.strictEqual(typeof resolve, 'function')
    assert.strictEqual(typeof reject, 'function')
  })

  await test('handles resolve', async (t) => {
    const { promise, resolve } = createDeferred()
    resolve(42)
    assert.strictEqual(await promise, 42)
  })

  await test('handles reject', async (t) => {
    const { promise, reject } = createDeferred()
    reject(new Error('gotcha'))
    try {
      await promise
      assert.strictEqual('should not', 'have gotten here')
    } catch (err) {
      assert.strictEqual(err.message, 'gotcha')
    }
  })

})
})()