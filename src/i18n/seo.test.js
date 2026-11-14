import test from 'node:test';
import assert from 'node:assert/strict';
import { getArticleSeoMetadata, getLocalizedSeoUrls, getOpenGraphLocale } from './seo.js';

test('English routes get canonical and Hindi alternate URLs', () => {
  assert.deepEqual(getLocalizedSeoUrls('https://example.com', '/en/news'), {
    canonical: 'https://example.com/en/news',
    languages: {
      en: 'https://example.com/en/news',
      hi: 'https://example.com/hi/news',
      'x-default': 'https://example.com/en/news',
    },
  });
});

test('legacy unprefixed routes canonicalize to the English locale URL', () => {
  const urls = getLocalizedSeoUrls('https://example.com', '/news/article-one/');
  assert.equal(urls.canonical, 'https://example.com/en/news/article-one');
  assert.equal(urls.languages.hi, 'https://example.com/hi/news/article-one');
});

test('Hindi routes retain the same page path in alternate URLs', () => {
  const urls = getLocalizedSeoUrls('https://example.com', '/hi/analysis');
  assert.equal(urls.canonical, 'https://example.com/hi/analysis');
  assert.equal(urls.languages.en, 'https://example.com/en/analysis');
});

test('Open Graph locale uses the correct language-region code', () => {
  assert.equal(getOpenGraphLocale('hi'), 'hi_IN');
  assert.equal(getOpenGraphLocale('en'), 'en_US');
});

test('article SEO uses localized editorial metadata and image', () => {
  assert.deepEqual(getArticleSeoMetadata({
    title: 'A cricket story',
    seoTitle: 'A focused headline',
    excerpt: 'An editorial summary.',
    seoDescription: 'A focused search description.',
    coverImage: '/images/story.jpg',
  }, 'en'), {
    title: 'A focused headline | AURA Sport',
    description: 'A focused search description.',
    image: '/images/story.jpg',
  });
  assert.deepEqual(getArticleSeoMetadata({
    title: 'A cricket story',
    titleHi: 'क्रिकेट की खबर',
    seoTitleHi: 'खास क्रिकेट खबर',
    excerpt: 'An editorial summary.',
    excerptHi: 'हिंदी सारांश।',
    seoDescriptionHi: 'हिंदी खोज विवरण।',
  }, 'hi'), {
    title: 'खास क्रिकेट खबर | AURA Sport',
    description: 'हिंदी खोज विवरण।',
    image: '',
  });
});
