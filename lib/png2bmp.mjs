import fs from 'node:fs/promises'

import sharp from 'sharp'

/** @import { ValOrErr } from './types.ts' */
import { isVal, eValAsync } from './val-or-error.mjs'

/** @type { (pngFileOrig: string, pngFileFinal: string) => Promise<ValOrErr<{data: Uint8Array, height: number, width: number}>> } */
export async function png2bmp(pngFileOrig, pngFileFinal) {
  return eValAsync(() => png2bmpImpl(pngFileOrig, pngFileFinal))
}

/** @type { (pngFileOrig: string, pngFileFinal: string) => Promise<{data: Uint8Array, height: number, width: number}> } */
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

  const croppedImage = fullImage
    .extract({ 
      left: 0, 
      top: rowBounds.top, 
      width: info.width, 
      height: rowBounds.bottom - rowBounds.top + 1 
    })
    .png({ colours: 2 })

  await croppedImage
    .toFile(pngFileFinal)

  const { data: croppedData, info: croppedInfo } = await croppedImage
    .raw()
    .toBuffer({ resolveWithObject: true });

  return {
    data: croppedData,
    height: croppedInfo.height,
    width: croppedInfo.width
  }
}

/** @type { (data: Uint8Array, width: number, height: number) => { top: number, bottom: number } } */
function findRowBounds(data, width, height) {
  let top = 0
  let bottom = height - 1

  while (bottom > 100) {
    let row = data.slice(bottom * width, (bottom + 1) * width)
    if (row.some(x => x !== 255)) {
      bottom++
      break
    }
    bottom--
  }

  return { top, bottom }
}