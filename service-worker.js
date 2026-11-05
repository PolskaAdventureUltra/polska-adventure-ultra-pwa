// © 2026 Polska Adventure Ultra. Wszelkie prawa zastrzeżone. Kopiowanie i wykorzystanie bez zgody zabronione.
// Licencja: plik LICENSE. Kontakt: polskaadventureultra@gmail.com
// Polska Adventure Ultra - PWA Service Worker
// Cache'uje wszystkie pliki apki, żeby działała w 100% offline po pierwszym wczytaniu.

const CACHE_NAME = "pau-cache-v61";
const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./qr/qr-aplikacja.svg",
  "./qr/qr-aplikacja.png",
  "./partners/cedrus.png",
  "./partners/tvplublin.png",
  "./partners/agnieszkadanieluk.png",
  "./partners/4evolve.png",
  "./partners/szymong.png",
  "./partners/stokrotka.png",
  "./partners/mosir.png",
  "./vendor/fonts/space-grotesk/space-grotesk-latin-wght-normal.woff2",
  "./vendor/fonts/space-grotesk/space-grotesk-latin-ext-wght-normal.woff2",
  "./vendor/leaflet/leaflet.js",
  "./vendor/leaflet/leaflet.css",
  "./vendor/leaflet/images/marker-icon.png",
  "./vendor/leaflet/images/marker-icon-2x.png",
  "./vendor/leaflet/images/marker-shadow.png",
  "./vendor/leaflet/images/layers.png",
  "./vendor/leaflet/images/layers-2x.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    // cache: "reload" - pobieramy prosto z serwera, z pominięciem pamięci HTTP przeglądarki
    // (GitHub Pages: max-age=600), inaczej nowa wersja mogłaby zapisać stare pliki.
    // Do adresu dokładamy ?v=<wersja>: serwer GitHub Pages (CDN) przez kilka minut po wydaniu potrafi
    // podać starą kopię pliku spod tego samego adresu - unikalny adres wymusza świeży plik.
    // Zapisujemy go pod zwykłym adresem (bez ?v), żeby strona go znalazła.
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(ASSETS.map((url) => {
        const fresh = url + (url.includes("?") ? "&" : "?") + "v=" + CACHE_NAME;
        return fetch(new Request(fresh, { cache: "reload" })).then((res) => {
          if (!res.ok) throw new Error(`${url}: ${res.status}`);
          return cache.put(url, res);
        });
      }))
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    // Tylko z bieżącej wersji cache - nie mieszamy plików ze starej i nowej wersji.
    caches.open(CACHE_NAME)
      .then((cache) => cache.match(event.request))
      .then((cached) => cached || fetch(event.request))
  );
});
