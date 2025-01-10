import path from 'node:path'

import meow from 'meow'

/** @import { Cli } from './types.ts' */

/** @type { (argv: string[]) => Cli } */
export function getCli(argv) {
  const cliOptions = meow({
    argv,
    flags: {
      printer:         { shortFlag: 'p', type: 'string' },
      list:            { shortFlag: 'l', type: 'boolean', default: false},
      watch:           { shortFlag: 'w', type: 'boolean', default: false },
      debug:           { shortFlag: 'd', type: 'boolean', default: false },
      help:            { shortFlag: 'h', type: 'boolean', default: false },
      version:         { shortFlag: 'v', type: 'boolean', default: false },
    },
    importMeta: import.meta,
    autoHelp: false,
    autoVersion: false,
  })

  const flags = cliOptions.flags
  const iFile = cliOptions.input[0]

  const result = {
    iFile,
    printer:    flags.printer,
    list:       !!flags.list,
    watch:      !!flags.watch,
    help:       !!flags.help,
    version:    !!flags.version,
    debug:      !!flags.debug,
  }
  return result
}