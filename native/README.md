# Polska Adventure Ultra — aplikacja Android (Capacitor)

Natywna aplikacja to opakowanie tej samej strony (PWA) z jedną różnicą: nagrywanie GPS działa
przez usługę Androida z powiadomieniem, więc także przy zgaszonym ekranie i w tle.

- `scripts/copy-web.mjs` kopiuje pliki strony (lista = `ASSETS` z `../service-worker.js`) do `www/`.
- `npm run sync` = kopiowanie + `npx cap sync android` (wrzuca pliki do projektu Android).
- `android/` — projekt do otwarcia w Android Studio.
- Wtyczka GPS: `@capacitor-community/background-geolocation`; integracja w `../app.js` (`isNativeApp`, `recStartNativeWatch`).

## Budowanie (Windows, Android Studio)

1. Zainstaluj Android Studio: https://developer.android.com/studio (opcje domyślne).
2. Android Studio → **Open** → `C:\Users\artsni\PycharmProjects\polska-adventure-ultra-pwa\native\android`.
   Pierwsza synchronizacja Gradle pobiera dużo plików — kilka-kilkanaście minut.
3. Telefon: Ustawienia → Informacje o telefonie → Informacje o oprogramowaniu → 7× stuknij „Numer wersji”.
   Potem Ustawienia → Opcje programisty → **Debugowanie USB** = włączone. Podłącz kablem i zezwól na debugowanie.
4. W Android Studio u góry wybierz telefon i kliknij zielony ▶ **Run** — aplikacja zainstaluje się na telefonie.
   (Bez kabla: Build → Build App Bundle(s) / APK(s) → Build APK(s) → plik `app-debug.apk` wyślij na telefon.)

Po zmianach w stronie: `cd native && npm run sync`, potem znowu ▶ Run.

## Ważne

- Natywna aplikacja ma **osobne dane** — treningi przenosi się kopią zapasową (Historia → kopia / przywróć).
- Android 13+: zezwól na powiadomienia, inaczej nie będzie widać powiadomienia o nagrywaniu (GPS i tak działa).
- Zgoda na lokalizację: „Zezwalaj podczas używania aplikacji” wystarcza (nagrywanie trzyma usługa na pierwszym planie).
