async function getArticles() {
  const SUPABASE_URL = "https://ngysrsypmieuvucqupgd.supabase.co";
  const SUPABASE_KEY = "sb_publishable_U05M_WQFKioCZ1LNSfyNbQ_jUoJTQvd";
  
  const res = await fetch(`${SUPABASE_URL}/rest/v1/articles?select=id,title,slug,ticker,category,excerpt,content,image_url,cover_image,status,created_at&status=eq.published&order=created_at.desc`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: "Bearer " + SUPABASE_KEY,
    },
    next: { revalidate: 60 }
  });
  
  if (!res.ok) return [];
  return res.json();
}

export default async function Home() {
  const articles = await getArticles();

  return (
    <div>
      <header className="topbar">
        <div className="container nav">
          <a className="brand" href="/">satisfy<span>nex</span></a>
          <nav className="navlinks">
            <a href="/global-markets">Global Markets</a>
            <a href="/">Research</a>
            <a href="/about">About</a>
          </nav>
        </div>
      </header>
      
      <main>
        <section className="hero">
          <div className="container">
            <div className="eyebrow">Independent market research</div>
            <h1 style={{fontSize: 'clamp(36px,6vw,60px)', margin: '16px 0'}}>Understand the business behind the stock.</h1>
            <p style={{color: '#d0d9e5', fontSize: '17px'}}>Satisfynex delivers daily visual chart breakdowns and technical price action research on high-momentum US equities.</p>
          </div>
        </section>

        <section className="container" style={{padding: '40px 0'}}>
          <h2>Latest Research Articles ({articles.length})</h2>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px', marginTop: '20px'}}>
            {articles.map((art) => {
              const slug = art.slug || art.id;
              const imageUrl = art.image_url || art.cover_image;
              
              return (
                <div key={art.id} style={{background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: '14px', overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
                  {imageUrl && (
                    <a href={`/articles/${slug}`} style={{display: 'block', height: '180px', overflow: 'hidden', background: '#080c10'}}>
                      <img src={imageUrl} alt={art.title} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                    </a>
                  )}
                  <div style={{padding: '20px', display: 'flex', flexDirection: 'column', flex: 1}}>
                    <span style={{color: 'var(--accent)', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase'}}>{art.category || 'Stock Analysis'}</span>
                    <h3 style={{fontSize: '18px', margin: '10px 0', lineHeight: '1.4'}}>
                      <a href={`/articles/${slug}`} style={{color: 'var(--text)'}}>{art.title}</a>
                    </h3>
                    <p style={{color: 'var(--muted)', fontSize: '13px', lineHeight: '1.6', flex: 1}}>{art.excerpt}</p>
                    <div style={{marginTop: '15px', paddingTop: '15px', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--muted)'}}>
                      <span>{art.ticker ? `$${art.ticker}` : 'Market Watch'}</span>
                      <a href={`/articles/${slug}`} style={{color: 'var(--accent)', fontWeight: '600'}}>Read Analysis →</a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <p>© {new Date().getFullYear()} Satisfynex. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
