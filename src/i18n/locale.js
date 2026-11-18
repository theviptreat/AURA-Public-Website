export const SUPPORTED_LOCALES = Object.freeze(['en', 'hi']);
export const DEFAULT_LOCALE = 'en';

const supportedLocaleSet = new Set(SUPPORTED_LOCALES);

/**
 * Return a supported locale code, or null when the value is not supported.
 * Regional variants such as "hi-IN" resolve to their base language.
 */
export function normalizeLocale(value) {
  if (typeof value !== 'string') return null;
  const language = value.trim().toLowerCase().split(/[-_]/)[0];
  return supportedLocaleSet.has(language) ? language : null;
}

/**
 * Parse a pathname without changing the browser location.
 * Legacy paths without a locale prefix remain English during migration.
 */
export function resolveLocalizedPath(pathname) {
  const safePath = typeof pathname === 'string' && pathname.startsWith('/')
    ? pathname
    : '/';
  const normalizedPath = safePath.length > 1
    ? safePath.replace(/\/+$/, '')
    : '/';
  const segments = normalizedPath.split('/');
  const locale = normalizeLocale(segments[1]);

  if (!locale) {
    return Object.freeze({
      locale: DEFAULT_LOCALE,
      pathname: normalizedPath,
      hasLocalePrefix: false,
    });
  }

  const remainder = segments.slice(2).join('/');
  return Object.freeze({
    locale,
    pathname: remainder ? `/${remainder}` : '/',
    hasLocalePrefix: true,
  });
}

/**
 * Build a locale-prefixed URL path while avoiding duplicate locale segments.
 */
export function localizePath(pathname, locale) {
  const safeLocale = normalizeLocale(locale) || DEFAULT_LOCALE;
  const resolved = resolveLocalizedPath(pathname);
  const basePath = resolved.pathname === '/'
    ? ''
    : resolved.pathname.replace(/^\/+/, '');
  return basePath ? `/${safeLocale}/${basePath}` : `/${safeLocale}`;
}

/**
 * Return the equivalent page URL in another language, retaining its query
 * string and hash fragment exactly as supplied by the browser.
 */
export function getLocaleSwitchPath(pathname, targetLocale, search = '', hash = '') {
  const query = typeof search === 'string' && search
    ? (search.startsWith('?') ? search : `?${search}`)
    : '';
  const fragment = typeof hash === 'string' && hash
    ? (hash.startsWith('#') ? hash : `#${hash}`)
    : '';
  return `${localizePath(pathname, targetLocale)}${query}${fragment}`;
}
