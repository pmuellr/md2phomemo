import { createDeferred } from './deferred.mjs'

/** @type { (ms: number) => Promise<void> } */
export function wait(ms) {
  const { promise, resolve } = createDeferred()
  setTimeout(resolve, ms)
  return promise
}
