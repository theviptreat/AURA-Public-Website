import React, { useEffect, useState } from 'react';
import { AdditionalPage } from './InfoPages';
import { getLocaleSwitchPath, localizePath, resolveLocalizedPath } from './i18n/locale';
import { getPublishedArticles } from './content/articles.js';
import { localizeStory } from './i18n/localized-content';
import { getNewsCategories } from './content/news-categories.js';
import { getArticleSeoMetadata, getLocalizedSeoUrls, getOpenGraphLocale } from './i18n/seo';

const tr = (locale, en, hi) => locale === 'hi' ? hi : en;
const articles = getPublishedArticles();

function Brand({ locale = 'en' }) {
  return <a className="brand" href={localizePath('/', locale)} aria-label={tr(locale, 'AURA home', 'AURA होमपेज')}><span className="brand-symbol" aria-hidden="true">A</span><span className="brand-name">AURA<span>.</span></span></a>;
}

function Header({ locale = 'en', currentPath = '/', currentSearch = '', currentHash = '' }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [['About','हमारे बारे में','about'],['Web App','वेब ऐप','web-app'],['Play Zone','प्ले ज़ोन','play-zone'],['Android','एंड्रॉयड','android']];
  return <header className="site-header cinematic-header"><div className="header-inner">
    <Brand locale={locale} />
    <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} id="primary-navigation" aria-label={tr(locale,'Main navigation','मुख्य नेविगेशन')}>
      {links.map(([en,hi,id]) => <a key={id} href={`${localizePath('/',locale)}#${id}`} onClick={() => setMenuOpen(false)}>{tr(locale,en,hi)}</a>)}
      <a className="nav-download" href={`${localizePath('/',locale)}#web-app`} onClick={() => setMenuOpen(false)}>{tr(locale,'Explore AURA','AURA देखें')} <span aria-hidden="true">↗</span></a>
      <div className="language-switch" aria-label={tr(locale,'Language selection','भाषा चुनें')}><a href={getLocaleSwitchPath(currentPath,'en',currentSearch,currentHash)} aria-current={locale==='en'?'page':undefined}>EN</a><span aria-hidden="true">|</span><a href={getLocaleSwitchPath(currentPath,'hi',currentSearch,currentHash)} aria-current={locale==='hi'?'page':undefined}>हिंदी</a></div>
    </nav>
    <button className="menu-toggle" type="button" aria-label={menuOpen?tr(locale,'Close navigation menu','नेविगेशन मेनू बंद करें'):tr(locale,'Open navigation menu','नेविगेशन मेनू खोलें')} aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen(!menuOpen)}><span/><span/></button>
  </div></header>;
}

function SectionHeading({ eyebrow, title, href, linkLabel = 'View all' }) {
  return <div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>{href && <a className="text-link" href={href}>{linkLabel} <span aria-hidden="true">↗</span></a>}</div>;
}

function EmptyStories({ message, compact = false }) {
  return <div className={compact ? 'empty-stories compact' : 'empty-stories'}><span className="empty-symbol" aria-hidden="true">✳</span><p>{message}</p></div>;
}

