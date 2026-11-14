import { validateArticles } from './article-schema.js';

// JSON article files are managed through Pages CMS and committed to GitHub.
// Draft and review records remain in the repository but are never exposed publicly.
const articleModules = import.meta.glob('../../content/articles/*.json', {
  eager: true,
  import: 'default',
});

export const ARTICLES = Object.freeze(validateArticles(Object.values(articleModules)));

export function getPublishedArticles() {
  return ARTICLES.filter((article) => article.status === 'published');
}
