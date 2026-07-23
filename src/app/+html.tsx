import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

import deployment from '../../config/deployment.json';

const webBasePath = deployment.webBasePath.replace(/\/$/, '');
const publicAsset = (fileName: string) => `${webBasePath}/${fileName}`;

/**
 * Document HTML racine (web only) — injecté au build statique par Expo Router.
 * Rend Trademy installable comme app plein écran (PWA standalone) :
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
        {/*
         * Accessibilité (WCAG 1.4.4 / 1.4.10) : ne JAMAIS bloquer le zoom.
         * On retire `maximum-scale=1` et `user-scalable=no` — le pincer-pour-zoomer
         * et le zoom navigateur doivent rester disponibles.
         */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />

        <meta name="theme-color" content="#0A0D16" />
        <meta name="color-scheme" content="dark" />

        {/* Installable / plein écran */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Trademy" />
        <meta name="application-name" content="Trademy" />

        <link rel="manifest" href={publicAsset('manifest.json')} />
        <link rel="apple-touch-icon" href={publicAsset('apple-touch-icon.png')} />
        <link rel="icon" type="image/png" sizes="192x192" href={publicAsset('icon-192.png')} />

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
  background-color: #0A0D16;
}
body {
  overscroll-behavior: none;
  -webkit-tap-highlight-color: transparent;
}

/*
 * Sur téléphone (écran étroit) : l'app occupe tout l'écran.
 * Sur ordinateur / grand écran : on la contraint en colonne "format
 * téléphone" centrée, pour éviter qu'elle s'étire sur toute la largeur.
 */
@media (min-width: 560px) {
  body {
    display: flex;
    justify-content: center;
    background-color: #05070E;
  }
  #root {
    width: 460px;
    max-width: 100%;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.06), 0 24px 70px rgba(0, 0, 0, 0.55);
  }
}
`;
