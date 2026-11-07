import './globals.css';

export const metadata = {
  title: 'Satisfynex — Independent US Stock Research',
  description: 'Independent research on US stocks, company fundamentals, technical charts and market trends.',
  metadataBase: new URL('https://www.satisfynex.com'),
  openGraph: {
    siteName: 'Satisfynex',
    type: 'website',
    title: 'Satisfynex — Independent US Stock Research',
    description: 'Independent research on US stocks, company fundamentals, technical charts and market trends.',
    url: 'https://www.satisfynex.com/',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/Icon.png" type="image/png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/Icon.png" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-742MNVD8XT"></script>
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-742MNVD8XT');
        `}} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