function StoryCard({ story, locale }) {
  const displayStory = localizeStory(story, locale);
  return (
    <article className="story-card">
      <a href={localizePath('/news/' + displayStory.slug, locale)} className="story-card-link">
        {displayStory.coverImage ? <img className="story-image" src={displayStory.coverImage} alt={displayStory.coverAlt || displayStory.title} loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none'; }} /> : <div className="story-image story-image-empty" aria-hidden="true" />}
        <span className="story-category">{displayStory.category}</span><h3>{displayStory.title}</h3>
        {displayStory.excerpt && <p>{displayStory.excerpt}</p>}<time dateTime={displayStory.publishedAt}>{displayStory.dateLabel}</time>
      </a>
    </article>
  );
}

function HomePage({ locale }) {
 return <main className="landing-page">
  <section className="hero-stadium" aria-labelledby="hero-title">
   <div className="stadium-lights" aria-hidden="true"><i/><i/><i/><i/></div><div className="stadium-stands" aria-hidden="true"/><div className="stadium-pitch" aria-hidden="true"><span/></div>
   <div className="hero-content container"><span className="hero-kicker">{tr(locale,'A NEW PERSPECTIVE ON CRICKET','क्रिकेट को देखने का एक नया नज़रिया')}</span><div className="hero-emblem" aria-hidden="true">A</div>
    <h1 id="hero-title">BEYOND<br/><span>THE GAME.</span></h1><p>{tr(locale,'More than cricket. A deeper perspective.','क्रिकेट से बढ़कर। खेल को समझने का एक गहरा नज़रिया।')}</p>
    <div className="hero-actions"><a className="button button-neon" href="#web-app">{tr(locale,'EXPLORE AURA','AURA देखें')} <span aria-hidden="true">↗</span></a><a className="button button-ghost" href="#about">{tr(locale,'DISCOVER AURA','AURA को जानें')} <span aria-hidden="true">↓</span></a></div>
   </div><div className="hero-bottomline container"><span>AURA SPORT</span><span>{tr(locale,'BUILT ON SKILL · STRATEGY · PATIENCE','कौशल · रणनीति · धैर्य')}</span></div>
  </section>
  <section className="about-section landing-section" id="about"><div className="container about-layout"><div className="section-index"><span>01</span><i/></div>
   <div className="about-copy"><span className="eyebrow">{tr(locale,'THE THINKING BEHIND AURA','AURA के पीछे की सोच')}</span><h2>{tr(locale,'MORE THAN JUST A GAME.','सिर्फ एक खेल से कहीं बढ़कर।')}</h2>
    <p>{tr(locale,'Cricket is a game of skill, strategy, patience and possibilities.','क्रिकेट कौशल, रणनीति, धैर्य और संभावनाओं का खेल है।')}</p>
    <p>{tr(locale,'At AURA, we believe understanding the game takes more than just watching it. It takes observation, research, patience and the ability to see beyond the obvious.','AURA में हमारा मानना है कि खेल को समझने के लिए सिर्फ उसे देखना काफी नहीं। इसके लिए निरीक्षण, शोध, धैर्य और स्पष्ट दिखाई देने वाली बातों से आगे देखने की क्षमता चाहिए।')}</p>
    <p>{tr(locale,'Built for those who appreciate the deeper side of cricket, AURA brings a thoughtful perspective to the game.','उन लोगों के लिए जो क्रिकेट की गहराई को समझते हैं, AURA खेल को देखने का एक विचारशील नज़रिया लेकर आता है।')}</p>
    <div className="about-words"><span>{tr(locale,'SKILL','कौशल')}</span><b>·</b><span>{tr(locale,'STRATEGY','रणनीति')}</span><b>·</b><span>{tr(locale,'PATIENCE','धैर्य')}</span></div>
   </div><div className="about-art" aria-hidden="true"><div className="about-orbit orbit-one"/><div className="about-orbit orbit-two"/><div className="about-orbit orbit-three"/>AURA</div>
  </div></section>
  <section className="webapp-section landing-section" id="web-app"><div className="container">
   <div className="webapp-heading"><div><span className="eyebrow">{tr(locale,'YOUR GAME. YOUR AURA.','आपका खेल। आपका AURA।')}</span><h2>{tr(locale,'THE AURA WEB APP.','AURA वेब ऐप।')}</h2></div><p>{tr(locale,'A closer look at the cricket experience we are building. Explore AURA on the web.','क्रिकेट के उस अनुभव को करीब से जानें जिसे हम बना रहे हैं। वेब पर AURA को एक्सप्लोर करें।')}</p></div>
   <div className="device-showcase"><div className="desktop-device"><div className="device-camera"/><div className="device-screen">
    <div className="preview-top"><span className="preview-brand">AURA<span>.</span></span><span>{tr(locale,'WEB APP PREVIEW','वेब ऐप प्रीव्यू')}</span><span className="preview-dot"/></div>
    <div className="preview-body"><div className="preview-side"><i/><i/><i/><i/></div><div className="preview-main"><div className="preview-label">{tr(locale,'THE AURA EXPERIENCE','AURA का अनुभव')}</div><div className="preview-line wide"/><div className="preview-line medium"/><div className="preview-cards"><i/><i/><i/></div><div className="preview-line short"/></div></div>
    <div className="preview-foot"><span>AURA SPORT</span><span>{tr(locale,'ACTUAL APP SCREENS WILL BE ADDED HERE','ऐप के वास्तविक स्क्रीनशॉट यहाँ जोड़े जाएँगे')}</span></div>
   </div></div>
   <div className="mobile-device"><div className="mobile-notch"/><div className="mobile-screen"><span className="preview-brand">AURA<span>.</span></span><div className="mobile-glow"/><small>{tr(locale,'YOUR CRICKET SPACE','आपकी क्रिकेट दुनिया')}</small><i/><i/><div className="mobile-tiles"><b/><b/><b/></div><small>{tr(locale,'APP PREVIEW','ऐप प्रीव्यू')}</small></div></div>
   <div className="showcase-caption">{tr(locale,'PREVIEW PLACEHOLDER · AUTHENTIC APP SCREENS TO FOLLOW','प्रीव्यू प्लेसहोल्डर · वास्तविक ऐप स्क्रीन जल्द जोड़ी जाएँगी')}</div></div>
   <div className="webapp-cta"><span>{tr(locale,'READY TO EXPLORE?','एक्सप्लोर करने के लिए तैयार हैं?')}</span><a className="button button-neon" href={localizePath('/download',locale)}>{tr(locale,'EXPLORE WEB APP','वेब ऐप देखें')} <span aria-hidden="true">↗</span></a></div>
  </div></section>
  <section className="coming-section landing-section" id="play-zone"><div className="container coming-inner"><div className="section-index"><span>02</span><i/></div><div><span className="eyebrow">{tr(locale,'A NEW WAY TO EXPERIENCE CRICKET','क्रिकेट का अनुभव करने का नया तरीका')}</span><h2>AURA <span>PLAY ZONE</span></h2><p>{tr(locale,'A new way to experience cricket.','क्रिकेट का अनुभव करने का एक नया तरीका।')}</p></div><span className="coming-pill">{tr(locale,'COMING SOON','जल्द आ रहा है')}</span></div></section>
  <section className="android-section landing-section" id="android"><div className="container android-inner"><div className="android-copy"><span className="eyebrow">{tr(locale,'THE AURA EXPERIENCE, ON THE MOVE','AURA का अनुभव, अब आपके साथ')}</span><h2>{tr(locale,'AURA ON ANDROID.','एंड्रॉयड पर AURA।')}</h2><p>{tr(locale,'The AURA experience is coming soon to Android.','AURA का अनुभव जल्द ही Android पर उपलब्ध होगा।')}</p><span className="coming-pill">{tr(locale,'COMING SOON','जल्द आ रहा है')}</span></div><div className="android-phone" aria-hidden="true"><div className="android-phone-screen"><span className="preview-brand">AURA<span>.</span></span><div className="android-phone-glow"/><span className="phone-caption">BEYOND THE GAME</span></div></div></div></section>
 </main>;
}

function NewsListingPage({ locale }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [visibleCount, setVisibleCount] = useState(8);
  const newsStories = [...articles].filter((article) => article.section === 'news' || article.section === 'match-report' || !article.section).sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  const featured = newsStories.find((article) => article.featured) || null;
  const featuredDisplay = localizeStory(featured, locale);
  const categories = getNewsCategories(newsStories, locale);
  const filtered = newsStories.filter((article) => article.slug !== featured?.slug).filter((article) => activeCategory === 'all' || article.category === activeCategory);
  const visibleArticles = filtered.slice(0, visibleCount);
  return (
    <main className="page-main">
      <section className="page-hero"><div className="container"><span className="eyebrow eyebrow-light">{tr(locale, 'Stories that matter', 'काम की और अहम खबरें')}</span><h1>{tr(locale, 'Cricket News', 'क्रिकेट समाचार')}</h1><p>{tr(locale, 'Updates and stories from across the cricket world.', 'क्रिकेट जगत की ताज़ा खबरें और खास कहानियाँ।')}</p></div></section>
      <section className="container listing-section">
        {featuredDisplay && <a className="listing-featured" href={localizePath('/news/' + featuredDisplay.slug, locale)}><div className="listing-featured-image">{featuredDisplay.coverImage && <img src={featuredDisplay.coverImage} alt={featuredDisplay.coverAlt || featuredDisplay.title} onError={(event) => { event.currentTarget.style.display = 'none'; }} />}</div><div className="listing-featured-copy"><span className="story-category">{tr(locale, 'Featured story', 'प्रमुख खबर')} · {featuredDisplay.category}</span><h2>{featuredDisplay.title}</h2>{featuredDisplay.excerpt && <p>{featuredDisplay.excerpt}</p>}<time dateTime={featuredDisplay.publishedAt}>{featuredDisplay.dateLabel}</time><span className="text-link">{tr(locale, 'Read story', 'खबर पढ़ें')} ↗</span></div></a>}
        <div className="listing-heading"><div><span className="eyebrow">{tr(locale, 'The latest', 'ताज़ा')}</span><h2>{tr(locale, 'All News', 'सभी खबरें')}</h2></div><span className="result-count">{filtered.length} {tr(locale, filtered.length === 1 ? 'story' : 'stories', 'खबरें')}</span></div>
        <div className="category-filters" aria-label={tr(locale, 'Filter news by category', 'श्रेणी के अनुसार खबरें चुनें')}>
          {categories.map((category) => <button type="button" key={category.value} className={activeCategory === category.value ? 'category-filter active' : 'category-filter'} aria-pressed={activeCategory === category.value} onClick={() => { setActiveCategory(category.value); setVisibleCount(8); }}>{category.label}</button>)}
        </div>
        {visibleArticles.length ? <>{<div className="news-list-grid">{visibleArticles.map((story) => <StoryCard key={story.slug} story={story} locale={locale} />)}</div>}{visibleCount < filtered.length && <div className="load-more-wrap"><button className="button button-outline" type="button" onClick={() => setVisibleCount((count) => count + 8)}>{tr(locale, 'Load More Stories', 'और खबरें देखें')}</button></div>}</> : <EmptyStories message={tr(locale, 'There are no published stories in this category yet.', 'इस श्रेणी में अभी कोई खबर प्रकाशित नहीं हुई है।')} />}
      </section>
    </main>
  );
}

function renderArticleBody(body) {
  return body.split(/\n\s*\n/).map((block, index) => {
    const content = block.trim();
    if (!content) return null;

    const heading = content.match(/^\*\*(.+)\*\*$/);
    if (heading) return <h2 key={index}>{heading[1]}</h2>;

    const parts = content.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={index}>
        {parts.map((part, partIndex) => {
          const bold = part.match(/^\*\*(.+)\*\*$/);
          return bold ? <strong key={partIndex}>{bold[1]}</strong> : part;
        })}
      </p>
    );
  });
}

