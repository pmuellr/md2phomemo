import { test } from 'node:test'
import assert from 'node:assert/strict'

import { getCli } from './cli.mjs'

(async () => { 

  test('cli', async (t) => {
    await test('getCli()', async (t) => {
      const cli = getCli([])
      assert.deepEqual(cli, {
        printer: undefined,
        list: false,
        output: undefined,
        help: false,
        version: false,
        debug: false,
      })
    })

    await test('getCli(help)', async (t) => {
      const cli = getCli(['--help'])
      assert.deepEqual(cli, {
        printer: undefined,
        list: false,
        output: undefined,
        help: !false,
        version: false,
        debug: false,
      })
    })

    await test('getCli(version)', async (t) => {
      const cli = getCli(['--version'])
      assert.deepEqual(cli, {
        printer: undefined,
        list: false,
        output: undefined,
        help: false,
        version: !false,
        debug: false,
      })
    })

    await test('getCli(debug)', async (t) => {
      const cli = getCli(['--debug'])
      assert.deepEqual(cli, {
        printer: undefined,
        list: false,
        output: undefined,
        help: false,
        version: false,
        debug: !false,
      })
    })

    await test('getCli(printer)', async (t) => {
      const cli = getCli(['--printer', 'a1234'])
      assert.deepEqual(cli, {
        printer: 'a1234',
        list: false,
        output: undefined,
        help: false,
        version: false,
        debug: false,
      })
    })

    await test('getCli(list)', async (t) => {
      const cli = getCli(['--list'])
      assert.deepEqual(cli, {
        printer: undefined,
        list: !false,
        output: undefined,
        help: false,
        version: false,
        debug: false,
      })
    })

    await test('getCli(output)', async (t) => {
      const cli = getCli(['--output', 'out.png'])
      assert.deepEqual(cli, {
        printer: undefined,
        list: false,
        output: 'out.png',
        help: false,
        version: false,
        debug: false,
      })

      const cli2 = getCli(['--output', 'out'])
      assert.deepEqual(cli2, {
        printer: undefined,
        list: false,
        output: 'out.png',
        help: false,
        version: false,
        debug: false,
      })
    })
    
  })

})()
