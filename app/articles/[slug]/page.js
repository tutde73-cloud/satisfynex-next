import Link from 'next/link';

async function getArticleDetail(slug) {
  const SUPABASE_URL = "https://ngysrsypmieuvucqupgd.supabase.co";
  const SUPABASE_KEY = "sb_publishable_U05M_WQFKioCZ1LNSfyNbQ_jUoJTQvd";
  
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/articles?select=*&or=(slug.eq.${slug},id.eq.${slug})`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: "Bearer " + SUPABASE_KEY,
        },
        cache: "no-store",
      }
    );
    
    if (!res.ok) return null;
    const rows = await res.json();
    if (!rows || rows.length === 0) return null;
    
    const row = rows[0];
    return {
      ...row,
      title: row.title || "Untitled Article",
      content: row.content || "No content available.",
      image: row.cover_image || row.image_url || row.image || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
      category: row.category || "Stock Analysis",
      ticker: row.ticker || "",
      date: row.created_at ? new Date(row.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }) : "Nov 7, 2026",
      read: "3 min read"
    };
  } catch (err) {
    return null;
  }
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = await getArticleDetail(slug);

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

      <main className="container" style={{ padding: '40px 0 80px', maxWidth: '800px' }}>
        <div style={{ marginBottom: '20px' }}>
          <Link href="/" className="muted small" style={{ textDecoration: 'underline' }}>← Back to all research</Link>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <span className="tag">{article.category}</span>
        </div>

        <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', lineHeight: '1.25', marginBottom: '15px', letterSpacing: '-0.5px' }}>
          {article.title}
        </h1>

        <div className="meta" style={{ marginBottom: '25px', fontSize: '13px', paddingBottom: '15px', borderBottom: '1px solid var(--line)' }}>
          <span>{article.ticker}</span>
          <span>{article.date}</span>
          <span>{article.read}</span>
        </div>

        {article.image && (
          <div style={{ marginBottom: '30px', borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--line)' }}>
            <img src={article.image} alt={article.title} style={{ width: '100%', maxHeight: '450px', objectFit: 'cover', display: 'block' }} />
          </div>
        )}

        <div className="article-content" style={{ fontSize: '16px', lineHeight: '1.8', color: 'var(--text)' }}>
          <div style={{ whiteSpace: 'pre-line' }}>{article.content}</div>
        </div>

        <div style={{ marginTop: '50px', paddingTop: '25px', borderTop: '1px solid var(--line)' }}>
          <Link href="/" className="read-more">← Back to Home / Latest Articles</Link>
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-row">
            <div>
              <a className="brand" href="/">satisfy<span>nex</span></a>
              <p style={{ margin: '8px 0' }}>Independent US stock research and investing education.</p>
            </div>
          </div>
          <p>© {new Date().getFullYear()} Satisfynex. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
