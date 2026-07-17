import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

/**
 * Document HTML racine (web only) — injecté au build statique par Expo Router.
 * Rend PatternLab installable comme app plein écran (PWA standalone) :
 * - manifest + icônes (add to home screen)
 * - meta apple-mobile-web-app (plein écran iOS, sans barre Safari)
 * - viewport-fit=cover + hauteur 100% pour occuper tout l'écran
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />

        <meta name="theme-color" content="#0C1411" />
        <meta name="color-scheme" content="dark" />

        {/* Installable / plein écran */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="PatternLab" />
        <meta name="application-name" content="PatternLab" />

        <link rel="manifest" href="/patternlab/manifest.json" />
        <link rel="apple-touch-icon" href="/patternlab/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/patternlab/icon-192.png" />

        <ScrollViewStyleReset />

        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const responsiveBackground = `
html, body, #root {
  height: 100%;
  background-color: #0C1411;
}
body {
  overscroll-behavior: none;
  -webkit-tap-highlight-color: transparent;
}
`;
