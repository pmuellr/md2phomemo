// https://github.com/vivier/phomemo-tools/blob/master/README.md#3-protocol-for-m02

import noble from '@abandonware/noble'

import { log } from './log.mjs'
import { wait } from './wait.mjs'
import { isVal, eValAsync } from './val-or-error.mjs'
import { createDeferred } from './deferred.mjs'
/** @import { Deferred } from './types.ts' */

const SCAN_TIME_MAX = 10 // seconds

export async function listDevices() {
  log.debug(`scanning for devices for ${SCAN_TIME_MAX} seconds ...`)
  await noble.startScanningAsync()
  
  noble.on('discover', function(peripheral) {
    const { address, advertisement, id, mtu, rssi, state } = peripheral
    const { localName, manufacturerData, serviceData, txPowerLevel } = advertisement

    if (!localName) return
    console.log(localName)
    console.log(`    address: ${address}`)
    console.log(`    id:      ${id}`)
    console.log(`    mtu:     ${mtu}`)
    console.log(`    rssi:    ${rssi}`)
    console.log(`    state:   ${state}`)
    // console.log(JSON.stringify(peripheral, null, 2))
  });
  
  await wait(SCAN_TIME_MAX * 1000)
  await noble.stopScanningAsync()
}

/** @type { (printerName: string, data: Uint8Array, height: number, width: number) => Promise<void> } */
export async function print(printerName, data, height, width) {
  const deferred = createDeferred()
  
  let found = false
  noble.on('discover', function(peripheral) {
    if (found) return
    const { advertisement } = peripheral
    const { localName } = advertisement || {}

    if (!localName) return
    if (localName !== printerName) return

    log.debug(`discovered device ${localName}`)
    found = true

    log.debug('stop scanning for printer because found')
    noble.stopScanningAsync()

    printOn(peripheral, deferred, data, height, width)
  })

  setTimeout(() => {
    if (found) return

    log.debug('stop scanning for printer because timeout')
    noble.stopScanningAsync()
    deferred.reject(new Error(`could not find printer named "${printerName}"`))
  }, 10000)

  log.debug('start scanning for printer')
  await noble.startScanningAsync()

  return deferred.promise
}

/** @type { (printer: noble.Peripheral, deferred: Deferred, data: Uint8Array, height: number, width: number) => Promise<void> } */
async function printOn(printer, deferred, data, height, width) {
  log.debug(`printing to ${printer.advertisement.localName}...`)
  log.debug(`data: ${data.length} bytes, ${height}x${width} pixels`)

  log(`connecting to printer`)
  await printer.connectAsync()
  log(`connected to printer`)

  const characteristic = await getWriteCharacteristic(printer)
  if (!characteristic) {
    deferred.reject(new Error(`could not find write characteristic for ${printer}`))
    return
  }

  /** @type { number[] } */
  const buffer = []
  let line = 0

  // https://github.com/vivier/phomemo-tools?tab=readme-ov-file#3-protocol-for-m02
  // https://github.com/vrk/cli-phomemo-printer/blob/ef1f841072a39004737c8afce630315607ae5409/index.js#L146-L264

  buffer.push(0x1b, 0x40)             // ESC @ initialize printer
  buffer.push(0x1b, 0x61, 0)          // ESC a: select justification; 0=left, 1=center, 2=right
  buffer.push(0x1f, 0x11, 0x02, 0x04) // end of header

  const chunkSizes = getChunkSizes(height)
  for (const chunkSize of chunkSizes) {
    buffer.push(0x1d, 0x76, 0x30)         // GS v 0 : print raster bit image
    buffer.push(0)                        // mode: 0 (normal), 1 (double width), 2 (double-height), 3 (quadruple)
    buffer.push(Math.ceil(width/8), 0x00) // bytes / line (48)
    buffer.push(chunkSize, 0x00)          // number of lines (max 255)

    for (let i = 0; i < chunkSize; i++) {
      buffer.push(...getDataForLine(data, line, width))
      line++
    }
  }

  buffer.push(0x1b, 0x64, 2)    // command ESC d : print and feed n lines
  buffer.push(0x1b, 0x64, 2)    // command ESC d : print and feed n lines
  buffer.push(0x1f, 0x11, 0x08) // footer stuff
  buffer.push(0x1f, 0x11, 0x0e) // footer stuff
  buffer.push(0x1f, 0x11, 0x07) // footer stuff
  buffer.push(0x1f, 0x11, 0x09) // footer stuff

  log.debug(`writing data to printer: ${buffer.length} bytes`)
  const byteBuffer = Buffer.from(Uint8Array.from(buffer))
  characteristic.write(byteBuffer, true, async (err) => {
    if (err) {
      deferred.reject(new Error(`error writing data to printer: ${err}`))
      return
    }

    log.debug(`data written to printer: ${buffer.length} bytes`)

    await wait(1000) // seems to need a delay before disconnecting
    log.debug(`disconnecting from printer`)
    await printer.disconnectAsync()
  
    deferred.resolve(null)
  })
}

/** @type { (data: Uint8Array, line: number, width: number) => number[] }  */
function getDataForLine(data, line, width) {
  /** @type { number[] } */
  const result = []

  const bytes = data.slice(line * width, (line + 1) * width)

  for (let i = 0; i < bytes.length; i += 8) {
    let byte = 0
    for (let j = 0; j < 8; j++) {
      const bit = bytes[i + j] & 0x01
      if (bit === 0) {
        byte |= 0x01 << (7 - j)
      }
    }
    result.push(byte)
  }

  return result
}

/** @type { (printer: noble.Peripheral) => Promise<noble.Characteristic | undefined> }  */
async function getWriteCharacteristic(printer) {
  log.debug(`getting write characteristic for ${printer.advertisement.localName}...`)
  const { characteristics } = await printer.discoverAllServicesAndCharacteristicsAsync()
  const [characteristic] = characteristics.filter(characteristic => { 
    return characteristic.properties.includes('write')
  })

  log.debug(`returning write characteristic ${characteristic?.name}...`)
  return characteristic
}

/** @type { (lines: number) => number[] } */
function getChunkSizes(lines) {
  /** @type { number[] } */
  const result = []
  while (lines > 0) {
    const linesThisChunk = Math.min(lines, 255)
    result.push(linesThisChunk)
    lines -= 255
  }
  return result
}