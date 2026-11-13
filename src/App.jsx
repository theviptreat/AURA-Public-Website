import React, { useEffect, useState } from 'react';
import { AdditionalPage } from './InfoPages';
import { localizePath, resolveLocalizedPath } from './i18n/locale';

const navigation = [
  ['News', '/news'],
  ['Match Preview', '/match-preview'],
  ['Analysis', '/analysis'],
  ['Knowledge', '/knowledge'],
  ['About AURA Sport', '/about'],
];
const newsCategories = ['All News', 'International', 'Domestic', 'Tournaments', 'Cricket Updates'];
const articles = [];

const tr = (locale, en, hi) => locale === 'hi' ? hi : en;

function Brand({ locale = 'en' }) {
  return <a className="brand" href={localizePath('/', locale)} aria-label="AURA Sport home"><span className="brand-name">AURA Sport<span>.</span></span></a>;
}

function Header({ locale = 'en', currentPath = '/' }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const labels = locale === 'hi'
    ? ['समाचार', 'मैच पूर्वावलोकन', 'विश्लेषण', 'क्रिकेट ज्ञान', 'AURA Sport के बारे में', 'ऐप डाउनलोड']
    : ['News', 'Match Preview', 'Analysis', 'Knowledge', 'About AURA Sport', 'Get the App'];
  const localizedNavigation = navigation.map(([, href], index) => [labels[index], localizePath(href, locale)]);
  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand locale={locale} />
        <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} id="primary-navigation" aria-label={tr(locale, 'Main navigation', 'मुख्य नेविगेशन')}>
          {localizedNavigation.map(([label, href]) => <a key={label} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
          <a className="nav-download" href={localizePath('/download', locale)}>{labels[5]} <span aria-hidden="true">↗</span></a>
          <div className="language-switch" aria-label={tr(locale, 'Language selection', 'भाषा चुनें')}>
            <a href={localizePath(currentPath, 'en')} aria-current={locale === 'en' ? 'page' : undefined}>EN</a>
            <span aria-hidden="true">|</span>
            <a href={localizePath(currentPath, 'hi')} aria-current={locale === 'hi' ? 'page' : undefined}>हिंदी</a>
          </div>
        </nav>
        <button className="menu-toggle" type="button" aria-label={menuOpen ? tr(locale, 'Close navigation menu', 'नेविगेशन मेनू बंद करें') : tr(locale, 'Open navigation menu', 'नेविगेशन मेनू खोलें')} aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span />
        </button>
      </div>
    </header>
  );
}

function SectionHeading({ eyebrow, title, href, linkLabel = 'View all' }) {
  return <div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>{href && <a className="text-link" href={href}>{linkLabel} <span aria-hidden="true">↗</span></a>}</div>;
}

function EmptyStories({ message, compact = false }) {
  return <div className={compact ? 'empty-stories compact' : 'empty-stories'}><span className="empty-symbol" aria-hidden="true">✳</span><p>{message}</p></div>;
}

