import Link from 'next/link';

async function getArticleDetail(slug) {
  const SUPABASE_URL = "https://ngysrsypmieuvucqupgd.supabase.co";
  const SUPABASE_KEY = "sb_publishable_U05M_WQFKioCZ1LNSfyNbQ_jUoJTQvd";
  
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/articles?select=*`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: "Bearer " + SUPABASE_KEY,
        },
        cache: "no-store",
      }
    );
    
    if (!res.ok) return { article: null, related: [] };
    const rows = await res.json();
    if (!rows || rows.length === 0) return { article: null, related: [] };
    
    const matchedRow = rows.find(r => 
      (r.slug && r.slug.toString() === slug) || 
      (r.id && r.id.toString() === slug)
    );
    
    if (!matchedRow) return { article: null, related: [] };

    const formatRow = (row) => {
      const content = Array.isArray(row.content) 
        ? row.content.map(x => typeof x === "string" ? x : (x.text || x.content || "")).join("\n\n") 
        : String(row.content || "");
      const words = content.trim().split(/\s+/).filter(Boolean).length;
      
      return {
        id: row.slug || row.id,
        title: row.title || "Untitled Article",
        ticker: row.ticker || "",
        category: row.category || "Stock Analysis",
        date: row.created_at ? new Date(row.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }) : "Nov 7, 2026",
        image: row.cover_image || row.image_url || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
        chartImage: row.image_url || "",
        coverImage: row.cover_image || "",
        read: Math.max(1, Math.ceil(words / 200)) + " min read",
        excerpt: row.excerpt || content.slice(0, 220),
        content
      };
    };

    const article = formatRow(matchedRow);
    const related = rows
      .filter(r => (r.slug || r.id).toString() !== slug)
      .slice(0, 3)
      .map(formatRow);

    return { article, related };
  } catch (err) {
    return { article: null, related: [] };
  }
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const { article, related } = await getArticleDetail(slug);

  if (!article) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2>Article not found</h2>
        <p className="muted">The article you are looking for might have been removed or does not exist.</p>
        <Link href="/" className="read-more" style={{ marginTop: '20px', display: 'inline-block' }}>← Back to Home</Link>
      </div>
    );
  }

  return (
    <div>
      <header className="topbar">
        <div className="ticker-tape-container"></div>
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

      <main className="container article-page" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
        <Link className="back-link" href="/">← Back to research</Link>
        <article>
          <header className="article-header">
            <div style={{ marginBottom: '8px' }}><span className="tag">{article.category}</span></div>
            <h1>{article.title}</h1>
            <p className="article-lead">{article.excerpt}</p>
            <div className="meta">
              <span>{article.ticker}</span>
              <span>{article.date}</span>
              <span>{article.read}</span>
            </div>
          </header>

          <img className="article-hero" src={article.coverImage || article.image} alt={article.title} />

          <div className="article-layout">
            <div className="article-content">
              {article.chartImage && (
                <div style={{ marginBottom: '25px', textAlign: 'center' }}>
                  <img src={article.chartImage} alt={`${article.title} Chart`} style={{ width: '100%', borderRadius: '10px' }} />
                  <p className="small muted" style={{ marginTop: '8px' }}>Technical Chart & Price Action Structure</p>
                </div>
              )}

              <div dangerouslySetInnerHTML={{ __html: article.content }} />

              <div className="satisfynex-author-card" style={{ margin: '30px 0 20px 0', padding: '20px', backgroundColor: 'var(--panel)', border: '1px solid var(--line)', borderRadius: '12px', display: 'flex', gap: '16px', alignItems: 'flex-start', color: 'var(--text)' }}>
                <div style={{ flexShrink: 0 }}>
                  <img src="/Icon.png" alt="Tutde Ariyasa" style={{ width: '50px', height: '50px', borderRadius: '50%', border: '1px solid var(--line)', objectFit: 'cover', background: '#0c1017' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.8px', color: 'var(--accent)', textTransform: 'uppercase' }}>WRITTEN BY</span>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)' }}>Tutde Ariyasa</h4>
                  <p style={{ margin: '4px 0 0', fontSize: '0.85rem', lineHeight: '1.45', color: 'var(--muted)' }}>
                    Independent financial analyst and founder of Satisfynex, specializing in US equities technical analysis, market data visualization, and risk-first research.
                  </p>
                  <div style={{ marginTop: '6px', fontSize: '0.8rem', color: 'var(--muted)' }}>
                    <span>Independent Financial Analyst</span> • <Link href="/about" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Learn about our research methodology →</Link>
                  </div>
                </div>
              </div>

              <div style={{ margin: '20px 0', padding: '12px', background: 'rgba(142, 224, 189, 0.03)', borderLeft: '3px solid var(--accent)', fontSize: '0.85rem', color: 'var(--muted)' }}>
                <span>Primary Source Verification: </span>
                <a href="https://www.sec.gov" target="_blank" rel="noopener" style={{ color: 'var(--accent)' }}>SEC EDGAR Database</a> • 
                <a href="https://www.investor.gov" target="_blank" rel="noopener" style="color: var(--accent)">Investor Relations Portal</a>
              </div>

              <hr style={{ border: 0, borderTop: '1px solid var(--line)', margin: '35px 0' }} />
              <p className="muted small">This article is provided for informational and educational purposes only. It is not a recommendation to buy or sell any security.</p>

              {related.length > 0 && (
                <div className="related-research-section">
                  <div className="eyebrow" style={{ marginBottom: '4px' }}>Keep Researching</div>
                  <h3 style={{ fontSize: '20px', margin: '0 0 12px 0' }}>Related Research</h3>
                  <div className="related-grid">
                    {related.map(rel => (
                      <article key={rel.id} className="related-card">
                        <Link href={`/articles/${rel.slug}`}>
                          <img className="related-thumb" src={rel.image} alt={rel.title} loading="lazy" />
                        </Link>
                        <div className="related-body">
                          <span className="related-date">{rel.date}</span>
                          <h4 className="related-title">
                            <Link href={`/articles/${rel.slug}`}>{rel.title}</Link>
                          </h4>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside className="sidebar">
              <div className="panel">
                <h3>About this research</h3>
                <p>Satisfynex explores company fundamentals, market developments, technical evidence, and investment risks.</p>
              </div>
              <div className="panel">
                <h3>Explore more</h3>
                <Link className="read-more" href="/#latest">Browse all articles →</Link>
              </div>
            </aside>
          </div>
        </article>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-row">
            <div>
              <Link className="brand" href="/">satisfy<span>nex</span></Link>
              <p style={{ margin: '8px 0' }}>Independent US stock research and investing education.</p>
            </div>
          </div>
          <p>© {new Date().getFullYear()} Satisfynex. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
