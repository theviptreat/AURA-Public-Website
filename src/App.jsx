import React, { useState } from 'react';

const navigation = [
  ['News', '/news'],
  ['Match Preview', '/match-preview'],
  ['Analysis', '/analysis'],
  ['Knowledge', '/knowledge'],
  ['About AURA', '/about'],
];

const newsCategories = ['All News', 'International', 'Domestic', 'Tournaments', 'Cricket Updates'];

// Approved editorial content will be supplied by the publishing workflow.
// Keeping this empty prevents sample or unverified stories appearing publicly.
const articles = [];

function Brand() {
  return (
    <a className="brand" href="/" aria-label="AURA home">
      <span className="brand-mark">A</span>
      <span className="brand-name">AURA<span>.</span></span>
    </a>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand />
        <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
          {navigation.map(([label, href]) => (
            <a key={label} href={href} onClick={() => setMenuOpen(false)}>{label}</a>
          ))}
          <a className="nav-download" href="/download">Get the App <span aria-hidden="true">↗</span></a>
        </nav>
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span /><span />
        </button>
      </div>
    </header>
  );
}

function SectionHeading({ eyebrow, title, href, linkLabel = 'View all' }) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      {href && <a className="text-link" href={href}>{linkLabel} <span aria-hidden="true">↗</span></a>}
    </div>
  );
}

function EmptyStories({ message = 'Fresh cricket stories are on the way.', compact = false }) {
  return (
    <div className={compact ? 'empty-stories compact' : 'empty-stories'}>
      <span className="empty-symbol" aria-hidden="true">✳</span>
      <p>{message}</p>
    </div>
  );
}

function StoryCard({ story }) {
  return (
    <article className="story-card">
      <a href={`/news/${story.slug}`} className="story-card-link">
        {story.coverImage ? (
          <img className="story-image" src={story.coverImage} alt={story.coverAlt || ''} loading="lazy" />
        ) : (
          <div className="story-image story-image-empty" aria-hidden="true" />
        )}
        <span className="story-category">{story.category}</span>
        <h3>{story.title}</h3>
        {story.excerpt && <p>{story.excerpt}</p>}
        <time dateTime={story.publishedAt}>{story.dateLabel}</time>
      </a>
    </article>
  );
}

function HomePage() {
  const featuredStory = articles.find((article) => article.featured) || null;
  const latestStories = [...articles]
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .filter((article) => article.slug !== featuredStory?.slug)
    .slice(0, 4);
  const previews = [];
  const analysis = articles.filter((article) => article.section === 'analysis').slice(0, 3);
  const knowledge = articles.filter((article) => article.section === 'knowledge').slice(0, 3);

  return (
    <>
      <section className="intro-band">
        <div className="container intro-content">
          <span className="eyebrow eyebrow-light">A clearer view of the game</span>
          <h1>Cricket, <em>with context.</em></h1>
          <p>News, perspectives and knowledge for people who love the game.</p>
        </div>
        <div className="intro-orbit orbit-one" />
        <div className="intro-orbit orbit-two" />
      </section>

      <main>
        {featuredStory && (
          <section className="container featured-section">
            <SectionHeading eyebrow="The big story" title="Featured" />
            <StoryCard story={featuredStory} />
          </section>
        )}

        <section className="container content-section" id="news">
          <SectionHeading eyebrow="From the cricket world" title="Latest News" href="/news" />
          {latestStories.length ? (
            <div className="story-grid">
              {latestStories.map((story) => <StoryCard key={story.slug} story={story} />)}
            </div>
          ) : (
            <EmptyStories />
          )}
        </section>

        {previews.length > 0 && (
          <section className="container content-section" id="previews">
            <SectionHeading eyebrow="Before the first ball" title="Match Previews" href="/match-preview" />
            <div className="story-grid">{previews.map((story) => <StoryCard key={story.slug} story={story} />)}</div>
          </section>
        )}

        {analysis.length > 0 && (
          <section className="analysis-band content-section" id="analysis">
            <div className="container">
              <SectionHeading eyebrow="Look beyond the score" title="AURA Analysis" href="/analysis" />
              <div className="story-grid">{analysis.map((story) => <StoryCard key={story.slug} story={story} />)}</div>
            </div>
          </section>
        )}

        {knowledge.length > 0 && (
          <section className="container content-section" id="knowledge">
            <SectionHeading eyebrow="Understand the game" title="Cricket Knowledge" href="/knowledge" />
            <div className="story-grid">{knowledge.map((story) => <StoryCard key={story.slug} story={story} />)}</div>
          </section>
        )}

        <section className="container app-promo" id="about">
          <div className="app-promo-copy">
            <span className="eyebrow eyebrow-light">The game goes with you</span>
            <h2>Stay closer to the cricket that matters.</h2>
            <p>Explore the AURA app for match coverage and team-researched predictions.</p>
            <a className="button button-gold" href="/download">Explore the AURA App <span aria-hidden="true">↗</span></a>
          </div>
          <div className="app-promo-art" aria-hidden="true">
            <div className="art-ring ring-a" />
            <div className="art-ring ring-b" />
            <span>A</span>
          </div>
        </section>
      </main>
    </>
  );
}