function StoryCard({ story, locale }) {
  return (
    <article className="story-card">
      <a href={localizePath('/news/' + story.slug, locale)} className="story-card-link">
        {story.coverImage ? <img className="story-image" src={story.coverImage} alt={story.coverAlt || story.title} loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none'; }} /> : <div className="story-image story-image-empty" aria-hidden="true" />}
        <span className="story-category">{story.category}</span><h3>{story.title}</h3>
        {story.excerpt && <p>{story.excerpt}</p>}<time dateTime={story.publishedAt}>{story.dateLabel}</time>
      </a>
    </article>
  );
}

function HomePage({ locale }) {
  const featuredStory = articles.find((article) => article.featured) || null;
  const latestStories = [...articles].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)).filter((article) => article.slug !== featuredStory?.slug).slice(0, 4);
  const previews = [];
  const analysis = articles.filter((article) => article.section === 'analysis').slice(0, 3);
  const knowledge = articles.filter((article) => article.section === 'knowledge').slice(0, 3);
  return (
    <>
      <section className="intro-band"><div className="container intro-content">
        <span className="eyebrow eyebrow-light">{tr(locale, 'A clearer view of the game', 'क्रिकेट को बेहतर समझने का नज़रिया')}</span>
        <h1>{tr(locale, 'Cricket,', 'क्रिकेट,')} <em>{tr(locale, 'with context.', 'सही संदर्भ के साथ।')}</em></h1>
        <p>{tr(locale, 'News, perspectives and knowledge for people who love the game.', 'खेल से प्यार करने वालों के लिए खबरें, विचार और क्रिकेट की जानकारी।')}</p>
      </div><div className="intro-orbit orbit-one" /><div className="intro-orbit orbit-two" /></section>
      <main>
        {featuredStory && <section className="container featured-section"><SectionHeading eyebrow={tr(locale, 'The big story', 'आज की बड़ी खबर')} title={tr(locale, 'Featured', 'प्रमुख खबर')} /><StoryCard story={featuredStory} locale={locale} /></section>}
        <section className="container content-section" id="news">
          <SectionHeading eyebrow={tr(locale, 'From the cricket world', 'क्रिकेट जगत से')} title={tr(locale, 'Latest News', 'ताज़ा खबरें')} href={localizePath('/news', locale)} linkLabel={tr(locale, 'View all', 'सभी देखें')} />
          {latestStories.length ? <div className="story-grid">{latestStories.map((story) => <StoryCard key={story.slug} story={story} locale={locale} />)}</div> : <EmptyStories message={tr(locale, 'Fresh cricket stories are on the way.', 'क्रिकेट की नई खबरें जल्द प्रकाशित होंगी।')} />}
        </section>
        {previews.length > 0 && <section className="container content-section" id="previews"><SectionHeading eyebrow={tr(locale, 'Before the first ball', 'पहली गेंद से पहले')} title={tr(locale, 'Match Previews', 'मैच पूर्वावलोकन')} href={localizePath('/match-preview', locale)} linkLabel={tr(locale, 'View all', 'सभी देखें')} /><div className="story-grid">{previews.map((story) => <StoryCard key={story.slug} story={story} locale={locale} />)}</div></section>}
        {analysis.length > 0 && <section className="analysis-band content-section" id="analysis"><div className="container"><SectionHeading eyebrow={tr(locale, 'Look beyond the score', 'स्कोर से आगे की समझ')} title={tr(locale, 'AURA Sport Analysis', 'AURA Sport विश्लेषण')} href={localizePath('/analysis', locale)} linkLabel={tr(locale, 'View all', 'सभी देखें')} /><div className="story-grid">{analysis.map((story) => <StoryCard key={story.slug} story={story} locale={locale} />)}</div></div></section>}
        {knowledge.length > 0 && <section className="container content-section" id="knowledge"><SectionHeading eyebrow={tr(locale, 'Understand the game', 'खेल को समझें')} title={tr(locale, 'Cricket Knowledge', 'क्रिकेट ज्ञान')} href={localizePath('/knowledge', locale)} linkLabel={tr(locale, 'View all', 'सभी देखें')} /><div className="story-grid">{knowledge.map((story) => <StoryCard key={story.slug} story={story} locale={locale} />)}</div></section>}
        <section className="container app-promo" id="about"><div className="app-promo-copy">
          <span className="eyebrow eyebrow-light">{tr(locale, 'The game goes with you', 'क्रिकेट का साथ हमेशा')}</span>
          <h2>{tr(locale, 'Stay closer to the cricket that matters.', 'क्रिकेट की हर अहम बात से जुड़े रहें।')}</h2>
          <p>{tr(locale, 'Explore the AURA Sport app for match coverage and team-researched predictions.', 'मैच कवरेज और अनुभवी टीम द्वारा तैयार किए गए पूर्वानुमानों के लिए AURA Sport ऐप देखें।')}</p>
          <a className="button button-gold" href={localizePath('/download', locale)}>{tr(locale, 'Explore the AURA Sport App', 'AURA Sport ऐप देखें')} <span aria-hidden="true">↗</span></a>
        </div><div className="app-promo-art" aria-hidden="true"><div className="art-ring ring-a" /><div className="art-ring ring-b" /><span>A</span></div></section>
      </main>
    </>
  );
}

