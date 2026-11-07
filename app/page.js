async function getArticles() {
  const SUPABASE_URL = "https://ngysrsypmieuvucqupgd.supabase.co";
  const SUPABASE_KEY = "sb_publishable_U05M_WQFKioCZ1LNSfyNbQ_jUoJTQvd";
  
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/articles?select=id,title,slug,ticker,category,excerpt,content,image_url,cover_image,status,created_at&status=eq.published&order=created_at.desc`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: "Bearer " + SUPABASE_KEY,
        },
        cache: "no-store",
      }
    );
    
    if (!res.ok) return [];
    const rows = await res.json();
    
    return rows.map((row) => {
      const slug = row.slug || row.id;
      const imageUrl = row.cover_image || row.image_url || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80";
      const tickerVal = (row.ticker || "").toUpperCase();
      const catVal = (row.category || "").toUpperCase();
      const isGlobal = ["$SSEC", "$COMPOSITE", "$IHSG", "$NYA", "$NDX", "$DJI", "$SPX", "$XAUUSD", "$KOSPI"].some(t => tickerVal.includes(t)) || catVal.includes("GLOBAL");

      return {
        ...row,
        slug,
        image: imageUrl,
        category: isGlobal ? "GLOBAL MARKETS" : (row.category || "Stock Analysis"),
        date: new Date(row.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }),
        read: "3 min read",
        isGlobal
      };
    });
  } catch (err) {
    return [];
  }
}

export default async function Home() {
  const articles = await getArticles();
  const normalArticles = articles.filter(a => !a.isGlobal);
  
  // Sesuai struktur index.html lama: 1 Featured Utama, 3 Featured Samping, dan Sisanya Latest
  const mainArticle = normalArticles[0];
  const sideArticles = normalArticles.slice(1, 4);
  const latestArticles = articles.slice(0, 20);

  return (
    <div>
      <header className="topbar">
        <div className="ticker-tape-container">
          <div className="tradingview-widget-container">
            <div className="tradingview-widget-container__widget"></div>
          </div>
        </div>

        <div className="container nav">
          <a className="brand" href="/">
            satisfy<span>nex</span>
          </a>
          <nav className="navlinks" aria-label="Main navigation">
            <a href="/global-markets">Global Markets</a>
            <a href="/">Research</a>
            <a href="/#latest">Latest</a>
            <a href="/about">About</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container">
            <div className="eyebrow">Independent market research</div>
            <h1 className="hero-title">Understand the business behind the stock.</h1>
            <p>Satisfynex delivers daily visual chart breakdowns and technical price action research on high-momentum US equities.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start', marginTop: '15px' }}>
              <div className="hero-note">Research and education · Not financial advice</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', fontStyle: 'italic', opacity: '0.85' }}>
                While others lock their insights behind paywalls and sign-up forms, we give you the analysis upfront.
              </div>
            </div>
          </div>
        </section>

        {/* Bagian Editor's Selection / Featured Research (Persis Web Lama) */}
        <section className="section">
          <div className="container">
            <div className="section-heading">
              <div>
                <div className="eyebrow">Editor's selection</div>
                <h2>Featured research</h2>
              </div>
            </div>

            {mainArticle ? (
              <div className="featured-grid">
                <article className="feature-main">
                  <a href={`/articles/${mainArticle.slug}`}>
                    <img className="cover" src={mainArticle.image} alt={mainArticle.title} />
                  </a>
                  <div className="body">
                    <div>
                      <span className="tag">{mainArticle.category}</span>
                    </div>
                    <h3>
                      <a href={`/articles/${mainArticle.slug}`}>{mainArticle.title}</a>
                    </h3>
                    <div className="meta">
                      <span>{mainArticle.ticker}</span>
                      <span>{mainArticle.date}</span>
                      <span>{mainArticle.read}</span>
                    </div>
                    <p className="excerpt">{mainArticle.excerpt}</p>
                    <a className="read-more" href={`/articles/${mainArticle.slug}`}>
                      Read full analysis →
                    </a>
                  </div>
                </article>

                <div className="feature-side">
                  {sideArticles.map((art) => (
                    <article key={art.id} className="side-story">
                      <a href={`/articles/${art.slug}`}>
                        <img src={art.image} alt={art.title} />
                      </a>
                      <div>
                        <div>
                          <span className="tag">{art.category}</span>
                        </div>
                        <h3>
                          <a href={`/articles/${art.slug}`}>{art.title}</a>
                        </h3>
                        <div className="meta">{art.date}</div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : (
              <div className="notice">Loading featured research...</div>
            )}
          </div>
        </section>

        {/* Bagian Latest Research Articles (Persis Web Lama) */}
        <section className="section" id="latest">
          <div className="container">
            <div className="section-heading">
              <div>
                <div className="eyebrow">Explore the research</div>
                <h2>Latest Research Articles</h2>
              </div>
              <div id="articleCount" className="muted small">
                {articles.length} articles
              </div>
            </div>

            <div className="article-grid">
              {latestArticles.map((art) => (
                <article key={art.id} className="article-card">
                  <a href={`/articles/${art.slug}`}>
                    <img className="cover" src={art.image} alt={art.title} loading="lazy" />
                  </a>
                  <div className="body">
                    <div>
                      <span className="tag">{art.category}</span>
                    </div>
                    <h3>
                      <a href={`/articles/${art.slug}`}>{art.title}</a>
                    </h3>
                    <div className="meta">
                      <span>{art.ticker}</span>
                      <span>{art.date}</span>
                      <span>{art.read}</span>
                    </div>
                    <p className="excerpt">{art.excerpt}</p>
                    <a className="read-more" href={`/articles/${art.slug}`}>
                      Read analysis →
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-row">
            <div>
              <a className="brand" href="/">
                satisfy<span>nex</span>
              </a>
              <p style={{ margin: '8px 0' }}>Independent US stock research and investing education.</p>
              <p>
                Questions?{' '}
                <a className="email-link" href="mailto:research@satisfynex.com">
                  research@satisfynex.com
                </a>
              </p>
            </div>
            <nav className="footer-links" aria-label="Policies and information">
              <a href="/global-markets">Global Markets</a>
              <a href="/privacy-policy">Privacy Policy</a>
              <a href="/terms-of-service">Terms of Service</a>
              <a href="/about">About Us</a>
              <a href="/contact">Contact Us</a>
              <a href="/disclaimer">Investment Disclaimer</a>
            </nav>
          </div>
          <p>© {new Date().getFullYear()} Satisfynex. All rights reserved. Market analysis is for educational purposes only.</p>
        </div>
      </footer>
    </div>
  );
}
