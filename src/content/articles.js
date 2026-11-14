import { validateArticles } from './article-schema.js';

// English fields are the source of truth. Hindi fields are supplied explicitly.
// Keep this list empty until an editor approves the first real story.
export const ARTICLES = Object.freeze([]);

export function getPublishedArticles() {
  validateArticles(ARTICLES);
  return ARTICLES.filter((article) => article.status === 'published');
}
