/** @import { ValOrErr } from './types.ts' */
import markdownFactory from 'markdown-it'
import { eVal } from './val-or-error.mjs'

/** @type { (md: string) => ValOrErr<string> } */
export function md2html(md) {
  const compiler = markdownFactory({
    html: true,
    linkify: true,
  })
  return eVal(() => compiler.render(md))
}