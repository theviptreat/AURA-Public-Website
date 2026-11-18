import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  getLocaleSwitchPath,
  localizePath,
  normalizeLocale,
  resolveLocalizedPath,
} from './locale.js';

test('only configured locales are supported', () => {
  assert.deepEqual(SUPPORTED_LOCALES, ['en', 'hi']);
  assert.equal(DEFAULT_LOCALE, 'en');
  assert.equal(normalizeLocale('HI-in'), 'hi');
  assert.equal(normalizeLocale('en_US'), 'en');
  assert.equal(normalizeLocale('ta-IN'), null);
  assert.equal(normalizeLocale(undefined), null);
});

test('legacy paths resolve as English without being rewritten', () => {
  assert.deepEqual(resolveLocalizedPath('/news/article-one/'), {
    locale: 'en',
    pathname: '/news/article-one',
    hasLocalePrefix: false,
  });
  assert.equal(resolveLocalizedPath('/').pathname, '/');
});

test('locale-prefixed paths resolve to their content pathname', () => {
  assert.deepEqual(resolveLocalizedPath('/hi/news/article-one/'), {
    locale: 'hi',
    pathname: '/news/article-one',
    hasLocalePrefix: true,
  });
  assert.equal(resolveLocalizedPath('/en/').pathname, '/');
});

test('localizePath avoids duplicate locale prefixes', () => {
  assert.equal(localizePath('/', 'en'), '/en');
  assert.equal(localizePath('/news', 'hi'), '/hi/news');
  assert.equal(localizePath('/en/news', 'hi'), '/hi/news');
  assert.equal(localizePath('/hi/news', 'en'), '/en/news');
  assert.equal(localizePath('/news', 'unsupported'), '/en/news');
});

test('language switching preserves the current page path', () => {
  assert.equal(getLocaleSwitchPath('/hi/analysis', 'en'), '/en/analysis');
  assert.equal(getLocaleSwitchPath('/news/article-one', 'hi'), '/hi/news/article-one');
});

test('language switching preserves query strings and hash fragments', () => {
  assert.equal(
    getLocaleSwitchPath('/hi/news', 'en', '?category=international&page=2', '#latest'),
    '/en/news?category=international&page=2#latest',
  );
  assert.equal(
    getLocaleSwitchPath('/en/analysis', 'hi', 'view=deep', 'methodology'),
    '/hi/analysis?view=deep#methodology',
  );
});

test('language switching works when only a query string or hash is present', () => {
  assert.equal(getLocaleSwitchPath('/news', 'hi', '?q=world'), '/hi/news?q=world');
  assert.equal(getLocaleSwitchPath('/news', 'hi', '', '#latest'), '/hi/news#latest');
});
