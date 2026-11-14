const ARTICLE_SECTIONS = Object.freeze(['news', 'match-preview', 'analysis', 'knowledge']);
const ARTICLE_STATUSES = Object.freeze(['draft', 'published']);
const REQUIRED_TEXT_FIELDS = Object.freeze(['title', 'excerpt', 'body', 'category']);

export function validateArticle(article) {
  if (!article || typeof article !== 'object' || Array.isArray(article)) {
    throw new TypeError('Article must be an object.');
  }
  if (typeof article.slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug)) {
    throw new TypeError('Article slug must be a lowercase URL-safe slug.');
  }
  for (const field of REQUIRED_TEXT_FIELDS) {
    if (typeof article[field] !== 'string' || !article[field].trim()) {
      throw new TypeError(`Article ${field} must be a non-empty string.`);
    }
  }
  if (typeof article.publishedAt !== 'string' || Number.isNaN(Date.parse(article.publishedAt))) {
    throw new TypeError('Article publishedAt must be a valid date string.');
  }
  if (!ARTICLE_SECTIONS.includes(article.section)) {
    throw new TypeError(`Article section must be one of: ${ARTICLE_SECTIONS.join(', ')}.`);
  }
  if (!ARTICLE_STATUSES.includes(article.status)) {
    throw new TypeError('Article status must be draft or published.');
  }
  for (const field of ['titleHi', 'excerptHi', 'bodyHi', 'categoryHi', 'seoTitle', 'seoTitleHi', 'seoDescription', 'seoDescriptionHi', 'author', 'authorHi', 'dateLabel', 'dateLabelHi', 'coverImage', 'coverAlt', 'coverAltHi', 'imageCredit', 'imageCreditHi']) {
    if (article[field] !== undefined && typeof article[field] !== 'string') {
      throw new TypeError(`Article ${field} must be a string when provided.`);
    }
  }
  if (article.featured !== undefined && typeof article.featured !== 'boolean') {
    throw new TypeError('Article featured must be a boolean when provided.');
  }
  return article;
}

export function validateArticles(articles) {
  if (!Array.isArray(articles)) throw new TypeError('Articles must be an array.');
  const seenSlugs = new Set();
  for (const article of articles) {
    validateArticle(article);
    if (seenSlugs.has(article.slug)) throw new TypeError(`Duplicate article slug: ${article.slug}`);
    seenSlugs.add(article.slug);
  }
  return articles;
}
