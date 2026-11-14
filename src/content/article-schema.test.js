import test from 'node:test';
import assert from 'node:assert/strict';
import { validateArticle, validateArticles, validatePublicArticle, validatePublicArticles } from './article-schema.js';

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
  assert.throws(() => validateArticle({ ...validArticle, status: 'scheduled' }), /status must be draft, review or published/);
  assert.throws(() => validateArticle({ ...validArticle, publishedAt: 'not-a-date' }), /valid date string/);
});

test('duplicate article slugs are rejected', () => {
  assert.throws(() => validateArticles([validArticle, validArticle]), /Duplicate article slug/);
});

test('draft and review articles may omit a publication date', () => {
  const { publishedAt, ...withoutDate } = validArticle;
  assert.equal(validateArticle(withoutDate).status, 'draft');
  assert.equal(validateArticle({ ...withoutDate, status: 'review' }).status, 'review');
});

test('published articles require a valid publication date', () => {
  const { publishedAt, ...withoutDate } = validArticle;
  assert.throws(() => validateArticle({ ...withoutDate, status: 'published' }), /Published articles must have a valid publishedAt/);
});

test('source references require a title and a valid http URL', () => {
  assert.equal(validateArticle({ ...validArticle, sources: [{ title: 'Official source', url: 'https://example.com/news' }] }).slug, validArticle.slug);
  assert.throws(() => validateArticle({ ...validArticle, sources: [{ title: 'Missing URL' }] }), /valid http\(s\) URL/);
  assert.throws(() => validateArticle({ ...validArticle, sources: [{ title: '', url: 'https://example.com' }] }), /non-empty title/);
});

test('match reports are a supported editorial section', () => {
  assert.equal(validateArticle({ ...validArticle, section: 'match-report' }).section, 'match-report');
});


test('public published records may omit editorial status after sanitization', () => {
  const { status, ...publicRecord } = { ...validArticle, status: 'published' };
  assert.equal(validatePublicArticle(publicRecord), publicRecord);
  assert.deepEqual(validatePublicArticles([publicRecord]), [publicRecord]);
});

test('public records still require valid publication dates and sections', () => {
  const { publishedAt, ...withoutDate } = { ...validArticle, status: 'published' };
  assert.throws(() => validatePublicArticle(withoutDate), /Published articles must have a valid publishedAt/);
  assert.throws(() => validatePublicArticle({ ...validArticle, status: undefined, section: 'unknown' }), /section must be one of/);
});
