import "./globals.css";
import React from "react";
import Script from "next/script";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="description" content="논리적이고 직설적인 AI 챗봇, 팩트폭격기 (Fact Machine)" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512x512.png" />
        <title>팩트폭격기!</title>
      </head>
      <body>
        {/* 좌측 고정 광고 */}
        <div className="ad-container" style={{
          position: 'fixed',
          left: 9,
          top: 30,
          height: '100vh',
          width: 160,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          zIndex: 1000,
          pointerEvents: 'auto',
        }}>
          <ins className="kakao_ad_area"
            style={{ display: 'block', width: 160, height: 600 }}
            data-ad-unit="DAN-JJ0v6l6xiVNGlSU6"
            data-ad-width="160"
            data-ad-height="600"
          ></ins>
          <Script src="//t1.daumcdn.net/kas/static/ba.min.js" strategy="afterInteractive" />
          {/* 좌측카카오 밑 배너 (PC 전용) */}
          <a
            href="https://ui7gwmf8ww.sens.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:block"
            style={{ width: 160, marginTop: 12 }}
          >
            <img
              src="/magabogam.png"
              alt="magabogam 광고 배너"
              style={{ width: 160, height: 'auto', display: 'block' }}
            />
          </a>
        </div>
        {/* 우측 고정 광고 */}
        <div className="ad-container" style={{
          position: 'fixed',
          right: 16,
          top: 30,
          height: '100vh',
          width: 160,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          zIndex: 1000,
          pointerEvents: 'auto',
        }}>
          <ins className="kakao_ad_area"
            style={{ display: 'block', width: 160, height: 600 }}
            data-ad-unit="DAN-NIKAdAgrHCQMaahW"
            data-ad-width="160"
            data-ad-height="600"
          ></ins>
          <Script src="//t1.daumcdn.net/kas/static/ba.min.js" strategy="afterInteractive" />
          {/* 우측카카오 밑 배너 (PC 전용) */}
          <a
            href="https://xz84rgb87c.sens.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:block"
            style={{ width: 160, marginTop: 12 }}
          >
            <img
              src="/malen365.png"
              alt="malen365 광고 배너"
              style={{ width: 160, height: 'auto', display: 'block' }}
            />
          </a>
        </div>
        {/* 메인 컨텐츠 */}
        {children}
      </body>
    </html>
  );
}
