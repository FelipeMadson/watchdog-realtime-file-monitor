import type { FileChangeRecord } from './types.ts';

export class DebounceBuffer {
  private pending = new Map<string, FileChangeRecord>();
  private readonly delayMs: number;

  constructor(delayMs = 100) {
    this.delayMs = delayMs;
  }

  push(change: FileChangeRecord): void {
    this.pending.set(change.path, change);
  }

  flush(): FileChangeRecord[] {
    const result = Array.from(this.pending.values());
    this.pending.clear();
    return result;
  }

  size(): number {
    return this.pending.size;
  }
}
