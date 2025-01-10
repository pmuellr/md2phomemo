#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { watch, readFile } from 'node:fs/promises'

import { log } from './lib/log.mjs'
import { pkg } from './lib/pkg.mjs'
import { isVal } from './lib/val-or-error.mjs'
import { getCli } from './lib/cli.mjs'
import { md2html } from './lib/md2html.mjs'
import { png2bmp } from './lib/png2bmp.mjs'
import { html2png } from './lib/html2png.mjs'

main()

async function main() {
  const cli = getCli(process.argv.slice(2))
  const { iFile, help, version, debug, printer, list, watch } = cli

  // handle flags
  if (help) { console.log(await getHelp()); process.exit(1) }
  if (version) { console.log(pkg.version); process.exit(1) }

  log.setDebug(!!debug)
  if (!iFile) {
    log.exit('expecting an input markdown file as a parameter')
  }

  const iFileBase = path.basename(iFile)
  const htmlFile = `${iFileBase}.html`
  const pngFileOrig = `${iFileBase}.orig.png`
  const pngFileFinal = `${iFileBase}.png`

  let md = ''
  try {
    md = await readFile(iFile, 'utf-8')
  } catch (err) {
    return log.exit(`error reading file "${iFile}": ${err.message}`)
  }

  const htmlVal = md2html(md)
  if (!isVal(htmlVal)) {
    return log.exit(htmlVal.err.message)
  }
  await fs.writeFile(htmlFile, htmlVal.val)
  log(`generated: ${htmlFile}`)

  const pngVal = await html2png(htmlVal.val, pngFileOrig)
  if (!isVal(pngVal)) {
    return log.exit(pngVal.err.message)
  }

  const bmpVal = await png2bmp(pngFileOrig, pngFileFinal)
  if (!isVal(bmpVal)) {
    return log.exit(bmpVal.err.message)
  }

  log(`generated: ${pngFileFinal}`)
  process.exit()
}

/** @type { () => Promise<string> } */
async function getHelp() {
  const thisFile = new URL(import.meta.url).pathname
  const thisDir = path.dirname(thisFile)
  return await readFile(`${thisDir}/README.md`, 'utf-8')
}

