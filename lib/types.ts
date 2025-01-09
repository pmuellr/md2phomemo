// only types, used for validation in vscode

export type { Val, Err, ValOrErr } from './val-or-error'

export interface Cli {
  params:     string[]
  printer?:   string
  list:       boolean
  watch:      boolean
  help:       boolean
  version:    boolean
  debug:      boolean
}
