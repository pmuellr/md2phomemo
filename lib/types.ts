// only types, used for validation in vscode

export type { Val, Err, ValOrErr } from './val-or-error.ts'

export interface Cli {
  iFile:      string
  printer?:   string
  list:       boolean
  watch:      boolean
  help:       boolean
  version:    boolean
  debug:      boolean
}

export interface Deferred {
  promise: Promise<any>;
  resolve: (val: any) => void;
  reject: (val: Error) => void;
}