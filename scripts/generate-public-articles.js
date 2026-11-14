import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { loadArticles } from './load-articles.js';
import { validateArticles } from '../src/content/article-schema.js';

const PUBLIC_FIELDS = Object.freeze([
  'slug', 'title', 'titleHi', 'excerpt', 'excerptHi', 'body', 'bodyHi',
  'category', 'categoryHi', 'section', 'publishedAt', 'author', 'authorHi',
  'dateLabel', 'dateLabelHi', 'featured', 'coverImage', 'coverAlt',
  'coverAltHi', 'imageCredit', 'imageCreditHi', 'seoTitle', 'seoTitleHi',
  'seoDescription', 'seoDescriptionHi',
]);

export function createPublicArticleRecords(articles) {
  return validateArticles(articles)
    .filter((article) => article.status === 'published')
    .map((article) => Object.fromEntries(
      PUBLIC_FIELDS.filter((field) => article[field] !== undefined)
        .map((field) => [field, article[field]]),
    ));
}

export async function generatePublicArticles({
  contentDirectory = path.resolve('content/articles'),
  outputFile = path.resolve('src/content/generated-articles.json'),
} = {}) {
  const articles = await loadArticles(contentDirectory);
  const publicArticles = createPublicArticleRecords(articles);
  await mkdir(path.dirname(outputFile), { recursive: true });
  await writeFile(outputFile, JSON.stringify(publicArticles, null, 2) + '\n', 'utf8');
  return publicArticles.length;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const count = await generatePublicArticles();
  console.log(`Prepared ${count} published article(s) for the public website.`);
}
