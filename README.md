# NOCH 1 METER

Ein schnelles Singleplayer-Browser-Spiel: Schätze unbekannte Größen – Gewicht, Entfernung, Zeit, Geschwindigkeit, Anzahl, Preis – auf einer Skala und finde heraus, wie weit du daneben lagst.

Kein Quiz, sondern Intuition und überraschende Fakten.

## Status

Phase 1 (Projekt-Setup) abgeschlossen. Das Spiel selbst ist noch nicht spielbar.

Das vollständige Konzept steht in [docs/konzept-v2.md](docs/konzept-v2.md).

## Geplanter Stack

React · TypeScript · Vite · Tailwind CSS · Framer Motion · Lucide React · Vitest

Kein Backend, keine Accounts. Der Spielstand liegt im localStorage des Browsers.

## Lokal starten

Voraussetzung: Node.js 22 LTS

```
npm install
npm run dev
```

## Weitere Befehle

| Befehl | Zweck |
| --- | --- |
| `npm run build` | Typecheck + Produktions-Build |
| `npm run test` | Logik-Tests (Vitest) |
| `npm run lint` | Lint (oxlint) |
| `npm run preview` | Build lokal ansehen |
