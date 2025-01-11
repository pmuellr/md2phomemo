#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { watch, readFile } from 'node:fs/promises'

import { log } from './lib/log.mjs'
import { pkg } from './lib/pkg.mjs'
import { getCli } from './lib/cli.mjs'
import { md2html } from './lib/md2html.mjs'
import { png2bmp } from './lib/png2bmp.mjs'
import { html2png } from './lib/html2png.mjs'
/** @import { ValOrErr } from './lib/types.ts' */
import { listDevices, print } from './lib/printer.mjs'
import { isVal, asVal, eValAsync } from './lib/val-or-error.mjs'

main()

async function main() {
  const cli = getCli(process.argv.slice(2))
  const { iFile, help, version, debug, printer, list, watch } = cli

  // handle flags
  if (help) { console.log(await getHelp()); process.exit(1) }
  if (version) { console.log(pkg.version); process.exit(1) }


  log.setDebug(!!debug)

  if (list) {
    await listDevices()
    return process.exit()
  }

  if (!iFile) {
    log.exit('expecting an input markdown file as a parameter')
  }

  const processVal = await eValAsync(async () => processFile(iFile))
  if (!isVal(processVal)) {
    return log.exit(processVal.err.message)
  }

  const { data, height, width } = processVal.val
  if (printer) {
    await print(printer, data, height, width)
    return process.exit()
  }

  if (watch) {
    await processWatch(iFile)
  }

  process.exit()
}

/** @type { (iFile: string) => Promise<{data: Uint8Array, height: number, width: number}> } */
async function processFile(iFile) {
  const htmlFile = `${iFile}.html`
  const pngFileOrig = `${iFile}.orig.png`
  const pngFileFinal = `${iFile}.png`

  let md = ''
  try {
    md = await readFile(iFile, 'utf-8')
  } catch (err) {
    throw new Error(`error reading file "${iFile}": ${err.message}`)
  }

  const htmlVal = md2html(md)
  if (!isVal(htmlVal)) {
    throw new Error(htmlVal.err.message)
  }
  await fs.writeFile(htmlFile, htmlVal.val)
  log(`generated: ${htmlFile}`)

  const pngVal = await html2png(htmlFile, pngFileOrig)
  if (!isVal(pngVal)) {
    throw new Error(pngVal.err.message)
  }
  log(`generated: ${pngFileOrig}`)

  const bmpVal = await png2bmp(pngFileOrig, pngFileFinal)
  if (!isVal(bmpVal)) {
    throw new Error(bmpVal.err.message)
  }
  log(`generated: ${pngFileFinal}`)

  return bmpVal.val
}

/** @type { (iFile: string) => Promise<void> } */
async function processWatch(iFile) {
  log()
  log(`watching on file change: ${iFile}`)
  const watcher = fs.watch(iFile);
  for await (const event of watcher) {
    log()
    log(`file changed: ${iFile}`)
    await processFile(iFile)
  }
}

/** @type { () => Promise<string> } */
async function getHelp() {
  const thisFile = new URL(import.meta.url).pathname
  const thisDir = path.dirname(thisFile)
  return await readFile(`${thisDir}/README.md`, 'utf-8')
}

