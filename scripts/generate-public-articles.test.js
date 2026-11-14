import test from 'node:test';
import assert from 'node:assert/strict';
import { createPublicArticleRecords } from './generate-public-articles.js';

const base = {
  slug: 'approved-story',
  title: 'Approved story',
  excerpt: 'A public summary.',
  body: 'Public article body.',
  category: 'International',
  section: 'news',
  status: 'published',
  publishedAt: '2026-11-14',
  sources: [{ title: 'Internal source', url: 'https://example.com' }],
  editorialNotes: 'Internal fact-check notes',
};

test('public article export includes only published stories', () => {
  const result = createPublicArticleRecords([
    base,
    { ...base, slug: 'draft-story', status: 'draft' },
    { ...base, slug: 'review-story', status: 'review' },
  ]);
  assert.deepEqual(result.map((article) => article.slug), ['approved-story']);
});

test('public article export strips internal sources and editorial notes', () => {
  const [article] = createPublicArticleRecords([base]);
  assert.equal(article.sources, undefined);
  assert.equal(article.editorialNotes, undefined);
  assert.equal(article.status, undefined);
  assert.equal(article.title, 'Approved story');
});