function ArticleDetailPage({ slug, locale }) {
  const sourceArticle = articles.find((item) => item.slug === slug);
  const article = localizeStory(sourceArticle, locale);
  const related = sourceArticle ? articles.filter((item) => item.slug !== slug && item.category === sourceArticle.category).slice(0, 3).map((item) => localizeStory(item, locale)) : [];
  if (!article) return <main className="page-main"><section className="container article-missing"><span className="eyebrow">AURA Sport</span><h1>{tr(locale, 'Story not available', 'खबर उपलब्ध नहीं है')}</h1><p>{tr(locale, 'This story may not have been published yet, or the link may have changed.', 'यह खबर अभी प्रकाशित नहीं हुई है या इसका लिंक बदल गया है।')}</p><a className="button button-gold" href={localizePath('/news', locale)}>{tr(locale, 'Back to News', 'खबरों पर वापस जाएँ')}</a></section></main>;
  return (
    <main className="page-main"><div className="container article-shell"><article className="article-content">
      <nav className="breadcrumbs" aria-label={tr(locale, 'Breadcrumb', 'पेज का रास्ता')}><a href={localizePath('/', locale)}>{tr(locale, 'Home', 'होम')}</a><span>/</span><a href={localizePath('/news', locale)}>{tr(locale, 'News', 'समाचार')}</a><span>/</span><span>{article.category}</span></nav>
      <span className="story-category">{article.category}</span><h1>{article.title}</h1>{article.excerpt && <p className="article-deck">{article.excerpt}</p>}
      <div className="article-meta">{article.author && <span>{tr(locale, 'By', 'लेखक')} {article.author}</span>}<time dateTime={article.publishedAt}>{article.dateLabel || article.publishedAt?.slice(0, 10)}</time></div>
      {article.coverImage && <figure className="article-cover"><img src={article.coverImage} alt={article.coverAlt || article.title} onError={(event) => { event.currentTarget.style.display = 'none'; }} />{article.imageCredit && <figcaption>{article.imageCredit}</figcaption>}</figure>}
      <div className="article-body">{renderArticleBody(article.body)}</div>
      <div className="article-share"><span>{tr(locale, 'Share this story', 'यह खबर साझा करें')}</span><button type="button" onClick={async () => { const url = window.location.href; try { if (navigator.share) { await navigator.share({ title: article.title, url }); return; } if (navigator.clipboard && navigator.clipboard.writeText) { await navigator.clipboard.writeText(url); window.alert(tr(locale, 'Story link copied.', 'खबर का लिंक कॉपी हो गया।')); return; } } catch (error) { if (error && error.name === 'AbortError') return; } window.prompt(tr(locale, 'Copy this story link:', 'खबर का लिंक कॉपी करें:'), url); }}>{tr(locale, 'Share', 'साझा करें')} ↗</button></div>
    </article><aside className="article-sidebar">{related.length > 0 && <div className="related-panel"><span className="eyebrow">{tr(locale, 'Keep reading', 'आगे पढ़ें')}</span><h2>{tr(locale, 'Related Stories', 'संबंधित खबरें')}</h2>{related.map((story) => <a className="related-story" key={story.slug} href={localizePath('/news/' + story.slug, locale)}><span className="story-category">{story.category}</span><strong>{story.title}</strong><time dateTime={story.publishedAt}>{story.dateLabel}</time></a>)}</div>}</aside></div></main>
  );
}

