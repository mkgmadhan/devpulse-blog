import Script from 'next/script';

export function AdSenseScript() {
  if (process.env.NODE_ENV !== 'production' || !process.env.NEXT_PUBLIC_ADSENSE_ID) {
    return null;
  }
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  );
}
