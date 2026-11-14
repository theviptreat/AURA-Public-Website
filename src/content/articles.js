import publishedArticles from './generated-articles.json';
import { validatePublicArticles } from './article-schema.js';

// This generated module contains published, public-safe fields only.
// Run the generation script before Vite dev/build; draft data is never bundled.
export const ARTICLES = Object.freeze(validatePublicArticles(publishedArticles));

export function getPublishedArticles() {
  return ARTICLES;
}