function Footer({ locale = 'en' }) {
 return <footer className="site-footer cinematic-footer"><div className="container footer-main">
  <div className="footer-brand"><Brand locale={locale}/><p>{tr(locale,'Beyond the Game.','खेल से कहीं आगे।')}</p></div>
  <div className="footer-links">
   <div><span className="footer-label">{tr(locale,'AURA','AURA')}</span><a href={localizePath('/about',locale)}>{tr(locale,'About AURA','AURA के बारे में')}</a><a href={localizePath('/download',locale)}>{tr(locale,'Web App','वेब ऐप')}</a><a href={localizePath('/contact',locale)}>{tr(locale,'Contact Us','संपर्क करें')}</a></div>
   <div><span className="footer-label">{tr(locale,'Information','जानकारी')}</span><a href={localizePath('/privacy-policy',locale)}>{tr(locale,'Privacy Policy','गोपनीयता नीति')}</a><a href={localizePath('/terms',locale)}>{tr(locale,'Terms & Conditions','नियम और शर्तें')}</a><a href={localizePath('/disclaimer',locale)}>{tr(locale,'Disclaimer','अस्वीकरण')}</a></div>
  </div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} AURA Sport. {tr(locale,'All rights reserved.','सर्वाधिकार सुरक्षित।')}</span><span>{tr(locale,'Made for the love of cricket.','क्रिकेट के प्रति प्रेम के लिए।')}</span></div></footer>;
}

