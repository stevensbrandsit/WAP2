# PWA (Progressive Web App) Functionaliteit

## Overzicht

De IWA - Osaka University Access applicatie is nu een volledige Progressive Web App (PWA). Dit betekent dat medewerkers van Osaka University de applicatie kunnen installeren op hun mobiele apparaten en gebruiken alsof het een native app is.

## Functionaliteiten

### ✅ Installeerbaar
- De app kan worden geïnstalleerd op Android, iOS en desktop browsers
- Automatische installatieprompt wordt getoond aan gebruikers
- App verschijnt op het startscherm zoals een native app

### ✅ Offline Functionaliteit
- Service Worker caching voor offline toegang
- API calls worden gecached voor betere performance
- Weather map wordt gecached voor snellere laadtijden

### ✅ Automatische Updates
- Gebruikers worden genotificeerd wanneer er updates beschikbaar zijn
- Een klik op "Update nu" laadt de nieuwe versie

### ✅ Native App Ervaring
- Full-screen modus (zonder browser UI)
- Thema kleur (#2d287f) past bij de Osaka branding
- Splash screen met Osaka logo
- Native-achtige animaties en transities

## Installatie Instructies

### Voor Gebruikers (Mobile)

#### Android:
1. Open de website in Chrome
2. Een "Installeer IWA Osaka" banner verschijnt onderaan
3. Klik op "Installeer"
4. De app verschijnt op je startscherm

#### iOS (Safari):
1. Open de website in Safari
2. Tik op het "Delen" icoon
3. Scroll naar beneden en selecteer "Voeg toe aan beginscherm"
4. Bevestig de installatie

### Voor Desktop (Chrome, Edge):
1. Open de website
2. Klik op het installatie-icoon in de adresbalk
3. Bevestig de installatie
4. De app opent in een eigen venster

## Technische Details

### Configuratie
- **Plugin**: vite-plugin-pwa
- **Service Worker**: Workbox (generateSW strategie)
- **Cache Strategie**: 
  - Static assets: Pre-cached
  - API calls: NetworkFirst (5 minuten cache)
  - Windy embed: NetworkFirst (24 uur cache)

### Manifest
```json
{
  "name": "IWA - Osaka University Access",
  "short_name": "IWA Osaka",
  "theme_color": "#2d287f",
  "display": "standalone"
}
```

### Browser Support
- ✅ Chrome/Edge (Android & Desktop)
- ✅ Safari (iOS 11.3+)
- ✅ Firefox (Android)
- ✅ Samsung Internet

## Testen

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

**Let op**: PWA functionaliteit werkt alleen in production builds of via HTTPS. In development mode is de service worker beperkt functioneel.

## Component Structuur

### PWAPrompt Component
Locatie: `src/components/PWAPrompt/PWAPrompt.jsx`

Features:
- Detecteert wanneer de app installeerbaar is
- Toont een installatie prompt
- Handelt service worker updates af
- Toont update notificaties

## Updates Deployen

1. Maak je code wijzigingen
2. Build de app: `npm run build`
3. Deploy naar je server
4. Gebruikers krijgen automatisch een update notificatie

## Troubleshooting

### Service Worker wordt niet geregistreerd
- Check of je HTTPS gebruikt (of localhost)
- Clear browser cache en service workers
- Herstart de browser

### Installatie prompt verschijnt niet
- Sommige browsers vereisen meerdere bezoeken
- Check of de app niet al is geïnstalleerd
- iOS Safari heeft een handmatige installatie methode

### Cache problemen
- Open DevTools > Application > Service Workers
- Click "Unregister" en reload
- Clear Storage als nodig

## Best Practices

1. **Test op echte apparaten**: PWA functionaliteit werkt anders op verschillende devices
2. **Monitor updates**: Let op update notificaties in de console
3. **Cache invalidatie**: Bij grote wijzigingen, overweeg de cache strategie aan te passen
4. **Icon kwaliteit**: Gebruik high-quality images voor de beste ervaring

## Resources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
