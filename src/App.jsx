import React, { useEffect, useRef, useState } from 'react';
import { AdditionalPage } from './InfoPages';
import { getLocaleSwitchPath, localizePath, resolveLocalizedPath } from './i18n/locale';
import { getPublishedArticles } from './content/articles.js';
import { localizeStory } from './i18n/localized-content';
import { getNewsCategories } from './content/news-categories.js';
import { getArticleSeoMetadata, getLocalizedSeoUrls, getOpenGraphLocale } from './i18n/seo';
import { sponsor, socialLinks } from './content/site-config.js';

const tr = (locale, en, hi) => locale === 'hi' ? hi : en;
const articles = getPublishedArticles();

function Brand({ locale = 'en' }) {
  return <a className="brand" href={localizePath('/', locale)} aria-label={tr(locale, 'AURA home', 'AURA होमपेज')}><span className="brand-name">AURA Sports</span></a>;
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


function AboutBall() {
  const [entered, setEntered] = useState(false);
  const ballStageRef = useRef(null);

  useEffect(() => {
    const stage = ballStageRef.current;
    if (!stage) return;
    if (!('IntersectionObserver' in window)) {
      setEntered(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setEntered(true);
        observer.disconnect();
      }
    }, { threshold: 0.35, rootMargin: '0px 0px -8% 0px' });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  return <div ref={ballStageRef} className={entered ? 'about-art is-entered' : 'about-art'} aria-hidden="true">
    <div className="about-orbit orbit-one"/>
    <div className="about-orbit orbit-two"/>
    <div className="about-orbit orbit-three"/>
    <div className="about-ball">
      <svg className="about-ball-art" viewBox="0 0 320 320" role="presentation">
        <defs>
          <radialGradient id="cricketBallRed" cx="35%" cy="25%" r="78%">
            <stop offset="0%" stopColor="#f56b66"/>
            <stop offset="22%" stopColor="#bd2528"/>
            <stop offset="62%" stopColor="#7e1019"/>
            <stop offset="100%" stopColor="#27050a"/>
          </radialGradient>
          <linearGradient id="cricketBallGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff0ae"/>
            <stop offset="35%" stopColor="#d7a441"/>
            <stop offset="65%" stopColor="#f7d77b"/>
            <stop offset="100%" stopColor="#8a571b"/>
          </linearGradient>
          <linearGradient id="cricketBallSeam" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff9e9"/>
            <stop offset="50%" stopColor="#d8cdb8"/>
            <stop offset="100%" stopColor="#9c8060"/>
          </linearGradient>
          <radialGradient id="ballGloss" cx="32%" cy="18%" r="72%">
            <stop offset="0%" stopColor="#fff" stopOpacity=".42"/>
            <stop offset="34%" stopColor="#fff" stopOpacity=".09"/>
            <stop offset="100%" stopColor="#fff" stopOpacity="0"/>
          </radialGradient>
          <filter id="leatherGrain" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency=".82" numOctaves="2" seed="9" result="grain"/>
            <feColorMatrix in="grain" type="saturate" values="0" result="mono"/>
            <feComponentTransfer in="mono" result="softGrain">
              <feFuncA type="table" tableValues="0 .15"/>
            </feComponentTransfer>
            <feBlend in="SourceGraphic" in2="softGrain" mode="soft-light"/>
          </filter>
          <clipPath id="cricketBallClip"><circle cx="160" cy="151" r="137"/></clipPath>
        </defs>
        <ellipse cx="160" cy="291" rx="103" ry="15" fill="#000" opacity=".38"/>
        <circle cx="160" cy="151" r="137" fill="#35070d" opacity=".8"/>
        <circle cx="160" cy="151" r="137" fill="url(#cricketBallRed)" stroke="#4b080e" strokeWidth="3"/>
        <g clipPath="url(#cricketBallClip)">
          <circle cx="160" cy="151" r="137" fill="url(#cricketBallRed)" filter="url(#leatherGrain)"/>
          <path d="M83 20 C24 76 24 208 103 279" fill="none" stroke="#3e080e" strokeWidth="15" strokeLinecap="round" opacity=".75"/>
          <path d="M83 20 C24 76 24 208 103 279" fill="none" stroke="#a43a35" strokeWidth="8" strokeLinecap="round" opacity=".9"/>
          <path d="M78 22 C20 78 20 205 98 276" fill="none" stroke="url(#cricketBallSeam)" strokeWidth="3.6" strokeLinecap="round"/>
          <path d="M68 18 C10 78 11 205 88 282" fill="none" stroke="#fff0d8" strokeWidth="3" strokeDasharray="1.8 7.2" strokeLinecap="round"/>
          <path d="M91 23 C33 75 34 208 111 274" fill="none" stroke="#fff0d8" strokeWidth="3" strokeDasharray="1.8 7.2" strokeLinecap="round"/>
          <path d="M70 35 C43 83 43 193 92 255" fill="none" stroke="#fff" strokeWidth="1" opacity=".16"/>
          <ellipse cx="113" cy="67" rx="74" ry="35" fill="#fff" opacity=".12" transform="rotate(-31 113 67)"/>
          <ellipse cx="210" cy="92" rx="36" ry="15" fill="#fff" opacity=".08" transform="rotate(-32 210 92)"/>
          <circle cx="160" cy="151" r="137" fill="url(#ballGloss)"/>
          <text x="196" y="160" textAnchor="middle" fill="url(#cricketBallGold)" stroke="#70451a" strokeWidth="1.2" paintOrder="stroke" fontFamily="Arial, Helvetica, sans-serif" fontSize="34" fontWeight="900" letterSpacing="1.5">AURA</text>
          <path d="M147 122 Q195 105 245 119" fill="none" stroke="url(#cricketBallGold)" strokeWidth="2.4" strokeLinecap="round" opacity=".95"/>
          <path d="M149 184 Q198 197 243 179" fill="none" stroke="url(#cricketBallGold)" strokeWidth="2.1" strokeLinecap="round" opacity=".85"/>
          <path d="M145 208 Q193 222 233 205" fill="none" stroke="#f0b84f" strokeWidth=".8" opacity=".18"/>
        </g>
        <circle cx="160" cy="151" r="137" fill="none" stroke="#ffb1a0" strokeWidth="1.8" opacity=".24"/>
      </svg>
      <span className="about-ball-glint"/>
    </div>
  </div>;
}


const webAppSlides = [
  { src: '/images/webapp/dashboard.jpeg', alt: 'AURA Sports dashboard with performance summary and quick navigation' },
  { src: '/images/webapp/match-results.jpeg', alt: 'AURA match result and historical evaluation screen' },
  { src: '/images/webapp/calendar.jpeg', alt: 'AURA cricket schedule calendar screen' },
  { src: '/images/webapp/promo-offers.jpeg', alt: 'AURA promo and offers screen' },
  { src: '/images/webapp/account-analytics.jpeg', alt: 'AURA account and historical prediction analytics screen' },
  { src: '/images/webapp/today.jpeg', alt: 'AURA Today page showing match categories and fixtures' },
  { src: '/images/webapp/live-alerts.jpeg', alt: 'AURA live match predictions and alerts screen' },
  { src: '/images/webapp/match-detail.jpeg', alt: 'AURA individual match detail and prediction screen' },
];

function WebAppShowcase({ locale }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const pointerStart = useRef(null);
  const dragDistance = useRef(0);
  const slideCount = webAppSlides.length;

  const moveSlide = (direction) => {
    setActiveSlide((current) => (current + direction + slideCount) % slideCount);
  };

  useEffect(() => {
    if (isPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => moveSlide(1), 6500);
    return () => window.clearInterval(timer);
  }, [isPaused, slideCount]);

  const handlePointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    pointerStart.current = event.clientX;
    dragDistance.current = 0;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerUp = (event) => {
    if (pointerStart.current === null) return;
    const distance = event.clientX - pointerStart.current;
    dragDistance.current = Math.abs(distance);
    if (Math.abs(distance) > 45) moveSlide(distance < 0 ? 1 : -1);
    pointerStart.current = null;
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); moveSlide(1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); moveSlide(-1); }
  };

  return <div className="webapp-showcase" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)} onFocus={() => setIsPaused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false); }}>
    <div className="laptop-stage">
      <div className="laptop-screen-shell">
        <span className="laptop-camera" aria-hidden="true"/>
        <div className="laptop-screen">
          <div className="webapp-slide-deck" role="region" aria-roledescription="carousel" aria-label={tr(locale, 'AURA Web App screen previews', 'AURA वेब ऐप स्क्रीन प्रीव्यू')} tabIndex={0} onKeyDown={handleKeyDown} onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerCancel={() => { pointerStart.current = null; }}>
            {webAppSlides.map((slide, index) => {
              const offset = (index - activeSlide + slideCount) % slideCount;
              const relative = offset > slideCount / 2 ? offset - slideCount : offset;
              const isVisible = Math.abs(relative) <= 1;
              return <div key={slide.src} className={`webapp-slide ${relative === 0 ? 'is-active' : ''} ${relative === -1 ? 'is-previous' : ''} ${relative === 1 ? 'is-next' : ''} ${!isVisible ? 'is-hidden' : ''}`} aria-hidden={relative !== 0} style={{ '--slide-offset': relative }}>
                <img src={slide.src} alt={relative === 0 ? slide.alt : ''} draggable="false" loading={index < 2 ? 'eager' : 'lazy'} />
              </div>;
            })}
          </div>
        </div>
      </div>
      <div className="laptop-base" aria-hidden="true"><span/></div>
      <div className="laptop-shadow" aria-hidden="true"/>
    </div>
    <p className="showcase-caption">{tr(locale, 'A CLOSER LOOK INSIDE AURA', 'AURA के अंदर की एक झलक')}</p>
  </div>;
}

