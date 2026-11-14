import test from 'node:test';
import assert from 'node:assert/strict';
import { buildLocalizedDocument, buildArticleDocument } from '../../scripts/prerender-locales.js';

const template = '<!doctype html><html lang="en"><head><meta name="description" content="Default description" /><title>Default title</title></head><body><div id="root"></div></body></html>';

test('English localized documents contain crawlable English metadata', () => {
  const html = buildLocalizedDocument(template, '/news', 'en');
  assert.match(html, /<html lang="en">/);
  assert.match(html, /<title>Cricket News \| AURA Sport<\/title>/);
  assert.match(html, /name="description" content="Read the latest cricket news and updates from AURA Sport\."/);
  assert.match(html, /property="og:locale" content="en_US"/);
});

test('Hindi localized documents contain crawlable Hindi metadata', () => {
  const html = buildLocalizedDocument(template, '/news', 'hi');
  assert.match(html, /<html lang="hi-IN">/);
  assert.match(html, /<title>क्रिकेट समाचार \| AURA Sport<\/title>/);
  assert.match(html, /name="description" content="AURA Sport पर पढ़ें क्रिकेट जगत की ताज़ा खबरें और अपडेट।"/);
  assert.match(html, /property="og:locale" content="hi_IN"/);
});

test('unsupported route and locale combinations fail instead of generating wrong metadata', () => {
  assert.throws(() => buildLocalizedDocument(template, '/unknown', 'hi'), /Unsupported localized route/);
  assert.throws(() => buildLocalizedDocument(template, '/news', 'fr'), /Unsupported localized route/);
});

const story = {
  slug: 'sample-match-report',
  title: 'A close cricket finish',
  titleHi: 'क्रिकेट का रोमांचक मुकाबला',
  excerpt: 'A sample editorial summary.',
  excerptHi: 'एक नमूना संपादकीय सारांश।',
  seoTitle: 'A close cricket finish',
  seoTitleHi: 'क्रिकेट का रोमांचक मुकाबला',
  seoDescription: 'A search description for the sample story.',
  seoDescriptionHi: 'नमूना खबर के लिए खोज विवरण।',
  coverImage: 'https://images.example.test/cricket.jpg',
  status: 'published',
  section: 'news',
  category: 'International',
  body: 'Sample body',
  publishedAt: '2026-11-14T08:00:00Z',
};

test('published article HTML gets locale-specific title, description and social image metadata', () => {
  const english = buildArticleDocument(template, story, 'en');
  const hindi = buildArticleDocument(template, story, 'hi');
  assert.match(english, /<html lang="en">/);
  assert.match(english, /<title>A close cricket finish \| AURA Sport<\/title>/);
  assert.match(english, /name="description" content="A search description for the sample story\."/);
  assert.match(english, /property="og:type" content="article"/);
  assert.match(english, /property="og:image" content="https:\/\/images\.example\.test\/cricket\.jpg"/);
  assert.match(english, /<h1>A close cricket finish<\/h1>/);
  assert.match(english, /<div class="article-body"><p>Sample body<\/p><\/div>/);
  assert.match(hindi, /<h1>क्रिकेट का रोमांचक मुकाबला<\/h1>/);
  assert.match(hindi, /<div class="article-body"><p>Sample body<\/p><\/div>/);
  assert.match(hindi, /<html lang="hi-IN">/);
  assert.match(hindi, /<title>क्रिकेट का रोमांचक मुकाबला \| AURA Sport<\/title>/);
  assert.match(hindi, /name="description" content="नमूना खबर के लिए खोज विवरण।"/);
});

test('draft articles are never prerendered as public article pages', () => {
  assert.throws(() => buildArticleDocument(template, { ...story, status: 'draft' }, 'en'), /Only published articles/);
});