function NewsListingPage({ locale }) {
  const [activeCategory, setActiveCategory] = useState('All News');
  const [visibleCount, setVisibleCount] = useState(8);
  const newsStories = [...articles].filter((article) => article.section === 'news' || !article.section).sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  const featured = newsStories.find((article) => article.featured) || null;
  const filtered = newsStories.filter((article) => article.slug !== featured?.slug).filter((article) => activeCategory === 'All News' || article.category === activeCategory);
  const visibleArticles = filtered.slice(0, visibleCount);
  const categoriesHi = ['सभी खबरें', 'अंतरराष्ट्रीय', 'घरेलू', 'टूर्नामेंट', 'क्रिकेट अपडेट'];
  return (
    <main className="page-main">
      <section className="page-hero"><div className="container"><span className="eyebrow eyebrow-light">{tr(locale, 'Stories that matter', 'काम की और अहम खबरें')}</span><h1>{tr(locale, 'Cricket News', 'क्रिकेट समाचार')}</h1><p>{tr(locale, 'Updates and stories from across the cricket world.', 'क्रिकेट जगत की ताज़ा खबरें और खास कहानियाँ।')}</p></div></section>
      <section className="container listing-section">
        {featured && <a className="listing-featured" href={localizePath('/news/' + featured.slug, locale)}><div className="listing-featured-image">{featured.coverImage && <img src={featured.coverImage} alt={featured.coverAlt || featured.title} onError={(event) => { event.currentTarget.style.display = 'none'; }} />}</div><div className="listing-featured-copy"><span className="story-category">{tr(locale, 'Featured story', 'प्रमुख खबर')} · {featured.category}</span><h2>{featured.title}</h2>{featured.excerpt && <p>{featured.excerpt}</p>}<time dateTime={featured.publishedAt}>{featured.dateLabel}</time><span className="text-link">{tr(locale, 'Read story', 'खबर पढ़ें')} ↗</span></div></a>}
        <div className="listing-heading"><div><span className="eyebrow">{tr(locale, 'The latest', 'ताज़ा')}</span><h2>{tr(locale, 'All News', 'सभी खबरें')}</h2></div><span className="result-count">{filtered.length} {tr(locale, filtered.length === 1 ? 'story' : 'stories', 'खबरें')}</span></div>
        <div className="category-filters" aria-label={tr(locale, 'Filter news by category', 'श्रेणी के अनुसार खबरें चुनें')}>
          {newsCategories.map((category, index) => <button type="button" key={category} className={activeCategory === category ? 'category-filter active' : 'category-filter'} aria-pressed={activeCategory === category} onClick={() => { setActiveCategory(category); setVisibleCount(8); }}>{locale === 'hi' ? categoriesHi[index] : category}</button>)}
        </div>
        {visibleArticles.length ? <>{<div className="news-list-grid">{visibleArticles.map((story) => <StoryCard key={story.slug} story={story} locale={locale} />)}</div>}{visibleCount < filtered.length && <div className="load-more-wrap"><button className="button button-outline" type="button" onClick={() => setVisibleCount((count) => count + 8)}>{tr(locale, 'Load More Stories', 'और खबरें देखें')}</button></div>}</> : <EmptyStories message={tr(locale, 'There are no published stories in this category yet.', 'इस श्रेणी में अभी कोई खबर प्रकाशित नहीं हुई है।')} />}
      </section>
    </main>
  );
}

function ArticleDetailPage({ slug, locale }) {
  const article = articles.find((item) => item.slug === slug);
  const related = article ? articles.filter((item) => item.slug !== slug && item.category === article.category).slice(0, 3) : [];
  if (!article) return <main className="page-main"><section className="container article-missing"><span className="eyebrow">AURA Sport</span><h1>{tr(locale, 'Story not available', 'खबर उपलब्ध नहीं है')}</h1><p>{tr(locale, 'This story may not have been published yet, or the link may have changed.', 'यह खबर अभी प्रकाशित नहीं हुई है या इसका लिंक बदल गया है।')}</p><a className="button button-gold" href={localizePath('/news', locale)}>{tr(locale, 'Back to News', 'खबरों पर वापस जाएँ')}</a></section></main>;
  return (
    <main className="page-main"><div className="container article-shell"><article className="article-content">
      <nav className="breadcrumbs" aria-label={tr(locale, 'Breadcrumb', 'पेज का रास्ता')}><a href={localizePath('/', locale)}>{tr(locale, 'Home', 'होम')}</a><span>/</span><a href={localizePath('/news', locale)}>{tr(locale, 'News', 'समाचार')}</a><span>/</span><span>{article.category}</span></nav>
      <span className="story-category">{article.category}</span><h1>{article.title}</h1>{article.excerpt && <p className="article-deck">{article.excerpt}</p>}
      <div className="article-meta">{article.author && <span>{tr(locale, 'By', 'लेखक')} {article.author}</span>}<time dateTime={article.publishedAt}>{article.dateLabel}</time></div>
      {article.coverImage && <figure className="article-cover"><img src={article.coverImage} alt={article.coverAlt || article.title} onError={(event) => { event.currentTarget.style.display = 'none'; }} />{article.imageCredit && <figcaption>{article.imageCredit}</figcaption>}</figure>}
      <div className="article-body">{article.body}</div>
      <div className="article-share"><span>{tr(locale, 'Share this story', 'यह खबर साझा करें')}</span><button type="button" onClick={async () => { const url = window.location.href; try { if (navigator.share) { await navigator.share({ title: article.title, url }); return; } if (navigator.clipboard && navigator.clipboard.writeText) { await navigator.clipboard.writeText(url); window.alert(tr(locale, 'Story link copied.', 'खबर का लिंक कॉपी हो गया।')); return; } } catch (error) { if (error && error.name === 'AbortError') return; } window.prompt(tr(locale, 'Copy this story link:', 'खबर का लिंक कॉपी करें:'), url); }}>{tr(locale, 'Share', 'साझा करें')} ↗</button></div>
    </article><aside className="article-sidebar">{related.length > 0 && <div className="related-panel"><span className="eyebrow">{tr(locale, 'Keep reading', 'आगे पढ़ें')}</span><h2>{tr(locale, 'Related Stories', 'संबंधित खबरें')}</h2>{related.map((story) => <a className="related-story" key={story.slug} href={localizePath('/news/' + story.slug, locale)}><span className="story-category">{story.category}</span><strong>{story.title}</strong><time dateTime={story.publishedAt}>{story.dateLabel}</time></a>)}</div>}</aside></div></main>
  );
}

