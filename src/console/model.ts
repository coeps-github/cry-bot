export interface Console {
  readonly execute: (command: string) => void
  readonly write: (line?: string, refillInput?: boolean) => void
}
