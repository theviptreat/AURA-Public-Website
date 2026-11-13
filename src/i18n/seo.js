import { localizePath, resolveLocalizedPath } from './locale.js';

/**
 * Build canonical and language-alternate URLs for the current page.
 * The origin is read from the deployed site at runtime so staging and the
 * eventual production domain do not get hard-coded into the source.
 */
export function getLocalizedSeoUrls(origin, pathname) {
  const resolved = resolveLocalizedPath(pathname);
  const canonicalPath = localizePath(resolved.pathname, resolved.locale);
  const canonical = new URL(canonicalPath, origin).href;

  return Object.freeze({
    canonical,
    languages: Object.freeze({
      en: new URL(localizePath(resolved.pathname, 'en'), origin).href,
      hi: new URL(localizePath(resolved.pathname, 'hi'), origin).href,
      'x-default': new URL(localizePath(resolved.pathname, 'en'), origin).href,
    }),
  });
}

export function getOpenGraphLocale(locale) {
  return locale === 'hi' ? 'hi_IN' : 'en_US';
}
