import { pkg } from './pkg.mjs'

let Debug = false

/** @type { (message?: string) => void } */
export function log(message) {
  if (!message) {
    console.log()
  } else {
    console.log(`${pkg.name}: ${message}`)
  }
}

/** @type { (message: string) => void } */
function debugLog(message) {
  log(`DEBUG: ${message}`)
}
log.debug = nothingLog
log.setDebug = setDebug
log.isDebug = isDebug
log.exit = logAndExit

/** @type { (message: string, status?: number) => void } */
function logAndExit(message, status) {
  log(message)
  process.exit(status == null ? 1 : status)
}

/** @type { () => boolean } */
function isDebug() {
  return !!Debug
}

/** @type { (debug: boolean) => void } */
function setDebug(debug) {
  Debug = !!debug
  if (debug) {
    log.debug = debugLog
  } else {
    log.debug = nothingLog
  }
}

/** @type { (message: string) => void } */
function nothingLog(message) {
}
