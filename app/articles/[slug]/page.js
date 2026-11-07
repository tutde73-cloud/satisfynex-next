import Link from 'next/link';

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
      const tickerVal = (row.ticker || "").toUpperCase();
      const catVal = (row.category || "").toUpperCase();
      const isGlobal = ['$SSEC', '$COMPOSITE', '$IHSG', '$NYA', '$NDX', '$DJI', '$SPX', '$XAUUSD', '$KOSPI'].some(t => tickerVal.includes(t)) || catVal.includes("GLOBAL");
      const imageUrl = row.cover_image || row.image_url || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80";

      return {
        id: slug,
        slug,
        title: row.title || "Untitled Article",
        ticker: row.ticker || "",
        category: isGlobal ? "GLOBAL MARKETS" : (row.category || "Stock Analysis"),
        date: row.created_at ? new Date(row.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }) : "Nov 7, 2026",
        image: imageUrl,
        read: "3 min read",
        excerpt: row.excerpt || "Read the latest Satisfynex research.",
        content: row.content || "",
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
  const globalArticles = articles.filter(a => a.isGlobal).slice(0, 5);

  const mainArticle = normalArticles[0];
  const sideArticles = normalArticles.slice(1, 4);
  const latestArticles = articles.slice(0, 20);
  const categories = [...new Set(articles.map(a => a.category))].filter(Boolean).sort();

  return (
    <div>
      <header className="topbar">
        {/* Ticker Tape Widget TradingView */}
        <div className="ticker-tape-container">
          <div className="tradingview-widget-container">
            <div className="tradingview-widget-container__widget"></div>
            <script 
              type="text/javascript" 
              src="https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js" 
              async
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "symbols": [
                    { "proName": "FOREXCOM:SPXUSD", "title": "S&P 500" },
                    { "proName": "FOREXCOM:NSXUSD", "title": "Nasdaq 100" },
                    { "proName": "FOREXCOM:DJI", "title": "Dow 30" },
                    { "proName": "INDEX:RUT", "title": "Russell 2000" },
                    { "proName": "INDEX:VIX", "title": "VIX" },
                    { "proName": "TVC:GOLD", "title": "Gold" },
                    { "proName": "TVC:SILVER", "title": "Silver" },
                    { "proName": "TVC:USOIL", "title": "Crude Oil (WTI)" },
                    { "proName": "TVC:UKOIL", "title": "Brent Oil" },
                    { "proName": "CAPITALCOM:NATURALGAS", "title": "Natural Gas" },
                    { "proName": "TVC:US10Y", "title": "US 10Y Yield" },
                    { "proName": "CAPITALCOM:DXY", "title": "Dollar Index (DXY)" },
                    { "proName": "BITSTAMP:BTCUSD", "title": "Bitcoin" }
                  ],
                  "showSymbolLogo": true,
                  "isTransparent": true,
                  "displayMode": "adaptive",
                  "colorTheme": "dark",
                  "locale": "en"
                })
              }}
            />
          </div>
        </div>
        
        <div className="container nav">
          <Link className="brand" href="/">satisfy<span>nex</span></Link>
          <nav className="navlinks" aria-label="Main navigation">
            <Link href="/global-markets">Global Markets</Link>
            <Link href="/">Research</Link>
            <Link href="/#latest">Latest</Link>
            <Link href="/about">About</Link>
          </nav>
        </div>
      </header>
 
      <main>
        <section className="hero">
          <div className="container">
            <div className="eyebrow">Independent market research</div>
            <h2 className="hero-title">Understand the business behind the stock.</h2>
            <p className="text-rotator">Satisfynex delivers daily visual chart breakdowns and technical price action research on high-momentum US equities.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
              <div className="hero-note">Research and education · Not financial advice</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', fontStyle: 'italic', opacity: 0.85 }}>
                While others lock their insights behind paywalls and sign-up forms, we give you the analysis upfront.
              </div>
            </div>
          </div>
        </section>
 
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
                  <Link href={`/articles/${mainArticle.slug}`}>
                    <img className="cover" src={mainArticle.image} alt={mainArticle.title} />
                  </Link>
                  <div className="body">
                    <div><span className="tag">{mainArticle.category}</span></div>
                    <h3>
                      <Link href={`/articles/${mainArticle.slug}`}>{mainArticle.title}</Link>
                    </h3>
                    <div className="meta">
                      <span>{mainArticle.ticker}</span>
                      <span>{mainArticle.date}</span>
                      <span>{mainArticle.read}</span>
                    </div>
                    <p className="excerpt">{mainArticle.excerpt}</p>
                    <Link className="read-more" href={`/articles/${mainArticle.slug}`}>Read full analysis →</Link>
                  </div>
                </article>
                <div className="feature-side">
                  {sideArticles.map(a => (
                    <article key={a.id} className="side-story">
                      <Link href={`/articles/${a.slug}`}>
                        <img src={a.image} alt={a.title} loading="lazy" />
                      </Link>
                      <div>
                        <div><span className="tag">{a.category}</span></div>
                        <h3>
                          <Link href={`/articles/${a.slug}`}>{a.title}</Link>
                        </h3>
                        <div className="meta">{a.date}</div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : (
              <div className="notice">Loading published research...</div>
            )}
          </div>
        </section>
 
        {/* SECTION LATEST ARTICLES DENGAN SEARCH & FILTER YANG LENGKAP */}
        <section className="section" id="latest">
          <div className="container">
            <div className="section-heading">
              <div>
                <div className="eyebrow">Explore the research</div>
                <h2>Latest articles</h2>
              </div>
              <div id="articleCount" className="muted small">{articles.length} articles</div>
            </div>

            <div className="filters">
              <input id="searchInput" type="search" placeholder="Search company, ticker, or topic..." aria-label="Search articles" />
              <select id="categoryFilter" aria-label="Filter by category">
                <option value="">All categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div id="articleGrid" className="article-grid">
              {latestArticles.map(a => (
                <article key={a.id} className="article-card">
                  <Link href={`/articles/${a.slug}`}>
                    <img className="cover" src={a.image} alt={a.title} loading="lazy" />
                  </Link>
                  <div className="body">
                    <div><span className="tag">{a.category}</span></div>
                    <h3>
                      <Link href={`/articles/${a.slug}`}>{a.title}</Link>
                    </h3>
                    <div className="meta">
                      <span>{a.ticker}</span>
                      <span>{a.date}</span>
                      <span>{a.read}</span>
                    </div>
                    <p className="excerpt">{a.excerpt}</p>
                    <Link className="read-more" href={`/articles/${a.slug}`}>Read analysis →</Link>
                  </div>
                </article>
              ))}
            </div>
            <div id="paginationContainer"></div>
          </div>
        </section>
 
        <section className="section" style={{ borderTop: '1px solid var(--line)', background: 'rgba(19, 26, 37, 0.4)' }}>
          <div className="container">
            <div className="section-heading">
              <div>
                <div className="eyebrow">Macro & Indices</div>
                <h2>Global Markets Insights</h2>
              </div>
              <Link className="read-more" href="/global-markets" style={{ margin: 0 }}>View all global markets →</Link>
            </div>
            <div className="article-grid">
              {globalArticles.length > 0 ? globalArticles.map(a => (
                <article key={a.id} className="article-card">
                  <Link href={`/articles/${a.slug}`}>
                    <img className="cover" src={a.image} alt={a.title} loading="lazy" />
                  </Link>
                  <div className="body">
                    <div><span className="tag">{a.category}</span></div>
                    <h3>
                      <Link href={`/articles/${a.slug}`}>{a.title}</Link>
                    </h3>
                    <div className="meta">
                      <span>{a.ticker}</span>
                      <span>{a.date}</span>
                      <span>{a.read}</span>
                    </div>
                    <p className="excerpt">{a.excerpt}</p>
                    <Link className="read-more" href={`/articles/${a.slug}`}>Read analysis →</Link>
                  </div>
                </article>
              )) : (
                <div className="notice" style={{ gridColumn: '1/-1' }}>No global market insights published yet.</div>
              )}
            </div>
          </div>
        </section>

        {/* TradingView Widgets */}
        <section className="screener-section">
          <div className="container">
            <div className="screener-panel">
              <div style={{ padding: '10px 10px 15px' }}>
                <div className="eyebrow">Market Quotes Data</div>
                <h2 style={{ fontSize: '22px', margin: '4px 0 0 0' }}>Global Markets Overview & Sectors</h2>
              </div>
              <div style={{ padding: '0 10px 10px' }}>
                <script type="module" src="https://widgets.tradingview-widget.com/w/en/tv-market-data.js"></script>
                <tv-market-data symbol-sectors='[{"sectionName":"Indices","symbols":["FOREXCOM:SPXUSD","FOREXCOM:NSXUSD","FOREXCOM:DJI","INDEX:NKY","INDEX:DEU40","FOREXCOM:UKXGBP"]},{"sectionName":"Futures","symbols":["BMFBOVESPA:ISP1!","BMFBOVESPA:EUR1!","CMCMARKETS:GOLD","TVC:USOIL","BMFBOVESPA:CCM1!"]},{"sectionName":"Bonds","symbols":["EUREX:FGBL1!","EUREX:FBTP1!","EUREX:FGBM1!"]},{"sectionName":"Forex","symbols":["FX:EURUSD","FX:GBPUSD","FX:USDJPY","FX:USDCHF","FX:AUDUSD","FX:USDCAD"]}]' theme="dark"></tv-market-data>
              </div>
            </div>
          </div>
        </section>
 
        <section className="screener-section" style={{ paddingTop: '10px' }}>
          <div className="container">
            <div className="screener-panel">
              <div style={{ padding: '10px 10px 15px' }}>
                <div className="eyebrow">Market Movers</div>
                <h2 style={{ fontSize: '22px', margin: '4px 0 0 0' }}>Active Equities & Performance Overview</h2>
              </div>
              <div style={{ padding: '0 10px 10px' }}>
                <script type="module" src="https://widgets.tradingview-widget.com/w/en/tv-market-overview.js"></script>
                <tv-market-overview exchange="NASDAQ" time-frame="1D" mode="market-movers" theme="dark"></tv-market-overview>
              </div>
            </div>
          </div>
        </section>
      </main>
 
      <footer className="footer">
        <div className="container">
          <div className="footer-row">
            <div>
              <Link className="brand" href="/">satisfy<span>nex</span></Link>
              <p style={{ margin: '8px 0' }}>Independent US stock research and investing education.</p>
              <p>Questions? <a className="email-link" href="mailto:research@satisfynex.com">research@satisfynex.com</a></p>
            </div>
            <nav className="footer-links" aria-label="Policies and information">
              <Link href="/global-markets">Global Markets</Link>
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/terms-of-service">Terms of Service</Link>
              <Link href="/about">About Us</Link>
              <Link href="/contact">Contact Us</Link>
              <Link href="/disclaimer">Investment Disclaimer</Link>
            </nav>
          </div>
          <p>© {new Date().getFullYear()} Satisfynex. All rights reserved. Market analysis is for educational purposes only.</p>
        </div>
      </footer>
    </div>
  );
}
