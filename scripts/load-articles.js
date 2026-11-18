import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { validateArticles } from '../src/content/article-schema.js';

export async function loadArticles(directory = path.resolve('content/articles')) {
  const names = (await readdir(directory)).filter((name) => name.endsWith('.json')).sort();
  const articles = [];
  for (const name of names) {
    const filePath = path.join(directory, name);
    articles.push(JSON.parse(await readFile(filePath, 'utf8')));
  }
  return validateArticles(articles);
}
