import React, { useState } from 'react';

const navigation = [
  ['News', '#news'],
  ['Match Preview', '#previews'],
  ['Analysis', '#analysis'],
  ['Knowledge', '#knowledge'],
  ['About AURA', '#about'],
];

function Brand() {
  return (
    <a className="brand" href="#" aria-label="AURA home">
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

function EmptyStories({ compact = false }) {
  return (
    <div className={compact ? 'empty-stories compact' : 'empty-stories'}>
      <span className="empty-symbol" aria-hidden="true">✳</span>
      <p>Fresh cricket stories are on the way.</p>
    </div>
  );
}

function HomePage() {
  // Content is intentionally empty until approved articles are supplied.
  // The layout adapts without displaying fabricated stories or empty ad slots.
  const featuredStory = null;
  const latestStories = [];
  const previews = [];
  const analysis = [];
  const knowledge = [];

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
        {featuredStory ? (
          <section className="container featured-section">
            <SectionHeading eyebrow="The big story" title="Featured" />
            {/* Approved featured story component will be rendered here. */}
          </section>
        ) : null}

        <section className="container content-section" id="news">
          <SectionHeading eyebrow="From the cricket world" title="Latest News" href="/news" />
          {latestStories.length ? (
            <div className="story-grid">
              {latestStories.slice(0, 4).map((story) => (
                <article className="story-card" key={story.slug}>
                  <a href={`/news/${story.slug}`} className="story-card-link">
                    <div className="story-image" />
                    <span className="story-category">{story.category}</span>
                    <h3>{story.title}</h3>
                    <p>{story.excerpt}</p>
                    <time>{story.date}</time>
                  </a>
                </article>
              ))}
            </div>
          ) : (
            <EmptyStories />
          )}
        </section>

        {previews.length > 0 && (
          <section className="container content-section" id="previews">
            <SectionHeading eyebrow="Before the first ball" title="Match Previews" href="/match-preview" />
          </section>
        )}

        {analysis.length > 0 && (
          <section className="analysis-band content-section" id="analysis">
            <div className="container">
              <SectionHeading eyebrow="Look beyond the score" title="AURA Analysis" href="/analysis" />
            </div>
          </section>
        )}

        {knowledge.length > 0 && (
          <section className="container content-section" id="knowledge">
            <SectionHeading eyebrow="Understand the game" title="Cricket Knowledge" href="/knowledge" />
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
  return (
    <>
      <Header />
      <HomePage />
      <Footer />
    </>
  );
}
