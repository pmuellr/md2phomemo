import url from 'url'

/** @type { (importMeta: { url: string }) => boolean } */
export function isMain(importMeta) {
  if (!importMeta.url.startsWith('file:')) return false

  const modulePath = url.fileURLToPath(importMeta.url)
  return process.argv[1] === modulePath
}
