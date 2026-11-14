const ARTICLE_SECTIONS = Object.freeze(['news', 'match-report', 'match-preview', 'analysis', 'knowledge']);
const ARTICLE_STATUSES = Object.freeze(['draft', 'review', 'published']);
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
  if (article.status === 'published' && (typeof article.publishedAt !== 'string' || Number.isNaN(Date.parse(article.publishedAt)))) {
    throw new TypeError('Published articles must have a valid publishedAt date string.');
  }
  if (article.publishedAt !== undefined && (typeof article.publishedAt !== 'string' || Number.isNaN(Date.parse(article.publishedAt)))) {
    throw new TypeError('Article publishedAt must be a valid date string when provided.');
  }
  if (!ARTICLE_SECTIONS.includes(article.section)) {
    throw new TypeError(`Article section must be one of: ${ARTICLE_SECTIONS.join(', ')}.`);
  }
  if (!ARTICLE_STATUSES.includes(article.status)) {
    throw new TypeError('Article status must be draft, review or published.');
  }
  for (const field of ['titleHi', 'excerptHi', 'bodyHi', 'categoryHi', 'seoTitle', 'seoTitleHi', 'seoDescription', 'seoDescriptionHi', 'author', 'authorHi', 'dateLabel', 'dateLabelHi', 'coverImage', 'coverAlt', 'coverAltHi', 'imageCredit', 'imageCreditHi', 'editorialNotes']) {
    if (article[field] !== undefined && typeof article[field] !== 'string') {
      throw new TypeError(`Article ${field} must be a string when provided.`);
    }
  }
  if (article.featured !== undefined && typeof article.featured !== 'boolean') {
    throw new TypeError('Article featured must be a boolean when provided.');
  }
  if (article.sources !== undefined) {
    if (!Array.isArray(article.sources)) throw new TypeError('Article sources must be an array when provided.');
    for (const source of article.sources) {
      if (!source || typeof source !== 'object' || typeof source.title !== 'string' || !source.title.trim()) {
        throw new TypeError('Each source must have a non-empty title.');
      }
      try {
        const parsed = new URL(source.url);
        if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Unsupported protocol');
      } catch {
        throw new TypeError('Each source must have a valid http(s) URL.');
      }
      for (const field of ['publisher', 'accessedAt', 'notes']) {
        if (source[field] !== undefined && typeof source[field] !== 'string') {
          throw new TypeError(`Source ${field} must be a string when provided.`);
        }
      }
    }
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


// Public build records intentionally omit editorial status and internal fields.
// Validate them as published records so required publication metadata is still enforced.
export function validatePublicArticle(article) {
  return validateArticle({ ...article, status: 'published' });
}

export function validatePublicArticles(articles) {
  if (!Array.isArray(articles)) throw new TypeError('Articles must be an array.');
  const seenSlugs = new Set();
  for (const article of articles) {
    validatePublicArticle(article);
    if (seenSlugs.has(article.slug)) throw new TypeError(`Duplicate article slug: ${article.slug}`);
    seenSlugs.add(article.slug);
  }
  return articles;
}
