#!/usr/bin/env node

import path from 'node:path'
import { watch, readFile } from 'node:fs/promises'

import { log } from './lib/log.mjs'
import { pkg } from './lib/pkg.mjs'
import { isVal } from './lib/val-or-error.mjs'
import { getCli } from './lib/cli.mjs'
import { md2html } from './lib/md2html.mjs'
import { html2png } from './lib/html2png.mjs'

main()

async function main() {
  const cli = getCli(process.argv.slice(2))
  const { params, help, version, debug, printer, list, watch } = cli

  // handle flags
  if (help) { console.log(await getHelp()); process.exit(1) }
  if (version) { console.log(pkg.version); process.exit(1) }

  log.setDebug(!!debug)
  if (params.length === 0) {
    log.exit('expecting an input markdown file as a parameter')
  }
  if (params.length > 1) {
    log(`only the first parameter "${params[0]}" is used, the rest ignored: "${params.slice(1).join(' ')}"`) 
  }

  const mdFile = params[0]
  const md = await readFile(mdFile, 'utf-8')
  const htmlVal = md2html(md)
  if (!isVal(htmlVal)) {
    return log.exit(htmlVal.err.message)
  }

  const pngFile = 'tmp/test.png'
  const pngVal = await html2png(htmlVal.val, pngFile)
  if (!isVal(pngVal)) {
    return log.exit(pngVal.err.message)
  }

  log(`generated: ${pngFile}`)
  process.exit()
}

/** @type { () => Promise<string> } */
async function getHelp() {
  const thisFile = new URL(import.meta.url).pathname
  const thisDir = path.dirname(thisFile)
  return await readFile(`${thisDir}/README.md`, 'utf-8')
}