export default function App() {
  const resolvedRoute = resolveLocalizedPath(window.location.pathname);
  const locale = resolvedRoute.locale;
  const path = resolvedRoute.pathname;
  const articleMatch = path.match(/^\/news\/([^/]+)$/);
  let articleSlug = null;
  if (articleMatch) {
    try { articleSlug = decodeURIComponent(articleMatch[1]); } catch { articleSlug = '__invalid_url__'; }
  }
  const sourceArticle = articles.find((article) => article.slug === articleSlug) || null;
  const localizedArticle = localizeStory(sourceArticle, locale);
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
  const fallbackArticleMeta = [tr(locale, 'Cricket Story | AURA Sport', 'क्रिकेट खबर | AURA Sport'), tr(locale, 'Read cricket news and perspectives from AURA Sport.', 'AURA Sport पर पढ़ें क्रिकेट की खबरें और विचार।')];
  const articleSeo = localizedArticle ? getArticleSeoMetadata(localizedArticle, locale) : null;
  const pageMetadata = articleSeo
    ? { title: articleSeo.title, description: articleSeo.description, image: articleSeo.image }
    : { title: articleMatch ? fallbackArticleMeta[0] : pageMeta[0], description: articleMatch ? fallbackArticleMeta[1] : pageMeta[1], image: '' };
  useEffect(() => {
    document.documentElement.lang = locale === 'hi' ? 'hi-IN' : 'en';
    document.title = pageMetadata.title;

    const setMeta = (selector, attribute, key, value) => {
      let element = document.head.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', value);
    };
    const setLink = (selector, attributes) => {
      let element = document.head.querySelector(selector);
      if (!element) {
        element = document.createElement('link');
        document.head.appendChild(element);
      }
      Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    };

    const seoUrls = getLocalizedSeoUrls(window.location.origin, window.location.pathname);
    setMeta('meta[name="description"]', 'name', 'description', pageMetadata.description);
    setLink('link[rel="canonical"]', { rel: 'canonical', href: seoUrls.canonical });
    Object.entries(seoUrls.languages).forEach(([language, href]) => {
      setLink(`link[rel="alternate"][hreflang="${language}"]`, {
        rel: 'alternate',
        hreflang: language,
        href,
      });
    });

    setMeta('meta[property="og:title"]', 'property', 'og:title', pageMetadata.title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', pageMetadata.description);
    setMeta('meta[property="og:type"]', 'property', 'og:type', articleMatch ? 'article' : 'website');
    setMeta('meta[property="og:image"]', 'property', 'og:image', pageMetadata.image);
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', pageMetadata.image);
    setMeta('meta[property="og:url"]', 'property', 'og:url', seoUrls.canonical);
    setMeta('meta[property="og:locale"]', 'property', 'og:locale', getOpenGraphLocale(locale));
    setMeta('meta[property="og:locale:alternate"]', 'property', 'og:locale:alternate', getOpenGraphLocale(locale === 'hi' ? 'en' : 'hi'));
    setMeta('meta[property="og:site_name"]', 'property', 'og:site_name', 'AURA Sport');
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', pageMetadata.image ? 'summary_large_image' : 'summary');
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', pageMetadata.title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', pageMetadata.description);
  }, [pageMetadata.title, pageMetadata.description, pageMetadata.image, locale, path, articleSlug]);

  let page;
  if (path === '/') page = <HomePage locale={locale} />;
  else if (path === '/news') page = <NewsListingPage locale={locale} />;
  else if (articleMatch) {
    page = <ArticleDetailPage slug={articleSlug || '__invalid_url__'} locale={locale} />;
  } else page = <AdditionalPage path={path} locale={locale} />;

  return <><Header locale={locale} currentPath={path} currentSearch={window.location.search} currentHash={window.location.hash} />{page}<Footer locale={locale} /></>;
}
