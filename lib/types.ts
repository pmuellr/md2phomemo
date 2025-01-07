// only types, used for validation in vscode

export type { Val, Err, ValOrErr } from './val-or-error'

export interface Cli {
  printer?:   string
  list:       boolean
  output?:    string
  help:       boolean
  version:    boolean
  debug:      boolean
}
