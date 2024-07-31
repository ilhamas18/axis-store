import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-524BJ5Q');`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(a,s,y,n,c,h,i,d,e){s.className+=' '+y;h.start=1*new Date;
            h.end=i=function(){s.className=s.className.replace(RegExp(' ?'+y),'')};
            (a[n]=a[n]||[]).hide=h;setTimeout(function(){i();h.end=null},c);h.timeout=c;
            })(window,document.documentElement,'async-hide','dataLayer',4000,
            {'OPT-PDH34Z2':true});`,
          }}
        />
        <script src="https://www.googleoptimize.com/optimize.js?id=OPT-PDH34Z2"></script>
      </Head>
      <Script
        src="../public/js/scripts.js"
        onError={() => console.log("error")}
        onReady={() => console.log("ready")}
      />
      <Script src="./sitemap.xml" />
      <Script src="./robots.txt" />
      <link
        rel="stylesheet"
        type="text/css"
        charSet="UTF-8"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
      />
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-524BJ5Q"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Main />
        <NextScript />
        {/* <script src="public/text-Slider.js"></script> */}

        <script src="https://d27xr6oh14aaqn.cloudfront.net/webchat-axiswebstore/js/jquery-2.1.3.min.js" />
        {/* <Script type="text/javascript" src="/script.gtag.js" strategy="afterInteractive" />
        <Script type="text/javascript" src="/script.tw.js" strategy="afterInteractive" />
        */}
      </body>
    </Html>
  );
}
