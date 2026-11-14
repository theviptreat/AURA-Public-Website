import test from 'node:test';
import assert from 'node:assert/strict';
import { validateArticle, validateArticles } from './article-schema.js';

const validArticle = {
  slug: 'sample-story',
  title: 'A sample cricket story',
  excerpt: 'A short summary.',
  body: 'Article body.',
  publishedAt: '2026-11-14T08:00:00Z',
  category: 'International',
  section: 'news',
  status: 'draft',
};

test('valid article records pass schema validation', () => {
  assert.equal(validateArticle(validArticle), validArticle);
  assert.deepEqual(validateArticles([validArticle]), [validArticle]);
});

test('invalid slugs and missing editorial fields are rejected', () => {
  assert.throws(() => validateArticle({ ...validArticle, slug: 'Not A Slug' }), /URL-safe slug/);
  assert.throws(() => validateArticle({ ...validArticle, title: '' }), /title must be a non-empty string/);
});

test('unsupported sections, statuses and invalid dates are rejected', () => {
  assert.throws(() => validateArticle({ ...validArticle, section: 'opinion' }), /section must be one of/);
  assert.throws(() => validateArticle({ ...validArticle, status: 'scheduled' }), /status must be draft or published/);
  assert.throws(() => validateArticle({ ...validArticle, publishedAt: 'not-a-date' }), /valid date string/);
});

test('duplicate article slugs are rejected', () => {
  assert.throws(() => validateArticles([validArticle, validArticle]), /Duplicate article slug/);
});
