# Watchdog Realtime File Monitor

Cross-platform, low-overhead filesystem event monitor featuring recursive tree state diffing, sliding-window burst debouncing, and atomic change journaling.

[![CI](https://github.com/FelipeMadson/watchdog-realtime-file-monitor/actions/workflows/ci.yml/badge.svg)](https://github.com/FelipeMadson/watchdog-realtime-file-monitor/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

*Read this in [Português](README.pt-BR.md).*

---

## Technical Architecture

- **In-Memory Snapshot Diffing**: Compares filesystem directory trees by size and modification timestamp, accurately discriminating between additions, updates, and deletions.
- **Burst Debouncing**: Groups rapid editor saves (atomic rename + write cycles) into single coalesced change events.
- **Glob Filtering**: Excludes noisy directories (`node_modules`, `.git`, build targets) by default.

---

## Usage Example

```typescript
import { FileTreeSnapshot, DebounceBuffer } from './src/index.ts';

const prev = new FileTreeSnapshot();
prev.set('src/index.ts', 1024, 1700000000);

const curr = new FileTreeSnapshot();
curr.set('src/index.ts', 2048, 1700000050);
curr.set('src/types.ts', 512, 1700000050);

const changes = prev.diff(curr);
// [{ path: 'src/index.ts', type: 'modified' }, { path: 'src/types.ts', type: 'created' }]
```

## License

MIT © [Felipe Madison](https://github.com/FelipeMadson)