function Footer({ locale = 'en' }) {
  return <footer className="site-footer"><div className="container footer-main">
    <div className="footer-brand"><Brand locale={locale} /><p>{tr(locale, 'Cricket, with context.', 'क्रिकेट, सही संदर्भ के साथ।')}</p></div>
    <div className="footer-links">
      <div><span className="footer-label">{tr(locale, 'Explore', 'देखें')}</span><a href={localizePath('/news', locale)}>{tr(locale, 'News', 'समाचार')}</a><a href={localizePath('/match-preview', locale)}>{tr(locale, 'Match Preview', 'मैच पूर्वावलोकन')}</a><a href={localizePath('/analysis', locale)}>{tr(locale, 'Analysis', 'विश्लेषण')}</a><a href={localizePath('/knowledge', locale)}>{tr(locale, 'Knowledge', 'क्रिकेट ज्ञान')}</a></div>
      <div><span className="footer-label">AURA Sport</span><a href={localizePath('/about', locale)}>{tr(locale, 'About', 'हमारे बारे में')}</a><a href={localizePath('/contact', locale)}>{tr(locale, 'Contact & Help', 'संपर्क और सहायता')}</a><a href={localizePath('/download', locale)}>{tr(locale, 'Download App', 'ऐप डाउनलोड')}</a></div>
      <div><span className="footer-label">{tr(locale, 'Information', 'जानकारी')}</span><a href={localizePath('/privacy-policy', locale)}>{tr(locale, 'Privacy Policy', 'गोपनीयता नीति')}</a><a href={localizePath('/terms', locale)}>{tr(locale, 'Terms & Conditions', 'नियम और शर्तें')}</a><a href={localizePath('/disclaimer', locale)}>{tr(locale, 'Disclaimer', 'अस्वीकरण')}</a></div>
    </div>
  </div><div className="container footer-bottom"><span>© {new Date().getFullYear()} AURA Sport. {tr(locale, 'All rights reserved.', 'सर्वाधिकार सुरक्षित।')}</span><span>{tr(locale, 'Made for the love of cricket.', 'क्रिकेट के प्रति प्रेम के लिए।')}</span></div></footer>;
}

