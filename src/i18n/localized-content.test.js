import test from 'node:test';
import assert from 'node:assert/strict';
import { localizeStory } from './localized-content.js';

test('English stories remain unchanged', () => {
  const story = { title: 'A cricket story', titleHi: 'क्रिकेट की खबर' };
  assert.equal(localizeStory(story, 'en'), story);
});

test('Hindi story fields replace matching English display fields', () => {
  const story = {
    title: 'A cricket story',
    titleHi: 'क्रिकेट की खबर',
    excerpt: 'English summary',
    excerptHi: 'हिंदी सारांश',
    category: 'International',
    categoryHi: 'अंतरराष्ट्रीय',
    body: '<p>English article</p>',
    bodyHi: '<p>हिंदी लेख</p>',
    slug: 'story-slug',
    publishedAt: '2026-11-14',
  };
  const localized = localizeStory(story, 'hi');
  assert.equal(localized.title, 'क्रिकेट की खबर');
  assert.equal(localized.excerpt, 'हिंदी सारांश');
  assert.equal(localized.category, 'अंतरराष्ट्रीय');
  assert.equal(localized.body, '<p>हिंदी लेख</p>');
  assert.equal(localized.slug, story.slug);
  assert.equal(localized.publishedAt, story.publishedAt);
  assert.equal(story.title, 'A cricket story');
});

test('missing Hindi fields safely retain the English source field', () => {
  const story = { title: 'A cricket story', titleHi: '   ', excerpt: 'Summary' };
  const localized = localizeStory(story, 'hi');
  assert.equal(localized.title, 'A cricket story');
  assert.equal(localized.excerpt, 'Summary');
});
