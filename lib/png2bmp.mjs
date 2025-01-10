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

  fullImage
    .png()
    .toFile(pngFileFinal)

  const { data, info } = await fullImage
    .raw()
    .toBuffer({ resolveWithObject: true });
  console.log(JSON.stringify(data, null, 2))
}
