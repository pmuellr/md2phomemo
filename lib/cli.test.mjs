import { test } from 'node:test'
import assert from 'node:assert/strict'

import { getCli } from './cli.mjs'

const BaseResult = {
  params: [],
  printer: undefined,
  list: false,
  output: undefined,
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

    await test('getCli(params)', async (t) => {
      const cli = getCli(['a', 'b', 'c'])
      assert.deepEqual(cli, {
        ...BaseResult,
        params: ['a', 'b', 'c'],
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

    await test('getCli(output 1)', async (t) => {
      const cli = getCli(['--output', 'a1234'])
      assert.deepEqual(cli, {
        ...BaseResult,
        output: 'a1234.png',
      })
    })

    await test('getCli(output 2)', async (t) => {
      const cli = getCli(['--output', '../b1234.png'])
      assert.deepEqual(cli, {
        ...BaseResult,
        output: '../b1234.png',
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
