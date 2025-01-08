import { getCli } from './lib/cli.mjs'
import { log } from './lib/log.mjs'
import { pkg } from './lib/pkg.mjs'
import { watch, readFile } from 'node:fs/promises'
import path from 'node:path'

main()

async function main() {
  const cli = getCli(process.argv.slice(2))
  const { help, version, debug, printer, list, output } = cli

  log.setDebug(!!debug)

 // handle flags
 if (help) { console.log(await getHelp()); process.exit(1) }
 if (version) { console.log(pkg.version); process.exit(1) }

}

/** @type { () => Promise<string> } */
async function getHelp() {
  const thisFile = new URL(import.meta.url).pathname
  const thisDir = path.dirname(thisFile)
  return await readFile(`${thisDir}/README.md`, 'utf-8')
}