function NewsListingPage() {
  const [activeCategory, setActiveCategory] = useState('All News');
  const [visibleCount, setVisibleCount] = useState(8);
  const [featured, ...rest] = [...articles]
    .filter((article) => article.section === 'news' || !article.section)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  const filtered = rest.filter((article) =>
    activeCategory === 'All News' || article.category === activeCategory
  );
  const visibleArticles = filtered.slice(0, visibleCount);

  return (
    <main className="page-main">
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow eyebrow-light">Stories that matter</span>
          <h1>Cricket News</h1>
          <p>Updates and stories from across the cricket world.</p>
        </div>
      </section>
      <section className="container listing-section">
        {featured && (
          <a className="listing-featured" href={`/news/${featured.slug}`}>
            <div className="listing-featured-image">
              {featured.coverImage && <img src={featured.coverImage} alt={featured.coverAlt || ''} />}
            </div>
            <div className="listing-featured-copy">
              <span className="story-category">Featured story · {featured.category}</span>
              <h2>{featured.title}</h2>
              {featured.excerpt && <p>{featured.excerpt}</p>}
              <time dateTime={featured.publishedAt}>{featured.dateLabel}</time>
              <span className="text-link">Read story ↗</span>
            </div>
          </a>
        )}
        <div className="listing-heading">
          <div>
            <span className="eyebrow">The latest</span>
            <h2>All News</h2>
          </div>
          <span className="result-count">{filtered.length} {filtered.length === 1 ? 'story' : 'stories'}</span>
        </div>
        <div className="category-filters" aria-label="Filter news by category">
          {newsCategories.map((category) => (
            <button
              type="button"
              key={category}
              className={activeCategory === category ? 'category-filter active' : 'category-filter'}
              aria-pressed={activeCategory === category}
              onClick={() => { setActiveCategory(category); setVisibleCount(8); }}
            >
              {category}
            </button>
          ))}
        </div>
        {visibleArticles.length ? (
          <>
            <div className="news-list-grid">
              {visibleArticles.map((story) => <StoryCard key={story.slug} story={story} />)}
            </div>
            {visibleCount < filtered.length && (
              <div className="load-more-wrap">
                <button className="button button-outline" type="button" onClick={() => setVisibleCount((count) => count + 8)}>
                  Load More Stories
                </button>
              </div>
            )}
          </>
        ) : (
          <EmptyStories message="There are no published stories in this category yet." />
        )}
      </section>
    </main>
  );
}

function ArticleDetailPage({ slug }) {
  const article = articles.find((item) => item.slug === slug);
  const related = article
    ? articles.filter((item) => item.slug !== slug && item.category === article.category).slice(0, 3)
    : [];

  if (!article) {
    return (
      <main className="page-main">
        <section className="container article-missing">
          <span className="eyebrow">AURA stories</span>
          <h1>Story not available</h1>
          <p>This story may not have been published yet, or the link may have changed.</p>
          <a className="button button-gold" href="/news">Back to News</a>
        </section>
      </main>
    );
  }

  return (
    <main className="page-main">
      <div className="container article-shell">
        <article className="article-content">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <a href="/">Home</a><span>/</span><a href="/news">News</a><span>/</span><span>{article.category}</span>
          </nav>
          <span className="story-category">{article.category}</span>
          <h1>{article.title}</h1>
          {article.excerpt && <p className="article-deck">{article.excerpt}</p>}
          <div className="article-meta">
            {article.author && <span>By {article.author}</span>}
            <time dateTime={article.publishedAt}>{article.dateLabel}</time>
          </div>
          {article.coverImage && (
            <figure className="article-cover">
              <img src={article.coverImage} alt={article.coverAlt || ''} />
              {article.imageCredit && <figcaption>{article.imageCredit}</figcaption>}
            </figure>
          )}
          <div className="article-body">
            {article.body}
          </div>
          <div className="article-share">
            <span>Share this story</span>
            <button type="button" onClick={() => {
              if (navigator.share) navigator.share({ title: article.title, url: window.location.href });
              else if (navigator.clipboard) navigator.clipboard.writeText(window.location.href);
            }}>Share ↗</button>
          </div>
        </article>
        <aside className="article-sidebar">
          {related.length > 0 && (
            <div className="related-panel">
              <span className="eyebrow">Keep reading</span>
              <h2>Related Stories</h2>
              {related.map((story) => (
                <a className="related-story" key={story.slug} href={`/news/${story.slug}`}>
                  <span className="story-category">{story.category}</span>
                  <strong>{story.title}</strong>
                  <time dateTime={story.publishedAt}>{story.dateLabel}</time>
                </a>
              ))}
            </div>
          )}
          {/* Optional ad placements will be added with the ad system; inactive slots stay hidden. */}
        </aside>
      </div>
    </main>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <Brand />
          <p>Cricket, with context.</p>
        </div>
        <div className="footer-links">
          <div><span className="footer-label">Explore</span><a href="/news">News</a><a href="/match-preview">Match Preview</a><a href="/analysis">Analysis</a><a href="/knowledge">Knowledge</a></div>
          <div><span className="footer-label">AURA</span><a href="/about">About</a><a href="/contact">Contact & Help</a><a href="/download">Download App</a></div>
          <div><span className="footer-label">Information</span><a href="/privacy-policy">Privacy Policy</a><a href="/terms">Terms & Conditions</a><a href="/disclaimer">Disclaimer</a></div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} AURA. All rights reserved.</span>
        <span>Made for the love of cricket.</span>
      </div>
    </footer>
  );
}

export default function App() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const articleMatch = path.match(/^\/news\/([^/]+)$/);
  let page = <HomePage />;
  if (path === '/news') page = <NewsListingPage />;
  else if (articleMatch) page = <ArticleDetailPage slug={decodeURIComponent(articleMatch[1])} />;

  return (
    <>
      <Header />
      {page}
      <Footer />
    </>
  );
}
