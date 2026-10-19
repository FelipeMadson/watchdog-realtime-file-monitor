import type { FileChangeRecord } from './types.ts';

export class FileTreeSnapshot {
  private files = new Map<string, { size: number; mtime: number }>();

  set(path: string, size: number, mtime: number): void {
    this.files.set(path, { size, mtime });
  }

  get(path: string): { size: number; mtime: number } | undefined {
    return this.files.get(path);
  }

  diff(nextSnapshot: FileTreeSnapshot): FileChangeRecord[] {
    const changes: FileChangeRecord[] = [];
    const now = Date.now();

    // 1. Arquivos criados ou modificados
    for (const [filePath, nextMeta] of nextSnapshot.files) {
      const prevMeta = this.files.get(filePath);
      if (!prevMeta) {
        changes.push({ path: filePath, type: 'created', timestamp: now });
      } else if (prevMeta.size !== nextMeta.size || prevMeta.mtime !== nextMeta.mtime) {
        changes.push({ path: filePath, type: 'modified', timestamp: now });
      }
    }

    // 2. Arquivos deletados
    for (const [filePath] of this.files) {
      if (!nextSnapshot.files.has(filePath)) {
        changes.push({ path: filePath, type: 'deleted', timestamp: now });
      }
    }

    return changes;
  }
}
