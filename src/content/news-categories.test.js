import test from 'node:test';
import assert from 'node:assert/strict';
import { getNewsCategories } from './news-categories.js';

const stories = [
  { category: 'Women’s Cricket', categoryHi: 'महिला क्रिकेट' },
  { category: 'International Cricket', categoryHi: 'अंतरराष्ट्रीय क्रिकेट' },
  { category: 'Women’s Cricket', categoryHi: 'महिला क्रिकेट' },
  { category: 'ODI Cricket' },
];

test('news filters include every distinct category used by published stories', () => {
  assert.deepEqual(getNewsCategories(stories), [
    { value: 'all', label: 'All News' },
    { value: 'Women’s Cricket', label: 'Women’s Cricket' },
    { value: 'International Cricket', label: 'International Cricket' },
    { value: 'ODI Cricket', label: 'ODI Cricket' },
  ]);
});

test('Hindi news filters use categoryHi while retaining the English category value', () => {
  assert.deepEqual(getNewsCategories(stories, 'hi'), [
    { value: 'all', label: 'सभी खबरें' },
    { value: 'Women’s Cricket', label: 'महिला क्रिकेट' },
    { value: 'International Cricket', label: 'अंतरराष्ट्रीय क्रिकेट' },
    { value: 'ODI Cricket', label: 'ODI Cricket' },
  ]);
});

test('empty category values are ignored and All News remains available', () => {
  assert.deepEqual(getNewsCategories([{ category: ' ' }, {}]), [
    { value: 'all', label: 'All News' },
  ]);
});
