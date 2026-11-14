import test from 'node:test';
import assert from 'node:assert/strict';
import {
  canonicalUrl,
  fetchAllowedText,
  isAllowedHost,
  parseFeed,
  slugify,
  validateDraft,
} from './collect-and-draft.js';

test('parseFeed extracts RSS item fields and decodes entities', () => {
  const xml = `<?xml version="1.0"?>
    <rss><channel><item>
      <title><![CDATA[India beat England &amp; win series]]></title>
      <link>https://www.bbc.co.uk/sport/cricket/123?utm_source=rss</link>
      <description><![CDATA[India won the match &amp; series.]]></description>
      <pubDate>Sat, 14 Nov 2026 09:00:00 GMT</pubDate>
    </item></channel></rss>`;
  const [item] = parseFeed(xml, 'BBC Sport');
  assert.equal(item.publisher, 'BBC Sport');
  assert.equal(item.title, 'India beat England & win series');
  assert.equal(item.summary, 'India won the match & series.');
  assert.equal(item.url, 'https://www.bbc.co.uk/sport/cricket/123?utm_source=rss');
  assert.equal(Date.parse(item.publishedAt), Date.parse('Sat, 14 Nov 2026 09:00:00 GMT'));
});

test('canonicalUrl removes tracking parameters but keeps story parameters', () => {
  assert.equal(
    canonicalUrl('https://example.com/story?id=42&utm_source=rss&fbclid=abc#top'),
    'https://example.com/story?id=42',
  );
});

test('BBC RSS host is explicitly approved', () => {
  assert.equal(isAllowedHost('https://feeds.bbci.co.uk/sport/cricket/rss.xml', ['bbc.co.uk', 'bbc.com', 'bbci.co.uk']), true);
});

test('isAllowedHost accepts real publisher subdomains and rejects lookalike domains', () => {
  assert.equal(isAllowedHost('https://www.bbc.co.uk/sport/cricket', ['bbc.co.uk']), true);
  assert.equal(isAllowedHost('https://bbc.co.uk.attacker.example/story', ['bbc.co.uk']), false);
  assert.equal(isAllowedHost('javascript:alert(1)', ['bbc.co.uk']), false);
});

test('slugify creates URL-safe English slugs', () => {
  assert.equal(slugify('India’s Big Win: 3 Lessons!'), 'india-s-big-win-3-lessons');
  assert.equal(slugify('हिंदी शीर्षक'), '');
});

test('validateDraft accepts a complete bilingual draft with source claims', () => {
  const draft = {
    title: 'India win the series',
    titleHi: 'भारत ने सीरीज़ जीती',
    excerpt: 'India secured the series.',
    excerptHi: 'भारत ने सीरीज़ अपने नाम की।',
    body: 'First paragraph.\\n\\nSecond paragraph.',
    bodyHi: 'पहला पैराग्राफ।\\n\\nदूसरा पैराग्राफ।',
    category: 'International Cricket',
    categoryHi: 'अंतरराष्ट्रीय क्रिकेट',
    section: 'news',
    sourceClaims: ['India won the final match.'],
  };
  assert.equal(validateDraft(draft), undefined);
});

test('validateDraft rejects missing source claims', () => {
  assert.throws(() => validateDraft({
    title: 'Title', titleHi: 'शीर्षक', excerpt: 'Summary', excerptHi: 'सारांश',
    body: 'Body', bodyHi: 'लेख', category: 'Cricket', categoryHi: 'क्रिकेट',
    section: 'news', sourceClaims: [],
  }), /source claims/);
});

test('fetchAllowedText validates every redirect hop before following it', async () => {
  const visited = [];
  const fetchImpl = async (url) => {
    visited.push(url);
    if (visited.length === 1) {
      return new Response(null, { status: 302, headers: { location: 'https://outside.example/story' } });
    }
    return new Response('should never be fetched');
  };
  await assert.rejects(
    fetchAllowedText('https://www.bbc.co.uk/story', ['bbc.co.uk'], { fetchImpl }),
    /not an approved HTTPS publisher host/,
  );
  assert.deepEqual(visited, ['https://www.bbc.co.uk/story']);
});

test('fetchAllowedText follows only approved HTTPS redirects', async () => {
  const visited = [];
  const fetchImpl = async (url) => {
    visited.push(url);
    if (visited.length === 1) {
      return new Response(null, { status: 301, headers: { location: 'https://www.bbc.co.uk/final' } });
    }
    return new Response('approved publisher content');
  };
  const body = await fetchAllowedText('https://bbc.co.uk/start', ['bbc.co.uk'], { fetchImpl });
  assert.equal(body, 'approved publisher content');
  assert.deepEqual(visited, ['https://bbc.co.uk/start', 'https://www.bbc.co.uk/final']);
});

test('fetchAllowedText rejects oversized responses', async () => {
  const fetchImpl = async () => new Response('12345');
  await assert.rejects(
    fetchAllowedText('https://bbc.co.uk/story', ['bbc.co.uk'], { fetchImpl, maxBytes: 4 }),
    /size limit/,
  );
});

test('validateDraft rejects HTML and oversized fields', () => {
  const valid = {
    title: 'Title', titleHi: 'शीर्षक', excerpt: 'Summary', excerptHi: 'सारांश',
    body: 'Body', bodyHi: 'लेख', category: 'Cricket', categoryHi: 'क्रिकेट',
    section: 'news', sourceClaims: ['A source-backed claim.'],
  };
  assert.throws(() => validateDraft({ ...valid, body: '<script>alert(1)</script>' }), /contains HTML/);
  assert.throws(() => validateDraft({ ...valid, title: 'x'.repeat(181) }), /exceeds limits/);
});