function HomePage({ locale }) {
 return <main className="landing-page">
  <section className="hero-stadium" aria-labelledby="hero-title">
   <div className="stadium-photo" aria-hidden="true">
    <img src="/images/hero/cricket-stadium-night.jpeg" alt="" fetchPriority="high" />
   </div>
   <div className="hero-content container"><span className="hero-kicker">{tr(locale,'A NEW PERSPECTIVE ON CRICKET','क्रिकेट को देखने का एक नया नज़रिया')}</span>
    <h1 id="hero-title">BEYOND<br/><span>THE GAME</span></h1><p>{tr(locale,'More than cricket. A deeper perspective.','क्रिकेट से बढ़कर। खेल को समझने का एक गहरा नज़रिया।')}</p>
    <div className="hero-actions"><a className="button button-neon" href="#web-app">{tr(locale,'EXPLORE AURA','AURA देखें')} <span aria-hidden="true">↗</span></a><a className="button button-ghost" href="#about">{tr(locale,'DISCOVER AURA','AURA को जानें')} <span aria-hidden="true">↓</span></a></div>
   </div><div className="hero-bottomline container"><span>AURA SPORTS</span><span>{tr(locale,'BUILT ON SKILL · STRATEGY · PATIENCE','कौशल · रणनीति · धैर्य')}</span></div>
  </section>
  <section className="about-section landing-section" id="about"><div className="container about-layout"><div className="section-index"><span>01</span><i/></div>
   <div className="about-copy"><span className="eyebrow">{tr(locale,'THE THINKING BEHIND AURA','AURA के पीछे की सोच')}</span><h2>{tr(locale,'MORE THAN JUST A GAME','सिर्फ एक खेल से कहीं बढ़कर')}</h2>
    <p>{tr(locale,'Cricket is a game of skill, strategy, patience and possibilities.','क्रिकेट कौशल, रणनीति, धैर्य और संभावनाओं का खेल है।')}</p>
    <p>{tr(locale,'At AURA, we believe understanding the game takes more than just watching it. It takes observation, research, patience and the ability to see beyond the obvious.','AURA में हमारा मानना है कि खेल को समझने के लिए सिर्फ उसे देखना काफी नहीं। इसके लिए निरीक्षण, शोध, धैर्य और स्पष्ट दिखाई देने वाली बातों से आगे देखने की क्षमता चाहिए।')}</p>
    <p>{tr(locale,'Built for those who appreciate the deeper side of cricket, AURA brings a thoughtful perspective to the game.','उन लोगों के लिए जो क्रिकेट की गहराई को समझते हैं, AURA खेल को देखने का एक विचारशील नज़रिया लेकर आता है।')}</p>
    <div className="about-words"><span>{tr(locale,'SKILL','कौशल')}</span><b>·</b><span>{tr(locale,'STRATEGY','रणनीति')}</span><b>·</b><span>{tr(locale,'PATIENCE','धैर्य')}</span></div>
   </div><AboutBall/>
  </div></section>
  <section className="webapp-section landing-section" id="web-app"><div className="container">
   <div className="webapp-heading"><div><span className="eyebrow">{tr(locale,'A NEW CRICKET EXPERIENCE','क्रिकेट का एक नया अनुभव')}</span><h2>{tr(locale,'AURA WEB APP','AURA वेब ऐप')}</h2></div><p>{tr(locale,'A closer look at the tools and insights inside AURA.','AURA के अंदर मौजूद टूल्स और इनसाइट्स की एक झलक।')}</p></div>
   <WebAppShowcase locale={locale}/>
  </div></section>
  <section className="coming-section landing-section" id="play-zone"><div className="container coming-inner"><div className="section-index"><span>02</span><i/></div><div><span className="eyebrow">{tr(locale,'A NEW WAY TO EXPERIENCE CRICKET','क्रिकेट का अनुभव करने का नया तरीका')}</span><h2>AURA <span>PLAY ZONE</span></h2><p>{tr(locale,'A new way to experience cricket.','क्रिकेट का अनुभव करने का एक नया तरीका।')}</p></div><span className="coming-pill">{tr(locale,'COMING SOON','जल्द आ रहा है')}</span></div></section>
  <section className="android-section landing-section" id="android">
   <div className="android-ambient android-ambient-one" aria-hidden="true"/>
   <div className="android-ambient android-ambient-two" aria-hidden="true"/>
   <div className="container android-inner">
    <div className="android-copy">
     <span className="eyebrow">{tr(locale,'THE AURA EXPERIENCE, ON THE MOVE','AURA का अनुभव, अब आपके साथ')}</span>
     <h2>{tr(locale,'AURA ON ANDROID','एंड्रॉयड पर AURA')}</h2>
     <p>{tr(locale,'The AURA experience is coming soon to Android.','AURA का अनुभव जल्द ही Android पर उपलब्ध होगा।')}</p>
     <span className="coming-pill">{tr(locale,'COMING SOON','जल्द आ रहा है')}</span>
    </div>
    <div className="android-phone-stage" aria-label="A preview of the AURA Android experience">
     <div className="android-phone-halo" aria-hidden="true"/>
     <div className="android-phone" aria-hidden="true">
      <div className="android-phone-side"/>
      <div className="android-phone-screen">
       <div className="phone-status"><span>9:41</span><span className="phone-status-icons">● ▮ ▰</span></div>
       <div className="phone-brand-row"><span className="preview-brand">AURA <b>SPORTS</b></span><span className="phone-menu-mark">•••</span></div>
       <div className="phone-screen-heading"><span>THE GAME, IN FOCUS</span><strong>MATCH CENTRE</strong></div>
       <div className="phone-match-card">
        <div className="phone-match-top"><span>INTERNATIONAL · T20</span><span className="sample-match-tag">SAMPLE</span></div>
        <div className="phone-teams">
         <div className="phone-team"><span className="phone-team-mark">IND</span><span>INDIA</span></div>
         <div className="phone-score"><strong>186<span>/4</span></strong><small>18.2 OV</small></div>
         <div className="phone-team"><span className="phone-team-mark team-mark-gold">AUS</span><span>AUSTRALIA</span></div>
        </div>
        <div className="phone-match-note">India batting · Illustrative score</div>
       </div>
       <div className="phone-insight-title"><span>QUICK INSIGHTS</span><i/></div>
       <div className="phone-stat-grid">
        <div className="phone-stat"><span>RUN RATE</span><strong>10.14</strong></div>
        <div className="phone-stat"><span>LAST 5 OV</span><strong>48/1</strong></div>
       </div>
       <div className="phone-form-strip"><span>RECENT MOMENTUM</span><div><i/><i/><i/><i/><i/></div></div>
       <div className="phone-screen-footer"><span className="phone-footer-diamond"/>BEYOND THE GAME</div>
      </div>
     </div>
     <span className="android-orbit android-orbit-a" aria-hidden="true"/>
     <span className="android-orbit android-orbit-b" aria-hidden="true"/>
    </div>
   </div>
  </section>
  {sponsor?.name && sponsor?.href && <section className="sponsor-section landing-section" aria-label={tr(locale,'AURA sponsor','AURA प्रायोजक')}>
   <div className="container sponsor-inner"><span className="eyebrow">{tr(locale,'IN PARTNERSHIP WITH','के सहयोग से')}</span>
    <a className="sponsor-link" href={sponsor.href} target="_blank" rel="noopener noreferrer">
     {sponsor.logo ? <img src={sponsor.logo} alt={sponsor.name} loading="lazy" /> : <strong>{sponsor.name}</strong>}
    </a>
    {sponsor.message && <p>{sponsor.message}</p>}
   </div>
  </section>}
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
  if (!article) return <main className="page-main"><section className="container article-missing"><span className="eyebrow">AURA Sports</span><h1>{tr(locale, 'Story not available', 'खबर उपलब्ध नहीं है')}</h1><p>{tr(locale, 'This story may not have been published yet, or the link may have changed.', 'यह खबर अभी प्रकाशित नहीं हुई है या इसका लिंक बदल गया है।')}</p><a className="button button-gold" href={localizePath('/news', locale)}>{tr(locale, 'Back to News', 'खबरों पर वापस जाएँ')}</a></section></main>;
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
  <div className="footer-brand"><Brand locale={locale}/><p>{tr(locale,'Beyond the Game','खेल से कहीं आगे।')}</p></div>
  <div className="footer-links">
   <div><span className="footer-label">{tr(locale,'AURA','AURA')}</span><a href={localizePath('/about',locale)}>{tr(locale,'About AURA','AURA के बारे में')}</a><a href={`${localizePath('/',locale)}#web-app`}>{tr(locale,'Web App','वेब ऐप')}</a><a href={`${localizePath('/',locale)}#play-zone`}>{tr(locale,'Play Zone','प्ले ज़ोन')}</a><a href={`${localizePath('/',locale)}#android`}>{tr(locale,'Android','एंड्रॉयड')}</a><a href={localizePath('/contact',locale)}>{tr(locale,'Contact Us','संपर्क करें')}</a></div>
   <div><span className="footer-label">{tr(locale,'Information','जानकारी')}</span><a href={localizePath('/privacy-policy',locale)}>{tr(locale,'Privacy Policy','गोपनीयता नीति')}</a><a href={localizePath('/terms',locale)}>{tr(locale,'Terms & Conditions','नियम और शर्तें')}</a><a href={localizePath('/disclaimer',locale)}>{tr(locale,'Disclaimer','अस्वीकरण')}</a></div>
   {socialLinks.length > 0 && <div><span className="footer-label">{tr(locale,'Follow AURA','AURA से जुड़ें')}</span>{socialLinks.map((item) => <a key={item.url} href={item.url} target="_blank" rel="noopener noreferrer">{item.label}</a>)}</div>}
  </div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} AURA Sports. {tr(locale,'All rights reserved.','सर्वाधिकार सुरक्षित।')}</span><span>{tr(locale,'Made for the love of cricket.','क्रिकेट के प्रति प्रेम के लिए।')}</span></div></footer>;
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
    '/': [['AURA Sports — Beyond the Game', 'Discover AURA Sports: a deeper perspective on cricket, built on skill, strategy, research and patience.'], ['AURA Sports — खेल से कहीं आगे', 'AURA Sports को जानें: कौशल, रणनीति, शोध और धैर्य पर आधारित क्रिकेट को समझने का एक गहरा नज़रिया।']],
    '/news': [['Cricket News | AURA Sports', 'Read the latest cricket news and updates from AURA Sports.'], ['क्रिकेट समाचार | AURA Sports', 'AURA Sports पर पढ़ें क्रिकेट जगत की ताज़ा खबरें और अपडेट।']],
    '/match-preview': [['Cricket Match Previews | AURA Sports', 'Explore cricket match previews from AURA Sports.'], ['क्रिकेट मैच पूर्वावलोकन | AURA Sports', 'AURA Sports पर देखें आने वाले क्रिकेट मैचों का पूर्वावलोकन।']],
    '/analysis': [['Cricket Analysis | AURA Sports', 'Read thoughtful cricket analysis and perspectives from AURA Sports.'], ['क्रिकेट विश्लेषण | AURA Sports', 'AURA Sports पर पढ़ें क्रिकेट का विश्लेषण और विशेषज्ञ विचार।']],
    '/knowledge': [['Cricket Knowledge | AURA Sports', 'Understand cricket rules, formats and tactics with AURA Sports.'], ['क्रिकेट ज्ञान | AURA Sports', 'AURA Sports के साथ क्रिकेट के नियम, प्रारूप और रणनीतियाँ समझें।']],
    '/about': [['About AURA — Beyond the Game', 'Discover AURA’s perspective on cricket, shaped by skill, strategy, observation, research and patience.'], ['AURA के बारे में — खेल से कहीं आगे', 'कौशल, रणनीति, निरीक्षण, शोध और धैर्य से बने क्रिकेट के प्रति AURA के नज़रिए को जानें।']],
    '/contact': [['Contact & Help | AURA Sports', 'Find information about contacting AURA Sports and getting support.'], ['संपर्क और सहायता | AURA Sports', 'AURA Sports से संपर्क और सहायता पाने की जानकारी।']],
    '/privacy-policy': [['Privacy Policy | AURA Sports', 'Read the AURA Sports website privacy policy.'], ['गोपनीयता नीति | AURA Sports', 'AURA Sports वेबसाइट की गोपनीयता नीति पढ़ें।']],
    '/terms': [['Terms & Conditions | AURA Sports', 'Read the terms and conditions for using AURA Sports.'], ['नियम और शर्तें | AURA Sports', 'AURA Sports के उपयोग से जुड़े नियम और शर्तें पढ़ें।']],
    '/disclaimer': [['Disclaimer | AURA Sports', 'Important information about AURA Sports editorial content and predictions.'], ['अस्वीकरण | AURA Sports', 'AURA Sports की सामग्री और पूर्वानुमानों से जुड़ी महत्वपूर्ण जानकारी।']],
    '/download': [['Get the AURA Sports App', 'Find official information about downloading the AURA Sports app.'], ['AURA Sports ऐप डाउनलोड करें', 'AURA Sports ऐप डाउनलोड करने की आधिकारिक जानकारी।']]
  };
  const pageMeta = (metadata[path] || [['Page Not Found | AURA Sports', 'The requested page could not be found on AURA Sports.'], ['पेज नहीं मिला | AURA Sports', 'आपका खोजा गया पेज AURA Sports पर उपलब्ध नहीं है।']])[locale === 'hi' ? 1 : 0];
  const fallbackArticleMeta = [tr(locale, 'Cricket Story | AURA Sports', 'क्रिकेट खबर | AURA Sports'), tr(locale, 'Read cricket news and perspectives from AURA Sports.', 'AURA Sports पर पढ़ें क्रिकेट की खबरें और विचार।')];
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
    setMeta('meta[property="og:site_name"]', 'property', 'og:site_name', 'AURA Sports');
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
