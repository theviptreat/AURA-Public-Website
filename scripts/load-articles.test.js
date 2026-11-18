import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { loadArticles } from './load-articles.js';

test('article loader reads JSON records and ignores non-JSON files', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'aura-articles-'));
  try {
    await writeFile(path.join(root, 'README.md'), 'CMS content folder');
    await writeFile(path.join(root, 'one.json'), JSON.stringify({
      slug: 'one-story', title: 'One story', excerpt: 'Summary', body: 'Body',
      category: 'International', section: 'news', status: 'draft',
    }));
    const records = await loadArticles(root);
    assert.equal(records.length, 1);
    assert.equal(records[0].slug, 'one-story');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('article loader validates every JSON content record', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'aura-articles-'));
  try {
    await writeFile(path.join(root, 'bad.json'), JSON.stringify({ slug: 'BAD SLUG' }));
    await assert.rejects(() => loadArticles(root), /URL-safe slug/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
