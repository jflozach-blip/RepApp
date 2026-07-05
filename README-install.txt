PWA Builder Elite V3 - Mobile Install + Auto Update

Upload all files in this ZIP to the root of your Netlify site.

Included files:
- index.html with iOS and Android PWA install tags
- manifest.json
- sw.js with cache cleanup and offline fallback
- version.json for update checks
- install.js with Android install prompt support and version refresh
- offline.html
- _headers for Netlify cache control
- icons and splash screens

Mobile install notes:
- Android/Chrome: use browser Install prompt or app button.
- iPhone/Safari: Share button > Add to Home Screen.
- The site must be served over HTTPS. Netlify provides HTTPS by default.
