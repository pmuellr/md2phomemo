import puppeteer from 'puppeteer-core';

/** @import { ValOrErr } from './types.ts' */
import { isVal, eValAsync } from './val-or-error.mjs'
import { isMain } from './is-main.mjs'

const PuppeteerBrowserURL = 'http://127.0.0.1:9222/json/version'
/** @type { (html: string, pngFile: string) => Promise<ValOrErr<void>> } */
export async function html2png(html, pngFile) {
  return eValAsync(() => html2pngImpl(html, pngFile))
}

/** @type { (html: string, pngFile: string) => Promise<void> } */
async function html2pngImpl(html, pngFile) {
  const browser = await puppeteer.connect({ 
    browserURL: PuppeteerBrowserURL,
    defaultViewport: { width: 384, height: 500 },
   })
  const page = await browser.newPage()
  await page.setContent(html)
  await page.screenshot({ path: pngFile })
  await page.close()
}

if (isMain(import.meta)) { main() }

async function main() {
  const html = '<h1>hello, world</h1>'
  const pngFile = 'tmp/hello.png'
  const voe = await html2png(html, pngFile)
  if (isVal(voe)) {
    console.log(`wrote ${pngFile}`)
  } else {
    console.error(voe.err.message)
  }
  process.exit()
}