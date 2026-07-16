# ADR-001 — Stack mobile

## Statut
Accepté (P0.1).

## Contexte
PatternLab doit tourner sur iOS, Android et web depuis une base unique, avec un
prototype réellement jouable et une bonne productivité. Le kit recommande Expo/RN/TS
après vérification des recommandations officielles au moment de l'exécution.

## Options
- Expo + React Native + TypeScript + Expo Router.
- React Native « nu » (sans Expo).
- Flutter / natif séparé iOS+Android.

## Décision
**Expo SDK 57 + React Native 0.86 + TypeScript strict + Expo Router**, scaffoldé
via la commande officielle `npx create-expo-app@latest` (template par défaut Expo
Router + web). Versions natives alignées via `bundledNativeModules.json` d'Expo.

## Conséquences
- iOS + Android + web depuis un seul code.
- Web sert de cible de vérification immédiate ; builds device via EAS en P2.
- `react-native-reanimated` (UI) et `react-native-svg` (graphiques) fournis par Expo.

## Rollback
Le scaffold est isolé ; revenir à un autre template Expo ou éjecter reste possible
tant que le socle est petit.
