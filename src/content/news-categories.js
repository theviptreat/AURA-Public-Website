const ALL_NEWS = Object.freeze({ value: 'all', labels: { en: 'All News', hi: 'सभी खबरें' } });

/**
 * Build the news filters from categories actually used by published stories.
 * CMS categories are free text, so the public filters must not assume a
 * separate hard-coded list. Hindi labels use categoryHi when available.
 */
export function getNewsCategories(articles, locale = 'en') {
  const byCategory = new Map();
  for (const article of articles) {
    const value = typeof article.category === 'string' ? article.category.trim() : '';
    if (!value || byCategory.has(value)) continue;
    const hindi = typeof article.categoryHi === 'string' ? article.categoryHi.trim() : '';
    byCategory.set(value, locale === 'hi' && hindi ? hindi : value);
  }
  return [
    { value: ALL_NEWS.value, label: ALL_NEWS.labels[locale === 'hi' ? 'hi' : 'en'] },
    ...[...byCategory].map(([value, label]) => ({ value, label })),
  ];
}
