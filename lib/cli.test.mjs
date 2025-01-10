import { test } from 'node:test'
import assert from 'node:assert/strict'

import { getCli } from './cli.mjs'

const BaseResult = {
  iFile: undefined,
  printer: undefined,
  list: false,
  watch: false,
  help: false,
  version: false,
  debug: false,
};

main()

async function main() {
  test('cli', async (t) => {
    await test('getCli()', async (t) => {
      const cli = getCli([])
      assert.deepEqual(cli, BaseResult)
    })

    await test('getCli(iFile)', async (t) => {
      const cli = getCli(['a', 'b', 'c'])
      assert.deepEqual(cli, {
        ...BaseResult,
        iFile: 'a',
      })
    })
    
    await test('getCli(help)', async (t) => {
      const cli = getCli(['--help'])
      assert.deepEqual(cli, {
        ...BaseResult,
        help: true,
      })
    })

    await test('getCli(version)', async (t) => {
      const cli = getCli(['--version'])
      assert.deepEqual(cli, {
        ...BaseResult,
        version: true,
      })
    })

    await test('getCli(debug)', async (t) => {
      const cli = getCli(['--debug'])
      assert.deepEqual(cli, {
        ...BaseResult,
        debug: true,
      })
    })

    await test('getCli(printer)', async (t) => {
      const cli = getCli(['--printer', 'a1234'])
      assert.deepEqual(cli, {
        ...BaseResult,
        printer: 'a1234',
      })
    })

    await test('getCli(list)', async (t) => {
      const cli = getCli(['--list'])
      assert.deepEqual(cli, {
        ...BaseResult,
        list: true,
      })
    })

    await test('getCli(watch)', async (t) => {
      const cli = getCli(['--watch'])
      assert.deepEqual(cli, {
        ...BaseResult,
        watch: true,
      })
    })
  })
}
