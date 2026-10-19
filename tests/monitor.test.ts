import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { FileTreeSnapshot } from '../src/tree-snapshot.ts';
import { DebounceBuffer } from '../src/debouncer.ts';

describe('FileTreeSnapshot', () => {
  it('detecta adições, modificações e exclusões entre snapshots', () => {
    const t0 = new FileTreeSnapshot();
    t0.set('src/a.ts', 100, 1000);
    t0.set('src/b.ts', 200, 1000);

    const t1 = new FileTreeSnapshot();
    t1.set('src/a.ts', 150, 1050); // modificado
    // src/b.ts removido
    t1.set('src/c.ts', 300, 1050); // criado

    const diff = t0.diff(t1);
    assert.equal(diff.length, 3);

    const mod = diff.find(d => d.path === 'src/a.ts');
    assert.equal(mod?.type, 'modified');

    const created = diff.find(d => d.path === 'src/c.ts');
    assert.equal(created?.type, 'created');

    const deleted = diff.find(d => d.path === 'src/b.ts');
    assert.equal(deleted?.type, 'deleted');
  });
});

describe('DebounceBuffer', () => {
  it('coalesce rajadas de eventos múltiplos para o mesmo arquivo', () => {
    const buf = new DebounceBuffer();
    buf.push({ path: 'src/main.ts', type: 'created', timestamp: 10 });
    buf.push({ path: 'src/main.ts', type: 'modified', timestamp: 20 });
    buf.push({ path: 'src/other.ts', type: 'created', timestamp: 25 });

    assert.equal(buf.size(), 2);
    const flushed = buf.flush();
    assert.equal(flushed.length, 2);
    assert.equal(buf.size(), 0);
  });
});
