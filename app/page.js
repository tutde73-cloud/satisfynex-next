async function getArticles() {
  const SUPABASE_URL = "https://ngysrsypmieuvucqupgd.supabase.co";
  const SUPABASE_KEY = "sb_publishable_U05M_WQFKioCZ1LNSfyNbQ_jUoJTQvd";
  
  const res = await fetch(`${SUPABASE_URL}/rest/v1/articles?select=id,title,slug,ticker,category,excerpt,content,image_url,cover_image,status,created_at&status=eq.published&order=created_at.desc`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: "Bearer " + SUPABASE_KEY,
    },
    next: { revalidate: 60 } // Update data otomatis setiap 60 detik
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
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px'}}>
            {articles.map((art) => {
              const slug = art.slug || art.id;
              return (
                <div key={art.id} style={{background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: '14px', padding: '16px'}}>
                  <span style={{color: 'var(--accent)', fontSize: '10px', fontWeight: 'bold'}}>{art.category || 'Stock Analysis'}</span>
                  <h3 style={{fontSize: '18px', margin: '10px 0'}}>
                    <a href={`/articles/${slug}`}>{art.title}</a>
                  </h3>
                  <p style={{color: 'var(--muted)', fontSize: '13px'}}>{art.excerpt}</p>
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
