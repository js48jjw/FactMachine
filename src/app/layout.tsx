import "./globals.css";
import React from "react";
import Script from "next/script";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2563eb" />
        <title>팩트폭격기!</title>
      </head>
      <body>
        {/* 좌측 고정 광고 */}
        <div style={{
          position: 'fixed',
          left: 5,
          top: 30,
          height: '100vh',
          width: 160,
          display: 'flex',
          alignItems: 'flex-start',
          zIndex: 1000,
          pointerEvents: 'auto',
        }}>
          <ins className="kakao_ad_area"
            style={{ display: 'block', width: 160, height: 600 }}
            data-ad-unit="DAN-dw0XaXYLeei0bqYK"
            data-ad-width="160"
            data-ad-height="600"
          ></ins>
          <Script src="//t1.daumcdn.net/kas/static/ba.min.js" strategy="afterInteractive" />
        </div>
        {/* 우측 고정 광고 */}
        <div style={{
          position: 'fixed',
          right: 16,
          top: 30,
          height: '100vh',
          width: 160,
          display: 'flex',
          alignItems: 'flex-start',
          zIndex: 1000,
          pointerEvents: 'auto',
        }}>
          <ins className="kakao_ad_area"
            style={{ display: 'block', width: 160, height: 600 }}
            data-ad-unit="DAN-kTq9g9C4bXqSwbOb"
            data-ad-width="160"
            data-ad-height="600"
          ></ins>
          <Script src="//t1.daumcdn.net/kas/static/ba.min.js" strategy="afterInteractive" />
        </div>
        {/* 메인 컨텐츠 */}
        {children}
      </body>
    </html>
  );
}
