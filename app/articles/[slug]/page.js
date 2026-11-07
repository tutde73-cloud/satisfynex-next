async function getArticle(slug) {
  const SUPABASE_URL = "https://ngysrsypmieuvucqupgd.supabase.co";
  const SUPABASE_KEY = "sb_publishable_U05M_WQFKioCZ1LNSfyNbQ_jUoJTQvd";
  
  const res = await fetch(`${SUPABASE_URL}/rest/v1/articles?select=*&slug=eq.${slug}&limit=1`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: "Bearer " + SUPABASE_KEY,
    },
    next: { revalidate: 60 }
  });
  
  if (!res.ok) return null;
  const data = await res.json();
  return data.length > 0 ? data[0] : null;
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return (
      <div className="container" style={{padding: '80px 0', textAlign: 'center'}}>
        <h1>Article Not Found</h1>
        <p style={{color: 'var(--muted)', margin: '20px 0'}}>The article you are looking for does not exist or has been removed.</p>
        <a href="/" style={{color: 'var(--accent)'}}>← Back to Home</a>
      </div>
    );
  }

  return (
    <div>
      <header className="topbar">
        <div className="container nav">
          <a className="brand" href="/">satisfy<span>nex</span></a>
          <nav className="navlinks">
            <a href="/">Research</a>
            <a href="/about">About</a>
          </nav>
        </div>
      </header>

      <main className="container" style={{padding: '60px 20px', maxWidth: '800px'}}>
        <div style={{marginBottom: '20px'}}>
          <a href="/" style={{color: 'var(--accent)', fontSize: '14px'}}>← Back to Research</a>
        </div>
        
        <span style={{color: 'var(--accent)', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase'}}>{article.category || 'Stock Analysis'}</span>
        
        <h1 style={{fontSize: 'clamp(28px, 4vw, 42px)', margin: '15px 0 20px', lineHeight: '1.2'}}>{article.title}</h1>
        
        <p style={{color: 'var(--muted)', fontSize: '14px', marginBottom: '30px'}}>
          Published on {new Date(article.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          {article.ticker && ` • Ticker: ${article.ticker}`}
        </p>

        {article.image_url && (
          <img 
            src={article.image_url} 
            alt={article.title} 
            style={{width: '100%', height: 'auto', borderRadius: '12px', marginBottom: '30px', border: '1px solid var(--line)'}} 
          />
        )}

        <div 
          style={{fontSize: '16px', lineHeight: '1.8', color: '#e2e8f0'}}
          dangerouslySetInnerHTML={{ __html: article.content }} 
        />
      </main>

      <footer className="footer">
        <div className="container">
          <p>© {new Date().getFullYear()} Satisfynex. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
