import fs from 'node:fs/promises'

import sharp from 'sharp'

/** @import { ValOrErr } from './types.ts' */
import { isVal, eValAsync } from './val-or-error.mjs'

/** @type { (pngFileOrig: string, pngFileFinal: string) => Promise<ValOrErr<void>> } */
export async function png2bmp(pngFileOrig, pngFileFinal) {
  return eValAsync(() => png2bmpImpl(pngFileOrig, pngFileFinal))
}

/** @type { (pngFileOrig: string, pngFileFinal: string) => Promise<void> } */
async function png2bmpImpl(pngFileOrig, pngFileFinal) {
  const image = sharp(pngFileOrig)

  const fullImage = image
    .greyscale()
    .toColourspace('b-w')
    .threshold()

  const { data, info } = await fullImage
    .raw()
    .toBuffer({ resolveWithObject: true });
  
  // console.log(JSON.stringify(data, null, 2))
  const rowBounds = findRowBounds(data, info.width, info.height)

  fullImage
    .extract({ 
      left: 0, 
      top: rowBounds.top, 
      width: info.width, 
      height: rowBounds.bottom - rowBounds.top + 1 
    })
    .png({ colours: 2 })
    .toFile(pngFileFinal)
}

/** @type { (data: Uint8Array, width: number, height: number) => { top: number, bottom: number } } */
function findRowBounds(data, width, height) {
  let top = 0
  let bottom = height - 1

  while (bottom > height - 100) {
    let row = data.slice(bottom * width, (bottom + 1) * width)
    if (row.some(x => x !== 255)) {
      break
    }
    bottom--
  }

  return { top, bottom }
}