export default function App() {
  const resolvedRoute = resolveLocalizedPath(window.location.pathname);
  const locale = resolvedRoute.locale;
  const path = resolvedRoute.pathname;
  const articleMatch = path.match(/^\/news\/([^/]+)$/);
  const metadata = {
    '/': [['AURA Sport — Cricket, with context', 'AURA Sport brings you considered cricket news, match previews, analysis and knowledge.'], ['AURA Sport — क्रिकेट, सही संदर्भ के साथ', 'AURA Sport पर पढ़ें क्रिकेट की खबरें, मैच पूर्वावलोकन, विश्लेषण और उपयोगी जानकारी।']],
    '/news': [['Cricket News | AURA Sport', 'Read the latest cricket news and updates from AURA Sport.'], ['क्रिकेट समाचार | AURA Sport', 'AURA Sport पर पढ़ें क्रिकेट जगत की ताज़ा खबरें और अपडेट।']],
    '/match-preview': [['Cricket Match Previews | AURA Sport', 'Explore cricket match previews from AURA Sport.'], ['क्रिकेट मैच पूर्वावलोकन | AURA Sport', 'AURA Sport पर देखें आने वाले क्रिकेट मैचों का पूर्वावलोकन।']],
    '/analysis': [['Cricket Analysis | AURA Sport', 'Read thoughtful cricket analysis and perspectives from AURA Sport.'], ['क्रिकेट विश्लेषण | AURA Sport', 'AURA Sport पर पढ़ें क्रिकेट का विश्लेषण और विशेषज्ञ विचार।']],
    '/knowledge': [['Cricket Knowledge | AURA Sport', 'Understand cricket rules, formats and tactics with AURA Sport.'], ['क्रिकेट ज्ञान | AURA Sport', 'AURA Sport के साथ क्रिकेट के नियम, प्रारूप और रणनीतियाँ समझें।']],
    '/about': [['About AURA Sport', 'Learn about AURA Sport and its cricket editorial approach.'], ['AURA Sport के बारे में', 'AURA Sport और क्रिकेट के प्रति उसके संपादकीय दृष्टिकोण के बारे में जानें।']],
    '/contact': [['Contact & Help | AURA Sport', 'Find information about contacting AURA Sport and getting support.'], ['संपर्क और सहायता | AURA Sport', 'AURA Sport से संपर्क और सहायता पाने की जानकारी।']],
    '/privacy-policy': [['Privacy Policy | AURA Sport', 'Read the AURA Sport website privacy policy.'], ['गोपनीयता नीति | AURA Sport', 'AURA Sport वेबसाइट की गोपनीयता नीति पढ़ें।']],
    '/terms': [['Terms & Conditions | AURA Sport', 'Read the terms and conditions for using AURA Sport.'], ['नियम और शर्तें | AURA Sport', 'AURA Sport के उपयोग से जुड़े नियम और शर्तें पढ़ें।']],
    '/disclaimer': [['Disclaimer | AURA Sport', 'Important information about AURA Sport editorial content and predictions.'], ['अस्वीकरण | AURA Sport', 'AURA Sport की सामग्री और पूर्वानुमानों से जुड़ी महत्वपूर्ण जानकारी।']],
    '/download': [['Get the AURA Sport App', 'Find official information about downloading the AURA Sport app.'], ['AURA Sport ऐप डाउनलोड करें', 'AURA Sport ऐप डाउनलोड करने की आधिकारिक जानकारी।']]
  };
  const pageMeta = (metadata[path] || [['Page Not Found | AURA Sport', 'The requested page could not be found on AURA Sport.'], ['पेज नहीं मिला | AURA Sport', 'आपका खोजा गया पेज AURA Sport पर उपलब्ध नहीं है।']])[locale === 'hi' ? 1 : 0];
  const pageMetadata = articleMatch ? [tr(locale, 'Cricket Story | AURA Sport', 'क्रिकेट खबर | AURA Sport'), tr(locale, 'Read cricket news and perspectives from AURA Sport.', 'AURA Sport पर पढ़ें क्रिकेट की खबरें और विचार।')] : pageMeta;
  useEffect(() => {
    document.documentElement.lang = locale === 'hi' ? 'hi-IN' : 'en';
    document.title = pageMetadata[0];
    let description = document.querySelector('meta[name="description"]');
    if (!description) { description = document.createElement('meta'); description.name = 'description'; document.head.appendChild(description); }
    description.setAttribute('content', pageMetadata[1]);
  }, [pageMetadata[0], pageMetadata[1], locale]);

  let page;
  if (path === '/') page = <HomePage locale={locale} />;
  else if (path === '/news') page = <NewsListingPage locale={locale} />;
  else if (articleMatch) {
    let safeSlug = '__invalid_url__';
    try { safeSlug = decodeURIComponent(articleMatch[1]); } catch { /* Show not-found for malformed URLs. */ }
    page = <ArticleDetailPage slug={safeSlug} locale={locale} />;
  } else page = <AdditionalPage path={path} locale={locale} />;

  return <><Header locale={locale} currentPath={path} />{page}<Footer locale={locale} /></>;
}
