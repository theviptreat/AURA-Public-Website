import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { localizeStory } from '../src/i18n/localized-content.js';

const routes = {
  '/': {
    en: ['AURA Sport — Cricket, with context', 'AURA Sport presents a thoughtful perspective on cricket, shaped by skill, strategy, research and patience.'],
    hi: ['AURA Sport — क्रिकेट, सही संदर्भ के साथ', 'AURA Sport कौशल, रणनीति, शोध और धैर्य के साथ क्रिकेट को समझने का एक गहरा नज़रिया प्रस्तुत करता है।'],
  },
  '/about': {
    en: ['About AURA Sport', 'Learn about AURA Sport and its cricket editorial approach.'],
    hi: ['AURA Sport के बारे में', 'AURA Sport और क्रिकेट के प्रति उसके संपादकीय दृष्टिकोण के बारे में जानें।'],
  },
  '/contact': {
    en: ['Contact & Help | AURA Sport', 'Find information about contacting AURA Sport and getting support.'],
    hi: ['संपर्क और सहायता | AURA Sport', 'AURA Sport से संपर्क और सहायता पाने की जानकारी।'],
  },
  '/privacy-policy': {
    en: ['Privacy Policy | AURA Sport', 'Read the AURA Sport website privacy policy.'],
    hi: ['गोपनीयता नीति | AURA Sport', 'AURA Sport वेबसाइट की गोपनीयता नीति पढ़ें।'],
  },
  '/terms': {
    en: ['Terms & Conditions | AURA Sport', 'Read the terms and conditions for using AURA Sport.'],
    hi: ['नियम और शर्तें | AURA Sport', 'AURA Sport के उपयोग से जुड़े नियम और शर्तें पढ़ें।'],
  },
  '/disclaimer': {
    en: ['Disclaimer | AURA Sport', 'Important information about AURA Sport editorial content and predictions.'],
    hi: ['अस्वीकरण | AURA Sport', 'AURA Sport की सामग्री और पूर्वानुमानों से जुड़ी महत्वपूर्ण जानकारी।'],
  },
  '/download': {
    en: ['Get the AURA Sport App', 'Find official information about downloading the AURA Sport app.'],
    hi: ['AURA Sport ऐप डाउनलोड करें', 'AURA Sport ऐप डाउनलोड करने की आधिकारिक जानकारी।'],
  },
};

function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function setMeta(html, attribute, key, value) {
  const tag = `<meta ${attribute}="${key}" content="${escapeHtml(value)}" />`;
  const pattern = new RegExp(`<meta ${attribute}=["']${key}["'][^>]*>`);
  if (pattern.test(html)) return html.replace(pattern, tag);
  return html.replace('</head>', `  ${tag}\n  </head>`);
}

export function buildArticleDocument(template, sourceArticle, locale) {
  if (!sourceArticle || sourceArticle.status !== 'published') {
    throw new Error('Only published articles can be prerendered.');
  }
  const article = localizeStory(sourceArticle, locale);
  if (!['en', 'hi'].includes(locale)) throw new Error(`Unsupported article locale: ${locale}`);
  const title = article.seoTitle?.trim() || article.title;
  const description = article.seoDescription?.trim() || article.excerpt;
  const lang = locale === 'hi' ? 'hi-IN' : 'en';
  const localeTag = locale === 'hi' ? 'hi_IN' : 'en_US';
  let html = template
    .replace('<html lang="en">', `<html lang="${lang}">`)
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title.includes('AURA Sport') ? title : `${title} | AURA Sport`)}</title>`);
  html = setMeta(html, 'name', 'description', description);
  html = setMeta(html, 'property', 'og:title', title.includes('AURA Sport') ? title : `${title} | AURA Sport`);
  html = setMeta(html, 'property', 'og:description', description);
  html = setMeta(html, 'property', 'og:type', 'article');
  html = setMeta(html, 'property', 'og:locale', localeTag);
  if (article.coverImage) {
    html = setMeta(html, 'property', 'og:image', article.coverImage);
    html = setMeta(html, 'name', 'twitter:image', article.coverImage);
    html = setMeta(html, 'name', 'twitter:card', 'summary_large_image');
  }

  const articleMarkup = [
    '<main class="page-main"><div class="container article-shell"><article class="article-content">',
    '<span class="story-category">', escapeHtml(article.category), '</span>',
    '<h1>', escapeHtml(article.title), '</h1>',
    article.excerpt ? '<p class="article-deck">' + escapeHtml(article.excerpt) + '</p>' : '',
    '<div class="article-meta">',
    article.author ? '<span>' + escapeHtml(article.author) + '</span>' : '',
    '<time datetime="' + escapeHtml(article.publishedAt) + '">' + escapeHtml(article.dateLabel || article.publishedAt.slice(0, 10)) + '</time>',
    '</div>',
    article.coverImage
      ? '<figure class="article-cover"><img src="' + escapeHtml(article.coverImage) + '" alt="' + escapeHtml(article.coverAlt || article.title) + '" />' + (article.imageCredit ? '<figcaption>' + escapeHtml(article.imageCredit) + '</figcaption>' : '') + '</figure>'
      : '',
    '<div class="article-body">', article.body.split(/\n\s*\n/).map((paragraph) => paragraph.trim() ? '<p>' + escapeHtml(paragraph.trim()) + '</p>' : '').join(''), '</div>',
    '</article></div></main>',
  ].join('');
  html = html.replace('<div id="root"></div>', '<div id="root">' + articleMarkup + '</div>');
  html = html.replace(/<link id="hero-image-preload"[^>]*>\s*/, '');
  return html;
}

export async function prerenderPublishedArticles(template, outputRoot = 'dist', articles = []) {
  for (const article of articles) {
    if (article.status !== 'published') continue;
    for (const locale of ['en', 'hi']) {
      const outputDir = path.join(outputRoot, locale, 'news', article.slug);
      await mkdir(outputDir, { recursive: true });
      await writeFile(path.join(outputDir, 'index.html'), buildArticleDocument(template, article, locale));
    }
  }
}

export function buildLocalizedDocument(template, route, locale) {
  const page = routes[route]?.[locale];
  if (!page) throw new Error(`Unsupported localized route: ${locale} ${route}`);
  const [title, description] = page;
  const lang = locale === 'hi' ? 'hi-IN' : 'en';
  const localeTag = locale === 'hi' ? 'hi_IN' : 'en_US';
  const html = template
    .replace('<html lang="en">', `<html lang="${lang}">`)
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${escapeHtml(description)}" />`)
    .replace('</head>', `  <meta property="og:title" content="${escapeHtml(title)}" />\n    <meta property="og:description" content="${escapeHtml(description)}" />\n    <meta property="og:locale" content="${localeTag}" />\n  </head>`);
  return route === '/' ? html : html.replace(/<link id="hero-image-preload"[^>]*>\s*/, '');
}

export async function prerenderLocalizedRoutes() {
  const template = await readFile('dist/index.html', 'utf8');
  for (const [route, translations] of Object.entries(routes)) {
    for (const locale of Object.keys(translations)) {
      const routePath = route === '/' ? locale : path.join(locale, route.slice(1));
      const outputDir = path.join('dist', routePath);
      await mkdir(outputDir, { recursive: true });
      await writeFile(path.join(outputDir, 'index.html'), buildLocalizedDocument(template, route, locale));
    }
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve('scripts/prerender-locales.js')) {
  await prerenderLocalizedRoutes();
  console.log('Generated English and Hindi static route documents.');
}
