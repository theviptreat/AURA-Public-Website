import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const FEEDS = [
  { publisher: 'BBC Sport', url: 'https://feeds.bbci.co.uk/sport/cricket/rss.xml' },
  { publisher: 'ESPNcricinfo', url: 'https://www.espncricinfo.com/rss/content/story/feeds/0.xml' },
];
const CONTENT_DIR = path.resolve('content/articles');
const MODEL = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';
const MAX_AGE_HOURS = 72;

function decode(value = '') {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([\da-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .trim();
}
function tag(xml, name) {
  const match = xml.match(new RegExp('<' + name + '(?:\\s[^>]*)?>([\\s\\S]*?)<\\/' + name + '>', 'i'));
  return match ? decode(match[1].replace(/<[^>]+>/g, ' ')).replace(/\\s+/g, ' ').trim() : '';
}
function parseFeed(xml, publisher) {
  return [...xml.matchAll(/<item\\b[^>]*>([\\s\\S]*?)<\\/item>/gi)].map((m) => {
    const item = m[1];
    return {
      publisher,
      title: tag(item, 'title'),
      url: tag(item, 'link'),
      summary: tag(item, 'description'),
      publishedAt: tag(item, 'pubDate'),
    };
  }).filter((item) => item.title && /^https?:\\/\\//i.test(item.url));
}
function plainText(html) {
  const article = html.match(/<article\\b[^>]*>([\\s\\S]*?)<\\/article>/i)?.[1] || html;
  return decode(article
    .replace(/<(script|style|noscript|nav|footer|header|svg)[^>]*>[\\s\\S]*?<\\/\\1>/gi, ' ')
    .replace(/<(p|h[1-6]|li|blockquote)\\b[^>]*>/gi, '\\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' '))
    .replace(/[ \\t]+/g, ' ').replace(/\\n\\s+/g, '\\n').replace(/\\n{3,}/g, '\\n\\n')
    .trim().slice(0, 12000);
}
async function fetchStory(item) {
  try {
    const response = await fetch(item.url, {
      headers: { 'user-agent': 'AURA-Sport-Newsroom/1.0 (+https://aura-sport-website-i18n-preview.onrender.com)' },
      signal: AbortSignal.timeout(12000),
    });
    if (response.ok) {
      const text = plainText(await response.text());
      if (text.length >= 500) return text;
    }
  } catch (error) {
    console.warn('Story page could not be read:', item.url, error.message);
  }
  return item.summary.length >= 500 ? item.summary : '';
}
async function existingArticles() {
  const files = await readdir(CONTENT_DIR).catch(() => []);
  const articles = [];
  for (const file of files.filter((name) => name.endsWith('.json'))) {
    try { articles.push(JSON.parse(await readFile(path.join(CONTENT_DIR, file), 'utf8'))); } catch {}
  }
  return articles;
}
function slugify(value) {
  return value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 72);
}
async function generateDraft(item, articleText) {
  const prompt = `You are the AURA Sport newsroom assistant. Create an original bilingual cricket-news draft using ONLY the supplied source material. Do not invent scores, dates, quotes, player details, causes, or context. If the source does not support a useful factual article, return {"skip":true,"reason":"..."}.
Return JSON only with these keys: skip, reason, title, titleHi, excerpt, excerptHi, body, bodyHi, category, categoryHi, section, verifiedFacts.
Rules:
- Write clear professional English and natural Hindi, not literal machine translation.
- Article body: 3-5 concise paragraphs in each language, plain text with blank lines between paragraphs.
- Keep the story factual and neutral. No betting, fantasy tips, predictions, or claims of guaranteed outcomes.
- section must be one of news, match-report, match-preview, analysis, knowledge. Prefer news unless this is clearly a completed match report.
- verifiedFacts must be an array of short facts directly supported by the source.
- Never include unsupported information. If the available source is insufficient, skip.
SOURCE PUBLISHER: ${item.publisher}
SOURCE TITLE: ${item.title}
SOURCE URL: ${item.url}
SOURCE DATE: ${item.publishedAt}
RSS SUMMARY: ${item.summary}
SOURCE ARTICLE TEXT:
${articleText}`;
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json', temperature: 0.2, maxOutputTokens: 2200 },
    }),
    signal: AbortSignal.timeout(60000),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(`Gemini API ${response.status}: ${JSON.stringify(payload).slice(0, 1000)}`);
  const raw = payload.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('');
  if (!raw) throw new Error('Gemini returned no draft content.');
  return JSON.parse(raw.replace(/^```(?:json)?\\s*/i, '').replace(/\\s*```$/, ''));
}
function validateDraft(draft) {
  const required = ['title', 'titleHi', 'excerpt', 'excerptHi', 'body', 'bodyHi', 'category', 'categoryHi'];
  for (const field of required) if (typeof draft[field] !== 'string' || !draft[field].trim()) {
    throw new Error(`Gemini draft is missing ${field}`);
  }
  if (!['news', 'match-report', 'match-preview', 'analysis', 'knowledge'].includes(draft.section)) {
    draft.section = 'news';
  }
  if (!Array.isArray(draft.verifiedFacts) || draft.verifiedFacts.length === 0) {
    throw new Error('Gemini did not provide source-supported verifiedFacts.');
  }
}
async function main() {
  if (!process.env.GEMINI_API_KEY) throw new Error('Missing GEMINI_API_KEY secret.');
  const existing = await existingArticles();
  const knownUrls = new Set(existing.flatMap((article) => (article.sources || []).map((source) => source.url)));
  const knownSlugs = new Set(existing.map((article) => article.slug));
  const cutoff = Date.now() - MAX_AGE_HOURS * 60 * 60 * 1000;
  const items = [];
  for (const feed of FEEDS) {
    const response = await fetch(feed.url, { signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`RSS feed failed (${response.status}): ${feed.url}`);
    items.push(...parseFeed(await response.text(), feed.publisher));
  }
  const candidates = items.filter((item) => {
    const date = Date.parse(item.publishedAt);
    return item.url && !knownUrls.has(item.url) && (!Number.isFinite(date) || date >= cutoff);
  }).sort((a, b) => (Date.parse(b.publishedAt) || 0) - (Date.parse(a.publishedAt) || 0));
  console.log(`Collected ${items.length} feed items; ${candidates.length} are new and recent.`);
  for (const item of candidates.slice(0, 6)) {
    const articleText = await fetchStory(item);
    if (articleText.length < 500) {
      console.log('Skipping item: insufficient source text:', item.title);
      continue;
    }
    const draft = await generateDraft(item, articleText);
    if (draft.skip) {
      console.log('Gemini skipped item:', item.title, draft.reason || '');
      continue;
    }
    validateDraft(draft);
    const date = new Date().toISOString().slice(0, 10);
    const base = slugify(draft.title);
    let slug = `${base}-${date}`;
    let suffix = 2;
    while (knownSlugs.has(slug)) slug = `${base}-${date}-${suffix++}`;
    const record = {
      slug,
      status: 'review',
      section: draft.section,
      title: draft.title.trim(),
      titleHi: draft.titleHi.trim(),
      excerpt: draft.excerpt.trim(),
      excerptHi: draft.excerptHi.trim(),
      body: draft.body.trim(),
      bodyHi: draft.bodyHi.trim(),
      category: draft.category.trim(),
      categoryHi: draft.categoryHi.trim(),
      author: 'AURA Sport Editorial Desk',
      authorHi: 'AURA Sport संपादकीय टीम',
      featured: false,
      sources: [{
        title: item.title,
        publisher: item.publisher,
        url: item.url,
        accessedAt: date,
        notes: draft.verifiedFacts.map((fact) => `• ${fact}`).join('\\n'),
      }],
      editorialNotes: 'AI-assisted draft. Human editor must verify every fact, headline, translation and source before publication. No cover image has been assigned.',
    };
    await writeFile(path.join(CONTENT_DIR, `${slug}.json`), JSON.stringify(record, null, 2) + '\\n', 'utf8');
    console.log(`Created review draft: ${slug}`);
    return;
  }
  console.log('No sufficiently supported new cricket story was found. No draft created.');
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
