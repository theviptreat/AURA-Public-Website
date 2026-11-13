import test from 'node:test';
import assert from 'node:assert/strict';
import { buildLocalizedDocument } from '../../scripts/prerender-locales.js';

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
