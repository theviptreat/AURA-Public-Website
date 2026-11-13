const LOCALIZED_STORY_FIELDS = Object.freeze({
  title: 'titleHi',
  excerpt: 'excerptHi',
  body: 'bodyHi',
  category: 'categoryHi',
  coverAlt: 'coverAltHi',
  imageCredit: 'imageCreditHi',
  author: 'authorHi',
  dateLabel: 'dateLabelHi',
});

/**
 * Return a display copy of a story in the requested locale.
 * English fields remain the source of truth; Hindi content is supplied
 * explicitly by the newsroom/CMS and is never machine-translated at render time.
 */
export function localizeStory(story, locale = 'en') {
  if (!story || typeof story !== 'object') return story;
  if (locale !== 'hi') return story;

  const localized = { ...story };
  for (const [field, translatedField] of Object.entries(LOCALIZED_STORY_FIELDS)) {
    if (typeof story[translatedField] === 'string' && story[translatedField].trim()) {
      localized[field] = story[translatedField];
    }
  }
  return localized;
}
