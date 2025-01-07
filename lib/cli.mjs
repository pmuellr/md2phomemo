/** @import { Val, Err, ValOrErr, Cli } from './types.ts' */

import meow from 'meow'

import { log } from './log.mjs'

export const DEFAULT_CONFIG = '~/.eslp.toml'
export const OUTPUT_PLAIN = 'plain'
export const OUTPUT_ENV   = 'env'

/** @type { (argv: string[]) => Cli } */
export function getCli(argv) {
  const cliOptions = meow({
    argv,
    flags: {
      printer:         { shortFlag: 'p', type: 'string' },
      list:            { shortFlag: 'l', type: 'boolean', default: false},
      output:          { shortFlag: 'o', type: 'string' },
      debug:           { shortFlag: 'd', type: 'boolean', default: false },
      help:            { shortFlag: 'h', type: 'boolean', default: false },
      version:         { shortFlag: 'v', type: 'boolean', default: false },
    },
    importMeta: import.meta,
    autoHelp: false,
    autoVersion: false,
  })

  const flags = cliOptions.flags

  if (flags.output) {
    if (!flags.output.toLowerCase().endsWith('.png')) {
      flags.output = `${flags.output}.png`
    }
  }

  const result = {
    printer:    flags.printer,
    list:       !!flags.list,
    output:     flags.output,
    help:       !!flags.help,
    version:    !!flags.version,
    debug:      !!flags.debug,
  }
  return result
}