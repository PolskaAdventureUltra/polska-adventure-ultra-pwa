// © 2026 Polska Adventure Ultra. Wszelkie prawa zastrzeżone. Kopiowanie i wykorzystanie bez zgody zabronione.
// Licencja: plik LICENSE. Kontakt: polskaadventureultra@gmail.com
// Polska Adventure Ultra - PWA logic
// Wszystkie dane trzymane lokalnie w przeglądarce telefonu (localStorage).
// Nic nie jest wysyłane na żaden serwer - każdy telefon ma swoją niezależną historię.

const PIN_KEY = "pau_pin";
const HISTORY_KEY = "pau_history";
const THEME_KEY = "pau_theme";
const LANG_KEY = "pau_lang";
const PLANNED_ROUTES_KEY = "pau_planned_routes";
const STATS_CONSENT_KEY = "pau_stats_consent";   // "yes" / "no" / brak = jeszcze nie pytano
const DEVICE_ID_KEY = "pau_device_id";
const LAST_PING_KEY = "pau_last_ping";
const SHARE_TOKENS_KEY = "pau_share_tokens";     // { idAktywności: tokenUsuwania }
const NICK_KEY = "pau_nick";
const ROUTE_SHARE_TOKENS_KEY = "pau_route_share_tokens"; // { idTrasy: tokenUsuwania }
const EVENT_TOKENS_KEY = "pau_event_tokens";     // { idWydarzenia: tokenZapisu }
const EVENTS_DONE_KEY = "pau_events_done";       // { idWydarzenia: { title, disc, starts_at, done_at } } - tylko na telefonie
const ADMIN_KEY_KEY = "pau_admin_key";           // klucz organizatora (tylko na telefonie administratora)
const CHALLENGE_INVITE_KEY = "pau_challenge_invite"; // kod zaproszenia: dołączenie przed oficjalnymi zapisami
const CHALLENGE_INVITE_TOKEN_KEY = "pau_challenge_invite_token"; // losowy token urządzenia, do którego przypisano kod
const CHALLENGE_KEY = "pau_challenge";              // { start: "YYYY-MM-DD" } - udział w wyzwaniu 4000 km
const GOALS_KEY = "pau_goals"; // [{ period: "week"|"month", disc: "all"|"Bieg"|..., km }]

// --- Społeczność (Supabase) ---
// Klucz "publishable"/"anon" jest z założenia publiczny - bezpieczeństwo zapewniają RLS
// i funkcje w supabase/schema.sql. Puste wartości = funkcje społeczności wyłączone.
const SUPABASE_URL = "https://ldzpelsvqtqoxhenbbsv.supabase.co";
const SUPABASE_KEY = "sb_publishable_D_2syaer9pzsc6nzKdY0xQ_8sIcmn_r";
// Kontakt do administratora danych (wymagany w informacji RODO).
const ADMIN_CONTACT = "polskaadventureultra@gmail.com";
const DEFAULT_PIN = "1234";

// --- Tłumaczenia (PL/EN) ---
const TRANSLATIONS = {
  pl: {
    loginBtn: "Zaloguj",
    invalidPin: "Nieprawidłowy PIN",
    tabTrain: "Trening",
    tabHistory: "Historia",
    labelDiscipline: "Dyscyplina",
    optBieg: "Bieg",
    optRower: "Rower",
    optKajak: "Kajak",
    optBasen: "Pływanie – basen",
    optWodyOtwarte: "Pływanie – wody otwarte",
    optTrekking: "Trekking",
    distSwimPlaceholder: "np. 1.5 = 1500 m",
    labelDate: "Data",
    labelDist: "Dystans (km)",
    labelTime: "Czas (min)",
    labelHr: "Śr. tętno (bpm)",
    labelVo2max: "Pułap tlenowy VO2max",
    labelWeight: "Waga (kg)",
    labelNotes: "Notatki / Samopoczucie",
    saveBtn: "ZAPISZ TRENING",
    paceBtn: "OBLICZ TEMPO",
    chartBtn: "POKAŻ WYKRES PROGRESU",
    exportBtn: "EKSPORTUJ DO CSV",
    importBtn: "IMPORTUJ Z GARMIN / SUUNTO / POLAR",
    importHint: "Wyeksportuj trening z Garmin Connect, Suunto app lub Polar Flow jako plik GPX lub TCX, a następnie wczytaj go tutaj.",
    chartTitle: "Progres dystansu",
    historyTitle: "Historia treningów",
    themeBtn: "Zmień motyw",
    pinChangeBtn: "Zmień PIN",
    langBtnTarget: "EN",
    totalLabel: (km) => `🏅 Łącznie: ${km} km`,
    noHistory: "Brak zapisanych treningów.",
    deleteTitle: "Usuń wpis",
    confirmDelete: "Usunąć ten wpis z historii?",
    alertDistRequired: "Podaj dystans większy od 0.",
    alertSaved: "Zapisano trening!",
    alertTimeRequired: "Podaj czas większy od 0.",
    paceResult: (min, sec) => `Tempo: ${min}:${sec} min/km`,
    speedResult: (v) => `Prędkość: ${v} km/h`,
    swimPaceResult: (pace) => `Tempo: ${pace}`,
    alertNoHistoryChart: "Brak danych historycznych.",
    alertNoHistoryExport: "Brak danych do eksportu.",
    importSuccess: (p) =>
      `Wczytano trening z pliku:\nData: ${p.date}\nDystans: ${p.dist} km\n` +
      `Czas: ${p.time} min\nŚr. tętno: ${p.hr} bpm\n\nSprawdź dane i kliknij "ZAPISZ TRENING".`,
    importError: (msg) => `Błąd importu: ${msg}`,
    errNoGpxPoints: "Brak punktów trasy w pliku GPX.",
    errNoTcxData: "Brak danych treningu w pliku TCX.",
    errBadXml: "Nie udało się odczytać pliku (nieprawidłowy XML).",
    promptNewPin: "Podaj nowy PIN:",
    pinChanged: "PIN zmieniony.",
    historyLabels: { date: "Data", disc: "Dyscyplina", dist: "Dystans", weight: "Waga", hr: "Tętno", vo2max: "VO2max", notes: "Notatki" },
    discNames: { Bieg: "Bieg", Rower: "Rower", Kajak: "Kajak", Basen: "Pływanie – basen", WodyOtwarte: "Pływanie – wody otwarte", Trekking: "Trekking", Multi: "Multisport" },
    routeTitle: "Trasa",
    showRouteTitle: "Pokaż trasę",
    tabPlan: "Trasy",
    planTitle: "Wyznacz trasę",
    planHint: "Klikaj na mapie, żeby dodać kolejne punkty trasy. Gotową trasę zapisz i wyeksportuj do GPX, a potem wgraj do zegarka.",
    planModeLabel: "Prowadzenie trasy",
    planModeFoot: "Po szlakach pieszych i górskich (bieg, trekking)",
    planModeBike: "Po drogach rowerowych (rower)",
    planModeStraight: "Linia prosta (kajak, pływanie, teren)",
    planUndoBtn: "Cofnij punkt",
    planClearBtn: "Wyczyść",
    planSaveBtn: "ZAPISZ TRASĘ",
    planExportBtn: "EKSPORTUJ DO GPX (ZEGAREK)",
    planExportHint: "Garmin: Garmin Connect (www) → Trening → Trasy → Importuj. Suunto: otwórz plik GPX w Suunto app. Polar: Polar Flow (www) → Ulubione → Trasy → Importuj.",
    savedRoutesTitle: "Zapisane trasy",
    noSavedRoutes: "Brak zapisanych tras.",
    planStats: (km, n) => `Dystans: ${km} km · punkty: ${n}`,
    planStatsAscent: (m) => ` · przewyższenie: ${m} m`,
    planRouting: "Wyznaczam trasę…",
    planRoutingError: "Nie udało się wyznaczyć trasy po drogach (brak internetu lub punkt poza drogą) — ten odcinek jest linią prostą.",
    planNeedPoints: "Dodaj co najmniej 2 punkty na mapie.",
    promptRouteName: "Nazwa trasy:",
    defaultRouteName: "Moja trasa",
    routeSaved: "Trasa zapisana!",
    confirmDeleteRoute: "Usunąć tę trasę?",
    editRouteTitle: "Edytuj trasę",
    exportRouteTitle: "Eksportuj do GPX",
    helpBtn: "Pomoc",
    helpTitle: "Pomoc i instrukcja",
    helpPrivacyBtn: "PEŁNA INFORMACJA O PRYWATNOŚCI (RODO)",
    copyrightLine: "© 2026 Polska Adventure Ultra · Wszelkie prawa zastrzeżone",
    tabChallenge: "Wyzwanie",
    challengeJoinTitle: "Wyzwanie 4000 km",
    challengeJoinText: "4000 km dookoła Polski — biegiem, rowerem i kajakiem. Start i meta w Lublinie. Uczestnicy widzą tu swój postęp: kilometry, miejsce na trasie i prognozę mety.",
    chSignupSoon: "ZAPISY OD WRZEŚNIA 2027",
    chDemoSub: "z 4000 km",
    chInviteLink: "Masz kod zaproszenia?",
    promptInvite: "Wpisz kod zaproszenia do wyzwania:",
    inviteInvalid: "Kod jest nieprawidłowy albo został już użyty na innym urządzeniu.",
    inviteOk: "Kod przyjęty — możesz dołączyć do wyzwania.",
    inviteRevoked: "Twoje zaproszenie do wyzwania zostało wycofane albo przeniesione na inne urządzenie. Treningi zostają w Historii.",
    chPartners: "PARTNERZY PROJEKTU",
    chPartnerCta: "Zostań partnerem →",
    chParticipantsOnly: "Postęp na żywo widzą tylko osoby biorące udział w wyzwaniu.",
    chSignupSoonHint: "Do tego czasu możesz śledzić wyzwanie i dołączać do wspólnych treningów.",
    challengeJoinBtn: "DOŁĄCZ DO WYZWANIA",
    challengeStartLabel: "Początek Twojego wyzwania",
    challengeStartHint: "Od tej daty liczą się dni wyzwania. Do postępu wliczają się tylko treningi biegowe, rowerowe i kajakowe oznaczone 🏁 jako odcinek wyzwania (pole przy zapisie treningu albo przycisk 🏁 w Historii).",
    challengeFlagLabel: "🏁 Odcinek wyzwania 4000 km (liczy się do postępu w wyzwaniu)",
    flagOnTitle: "Odcinek wyzwania — kliknij, aby odznaczyć",
    flagOffTitle: "Oznacz jako odcinek wyzwania 4000 km",
    challengeLeaveBtn: "Zrezygnuj z wyzwania",
    confirmLeaveChallenge: "Zrezygnować z wyzwania? Postęp przestanie się liczyć (treningi zostają w Historii).",
    chOf: (pct) => `z 4 000 km · ${pct}%`,
    chWeek: "TEN TYDZIEŃ",
    chStreak: (n) => `${n} ${n === 1 ? "dzień" : "dni"} z rzędu w ruchu`,
    chNoStreak: "Dodaj dziś trening i zacznij passę",
    chH1: "4000 km<br>dookoła Polski",
    chMeta: "WYZWANIE · BIEG · ROWER · KAJAK",
    chNow: (day) => `start i meta: Lublin<br>dzień ${day} wyzwania`,
    chStatDays: "dni w wyzwaniu",
    chStatAvg: "km dziennie",
    chStatEta: "meta ok.",
    eventsTitle: "📅 Wydarzenia",
    eventsHint: "Wspólne treningi, spływy i rajdy. Kliknij „Biorę udział”, żeby organizator wiedział, ilu osób się spodziewać.",
    noEvents: "Brak zaplanowanych wydarzeń — zajrzyj później.",
    optMulti: "Multisport",
    eventFormTitle: "Nowe wydarzenie",
    eventTitleLabel: "Nazwa",
    eventStartLabel: "Data i godzina",
    eventPlaceLabel: "Miejsce zbiórki",
    eventMapHint: "Opcjonalnie: kliknij na mapie dokładne miejsce zbiórki (uczestnicy dostaną link do nawigacji).",
    eventDescLabel: "Opis (dystans, tempo, co zabrać…)",
    eventLinkLabel: "Link (opcjonalnie, np. wydarzenie na Facebooku)",
    eventSaveBtn: "Opublikuj",
    eventAddBtn: "＋ DODAJ WYDARZENIE",
    organizerLogin: "🔑 Organizator",
    organizerLogout: "🔑 Wyloguj organizatora",
    promptAdminKey: "Podaj klucz organizatora:",
    adminKeyInvalid: "Nieprawidłowy klucz organizatora.",
    adminLoggedIn: "Tryb organizatora włączony — możesz dodawać i usuwać wydarzenia.",
    eventMissingFields: "Uzupełnij nazwę, datę i godzinę oraz miejsce zbiórki.",
    eventLinkInvalid: "Link musi zaczynać się od https://",
    eventPublished: "Wydarzenie opublikowane!",
    confirmDeleteEvent: "Usunąć to wydarzenie? Zniknie u wszystkich użytkowników.",
    joinBtn: (n) => `🙋 Biorę udział · ${n}`,
    joinedBtn: (n) => `✅ Bierzesz udział · ${n}`,
    joinTitle: "Zapisz się — organizator zobaczy tylko liczbę chętnych",
    leaveTitle: "Kliknij, aby się wypisać",
    eventNavigate: "📍 Dojazd",
    eventLink: "🔗 Szczegóły",
    eventCalendar: "📆 Do kalendarza",
    eventToday: "dziś",
    eventTomorrow: "jutro",
    eventInDays: (n) => `za ${n} dni`,
    eventDoneBtn: (n) => `🏁 Zrobione · ${n}`,
    eventDoneMark: (n) => `✅ Ukończone · ${n}`,
    eventDoneTitle: "Zaznacz, że masz to wydarzenie za sobą — liczba obok to osoby, które je ukończyły",
    eventDoneDialogTitle: "Gratulacje! 🎉",
    eventDoneDialogText: "Pokazać wszystkim, że masz to wydarzenie za sobą? Razem z Twoim wynikiem: dystans, czas i profil wysokości (bez mapy trasy).",
    eventDoneShareBtn: "👥 Pokaż z nickiem",
    eventDoneShareAnonBtn: "👥 Pokaż anonimowo",
    eventDoneLocalBtn: "🔒 Tylko u mnie",
    eventDoneCancelBtn: "Anuluj",
    eventDoneShareFailed: "Nie udało się wysłać na serwer (sprawdź internet) — zapisano tylko na Twoim telefonie.",
    eventDoneFillTraining: (title) => `📅 ${title} — uzupełnij dystans i czas, żeby trening trafił do Historii (albo pomiń, jeśli importujesz go z zegarka).`,
    hintCloseLabel: "Zamknij",
    eventDoneSharedTag: "(widoczne dla wszystkich)",
    eventYourResult: "🏁 Twój wynik:",
    eventResultsBtn: (n) => `📊 Wyniki · ${n}`,
    eventResultsTitle: (title) => `📊 Wyniki — ${title}`,
    eventResultsEmpty: "Nikt jeszcze nie podał wyniku.",
    eventResultsAnon: "Anonim",
    eventResultsProfile: "📈 Profil",
    eventResultsClose: "Zamknij",
    eventNoResult: "Brak treningu z tego dnia w Historii — zapisz go, a dystans pojawi się tutaj.",
    eventWent: (n) => `🙋 Zapisanych: ${n}`,
    eventsPastTitle: "🏁 Zakończone (ostatnie 7 dni)",
    eventUndoneTitle: "Kliknij, aby cofnąć",
    eventsDoneTitle: (n) => `🏅 Twoje ukończone wydarzenia (${n})`,
    eventDoneRemoveTitle: "Usuń z listy ukończonych",
    dateLocale: "pl-PL",
    goalsTitle: "🎯 Cele",
    goalsEmpty: "Nie masz jeszcze celów. Ustaw np. 30 km biegu tygodniowo i śledź postęp.",
    goalAddBtn: "＋ DODAJ CEL",
    goalPeriodLabel: "Okres",
    goalWeek: "Tygodniowy",
    goalMonth: "Miesięczny",
    goalAllDisc: "Wszystkie dyscypliny",
    goalKmLabel: "Dystans (km)",
    goalSaveBtn: "Zapisz cel",
    goalCancelBtn: "Anuluj",
    goalKmInvalid: "Podaj dystans celu (większy od 0).",
    goalLabel: (period, disc) => `${period === "week" ? "Tydzień" : "Miesiąc"} · ${disc}`,
    goalAll: "wszystkie dyscypliny",
    goalLeft: (km, days) => `zostało ${km} km · ${days} ${days === 1 ? "dzień" : "dni"} do końca`,
    goalDone: "✅ Cel osiągnięty!",
    confirmDeleteGoal: "Usunąć ten cel?",
    goalReached: (labels) => `🎯 Brawo! Cel osiągnięty:\n${labels.join("\n")}`,
    summaryTitle: "Podsumowanie",
    periodWeek: "Ten tydzień",
    periodMonth: "Ten miesiąc",
    periodYear: "Ten rok",
    periodAll: "Od początku",
    summaryTrainings: "Treningi",
    summaryDistance: "Dystans (km)",
    summaryTime: "Czas",
    summaryAscent: "Przewyższenie (m)",
    summaryEmpty: "Brak treningów w tym okresie.",
    summaryCompare: (period, km, diff) =>
      `${{ week: "Poprzedni tydzień", month: "Poprzedni miesiąc", year: "Poprzedni rok" }[period]}: ${km} km` +
      (diff !== null ? ` (${diff >= 0 ? "+" : ""}${diff} km)` : ""),
    summaryDiscLine: (name, count, km, time) => `<b>${name}</b>: ${count}× · ${km} km${time ? ` · ${time}` : ""}`,
    streakTitle: "🔥 Passa treningowa",
    streakCurrent: "Obecna passa",
    streakBest: "Najdłuższa passa",
    days: (n) => `${n} ${n === 1 ? "dzień" : "dni"}`,
    recordsTitle: "🏆 Rekordy osobiste",
    recordsEmpty: "Zapisz pierwszy trening, żeby zobaczyć rekordy.",
    recordsOverall: "Ogółem",
    recLongestDist: "Najdłuższy dystans",
    recLongestTime: "Najdłuższy czas",
    recBestPace: "Najszybsze tempo (od 1 km)",
    recBestSwimPace: "Najszybsze tempo (od 400 m)",
    recBestSpeed: "Najwyższa śr. prędkość (od 1 km)",
    recMaxAscent: "Największe przewyższenie",
    recBestWeek: "Najlepszy tydzień",
    recBestMonth: "Najlepszy miesiąc",
    recWeekOf: (date) => `od ${date}`,
    elevationTitle: "Profil wysokości",
    elevationStats: (up, down, min, max) => `↗ podejścia ${up} m · ↘ zejścia ${down} m · min ${min} m · max ${max} m n.p.m.`,
    backupTitle: "Kopia zapasowa",
    backupHint: "Treningi i trasy są zapisane tylko na tym telefonie. Zrób kopię i zachowaj plik (np. na Dysku Google lub wyślij sobie mailem) — na nowym telefonie wczytasz go przyciskiem „Przywróć”.",
    backupBtn: "ZRÓB KOPIĘ ZAPASOWĄ",
    restoreBtn: "PRZYWRÓĆ Z KOPII",
    backupInvalid: "To nie jest poprawny plik kopii zapasowej Polska Adventure Ultra.",
    confirmRestore: (date, trainings, routes) =>
      `Przywrócić kopię z ${date}?\n\nZawiera: ${trainings} treningów i ${routes} tras.\n\nUWAGA: obecne treningi i trasy na tym telefonie zostaną zastąpione danymi z kopii.`,
    restoreDone: "Kopia przywrócona.",
    recommendTitle: "📱 Poleć aplikację",
    recommendText: "Pokaż ten kod znajomemu — zeskanuje go aparatem telefonu i od razu otworzy aplikację.",
    shareAppBtn: "WYŚLIJ LINK DO APLIKACJI",
    shareQrBtn: "UDOSTĘPNIJ KOD QR",
    shareAppText: "Polska Adventure Ultra — dziennik treningów: bieg, rower, kajak, pływanie i trekking:",
    appLinkCopied: "Link do aplikacji skopiowany do schowka.",
    helpHtml: (community, contact) => `
      ${contact ? `<p class="contact-box">✉️ Kontakt: <a href="mailto:${contact}">${contact}</a> — pytania, zgłoszenia błędów, prośby o usunięcie danych, zgłaszanie niestosownych treści.</p>` : ""}
      <details open><summary>🚀 Pierwsze kroki</summary>
        <ul>
          <li>Domyślny PIN to <b>1234</b> — zmień go od razu przyciskiem „Zmień PIN” na dole ekranu.</li>
          <li>Dodaj aplikację do ekranu głównego: <b>Android (Chrome)</b> — menu ⋮ → „Dodaj do ekranu głównego”; <b>iPhone (Safari)</b> — przycisk Udostępnij → „Do ekranu początkowego”.</li>
          <li>Po dodaniu aplikacja działa także bez internetu (poza mapami${community ? " i zakładką Aktywność" : ""}).</li>
        </ul>
      </details>
      <details><summary>🇵🇱 Wyzwanie 4000 km</summary>
        <ul>
          <li>Zakładka <b>Wyzwanie</b> jest dostępna dla wszystkich: pokazuje trasę 4000 km (start i meta: Lublin) i zasady. Licznik na mapie jest poglądowy — prawdziwy postęp widzą tylko uczestnicy.</li>
          <li>Zapisy ruszają we wrześniu 2027. Po dołączeniu ekran pokazuje Twój postęp: kilometry w każdej dyscyplinie, miejsce na trasie i prognozę mety.</li>
          <li>Masz kod zaproszenia od organizatora? Kliknij „Masz kod zaproszenia?” pod przyciskiem zapisów — po wpisaniu kodu możesz dołączyć wcześniej. Kod działa tylko na jednym telefonie (przy zmianie telefonu przywróć kopię zapasową albo poproś organizatora o zwolnienie kodu). Jeśli organizator wycofa kod, udział w wyzwaniu zostanie zakończony (treningi zostają w Historii).</li>
          <li>Do postępu liczą się <b>tylko odcinki wyzwania</b>: przy zapisie treningu zaznacz „🏁 Odcinek wyzwania 4000 km”, a w Historii możesz oznaczyć lub odznaczyć trening przyciskiem 🏁. Codzienne treningi gdzie indziej trafiają tylko do Historii. Wyzwanie to bieg, rower i kajak — pływanie i trekking się do niego nie liczą (nie mają pola 🏁).</li>
          <li>Po rezygnacji ekran wraca do widoku dla obserwatorów; treningi zostają w Historii.</li>
        </ul>
      </details>
      <details><summary>🏃 Zapisywanie treningu</summary>
        <ul>
          <li>W zakładce <b>Trening</b> wybierz dyscyplinę, wpisz dystans (wymagany) i pozostałe dane, kliknij „ZAPISZ TRENING”.</li>
          <li>Dyscypliny: bieg, rower, kajak, pływanie (basen albo wody otwarte: jezioro, rzeka, morze) i trekking. Dystans pływania też wpisujesz w km (1500 m = 1.5).</li>
          <li>„OBLICZ TEMPO” pokazuje tempo w min/km (bieg), tempo na 100 m (pływanie) albo prędkość w km/h (rower, kajak, trekking); „POKAŻ WYKRES PROGRESU” rysuje wykres dystansów.</li>
        </ul>
      </details>
      <details><summary>⌚ Import z zegarka (Garmin / Suunto / Polar)</summary>
        <ul>
          <li><b>Garmin Connect</b> (www): otwórz aktywność → ikona koła zębatego → „Eksportuj do GPX” lub „Eksportuj do TCX”.</li>
          <li><b>Suunto app</b>: Dziennik → trening → ⋮ / Udostępnij → Eksportuj → GPX.</li>
          <li><b>Polar Flow</b> (www): otwórz trening → „Eksportuj sesję” → GPX lub TCX.</li>
          <li>W aplikacji kliknij „IMPORTUJ Z GARMIN / SUUNTO / POLAR”, wybierz plik, sprawdź dane i kliknij „ZAPISZ TRENING”. Trasa zapisze się razem z treningiem.</li>
        </ul>
      </details>
      <details><summary>📋 Historia</summary>
        <ul>
          <li><b>🎯 Cele</b>: „＋ DODAJ CEL” ustawia cel tygodniowy lub miesięczny w km — dla jednej dyscypliny albo wszystkich razem. Pasek pokazuje postęp, ile km i dni zostało; po zapisaniu treningu, który domyka cel, pojawi się gratulacja. Tydzień liczy się od poniedziałku.</li>
          <li><b>Podsumowanie</b> na górze zakładki: liczba treningów, dystans, czas i przewyższenie w wybranym okresie (tydzień, miesiąc, rok, od początku), porównanie z poprzednim okresem i rozbicie na dyscypliny.</li>
          <li><b>🔥 Passa</b> to liczba kolejnych dni z treningiem. Obecna passa trwa, jeśli ostatni trening był dziś albo wczoraj.</li>
          <li><b>🏆 Rekordy osobiste</b> dla każdej dyscypliny: najdłuższy dystans i czas, najszybsze tempo (bieg) lub prędkość (rower, kajak), największe przewyższenie, a także najlepszy tydzień i miesiąc. Tempo i prędkość liczą się dla treningów od 1 km z wpisanym czasem.</li>
          <li>🗺 — pokazuje trasę treningu na mapie wraz z profilem wysokości (dla treningów zaimportowanych z pliku).</li>
          <li>🗑 — usuwa wpis (po potwierdzeniu).</li>
          ${community ? "<li>📤 — udostępnia trening w zakładce Aktywność; 🌍 oznacza, że trening jest udostępniony (kliknij, aby cofnąć udostępnienie).</li>" : ""}
        </ul>
      </details>
      <details><summary>🗺 Planowanie tras i nawigacja w zegarku</summary>
        <ul>
          <li>W zakładce <b>Trasy</b> klikaj na mapie kolejne punkty. Wybierz prowadzenie: szlaki piesze i górskie (bieg, trekking), drogi rowerowe albo linia prosta (kajak, pływanie, teren).</li>
          <li>„Cofnij punkt” usuwa ostatni punkt, „Wyczyść” — całą trasę. „ZAPISZ TRASĘ” zapisuje ją na liście poniżej mapy.</li>
          <li>„EKSPORTUJ DO GPX” (lub przycisk GPX przy zapisanej trasie) tworzy plik do zegarka. Na telefonie otworzy się menu „Udostępnij”.</li>
          <li><b>Garmin</b>: Garmin Connect (www) → Trening → Trasy → Importuj → wyślij na zegarek. <b>Suunto</b>: otwórz plik GPX w Suunto app i zsynchronizuj zegarek. <b>Polar</b>: Polar Flow (www) → Ulubione → Trasy → Importuj → synchronizuj.</li>
          <li>Wyznaczanie trasy po drogach wymaga internetu (darmowy serwis BRouter — wysyłane są wyłącznie współrzędne klikniętych punktów). Bez internetu odcinki będą liniami prostymi.</li>
        </ul>
      </details>
      <details><summary>⛰ Profil wysokości</summary>
        <ul>
          <li>Pod mapą trasy pokazuje się wykres wysokości: na osi poziomej dystans, na pionowej wysokość n.p.m.</li>
          <li>Pod wykresem: <b>↗ podejścia</b> i <b>↘ zejścia</b> (suma metrów w górę i w dół) oraz najniższy i najwyższy punkt trasy.</li>
          <li>Gdzie go zobaczysz: w <b>Historii</b> po kliknięciu 🗺 przy zaimportowanym treningu, w zakładce <b>Trasy</b> na bieżąco podczas wyznaczania trasy${community ? ", przy podglądzie tras społeczności i udostępnionych aktywności w zakładce Aktywność oraz w „📊 Wyniki” wydarzeń" : ""}.</li>
          <li>Wysokość jest odczytywana z pliku GPX/TCX z zegarka. Treningi zaimportowane przed dodaniem tej funkcji nie mają wysokości — usuń taki wpis i zaimportuj plik ponownie. Aktywności udostępnione przed 4.11.2026 nie mają profilu — cofnij udostępnienie i udostępnij ponownie.</li>
          <li>Trasy wyznaczane linią prostą (kajak / teren) oraz pliki bez danych o wysokości nie mają wykresu.</li>
        </ul>
      </details>
      ${community ? `<details><summary>🌍 Aktywność i społeczność</summary>
        <ul>
          <li>Zakładka <b>Aktywność</b> pokazuje statystyki społeczności i treningi udostępnione przez innych użytkowników.</li>
          <li><b>📅 Wydarzenia</b> (na górze zakładki): wspólne treningi, spływy i rajdy ogłaszane przez organizatora. „🙋 Biorę udział” zapisuje Cię anonimowo — widać tylko liczbę chętnych; kliknij ponownie, żeby się wypisać. „📍 Dojazd” otwiera nawigację do miejsca zbiórki, „📆 Do kalendarza” dodaje wydarzenie do kalendarza w telefonie. Gdy wydarzenie się zacznie, pojawi się „🏁 Zrobione” z liczbą osób, które je ukończyły. Po kliknięciu sam decydujesz, czy pokazać innym, że masz je za sobą — z nickiem albo anonimowo — czy zostawić to tylko u siebie. Aplikacja otworzy formularz treningu z dyscypliną i datą; gdy go zapiszesz, Twój wynik (dystans, czas i profil wysokości z importu z zegarka) pojawi się przy wydarzeniu, a jeśli wybrałeś „pokaż”, także w „📊 Wyniki” dla wszystkich — w kolejności ukończenia, bez rankingu. Mapy trasy nie udostępniamy. Zakończone wydarzenia widać jeszcze 7 dni w sekcji „🏁 Zakończone”, a Twoje ukończone zostają w liście „🏅 Twoje ukończone wydarzenia” (także w kopii zapasowej).</li>
          <li>Udostępniasz tylko wtedy, gdy sam klikniesz 📤 przy treningu. Wybierasz dowolny nick (1–30 znaków).</li>
          <li><b>Trasy społeczności:</b> zaplanowaną trasę udostępnisz przyciskiem 📤 przy zapisanej trasie w zakładce Trasy. Przy trasach innych osób: 🗺 — podgląd na mapie, GPX — pobranie do zegarka, ➕ — kopia do Twoich tras (możesz ją dalej edytować).</li>
          <li>Swój wpis usuniesz przyciskiem 🗑 w Aktywności, przyciskiem 🌍 w Historii lub w Trasach albo wszystkie naraz w oknie „Prywatność”.</li>
          <li>Możliwość usunięcia wpisu jest zapisana na tym telefonie — po wyczyszczeniu danych przeglądarki lub zmianie telefonu usuniesz go już tylko przez kontakt z administratorem.</li>
        </ul>
      </details>` : ""}
      <details><summary>💾 Twoje dane, kopia zapasowa i zmiana telefonu</summary>
        <ul>
          <li>Treningi i trasy są zapisane <b>tylko na tym telefonie</b>. Wyczyszczenie danych przeglądarki, odinstalowanie aplikacji albo zgubienie telefonu oznacza ich utratę — dlatego rób kopię regularnie, np. raz w tygodniu.</li>
          <li>W zakładce <b>Historia</b> kliknij „ZRÓB KOPIĘ ZAPASOWĄ”. Na telefonie otworzy się menu „Udostępnij” — zapisz plik na Dysku Google / iCloud albo wyślij go sobie mailem. Na komputerze plik trafi do folderu Pobrane.</li>
          <li>Kopia zawiera treningi (z trasami), zaplanowane trasy, cele, motyw, język i nick${community ? " oraz klucze pozwalające usuwać Twoje udostępnienia" : ""}. <b>PIN nie jest zapisywany</b> w kopii.</li>
          <li><b>Nowy telefon:</b> otwórz aplikację, zaloguj się, w zakładce <b>Historia</b> kliknij „PRZYWRÓĆ Z KOPII” i wybierz plik <code>pau-kopia-….json</code>. Aplikacja pokaże datę kopii i liczbę treningów — po potwierdzeniu dane z kopii <b>zastąpią</b> obecne dane na telefonie.</li>
          <li>Plik kopii zawiera Twoje trasy (miejsca treningów) — przechowuj go tak jak inne prywatne pliki i nie udostępniaj publicznie.</li>
          <li>Każdy telefon i każda przeglądarka mają osobną historię.</li>
          <li>„EKSPORTUJ DO CSV” w zakładce Trening tworzy dodatkowo plik do Excela (bez tras) — przydatny do własnych zestawień, ale nie da się go wczytać z powrotem.</li>
        </ul>
      </details>
      <details><summary>🔒 Bezpieczeństwo</summary>
        <ul>
          <li>PIN chroni przed przypadkowym podejrzeniem aplikacji na Twoim telefonie, ale nie szyfruje danych — zabezpieczaj też sam telefon (blokada ekranu).</li>
          <li>Nie używaj jako PIN-u kodu do karty, banku ani telefonu.</li>
          ${community ? `<li>Udostępnione treningi widzi <b>każdy</b> użytkownik aplikacji. Jeśli nie chcesz być rozpoznany, nie używaj imienia i nazwiska jako nicku.</li>
          <li>Udostępniona zaplanowana trasa jest widoczna <b>w całości</b> (żeby inni mogli z niej nawigować) — jeśli zaczyna się pod Twoim domem, przesuń start przed udostępnieniem.</li>
          <li>Przy udostępnianiu treningu aplikacja obcina pierwsze i ostatnie 300 m trasy, ale jeśli trening zaczynasz i kończysz pod domem w małej miejscowości, rozważ udostępnienie go bez trasy (np. trening wpisany ręcznie).</li>
          <li>Treści obraźliwe lub naruszające prywatność zgłoś administratorowi (adres na górze Pomocy).</li>` : ""}
          <li>Aplikacja nigdy nie prosi o hasło do Garmin, Suunto ani Polar — pliki importujesz sam.</li>
        </ul>
      </details>
      <details><summary>⚖️ RODO w skrócie</summary>
        <ul>
          <li>Domyślnie nic nie jest wysyłane na żaden serwer.</li>
          ${community ? `<li>Na serwer (Supabase, Unia Europejska) trafia tylko to, na co się zgodzisz: losowy identyfikator do liczenia użytkowników oraz treningi, które sam udostępnisz.</li>
          <li>Zgodę na statystyki możesz wycofać w każdej chwili w oknie „Prywatność” — identyfikator zostanie usunięty z serwera.</li>` : ""}
          <li>Szczegóły — przycisk poniżej.</li>
        </ul>
      </details>
      <details><summary>© Prawa autorskie</summary>
        <ul>
          <li>Aplikacja Polska Adventure Ultra — jej kod, wygląd, nazwa, logo i treści — jest chroniona prawem autorskim. © 2026 Polska Adventure Ultra. Wszelkie prawa zastrzeżone.</li>
          <li>Kopiowanie, modyfikowanie lub wykorzystywanie aplikacji albo jej części bez pisemnej zgody jest zabronione.</li>
          <li>Z aplikacji możesz oczywiście swobodnie korzystać i polecać ją innym.${contact ? ` W sprawie zgody na inne wykorzystanie napisz na ${contact}.` : ""}</li>
          <li>Logotypy partnerów należą do ich właścicieli i są pokazywane za ich zgodą.</li>
        </ul>
      </details>`,
    communityRoutesTitle: "Trasy społeczności",
    communityRoutesHint: "Swoją zaplanowaną trasę udostępnisz przyciskiem 📤 w zakładce Trasy.",
    noCommunityRoutes: "Nikt jeszcze nie udostępnił trasy.",
    statRoutes: "udostępnionych tras",
    shareRouteTitle: "Udostępnij trasę społeczności",
    unshareRouteTitle: "Udostępniona — kliknij, aby przestać udostępniać",
    copyRouteTitle: "Kopiuj do moich tras",
    shareRouteConfirm:
      "Udostępnić tę trasę wszystkim użytkownikom aplikacji?\n\n" +
      "Widoczne będą: Twój nick, nazwa trasy, dystans i CAŁA trasa na mapie (inni mogą ją pobrać do zegarka).\n" +
      "Jeśli trasa zaczyna się lub kończy pod Twoim domem, najpierw przesuń start/metę. Możesz to w każdej chwili usunąć.",
    routeSharedMsg: "Trasa udostępniona! Zobaczysz ją w zakładce Aktywność.",
    confirmUnshareRoute: "Przestać udostępniać tę trasę?",
    routeCopied: (name) => `Skopiowano „${name}” do Twoich tras (zakładka Trasy).`,
    modeNames: { "hiking-mountain": "pieszo", trekking: "rower", straight: "linia prosta" },
    tabActivity: "Aktywność",
    consentText: "Czy możemy anonimowo liczyć, ile osób korzysta z aplikacji? Wysyłamy tylko losowy identyfikator urządzenia — bez imienia, treningów i lokalizacji.",
    consentYes: "Zgadzam się",
    consentNo: "Nie, dziękuję",
    privacyMore: "Szczegóły (prywatność)",
    privacyBtn: "Prywatność",
    privacyTitle: "Prywatność",
    statsToggle: "Anonimowe liczenie użytkowników",
    deleteMySharesBtn: "USUŃ WSZYSTKIE MOJE UDOSTĘPNIENIA (AKTYWNOŚCI I TRASY)",
    closeBtn: "Zamknij",
    communityTitle: "Społeczność",
    activityTitle: "Udostępnione aktywności",
    activityHint: "Swój trening udostępnisz przyciskiem 📤 w zakładce Historia.",
    statUsers: "użytkowników",
    statActive: "aktywnych w 7 dni",
    statActivities: "udostępnionych aktywności",
    statKm: "km społeczności",
    noActivities: "Nikt jeszcze nic nie udostępnił — bądź pierwszy!",
    communityOff: "Funkcje społeczności nie są jeszcze skonfigurowane.",
    communityError: "Nie udało się połączyć z serwerem (sprawdź internet).",
    loading: "Wczytywanie…",
    shareTitle: "Udostępnij w zakładce Aktywność",
    unshareTitle: "Udostępnione — kliknij, aby usunąć z Aktywności",
    shareConfirm: (hasRoute) =>
      "Udostępnić ten trening wszystkim użytkownikom aplikacji?\n\n" +
      "Widoczne będą: Twój nick, dyscyplina, data, dystans i czas" +
      (hasRoute ? " oraz trasa na mapie (bez pierwszych i ostatnich 300 m, żeby nie zdradzać np. adresu domu)." : ".") +
      "\nTętno, waga, VO2max i notatki NIE są wysyłane. Możesz to w każdej chwili usunąć.",
    promptNick: "Twój nick (widoczny dla wszystkich, 1–30 znaków):",
    nickInvalid: "Nick musi mieć od 1 do 30 znaków.",
    shared: "Udostępniono! Zobaczysz to w zakładce Aktywność.",
    confirmUnshare: "Usunąć to udostępnienie z zakładki Aktywność?",
    unshared: "Usunięto z Aktywności.",
    deleteFailed: "Nie udało się usunąć (sprawdź internet i spróbuj ponownie).",
    confirmDeleteAllShares: "Usunąć wszystkie Twoje udostępnione aktywności i trasy z serwera?",
    deletedAllShares: (n) => `Usunięto udostępnienia: ${n}.`,
    noShares: "Nie masz nic udostępnionego.",
    mineLabel: "(Ty)",
    privacyHtml: (contact, community) => `
      ${contact ? `<p class="contact-box">✉️ Administrator danych / kontakt: <a href="mailto:${contact}">${contact}</a></p>` : ""}
      <p>Aplikacja domyślnie trzyma wszystkie dane (treningi, trasy, PIN) <b>tylko na Twoim telefonie</b>.</p>
      <p><b>Usługi zewnętrzne:</b> podczas oglądania map telefon pobiera kafelki z serwerów OpenStreetMap, a przy wyznaczaniu trasy po drogach wysyła współrzędne klikniętych punktów do darmowego serwisu BRouter (brouter.de). Serwery te, jak każda strona internetowa, widzą adres IP Twojego urządzenia. Nie są im przekazywane żadne inne dane.</p>
      ${community ? `<p>Na serwer aplikacji trafiają wyłącznie dane, na które się zgodzisz:</p>
      <ul>
        <li><b>Statystyki użytkowników</b> (tylko za zgodą): losowy identyfikator urządzenia i czas ostatniego użycia aplikacji. Cel: policzenie, ile osób korzysta z aplikacji (łącznie i w danym okresie). Liczymy tylko liczby — identyfikator nie jest powiązany z imieniem, nickiem ani treningami. Usuwany po 13 miesiącach braku aktywności lub od razu po wyłączeniu zgody.</li>
        <li><b>Udostępnione aktywności</b> (tylko te, które sam udostępnisz): nick, dyscyplina, data, dystans, czas i trasa (z wysokością n.p.m., jeśli trening ją ma) bez pierwszych/ostatnich 300 m. Nie są powiązane z identyfikatorem urządzenia. Przechowywane do czasu, aż je usuniesz. Widoczne dla wszystkich użytkowników aplikacji.</li>
        <li><b>Udostępnione trasy</b> (tylko te, które sam udostępnisz): nick, nazwa trasy, rodzaj, dystans i cała trasa. Nie są powiązane z identyfikatorem urządzenia. Przechowywane do czasu, aż je usuniesz. Widoczne dla wszystkich i możliwe do pobrania przez innych użytkowników.</li>
        <li><b>Zapisy na wydarzenia</b> (tylko gdy klikniesz „Biorę udział”): wyłącznie skrót (hash) losowego znacznika zapisanego na Twoim telefonie — bez nicku i identyfikatora urządzenia. Służy do policzenia chętnych i umożliwia wypisanie się. Usuwany po wypisaniu się albo razem z wydarzeniem, najpóźniej 30 dni po jego terminie.</li>
        <li><b>Ukończenie wydarzenia</b> (tylko gdy po kliknięciu „Zrobione” wybierzesz „pokaż wszystkim”): skrót (hash) losowego znacznika z Twojego telefonu, a po zapisaniu treningu także Twój wynik: dystans, czas, profil wysokości (wysokość względem przebytych kilometrów — bez współrzędnych i mapy trasy) oraz nick, jeśli wybrałeś „Pokaż z nickiem”. Służy do pokazania liczby osób, które ukończyły wydarzenie, i listy wyników. Usunięcie treningu z Historii usuwa też wynik z serwera. Usuwany po cofnięciu albo razem z wydarzeniem, najpóźniej 30 dni po jego terminie.</li>
      </ul>
      <p>Podstawa prawna: Twoja zgoda (art. 6 ust. 1 lit. a RODO) — możesz ją wycofać w dowolnym momencie poniżej. Dane są przechowywane w usłudze Supabase w Unii Europejskiej; dostawca, jak każdy serwer, technicznie rejestruje adresy IP w logach.</p>
      ` : ""}
      <p>Masz prawo dostępu do danych, ich usunięcia i wniesienia skargi do Prezesa UODO.${contact ? ` W tych sprawach napisz na adres podany na górze.` : ""}</p>`,
  },
  en: {
    loginBtn: "Log in",
    invalidPin: "Invalid PIN",
    tabTrain: "Training",
    tabHistory: "History",
    labelDiscipline: "Discipline",
    optBieg: "Running",
    optRower: "Cycling",
    optKajak: "Kayaking",
    optBasen: "Swimming – pool",
    optWodyOtwarte: "Swimming – open water",
    optTrekking: "Hiking",
    distSwimPlaceholder: "e.g. 1.5 = 1500 m",
    labelDate: "Date",
    labelDist: "Distance (km)",
    labelTime: "Time (min)",
    labelHr: "Avg. heart rate (bpm)",
    labelVo2max: "VO2max",
    labelWeight: "Weight (kg)",
    labelNotes: "Notes / How you felt",
    saveBtn: "SAVE TRAINING",
    paceBtn: "CALCULATE PACE",
    chartBtn: "SHOW PROGRESS CHART",
    exportBtn: "EXPORT TO CSV",
    importBtn: "IMPORT FROM GARMIN / SUUNTO / POLAR",
    importHint: "Export your training from Garmin Connect, Suunto app or Polar Flow as a GPX or TCX file, then load it here.",
    chartTitle: "Distance progress",
    historyTitle: "Training history",
    themeBtn: "Switch theme",
    pinChangeBtn: "Change PIN",
    langBtnTarget: "PL",
    totalLabel: (km) => `🏅 Total: ${km} km`,
    noHistory: "No saved trainings yet.",
    deleteTitle: "Delete entry",
    confirmDelete: "Delete this entry from history?",
    alertDistRequired: "Enter a distance greater than 0.",
    alertSaved: "Training saved!",
    alertTimeRequired: "Enter a time greater than 0.",
    paceResult: (min, sec) => `Pace: ${min}:${sec} min/km`,
    speedResult: (v) => `Speed: ${v} km/h`,
    swimPaceResult: (pace) => `Pace: ${pace}`,
    alertNoHistoryChart: "No historical data.",
    alertNoHistoryExport: "No data to export.",
    importSuccess: (p) =>
      `Training loaded from file:\nDate: ${p.date}\nDistance: ${p.dist} km\n` +
      `Time: ${p.time} min\nAvg. HR: ${p.hr} bpm\n\nCheck the data and click "SAVE TRAINING".`,
    importError: (msg) => `Import error: ${msg}`,
    errNoGpxPoints: "No track points found in the GPX file.",
    errNoTcxData: "No training data found in the TCX file.",
    errBadXml: "Could not read the file (invalid XML).",
    promptNewPin: "Enter new PIN:",
    pinChanged: "PIN changed.",
    historyLabels: { date: "Date", disc: "Discipline", dist: "Distance", weight: "Weight", hr: "HR", vo2max: "VO2max", notes: "Notes" },
    discNames: { Bieg: "Running", Rower: "Cycling", Kajak: "Kayaking", Basen: "Swimming – pool", WodyOtwarte: "Swimming – open water", Trekking: "Hiking", Multi: "Multisport" },
    routeTitle: "Route",
    showRouteTitle: "Show route",
    tabPlan: "Routes",
    planTitle: "Plan a route",
    planHint: "Tap the map to add route points. Save the finished route, export it to GPX and upload it to your watch.",
    planModeLabel: "Route guidance",
    planModeFoot: "Follow footpaths and mountain trails (running, hiking)",
    planModeBike: "Follow cycle roads (cycling)",
    planModeStraight: "Straight lines (kayak, swimming, off-road)",
    planUndoBtn: "Undo point",
    planClearBtn: "Clear",
    planSaveBtn: "SAVE ROUTE",
    planExportBtn: "EXPORT TO GPX (WATCH)",
    planExportHint: "Garmin: Garmin Connect (web) → Training → Courses → Import. Suunto: open the GPX file in the Suunto app. Polar: Polar Flow (web) → Favorites → Routes → Import.",
    savedRoutesTitle: "Saved routes",
    noSavedRoutes: "No saved routes yet.",
    planStats: (km, n) => `Distance: ${km} km · points: ${n}`,
    planStatsAscent: (m) => ` · ascent: ${m} m`,
    planRouting: "Calculating route…",
    planRoutingError: "Could not route along roads (no internet or point off-road) — this section is a straight line.",
    planNeedPoints: "Add at least 2 points on the map.",
    promptRouteName: "Route name:",
    defaultRouteName: "My route",
    routeSaved: "Route saved!",
    confirmDeleteRoute: "Delete this route?",
    editRouteTitle: "Edit route",
    exportRouteTitle: "Export to GPX",
    helpBtn: "Help",
    helpTitle: "Help and guide",
    helpPrivacyBtn: "FULL PRIVACY INFORMATION (GDPR)",
    copyrightLine: "© 2026 Polska Adventure Ultra · All rights reserved",
    tabChallenge: "Challenge",
    challengeJoinTitle: "The 4000 km challenge",
    challengeJoinText: "4000 km around Poland — running, cycling and kayaking. Start and finish in Lublin. Participants see their progress here: kilometres, their place on the route and a finish forecast.",
    chSignupSoon: "SIGN-UPS OPEN IN SEPTEMBER 2027",
    chDemoSub: "of 4000 km",
    chInviteLink: "Have an invitation code?",
    promptInvite: "Enter your challenge invitation code:",
    inviteInvalid: "The code is invalid or has already been used on another device.",
    inviteOk: "Code accepted — you can join the challenge.",
    inviteRevoked: "Your challenge invitation was withdrawn or moved to another device. Your trainings stay in History.",
    chPartners: "PROJECT PARTNERS",
    chPartnerCta: "Become a partner →",
    chParticipantsOnly: "Live progress is visible only to challenge participants.",
    chSignupSoonHint: "Until then you can follow the challenge and join group trainings.",
    challengeJoinBtn: "JOIN THE CHALLENGE",
    challengeStartLabel: "Start of your challenge",
    challengeStartHint: "Challenge days are counted from this date. Only running, cycling and kayaking trainings marked 🏁 as a challenge stage count towards progress (checkbox when saving a training or the 🏁 button in History).",
    challengeFlagLabel: "🏁 4000 km challenge stage (counts towards challenge progress)",
    flagOnTitle: "Challenge stage — tap to unmark",
    flagOffTitle: "Mark as a 4000 km challenge stage",
    challengeLeaveBtn: "Leave the challenge",
    confirmLeaveChallenge: "Leave the challenge? Your progress will no longer be tracked (your trainings stay in History).",
    chOf: (pct) => `of 4,000 km · ${pct}%`,
    chWeek: "THIS WEEK",
    chStreak: (n) => `${n} ${n === 1 ? "day" : "days"} in a row`,
    chNoStreak: "Add a training today to start a streak",
    chH1: "4000 km<br>around Poland",
    chMeta: "CHALLENGE · RUN · BIKE · KAYAK",
    chNow: (day) => `start and finish: Lublin<br>day ${day} of the challenge`,
    chStatDays: "days in",
    chStatAvg: "km per day",
    chStatEta: "finish ~",
    eventsTitle: "📅 Events",
    eventsHint: "Group trainings, kayak trips and races. Tap “I'm going” so the organiser knows how many people to expect.",
    noEvents: "No events planned — check back later.",
    optMulti: "Multisport",
    eventFormTitle: "New event",
    eventTitleLabel: "Name",
    eventStartLabel: "Date and time",
    eventPlaceLabel: "Meeting point",
    eventMapHint: "Optional: tap the exact meeting point on the map (participants get a navigation link).",
    eventDescLabel: "Description (distance, pace, what to bring…)",
    eventLinkLabel: "Link (optional, e.g. a Facebook event)",
    eventSaveBtn: "Publish",
    eventAddBtn: "＋ ADD EVENT",
    organizerLogin: "🔑 Organiser",
    organizerLogout: "🔑 Log out organiser",
    promptAdminKey: "Enter the organiser key:",
    adminKeyInvalid: "Invalid organiser key.",
    adminLoggedIn: "Organiser mode on — you can add and delete events.",
    eventMissingFields: "Fill in the name, date and time, and meeting point.",
    eventLinkInvalid: "The link must start with https://",
    eventPublished: "Event published!",
    confirmDeleteEvent: "Delete this event? It will disappear for all users.",
    joinBtn: (n) => `🙋 I'm going · ${n}`,
    joinedBtn: (n) => `✅ You're going · ${n}`,
    joinTitle: "Sign up — the organiser only sees the number of people",
    leaveTitle: "Tap to cancel",
    eventNavigate: "📍 Directions",
    eventLink: "🔗 Details",
    eventCalendar: "📆 Add to calendar",
    eventToday: "today",
    eventTomorrow: "tomorrow",
    eventInDays: (n) => `in ${n} days`,
    eventDoneBtn: (n) => `🏁 Done · ${n}`,
    eventDoneMark: (n) => `✅ Completed · ${n}`,
    eventDoneTitle: "Mark this event as completed — the number shows how many people completed it",
    eventDoneDialogTitle: "Congratulations! 🎉",
    eventDoneDialogText: "Show everyone that you completed this event? Together with your result: distance, time and elevation profile (no route map).",
    eventDoneShareBtn: "👥 Show with my nickname",
    eventDoneShareAnonBtn: "👥 Show anonymously",
    eventDoneLocalBtn: "🔒 Only on my phone",
    eventDoneCancelBtn: "Cancel",
    eventDoneShareFailed: "Could not send to the server (check your connection) — saved only on your phone.",
    eventDoneFillTraining: (title) => `📅 ${title} — fill in distance and time so the training lands in your History (or skip it if you import it from your watch).`,
    hintCloseLabel: "Close",
    eventDoneSharedTag: "(visible to everyone)",
    eventYourResult: "🏁 Your result:",
    eventResultsBtn: (n) => `📊 Results · ${n}`,
    eventResultsTitle: (title) => `📊 Results — ${title}`,
    eventResultsEmpty: "Nobody has posted a result yet.",
    eventResultsAnon: "Anonymous",
    eventResultsProfile: "📈 Profile",
    eventResultsClose: "Close",
    eventNoResult: "No training from that day in your History — save it and the distance will show up here.",
    eventWent: (n) => `🙋 Signed up: ${n}`,
    eventsPastTitle: "🏁 Finished (last 7 days)",
    eventUndoneTitle: "Tap to undo",
    eventsDoneTitle: (n) => `🏅 Your completed events (${n})`,
    eventDoneRemoveTitle: "Remove from completed events",
    dateLocale: "en-GB",
    goalsTitle: "🎯 Goals",
    goalsEmpty: "No goals yet. Set e.g. 30 km of running per week and track your progress.",
    goalAddBtn: "＋ ADD GOAL",
    goalPeriodLabel: "Period",
    goalWeek: "Weekly",
    goalMonth: "Monthly",
    goalAllDisc: "All disciplines",
    goalKmLabel: "Distance (km)",
    goalSaveBtn: "Save goal",
    goalCancelBtn: "Cancel",
    goalKmInvalid: "Enter the goal distance (greater than 0).",
    goalLabel: (period, disc) => `${period === "week" ? "Week" : "Month"} · ${disc}`,
    goalAll: "all disciplines",
    goalLeft: (km, days) => `${km} km to go · ${days} ${days === 1 ? "day" : "days"} left`,
    goalDone: "✅ Goal reached!",
    confirmDeleteGoal: "Delete this goal?",
    goalReached: (labels) => `🎯 Well done! Goal reached:\n${labels.join("\n")}`,
    summaryTitle: "Summary",
    periodWeek: "This week",
    periodMonth: "This month",
    periodYear: "This year",
    periodAll: "All time",
    summaryTrainings: "Trainings",
    summaryDistance: "Distance (km)",
    summaryTime: "Time",
    summaryAscent: "Ascent (m)",
    summaryEmpty: "No trainings in this period.",
    summaryCompare: (period, km, diff) =>
      `${{ week: "Previous week", month: "Previous month", year: "Previous year" }[period]}: ${km} km` +
      (diff !== null ? ` (${diff >= 0 ? "+" : ""}${diff} km)` : ""),
    summaryDiscLine: (name, count, km, time) => `<b>${name}</b>: ${count}× · ${km} km${time ? ` · ${time}` : ""}`,
    streakTitle: "🔥 Training streak",
    streakCurrent: "Current streak",
    streakBest: "Longest streak",
    days: (n) => `${n} ${n === 1 ? "day" : "days"}`,
    recordsTitle: "🏆 Personal records",
    recordsEmpty: "Save your first training to see records.",
    recordsOverall: "Overall",
    recLongestDist: "Longest distance",
    recLongestTime: "Longest time",
    recBestPace: "Fastest pace (1 km+)",
    recBestSwimPace: "Fastest pace (400 m+)",
    recBestSpeed: "Highest avg. speed (1 km+)",
    recMaxAscent: "Biggest ascent",
    recBestWeek: "Best week",
    recBestMonth: "Best month",
    recWeekOf: (date) => `from ${date}`,
    elevationTitle: "Elevation profile",
    elevationStats: (up, down, min, max) => `↗ ascent ${up} m · ↘ descent ${down} m · min ${min} m · max ${max} m a.s.l.`,
    backupTitle: "Backup",
    backupHint: "Trainings and routes are stored only on this phone. Make a backup and keep the file (e.g. on Google Drive or email it to yourself) — on a new phone, load it with the \"Restore\" button.",
    backupBtn: "MAKE A BACKUP",
    restoreBtn: "RESTORE FROM BACKUP",
    backupInvalid: "This is not a valid Polska Adventure Ultra backup file.",
    confirmRestore: (date, trainings, routes) =>
      `Restore the backup from ${date}?\n\nIt contains: ${trainings} trainings and ${routes} routes.\n\nWARNING: the current trainings and routes on this phone will be replaced with the backup data.`,
    restoreDone: "Backup restored.",
    recommendTitle: "📱 Recommend the app",
    recommendText: "Show this code to a friend — they scan it with the phone camera and the app opens right away.",
    shareAppBtn: "SEND A LINK TO THE APP",
    shareQrBtn: "SHARE THE QR CODE",
    shareAppText: "Polska Adventure Ultra — a training log for running, cycling, kayaking, swimming and hiking:",
    appLinkCopied: "App link copied to the clipboard.",
    helpHtml: (community, contact) => `
      ${contact ? `<p class="contact-box">✉️ Contact: <a href="mailto:${contact}">${contact}</a> — questions, bug reports, data deletion requests, reporting inappropriate content.</p>` : ""}
      <details open><summary>🚀 Getting started</summary>
        <ul>
          <li>The default PIN is <b>1234</b> — change it right away with “Change PIN” at the bottom of the screen.</li>
          <li>Add the app to your home screen: <b>Android (Chrome)</b> — menu ⋮ → “Add to Home screen”; <b>iPhone (Safari)</b> — Share button → “Add to Home Screen”.</li>
          <li>Once added, the app also works offline (except maps${community ? " and the Activity tab" : ""}).</li>
        </ul>
      </details>
      <details><summary>🇵🇱 The 4000 km challenge</summary>
        <ul>
          <li>The <b>Challenge</b> tab is open to everyone: it shows the 4000 km route (start and finish: Lublin) and the rules. The counter on the map is just an illustration — real progress is visible only to participants.</li>
          <li>Sign-ups open in September 2027. After joining, the screen shows your progress: kilometres per discipline, your place on the route and a finish forecast.</li>
          <li>Got an invitation code from the organiser? Tap “Have an invitation code?” below the sign-up button — after entering it you can join early. The code works on one phone only (when changing phones, restore your backup or ask the organiser to release the code). If the organiser withdraws the code, your participation ends (your trainings stay in History).</li>
          <li>Only <b>challenge stages</b> count towards progress: when saving a training tick “🏁 4000 km challenge stage”, and in History you can mark or unmark a training with the 🏁 button. Everyday trainings elsewhere go only to History. The challenge is running, cycling and kayaking — swimming and hiking don't count towards it (they have no 🏁 option).</li>
          <li>After leaving, the screen returns to the observer view; your trainings stay in History.</li>
        </ul>
      </details>
      <details><summary>🏃 Saving a training</summary>
        <ul>
          <li>In the <b>Training</b> tab choose a discipline, enter the distance (required) and other data, then tap “SAVE TRAINING”.</li>
          <li>Disciplines: running, cycling, kayaking, swimming (pool or open water: lake, river, sea) and hiking. Swimming distance is also entered in km (1500 m = 1.5).</li>
          <li>“CALCULATE PACE” shows pace per km (running), pace per 100 m (swimming) or speed in km/h (cycling, kayaking, hiking); “SHOW PROGRESS CHART” draws a distance chart.</li>
        </ul>
      </details>
      <details><summary>⌚ Import from your watch (Garmin / Suunto / Polar)</summary>
        <ul>
          <li><b>Garmin Connect</b> (web): open the activity → gear icon → “Export to GPX” or “Export to TCX”.</li>
          <li><b>Suunto app</b>: Diary → training → ⋮ / Share → Export → GPX.</li>
          <li><b>Polar Flow</b> (web): open the training → “Export session” → GPX or TCX.</li>
          <li>In the app tap “IMPORT FROM GARMIN / SUUNTO / POLAR”, choose the file, check the data and tap “SAVE TRAINING”. The route is saved with the training.</li>
        </ul>
      </details>
      <details><summary>📋 History</summary>
        <ul>
          <li><b>🎯 Goals</b>: “＋ ADD GOAL” sets a weekly or monthly distance goal in km — for one discipline or all of them together. The bar shows progress and how many km and days are left; saving a training that completes a goal shows a congratulation. Weeks start on Monday.</li>
          <li><b>Summary</b> at the top of the tab: number of trainings, distance, time and ascent in the chosen period (week, month, year, all time), comparison with the previous period and a breakdown by discipline.</li>
          <li><b>🔥 Streak</b> is the number of consecutive days with a training. The current streak continues as long as you train today or trained yesterday.</li>
          <li><b>🏆 Personal records</b> for each discipline: longest distance and time, fastest pace (running) or speed (cycling, kayaking), biggest ascent, plus your best week and month. Pace and speed count trainings of 1 km+ with time entered.</li>
          <li>🗺 — shows the training route on a map with its elevation profile (for trainings imported from a file).</li>
          <li>🗑 — deletes the entry (after confirmation).</li>
          ${community ? "<li>📤 — shares the training in the Activity tab; 🌍 means it is shared (tap to unshare).</li>" : ""}
        </ul>
      </details>
      <details><summary>🗺 Route planning and watch navigation</summary>
        <ul>
          <li>In the <b>Routes</b> tab tap the map to add points. Choose guidance: footpaths and mountain trails, cycle roads or straight lines (kayak, swimming, off-road).</li>
          <li>“Undo point” removes the last point, “Clear” the whole route. “SAVE ROUTE” adds it to the list below the map.</li>
          <li>“EXPORT TO GPX” (or the GPX button next to a saved route) creates a file for your watch. On a phone the Share menu opens.</li>
          <li><b>Garmin</b>: Garmin Connect (web) → Training → Courses → Import → send to device. <b>Suunto</b>: open the GPX file in the Suunto app and sync the watch. <b>Polar</b>: Polar Flow (web) → Favorites → Routes → Import → sync.</li>
          <li>Road routing needs internet (free BRouter service — only the coordinates of tapped points are sent). Offline, sections are straight lines.</li>
        </ul>
      </details>
      <details><summary>⛰ Elevation profile</summary>
        <ul>
          <li>An elevation chart is shown under the route map: distance on the horizontal axis, altitude above sea level on the vertical one.</li>
          <li>Below the chart: <b>↗ ascent</b> and <b>↘ descent</b> (total metres up and down) plus the lowest and highest point of the route.</li>
          <li>Where to find it: in <b>History</b> after tapping 🗺 on an imported training, in the <b>Routes</b> tab live while planning${community ? ", when previewing community routes and shared activities in the Activity tab, and under “📊 Results” of events" : ""}.</li>
          <li>Altitude is read from the GPX/TCX file from your watch. Trainings imported before this feature have no altitude — delete such an entry and import the file again. Activities shared before 4 Nov 2026 have no profile — unshare and share them again.</li>
          <li>Straight-line routes (kayak / off-road) and files without altitude data have no chart.</li>
        </ul>
      </details>
      ${community ? `<details><summary>🌍 Activity and community</summary>
        <ul>
          <li>The <b>Activity</b> tab shows community statistics and trainings shared by other users.</li>
          <li><b>📅 Events</b> (at the top of the tab): group trainings, kayak trips and races announced by the organiser. “🙋 I'm going” signs you up anonymously — only the number of people is shown; tap again to cancel. “📍 Directions” opens navigation to the meeting point, “📆 Add to calendar” adds the event to your phone's calendar. Once the event has started, “🏁 Done” appears with the number of people who completed it. When you tap it, you decide whether to show others that you completed it — with your nickname or anonymously — or keep it to yourself. The app opens the training form with discipline and date filled in; once you save it, your result (distance, time and the elevation profile from a watch import) appears next to the event, and if you chose to show it, also under “📊 Results” for everyone — in order of completion, no ranking. The route map is never shared. Finished events stay visible for 7 days under “🏁 Finished”, and yours stay in “🏅 Your completed events” (also in the backup).</li>
          <li>You share only when you tap 📤 next to a training yourself. Choose any nickname (1–30 characters).</li>
          <li><b>Community routes:</b> share a planned route with the 📤 button next to a saved route in the Routes tab. For other people's routes: 🗺 — map preview, GPX — download to your watch, ➕ — copy to your routes (you can edit it further).</li>
          <li>Delete your entry with 🗑 in Activity, 🌍 in History or Routes, or all at once in the “Privacy” window.</li>
          <li>The ability to delete an entry is stored on this phone — after clearing browser data or changing phones, it can only be removed by contacting the administrator.</li>
        </ul>
      </details>` : ""}
      <details><summary>💾 Your data, backup and changing phones</summary>
        <ul>
          <li>Trainings and routes are stored <b>only on this phone</b>. Clearing browser data, uninstalling the app or losing the phone means losing them — so make a backup regularly, e.g. once a week.</li>
          <li>In the <b>History</b> tab tap "MAKE A BACKUP". On a phone the Share menu opens — save the file to Google Drive / iCloud or email it to yourself. On a computer the file goes to the Downloads folder.</li>
          <li>The backup contains trainings (with routes), planned routes, goals, theme, language and nickname${community ? ", plus the keys that let you delete your shared items" : ""}. <b>The PIN is not stored</b> in the backup.</li>
          <li><b>New phone:</b> open the app, log in, in the <b>History</b> tab tap "RESTORE FROM BACKUP" and choose the <code>pau-kopia-….json</code> file. The app shows the backup date and number of trainings — after confirming, the backup data <b>replaces</b> the current data on the phone.</li>
          <li>The backup file contains your routes (training locations) — keep it like other private files and do not share it publicly.</li>
          <li>Each phone and each browser has its own history.</li>
          <li>“EXPORT TO CSV” in the Training tab additionally creates an Excel file (without routes) — handy for your own analysis, but it cannot be loaded back.</li>
        </ul>
      </details>
      <details><summary>🔒 Security</summary>
        <ul>
          <li>The PIN protects against someone casually opening the app on your phone, but it does not encrypt data — also lock your phone itself.</li>
          <li>Don't use your card, bank or phone code as the PIN.</li>
          ${community ? `<li>Shared trainings are visible to <b>every</b> app user. If you don't want to be recognised, don't use your full name as a nickname.</li>
          <li>A shared planned route is visible <b>in full</b> (so others can navigate it) — if it starts at your home, move the start before sharing.</li>
          <li>When sharing a training, the app cuts the first and last 300 m of the route, but if you start and finish at home in a small town, consider sharing without a route (e.g. a manually entered training).</li>
          <li>Report offensive content or privacy violations to the administrator (address at the top of Help).</li>` : ""}
          <li>The app never asks for your Garmin, Suunto or Polar password — you import files yourself.</li>
        </ul>
      </details>
      <details><summary>⚖️ GDPR in short</summary>
        <ul>
          <li>By default nothing is sent to any server.</li>
          ${community ? `<li>Only what you agree to goes to the server (Supabase, European Union): a random ID for counting users and the trainings you share yourself.</li>
          <li>You can withdraw consent to statistics at any time in the “Privacy” window — the ID will be deleted from the server.</li>` : ""}
          <li>Details — button below.</li>
        </ul>
      </details>
      <details><summary>© Copyright</summary>
        <ul>
          <li>The Polska Adventure Ultra app — its code, design, name, logo and content — is protected by copyright. © 2026 Polska Adventure Ultra. All rights reserved.</li>
          <li>Copying, modifying or using the app or any part of it without written permission is prohibited.</li>
          <li>You are of course free to use the app and recommend it to others.${contact ? ` For permission to use it in any other way, write to ${contact}.` : ""}</li>
          <li>Partner logos belong to their respective owners and are shown with their permission.</li>
        </ul>
      </details>`,
    communityRoutesTitle: "Community routes",
    communityRoutesHint: "Share your planned route with the 📤 button in the Routes tab.",
    noCommunityRoutes: "Nobody has shared a route yet.",
    statRoutes: "shared routes",
    shareRouteTitle: "Share route with the community",
    unshareRouteTitle: "Shared — click to stop sharing",
    copyRouteTitle: "Copy to my routes",
    shareRouteConfirm:
      "Share this route with all app users?\n\n" +
      "Visible: your nickname, route name, distance and the WHOLE route on a map (others can download it to their watch).\n" +
      "If the route starts or ends at your home, move the start/finish first. You can delete it at any time.",
    routeSharedMsg: "Route shared! You'll see it in the Activity tab.",
    confirmUnshareRoute: "Stop sharing this route?",
    routeCopied: (name) => `Copied “${name}” to your routes (Routes tab).`,
    modeNames: { "hiking-mountain": "on foot", trekking: "bike", straight: "straight line" },
    tabActivity: "Activity",
    consentText: "May we anonymously count how many people use the app? We only send a random device ID — no name, trainings or location.",
    consentYes: "I agree",
    consentNo: "No, thanks",
    privacyMore: "Details (privacy)",
    privacyBtn: "Privacy",
    privacyTitle: "Privacy",
    statsToggle: "Anonymous user counting",
    deleteMySharesBtn: "DELETE ALL MY SHARES (ACTIVITIES AND ROUTES)",
    closeBtn: "Close",
    communityTitle: "Community",
    activityTitle: "Shared activities",
    activityHint: "Share your training with the 📤 button in the History tab.",
    statUsers: "users",
    statActive: "active in 7 days",
    statActivities: "shared activities",
    statKm: "community km",
    noActivities: "Nobody has shared anything yet — be the first!",
    communityOff: "Community features are not configured yet.",
    communityError: "Could not connect to the server (check your internet).",
    loading: "Loading…",
    shareTitle: "Share in the Activity tab",
    unshareTitle: "Shared — click to remove from Activity",
    shareConfirm: (hasRoute) =>
      "Share this training with all app users?\n\n" +
      "Visible: your nickname, discipline, date, distance and time" +
      (hasRoute ? " and the route on a map (without the first and last 300 m, so it doesn't reveal e.g. your home address)." : ".") +
      "\nHeart rate, weight, VO2max and notes are NOT sent. You can delete it at any time.",
    promptNick: "Your nickname (visible to everyone, 1–30 characters):",
    nickInvalid: "Nickname must be 1 to 30 characters.",
    shared: "Shared! You'll see it in the Activity tab.",
    confirmUnshare: "Remove this from the Activity tab?",
    unshared: "Removed from Activity.",
    deleteFailed: "Could not delete (check your internet and try again).",
    confirmDeleteAllShares: "Delete all your shared activities and routes from the server?",
    deletedAllShares: (n) => `Deleted shares: ${n}.`,
    noShares: "You have nothing shared.",
    mineLabel: "(you)",
    privacyHtml: (contact, community) => `
      ${contact ? `<p class="contact-box">✉️ Data controller / contact: <a href="mailto:${contact}">${contact}</a></p>` : ""}
      <p>By default the app keeps all data (trainings, routes, PIN) <b>only on your phone</b>.</p>
      <p><b>External services:</b> when viewing maps the phone downloads tiles from OpenStreetMap servers, and when routing along roads it sends the coordinates of tapped points to the free BRouter service (brouter.de). Like any website, these servers see your device's IP address. No other data is shared with them.</p>
      ${community ? `<p>Only data you agree to is sent to the app's server:</p>
      <ul>
        <li><b>User statistics</b> (only with consent): a random device ID and the time of last use. Purpose: counting how many people use the app (in total and over a given period). Only numbers are counted — the ID is not linked to any name, nickname or training. Deleted after 13 months of inactivity or immediately when you withdraw consent.</li>
        <li><b>Shared activities</b> (only those you share yourself): nickname, discipline, date, distance, time and the route (with altitude, if the training has it) without the first/last 300 m. Not linked to the device ID. Kept until you delete them. Visible to all app users.</li>
        <li><b>Shared routes</b> (only those you share yourself): nickname, route name, type, distance and the whole route. Not linked to the device ID. Kept until you delete them. Visible to and downloadable by all app users.</li>
        <li><b>Event sign-ups</b> (only when you tap “I'm going”): only a hash of a random marker stored on your phone — no nickname or device ID. Used to count participants and to let you cancel. Deleted when you cancel or together with the event, at the latest 30 days after it takes place.</li>
        <li><b>Event completions</b> (only when you choose “show everyone” after tapping “Done”): a hash of a random marker from your phone and, once you save the training, your result: distance, time, elevation profile (elevation against distance covered — no coordinates or route map) and your nickname if you chose “Show with my nickname”. Used to show how many people completed the event and the list of results. Deleting the training from your History also removes the result from the server. Deleted when you undo it or together with the event, at the latest 30 days after it takes place.</li>
      </ul>
      <p>Legal basis: your consent (Art. 6(1)(a) GDPR) — you can withdraw it at any time below. Data is stored with Supabase in the European Union; like any server, the provider technically records IP addresses in logs.</p>
      ` : ""}
      <p>You have the right to access and delete your data and to lodge a complaint with the supervisory authority (UODO).${contact ? ` For these matters, write to the address at the top.` : ""}</p>`,
  },
};

function getLang() {
  return localStorage.getItem(LANG_KEY) || "pl";
}

function t() {
  return TRANSLATIONS[getLang()];
}

function applyLanguage() {
  const dict = t();
  document.documentElement.lang = getLang();
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = dict[el.dataset.i18n];
  });
  document.getElementById("langBtn").textContent = dict.langBtnTarget;
  updateDisciplineUi();
  document.getElementById("trainHintClose").setAttribute("aria-label", dict.hintCloseLabel);
  hideTrainHint();
  clearFieldState("dist");
  clearFieldState("time");
}

function toggleLanguage() {
  localStorage.setItem(LANG_KEY, getLang() === "pl" ? "en" : "pl");
  applyLanguage();
  refreshTotalLabel();
  refreshHistoryList();
  refreshSavedRoutesList();
  refreshPlanStats();
  refreshPrivacyText();
  refreshHelpText();
  redrawElevations();
  renderChallenge(); // pasek z hasłami i reszta ekranu Wyzwania w nowym języku
  if (document.getElementById("tabActivity").classList.contains("active")) refreshActivityTab();
}

// --- Rejestracja Service Workera (offline) ---
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch((e) => console.warn("SW error", e));
  });
}

// --- Pomocnicze: localStorage ---
function getPin() {
  let pin = localStorage.getItem(PIN_KEY);
  if (!pin) {
    pin = DEFAULT_PIN;
    localStorage.setItem(PIN_KEY, pin);
  }
  return pin;
}

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveHistory(history) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function getTotalDistance() {
  return getHistory().reduce((sum, item) => sum + (parseFloat(item.dist) || 0), 0);
}

// --- Motyw (jasny/ciemny) ---
function applyTheme() {
  const theme = localStorage.getItem(THEME_KEY) || "light";
  document.body.classList.toggle("dark", theme === "dark");
  // Pasek systemowy telefonu w kolorze tła aplikacji (--bg w style.css), żeby górny i dolny pasek się zgadzały.
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "dark" ? "#0F1A2B" : "#F3F5F8");
}

function toggleTheme() {
  const current = localStorage.getItem(THEME_KEY) || "light";
  localStorage.setItem(THEME_KEY, current === "light" ? "dark" : "light");
  applyTheme();
  redrawElevations();
}

// --- Logowanie PIN-em ---
function showLogin() {
  document.getElementById("loginScreen").style.display = "flex";
  document.getElementById("mainApp").style.display = "none";
}

function showMainApp() {
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("mainApp").style.display = "block";
  refreshTotalLabel();
  refreshHistoryList();
  refreshSavedRoutesList();
  document.getElementById("date").valueAsDate = new Date();
  initCommunity();
}

function tryLogin() {
  const input = document.getElementById("pinInput");
  const errorEl = document.getElementById("loginError");
  if (input.value === getPin()) {
    sessionStorage.setItem("pau_authed", "1");
    errorEl.textContent = "";
    showMainApp();
  } else {
    errorEl.textContent = t().invalidPin;
    input.value = "";
  }
}

// --- Zakładki ---
const TAB_IDS = {
  challenge: ["tabChallenge", "tabChallengeBtn"],
  train: ["tabTrain", "tabTrainBtn"],
  history: ["tabHistory", "tabHistoryBtn"],
  plan: ["tabPlan", "tabPlanBtn"],
  activity: ["tabActivity", "tabActivityBtn"],
};

function showTab(tabName) {
  document.querySelectorAll(".tab-content").forEach((el) => el.classList.remove("active"));
  document.querySelectorAll(".tabs button").forEach((el) => el.classList.remove("active"));
  if (tabName !== "challenge") stopChallengeDemo();
  const [contentId, btnId] = TAB_IDS[tabName];
  document.getElementById(contentId).classList.add("active");
  document.getElementById(btnId).classList.add("active");
}

// --- Licznik motywacyjny ---
function refreshTotalLabel() {
  const total = getTotalDistance();
  document.getElementById("totalLbl").textContent = t().totalLabel(total.toFixed(1));
}

// --- Podsumowanie, passa i rekordy (liczone na bieżąco z historii) ---
const DISCIPLINES = ["Bieg", "Rower", "Kajak", "Basen", "WodyOtwarte", "Trekking"];
// Do wyzwania 4000 km liczą się tylko te dyscypliny (pływanie i trekking - tylko do Historii/statystyk).
const CHALLENGE_DISCIPLINES = ["Bieg", "Rower", "Kajak"];
const SWIM_DISCIPLINES = ["Basen", "WodyOtwarte"];

function isChallengeDisc(disc) {
  return CHALLENGE_DISCIPLINES.includes(disc);
}

function formatSwimPace(minPer100m) {
  let m = Math.floor(minPer100m);
  let sec = Math.round((minPer100m - m) * 60);
  if (sec === 60) { m++; sec = 0; }
  return `${m}:${String(sec).padStart(2, "0")} /100 m`;
}

// Pole „Odcinek wyzwania” i podpowiedź dystansu zależą od wybranej dyscypliny.
function updateDisciplineUi() {
  const disc = document.getElementById("discipline").value;
  const flagRow = document.getElementById("challengeFlagRow");
  const show = Boolean(getChallenge()) && isChallengeDisc(disc);
  flagRow.style.display = show ? "flex" : "none";
  if (!show) document.getElementById("challengeFlag").checked = false;
  document.getElementById("dist").placeholder = SWIM_DISCIPLINES.includes(disc) ? t().distSwimPlaceholder : "";
}

function toYmd(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function parseYmd(ymd) {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function addDays(d, days) {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + days);
  return copy;
}

// Poniedziałek tygodnia, do którego należy data.
function weekStart(d) {
  return addDays(d, -((d.getDay() + 6) % 7));
}

// [od, do) jako "YYYY-MM-DD"; offset -1 = poprzedni okres.
function periodRange(period, offset) {
  const now = new Date();
  let from, to;
  if (period === "week") {
    from = addDays(weekStart(now), 7 * offset);
    to = addDays(from, 7);
  } else if (period === "month") {
    from = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    to = new Date(now.getFullYear(), now.getMonth() + offset + 1, 1);
  } else {
    from = new Date(now.getFullYear() + offset, 0, 1);
    to = new Date(now.getFullYear() + offset + 1, 0, 1);
  }
  return [toYmd(from), toYmd(to)];
}

function entryAscent(item) {
  return Array.isArray(item.route) ? trackAscentM(item.route.filter((p) => Number.isFinite(p.ele))) : 0;
}

function formatDuration(min) {
  const total = Math.round(min);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")} h`;
}

function formatPace(minPerKm) {
  let m = Math.floor(minPerKm);
  let sec = Math.round((minPerKm - m) * 60);
  if (sec === 60) { m++; sec = 0; }
  return `${m}:${String(sec).padStart(2, "0")} /km`;
}

function summarize(items) {
  const sum = { count: items.length, km: 0, min: 0, ascent: 0 };
  items.forEach((item) => {
    sum.km += parseFloat(item.dist) || 0;
    sum.min += parseFloat(item.time) || 0;
    sum.ascent += entryAscent(item);
  });
  return sum;
}

function streaks(history) {
  const days = new Set(history.map((item) => item.date));
  let current = 0;
  let day = new Date();
  if (!days.has(toYmd(day))) day = addDays(day, -1); // passa trwa, jeśli trening był wczoraj
  while (days.has(toYmd(day))) {
    current++;
    day = addDays(day, -1);
  }
  let best = 0, run = 0, prev = null;
  [...days].sort().forEach((ymd) => {
    const d = parseYmd(ymd);
    run = prev && toYmd(addDays(prev, 1)) === ymd ? run + 1 : 1;
    best = Math.max(best, run);
    prev = d;
  });
  return { current, best };
}

function statTile(value, label) {
  return `<div class="stat-tile"><div class="stat-value">${value}</div><div class="stat-label">${label}</div></div>`;
}

// --- Cele tygodniowe / miesięczne ---
function getGoals() {
  try {
    const goals = JSON.parse(localStorage.getItem(GOALS_KEY));
    return Array.isArray(goals) ? goals : [];
  } catch (e) {
    return [];
  }
}

function saveGoals(goals) {
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
}

function goalProgressKm(goal, history) {
  const [from, to] = periodRange(goal.period, 0);
  return history
    .filter((item) => item.date >= from && item.date < to && (goal.disc === "all" || item.disc === goal.disc))
    .reduce((sum, item) => sum + (parseFloat(item.dist) || 0), 0);
}

function goalLabel(goal) {
  const dict = t();
  return dict.goalLabel(goal.period, goal.disc === "all" ? dict.goalAll : dict.discNames[goal.disc] || goal.disc) + `: ${goal.km} km`;
}

function reachedGoals(history) {
  return getGoals().map((goal) => goalProgressKm(goal, history) >= goal.km);
}

function refreshGoals() {
  const list = document.getElementById("goalsList");
  if (!list) return;
  const dict = t();
  const goals = getGoals();
  if (goals.length === 0) {
    list.innerHTML = `<p class="hint-text">${dict.goalsEmpty}</p>`;
    return;
  }
  const history = getHistory();
  const today = parseYmd(toYmd(new Date()));
  list.innerHTML = goals
    .map((goal, index) => {
      const km = goalProgressKm(goal, history);
      const pct = Math.min(100, Math.round((km / goal.km) * 100));
      const to = parseYmd(periodRange(goal.period, 0)[1]);
      const daysLeft = Math.round((to - today) / 86400000);
      const status = km >= goal.km
        ? `<span class="goal-done">${dict.goalDone}</span>`
        : dict.goalLeft((goal.km - km).toFixed(1), daysLeft);
      return `<div class="goal-item">` +
        `<div class="goal-head"><span><b>${escapeXml(goalLabel(goal))}</b></span>` +
        `<button class="delete-btn" data-index="${index}" title="${dict.deleteTitle}">🗑</button></div>` +
        `<div class="goal-bar"><div class="goal-bar-fill" style="width:${pct}%"></div></div>` +
        `<div class="hint-text">${km.toFixed(1)} / ${goal.km} km (${pct}%) · ${status}</div>` +
        `</div>`;
    })
    .join("");
  list.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => deleteGoal(parseInt(btn.dataset.index, 10)));
  });
}

function showGoalForm(visible) {
  document.getElementById("goalForm").style.display = visible ? "block" : "none";
  document.getElementById("goalAddBtn").style.display = visible ? "none" : "block";
  if (visible) document.getElementById("goalKm").value = "";
}

function addGoal() {
  const km = parseFloat(document.getElementById("goalKm").value);
  if (!(km > 0)) {
    alert(t().goalKmInvalid);
    return;
  }
  const goals = getGoals();
  goals.push({
    period: document.getElementById("goalPeriod").value,
    disc: document.getElementById("goalDisc").value,
    km: Math.round(km * 10) / 10,
  });
  saveGoals(goals);
  showGoalForm(false);
  refreshGoals();
}

function deleteGoal(index) {
  if (!confirm(t().confirmDeleteGoal)) return;
  const goals = getGoals();
  goals.splice(index, 1);
  saveGoals(goals);
  refreshGoals();
}

function refreshSummary() {
  const tiles = document.getElementById("summaryTiles");
  if (!tiles) return;
  refreshGoals();
  const dict = t();
  const history = getHistory().filter((item) => /^\d{4}-\d{2}-\d{2}$/.test(item.date));
  const period = document.getElementById("summaryPeriod").value;

  const inRange = ([from, to]) => history.filter((item) => item.date >= from && item.date < to);
  const items = period === "all" ? history : inRange(periodRange(period, 0));
  const sum = summarize(items);
  tiles.innerHTML =
    statTile(sum.count, dict.summaryTrainings) +
    statTile(sum.km.toFixed(1), dict.summaryDistance) +
    statTile(sum.min > 0 ? formatDuration(sum.min) : "—", dict.summaryTime) +
    statTile(sum.ascent > 0 ? Math.round(sum.ascent) : "—", dict.summaryAscent);

  const compare = document.getElementById("summaryCompare");
  if (period === "all") {
    compare.textContent = "";
  } else {
    const prev = summarize(inRange(periodRange(period, -1)));
    compare.textContent = dict.summaryCompare(period, prev.km.toFixed(1),
      prev.count || sum.count ? Number((sum.km - prev.km).toFixed(1)) : null);
  }

  document.getElementById("summaryByDisc").innerHTML = items.length === 0
    ? `<p class="hint-text">${dict.summaryEmpty}</p>`
    : DISCIPLINES
      .map((disc) => {
        const s = summarize(items.filter((item) => item.disc === disc));
        return s.count
          ? `<div class="summary-disc">${dict.summaryDiscLine(dict.discNames[disc], s.count, s.km.toFixed(1), s.min > 0 ? formatDuration(s.min) : "")}</div>`
          : "";
      })
      .join("");

  const st = streaks(history);
  document.getElementById("streakTiles").innerHTML =
    statTile(dict.days(st.current), dict.streakCurrent) + statTile(dict.days(st.best), dict.streakBest);

  refreshRecords(history);
}

function bestBy(items, score) {
  let best = null, bestScore = -Infinity;
  items.forEach((item) => {
    const value = score(item);
    if (Number.isFinite(value) && value > 0 && value > bestScore) {
      best = item;
      bestScore = value;
    }
  });
  return best ? { item: best, value: bestScore } : null;
}

function bestPeriodKm(history, keyOf) {
  const totals = {};
  history.forEach((item) => {
    const key = keyOf(item.date);
    totals[key] = (totals[key] || 0) + (parseFloat(item.dist) || 0);
  });
  let best = null;
  Object.entries(totals).forEach(([key, km]) => {
    if (km > 0 && (!best || km > best.km)) best = { key, km };
  });
  return best;
}

function refreshRecords(history) {
  const list = document.getElementById("recordsList");
  const dict = t();
  if (history.length === 0) {
    list.innerHTML = `<p class="hint-text">${dict.recordsEmpty}</p>`;
    return;
  }
  const row = (label, value, date) =>
    `<div class="record-row"><span>${label}</span><span><b>${value}</b> <span class="record-date">${escapeXml(date)}</span></span></div>`;

  let html = "";
  DISCIPLINES.forEach((disc) => {
    const items = history.filter((item) => item.disc === disc);
    if (items.length === 0) return;
    const swim = SWIM_DISCIPLINES.includes(disc);
    const timed = items.filter((item) => parseFloat(item.dist) >= (swim ? 0.4 : 1) && parseFloat(item.time) > 0);
    const rows = [];
    const dist = bestBy(items, (item) => parseFloat(item.dist));
    if (dist) rows.push(row(dict.recLongestDist, `${dist.value.toFixed(2)} km`, dist.item.date));
    const time = bestBy(items, (item) => parseFloat(item.time));
    if (time) rows.push(row(dict.recLongestTime, formatDuration(time.value), time.item.date));
    if (disc === "Bieg") {
      const pace = bestBy(timed, (item) => parseFloat(item.dist) / parseFloat(item.time));
      if (pace) rows.push(row(dict.recBestPace, formatPace(1 / pace.value), pace.item.date));
    } else if (swim) {
      const pace = bestBy(timed, (item) => parseFloat(item.dist) / parseFloat(item.time));
      if (pace) rows.push(row(dict.recBestSwimPace, formatSwimPace(1 / (pace.value * 10)), pace.item.date));
    } else {
      const speed = bestBy(timed, (item) => parseFloat(item.dist) / (parseFloat(item.time) / 60));
      if (speed) rows.push(row(dict.recBestSpeed, `${speed.value.toFixed(1)} km/h`, speed.item.date));
    }
    const ascent = bestBy(items, entryAscent);
    if (ascent) rows.push(row(dict.recMaxAscent, `${Math.round(ascent.value)} m`, ascent.item.date));
    html += `<h3 class="records-disc">${dict.discNames[disc]}</h3>${rows.join("")}`;
  });

  const week = bestPeriodKm(history, (ymd) => toYmd(weekStart(parseYmd(ymd))));
  const month = bestPeriodKm(history, (ymd) => ymd.slice(0, 7));
  if (week || month) {
    html += `<h3 class="records-disc">${dict.recordsOverall}</h3>`;
    if (week) html += row(dict.recBestWeek, `${week.km.toFixed(1)} km`, dict.recWeekOf(week.key));
    if (month) html += row(dict.recBestMonth, `${month.km.toFixed(1)} km`, month.key);
  }
  list.innerHTML = html;
}

// --- Wyzwanie 4000 km (zakładka dla wszystkich; postęp widzą uczestnicy) ---
const CHALLENGE_KM = 4000;
// Zapisy dla nowych uczestników ruszają od tej daty; wcześniej dołączyć może tylko organizator.
const CHALLENGE_SIGNUP_FROM = "2027-09-01";
// Schematyczna pętla na konturze Polski (start i meta: Lublin). Do podmiany na prawdziwą trasę z GPX.
const POLAND_OUTLINE_D = "M8.0 47.7 L18.8 45.4 L41.7 37.5 L64.5 30.6 L84.5 16.7 L113.0 6.0 L127.3 7.9 L138.7 16.7 L133.0 24.5 L144.4 28.3 L161.6 23.6 L184.4 26.4 L210.1 29.2 L252.9 27.8 L272.9 39.8 L272.9 58.4 L284.3 83.9 L284.3 104.8 L264.3 123.3 L277.2 134.0 L277.2 155.8 L290.0 183.6 L275.8 211.4 L247.2 248.5 L254.4 274.0 L230.1 267.0 L201.5 256.8 L175.9 267.0 L155.9 248.5 L140.2 253.1 L118.8 230.9 L107.3 216.0 L84.5 210.5 L70.2 199.8 L58.8 202.1 L41.7 192.9 L26.0 189.6 L30.3 174.3 L23.1 155.8 L18.8 132.6 L17.4 109.4 L6.0 97.8 L13.1 76.9 L8.0 47.7 Z";
// Kierunek: z Lublina na południe, dalej zachodnią granicą, wybrzeżem i wschodnią granicą z powrotem do Lublina.
const CHALLENGE_ROUTE = [[246.3, 172.0], [282.9, 168.3], [290.0, 183.6], [275.7, 211.4], [247.2, 248.5], [254.3, 274.0], [230.1, 267.0],
  [201.5, 256.8], [175.8, 267.0], [155.8, 248.5], [140.2, 253.1], [118.7, 230.9], [107.3, 216.0], [84.5, 210.5],
  [70.2, 199.8], [58.8, 202.1], [41.7, 192.8], [26.0, 189.6], [30.3, 174.3], [23.1, 155.7], [18.8, 132.6],
  [17.4, 109.4], [6.0, 97.8], [13.1, 76.9], [8.0, 47.7], [18.8, 45.4], [41.7, 37.5], [64.5, 30.6],
  [84.5, 16.7], [113.0, 6.0], [127.3, 7.9], [138.7, 16.7], [133.0, 24.5], [144.4, 28.3], [161.6, 23.6],
  [184.4, 26.4], [210.1, 29.2], [252.9, 27.8], [272.9, 39.8], [272.9, 58.4], [284.3, 83.9], [284.3, 104.7],
  [264.3, 123.3], [277.2, 134.0], [277.2, 155.7], [282.9, 168.3], [246.3, 172.0]];
const CHALLENGE_ROUTE_D = CHALLENGE_ROUTE.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
const DISC_ICONS = {
  Bieg: '<circle cx="15" cy="4.5" r="2"></circle><path d="M8 21l3-5 3 2v4"></path><path d="M11 16l1.5-6 3 2.5 3.5-.5"></path><path d="M7 11l3.5-2.5 2 1.5"></path>',
  Rower: '<circle cx="5.5" cy="16.5" r="3.5"></circle><circle cx="18.5" cy="16.5" r="3.5"></circle><path d="M5.5 16.5L9 9h6l3.5 7.5"></path><path d="M9 9l3.5 7.5H5.5"></path><path d="M13.5 6h2.5"></path>',
  Kajak: '<path d="M2 15c5 3.5 15 3.5 20 0"></path><path d="M5 5l14 13"></path><path d="M3.5 3.5l2.5 2.5"></path><path d="M18 17l2.5 2.5"></path>',
};
// Partnerzy jak na polskaadventureultra.pl (#partners); logotypy lokalnie w partners/ (działają offline).
// ratio = szerokość / wysokość pliku; służy do wyrównania wielkości logotypów.
const CHALLENGE_PARTNERS = [
  { name: "Cedrus", logo: "partners/cedrus.png", ratio: 360 / 56 },
  { name: "TVP3 Lublin", logo: "partners/tvplublin.png", ratio: 199 / 49 },
  { name: "Agnieszka Danieluk", logo: "partners/agnieszkadanieluk.png", ratio: 196 / 200 },
  { name: "4evolve", logo: "partners/4evolve.png", ratio: 226 / 84 },
  { name: "Gospodarstwo rolne Szymon Gorzałczany", logo: "partners/szymong.png", ratio: 360 / 96 },
  { name: "Stokrotka", logo: "partners/stokrotka.png", ratio: 254 / 200 },
  { name: "MOSiR Lublin", logo: "partners/mosir.png", ratio: 360 / 157 },
];
const PARTNER_LOGO_AREA = 750; // px² - każde logo zajmuje mniej więcej tyle samo miejsca
const PARTNER_LOGO_MAX_W = 62;
const PARTNERS_PAGE_URL = "https://polskaadventureultra.pl/#partners";

// Hasła wyzwania w płynącym pasku na górze karty Wyzwania (motto - po polsku w obu językach).
// Hasła paska w Wyzwaniu - w języku aplikacji (nazwa wyzwania bez tłumaczenia).
const CHALLENGE_SLOGANS = {
  pl: ["Polska Adventure Ultra", "Już czas", "Biegnij, jedź i płyń"],
  en: ["Polska Adventure Ultra", "It's time", "Run, ride and paddle"],
};

function challengeSlogans() {
  return CHALLENGE_SLOGANS[getLang()] || CHALLENGE_SLOGANS.pl;
}
let challengeDemoFrame = null; // animacja licznika 1-100% w widoku obserwatora

function discIcon(disc, size) {
  return `<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${DISC_ICONS[disc]}</svg>`;
}

function getChallenge() {
  try {
    const c = JSON.parse(localStorage.getItem(CHALLENGE_KEY));
    return c && /^\d{4}-\d{2}-\d{2}$/.test(c.start) ? c : null;
  } catch (e) {
    return null;
  }
}

function saveChallenge(challenge) {
  if (challenge) localStorage.setItem(CHALLENGE_KEY, JSON.stringify(challenge));
  else localStorage.removeItem(CHALLENGE_KEY);
}

function canJoinChallenge() {
  return toYmd(new Date()) >= CHALLENGE_SIGNUP_FROM || Boolean(getAdminKey()) || Boolean(localStorage.getItem(CHALLENGE_INVITE_KEY));
}

function normalizeInviteCode(code) {
  return code.trim().replace(/\s+/g, "").toUpperCase();
}

function getInviteDeviceToken() {
  let token = localStorage.getItem(CHALLENGE_INVITE_TOKEN_KEY);
  if (!token) {
    token = randomToken();
    localStorage.setItem(CHALLENGE_INVITE_TOKEN_KEY, token);
  }
  return token;
}

function claimChallengeInvite(code) {
  return rpc("claim_challenge_invite", { p_code: code, p_token: getInviteDeviceToken() });
}

// Przed oficjalnymi zapisami udział z kodu zaproszenia trwa tylko, dopóki organizator nie usunie kodu
// (albo nie przypisze go do innego urządzenia).
// Bez internetu nic nie zmieniamy - sprawdzimy przy następnej okazji.
let challengeInviteChecked = false;

async function verifyChallengeInvite() {
  const code = localStorage.getItem(CHALLENGE_INVITE_KEY);
  if (challengeInviteChecked || !code || !isCommunityConfigured()) return;
  if (toYmd(new Date()) >= CHALLENGE_SIGNUP_FROM || getAdminKey()) return;
  let valid;
  try {
    valid = await claimChallengeInvite(code);
  } catch (e) {
    return;
  }
  challengeInviteChecked = true;
  if (valid) return;
  localStorage.removeItem(CHALLENGE_INVITE_KEY);
  const wasJoined = Boolean(getChallenge());
  saveChallenge(null);
  renderChallenge();
  if (wasJoined) alert(t().inviteRevoked);
}

async function enterChallengeInvite() {
  const dict = t();
  const input = prompt(dict.promptInvite);
  if (!input) return;
  const code = normalizeInviteCode(input);
  try {
    if (!(await claimChallengeInvite(code))) {
      alert(dict.inviteInvalid);
      return;
    }
  } catch (e) {
    alert(dict.communityError);
    return;
  }
  localStorage.setItem(CHALLENGE_INVITE_KEY, code);
  alert(dict.inviteOk);
  renderChallenge();
}

function joinChallenge() {
  if (!canJoinChallenge()) return;
  saveChallenge({ start: toYmd(new Date()) });
  renderChallenge();
}

function leaveChallenge() {
  if (!confirm(t().confirmLeaveChallenge)) return;
  saveChallenge(null);
  renderChallenge();
}

function pointAlongRoute(fraction) {
  const lengths = [0];
  for (let i = 1; i < CHALLENGE_ROUTE.length; i++) {
    const [x1, y1] = CHALLENGE_ROUTE[i - 1], [x2, y2] = CHALLENGE_ROUTE[i];
    lengths.push(lengths[i - 1] + Math.hypot(x2 - x1, y2 - y1));
  }
  const target = Math.max(0, Math.min(1, fraction)) * lengths[lengths.length - 1];
  const i = Math.max(1, lengths.findIndex((l) => l >= target));
  const t0 = (target - lengths[i - 1]) / (lengths[i] - lengths[i - 1] || 1);
  const [x1, y1] = CHALLENGE_ROUTE[i - 1], [x2, y2] = CHALLENGE_ROUTE[i];
  return [x1 + t0 * (x2 - x1), y1 + t0 * (y2 - y1)];
}

function challengeStats() {
  const challenge = getChallenge();
  const today = parseYmd(toYmd(new Date()));
  // Do postępu liczą się wyłącznie treningi oznaczone jako odcinek wyzwania (🏁).
  const items = getHistory().filter((item) => item.challenge === true && isChallengeDisc(item.disc) &&
    /^\d{4}-\d{2}-\d{2}$/.test(item.date));
  const byDisc = {};
  CHALLENGE_DISCIPLINES.forEach((disc) => {
    byDisc[disc] = summarize(items.filter((item) => item.disc === disc)).km;
  });
  const km = summarize(items).km;
  const day = Math.max(1, Math.round((today - parseYmd(challenge.start)) / 86400000) + 1);
  const perDay = km / day;
  const weekGoal = getGoals().find((g) => g.period === "week");
  const [weekFrom, weekTo] = periodRange("week", 0);
  const weekKm = weekGoal ? goalProgressKm(weekGoal, getHistory())
    : summarize(items.filter((item) => item.date >= weekFrom && item.date < weekTo)).km;
  return {
    km, byDisc, day, perDay, weekKm, weekGoal,
    fraction: Math.min(km / CHALLENGE_KM, 1),
    pct: Math.min(100, Math.floor((km / CHALLENGE_KM) * 100)),
    streak: streaks(items).current,
    eta: perDay > 0 && km < CHALLENGE_KM ? addDays(today, Math.ceil((CHALLENGE_KM - km) / perDay)) : null,
  };
}

function challengeMapSvg(fraction, showDot) {
  const [dx, dy] = pointAlongRoute(fraction);
  return `<svg role="img" aria-label="${escapeXml(t().chOf(Math.round(fraction * 100)))}" viewBox="0 0 296 280">` +
    `<path class="ch-outline" d="${POLAND_OUTLINE_D}"></path>` +
    `<path class="ch-route-base" d="${CHALLENGE_ROUTE_D}"></path>` +
    `<path class="ch-progress" d="${CHALLENGE_ROUTE_D}" pathLength="100" stroke-dasharray="${(fraction * 100).toFixed(2)} 100"></path>` +
    `<circle class="ch-start" cx="246.3" cy="172" r="7"></circle>` +
    `<text class="ch-start-label" x="234" y="176.5" text-anchor="end">Lublin</text>` +
    (showDot ? `<circle class="ch-dot" cx="${dx.toFixed(1)}" cy="${dy.toFixed(1)}" r="8"></circle>` : "") +
    `</svg>`;
}

function challengeHeadHtml() {
  const dict = t();
  return `<div class="ch-flag" aria-hidden="true"><i style="background:var(--ch-stripe)"></i><i style="background:var(--ch-accent)"></i></div>` +
    challengeTickerHtml() +
    `<span class="ch-kicker">${dict.chMeta}</span><h2 class="ch-h1">${dict.chH1}</h2>`;
}

// Pasek z hasłami: treść powtórzona 2x, animacja przesuwa o połowę -> pętla bez skoku.
// Dotknięcie zatrzymuje/wznawia; przy "ograniczeniu ruchu" w systemie pasek stoi (CSS).
function challengeTickerHtml() {
  // Hasła powtórzone 2x, żeby jedna kopia była szersza niż ekran (bez dziury w pętli).
  const slogans = challengeSlogans();
  const one = slogans.map((s) => `<span>${escapeXml(s)}</span><i aria-hidden="true">•</i>`).join("");
  const run = one + `<b class="ch-ticker-dup">${one}</b>`;
  return `<div class="ch-ticker" role="marquee" tabindex="0" aria-label="${escapeXml(slogans.join(". "))}">` +
    `<div class="ch-ticker-track" aria-hidden="true"><div class="ch-ticker-run">${run}</div><div class="ch-ticker-run">${run}</div></div></div>`;
}

function bindChallengeTicker(root) {
  const ticker = root.querySelector(".ch-ticker");
  if (!ticker) return;
  const toggle = () => ticker.classList.toggle("paused");
  ticker.addEventListener("click", toggle);
  ticker.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
  });
}

function challengePartnersHtml() {
  const dict = t();
  return `<div class="ch-partners"><span class="ch-kicker">${dict.chPartners}</span><div class="ch-partner-grid">` +
    CHALLENGE_PARTNERS.map((p) => {
      const w = Math.min(PARTNER_LOGO_MAX_W, Math.sqrt(PARTNER_LOGO_AREA * p.ratio));
      const h = w / p.ratio;
      return `<img class="ch-partner" src="${p.logo}" alt="${escapeXml(p.name)}" width="${Math.round(w)}" height="${Math.round(h)}" loading="lazy">`;
    }).join("") +
    `</div><a class="ch-partner-cta" href="${PARTNERS_PAGE_URL}" target="_blank" rel="noopener">${dict.chPartnerCta}</a></div>`;
}

function challengeWeekHtml(st) {
  const dict = t();
  const goal = st.weekGoal;
  const pct = goal ? Math.min(100, Math.round((st.weekKm / goal.km) * 100)) : 0;
  return `<div class="ch-box"><div class="ch-row"><span class="ch-label">${dict.chWeek}</span>` +
    `<span class="ch-small"><b style="color:var(--ch-fg)">${st.weekKm.toFixed(0)}</b>${goal ? ` / ${goal.km}` : ""} km</span></div>` +
    (goal ? `<div class="ch-bar"><div class="ch-bar-fill" style="width:${pct}%"></div></div>` : "") +
    `<span class="ch-note">${st.streak ? dict.chStreak(st.streak) : dict.chNoStreak}</span></div>`;
}

// Widok dla osób, które nie dołączyły: opis wyzwania, trasa, najbliższe wydarzenie i przycisk "Dołącz".
// Licznik i kropka są tu tylko poglądowe (animacja 1-100%) - prawdziwy postęp widzą uczestnicy.
function challengeObserverHtml() {
  const dict = t();
  return challengeHeadHtml() +
    `<div class="ch-map"><div class="ch-map-left"><span class="ch-big" id="chDemoPct">1%</span>` +
    `<span class="ch-sub">${dict.chDemoSub}</span><span class="ch-small">${dict.chNow(1).split("<br>")[0]}</span>` +
    `${challengePartnersHtml()}</div>${challengeMapSvg(0, true)}</div>` +
    `<p class="ch-lock"><svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="5" y="11" width="14" height="10" rx="2"></rect><path d="M8 11V7a4 4 0 0 1 8 0v4"></path></svg>${dict.chParticipantsOnly}</p>` +
    `<p class="ch-intro">${dict.challengeJoinText}</p>` +
    (canJoinChallenge()
      ? `<button class="ch-cta" id="challengeJoinBtn">${dict.challengeJoinBtn}</button>`
      : `<button class="ch-cta" id="challengeJoinBtn" disabled>${dict.chSignupSoon}</button>` +
        `<p class="ch-small" style="text-align:center;margin:8px 0 0">${dict.chSignupSoonHint}</p>` +
        (isCommunityConfigured() ? `<button class="ch-invite" id="challengeInviteBtn">${dict.chInviteLink}</button>` : ""));
}

function challengeParticipantHtml() {
  const dict = t();
  const st = challengeStats();
  const eta = st.eta ? st.eta.toLocaleDateString(dict.dateLocale, { day: "numeric", month: "short" }) : "—";
  return challengeHeadHtml() +
    `<div class="ch-map"><div class="ch-map-left"><span class="ch-big">${st.pct}%</span>` +
    `<span class="ch-sub">${Math.round(st.km).toLocaleString(dict.dateLocale)} km</span><span class="ch-small">${dict.chNow(st.day)}</span>` +
    `${challengePartnersHtml()}</div>${challengeMapSvg(st.fraction, true)}</div>` +
    `<div class="ch-pills">${CHALLENGE_DISCIPLINES.map((d) => `<div class="ch-pill" title="${dict.discNames[d]}">${discIcon(d, 18)}<b>${Math.round(st.byDisc[d])}</b> km</div>`).join("")}</div>` +
    `<div class="ch-stats"><div><span class="ch-stat-value">${st.day}</span><span class="ch-stat-label">${dict.chStatDays}</span></div>` +
    `<div><span class="ch-stat-value">${st.perDay.toFixed(1)}</span><span class="ch-stat-label">${dict.chStatAvg}</span></div>` +
    `<div><span class="ch-stat-value">${escapeXml(eta)}</span><span class="ch-stat-label">${dict.chStatEta}</span></div></div>` +
    challengeWeekHtml(st);
}

function setChallengeDemo(el, fraction) {
  const [x, y] = pointAlongRoute(fraction);
  el.querySelector("#chDemoPct").textContent = `${Math.max(1, Math.round(fraction * 100))}%`;
  el.querySelector(".ch-progress").setAttribute("stroke-dasharray", `${(fraction * 100).toFixed(2)} 100`);
  const dot = el.querySelector(".ch-dot");
  dot.setAttribute("cx", x.toFixed(1));
  dot.setAttribute("cy", y.toFixed(1));
}

function stopChallengeDemo() {
  if (challengeDemoFrame) cancelAnimationFrame(challengeDemoFrame);
  challengeDemoFrame = null;
}

function startChallengeDemo(el) {
  stopChallengeDemo();
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setChallengeDemo(el, 1);
    return;
  }
  const runMs = 7000, holdMs = 1500;
  let startTs = null;
  const step = (ts) => {
    if (startTs === null) startTs = ts;
    const fraction = Math.min(1, ((ts - startTs) % (runMs + holdMs)) / runMs);
    setChallengeDemo(el, fraction);
    challengeDemoFrame = requestAnimationFrame(step);
  };
  challengeDemoFrame = requestAnimationFrame(step);
}

function renderChallenge() {
  const el = document.getElementById("challengeScreen");
  if (!el) return;
  stopChallengeDemo();
  const challenge = getChallenge();
  document.getElementById("challengeSettings").style.display = challenge ? "block" : "none";
  updateDisciplineUi();
  el.innerHTML = challenge ? challengeParticipantHtml() : challengeObserverHtml();
  bindChallengeTicker(el);
  if (challenge) {
    document.getElementById("challengeStart").value = challenge.start;
  } else {
    document.getElementById("challengeJoinBtn").addEventListener("click", joinChallenge);
    const inviteBtn = document.getElementById("challengeInviteBtn");
    if (inviteBtn) inviteBtn.addEventListener("click", enterChallengeInvite);
    if (document.getElementById("tabChallenge").classList.contains("active")) startChallengeDemo(el);
  }
}

// --- Historia ---
function refreshHistoryList() {
  refreshSummary();
  renderChallenge();
  const list = document.getElementById("historyList");
  const history = getHistory();
  const dict = t();
  if (history.length === 0) {
    list.innerHTML = `<p>${dict.noHistory}</p>`;
    return;
  }
  list.innerHTML = history
    .map((item, index) => ({ item, index }))
    .reverse()
    .map(({ item, index }) => {
      const l = dict.historyLabels;
      const discName = dict.discNames[item.disc] || item.disc;
      const notes = item.notes ? `, ${l.notes}: ${escapeXml(item.notes)}` : "";
      const routeBtn = item.route && item.route.length >= 2
        ? `<button class="route-btn" data-index="${index}" title="${dict.showRouteTitle}">🗺</button>`
        : "";
      const flagBtn = getChallenge() && (isChallengeDisc(item.disc) || item.challenge)
        ? `<button class="flag-btn${item.challenge ? " on" : ""}" data-index="${index}" title="${item.challenge ? dict.flagOnTitle : dict.flagOffTitle}" aria-pressed="${item.challenge ? "true" : "false"}">🏁</button>`
        : "";
      const shareBtn = isCommunityConfigured()
        ? `<button class="share-btn" data-index="${index}" title="${item.sharedId ? dict.unshareTitle : dict.shareTitle}">${item.sharedId ? "🌍" : "📤"}</button>`
        : "";
      return `<div class="history-item">` +
             `<span>${l.date}: ${item.date}, ${l.disc}: ${discName}, ${l.dist}: ${item.dist} km, ` +
             `${l.weight}: ${item.weight} kg, ${l.hr}: ${item.hr} bpm, ${l.vo2max}: ${item.vo2max}${notes}</span>` +
             `<div class="history-actions">${flagBtn}${shareBtn}${routeBtn}` +
             `<button class="delete-btn" data-index="${index}" title="${dict.deleteTitle}">🗑</button></div>` +
             `</div>`;
    })
    .join("");

  list.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => deleteTraining(parseInt(btn.dataset.index, 10)));
  });
  list.querySelectorAll(".route-btn").forEach((btn) => {
    btn.addEventListener("click", () => showRoute(parseInt(btn.dataset.index, 10)));
  });
  list.querySelectorAll(".share-btn").forEach((btn) => {
    btn.addEventListener("click", () => toggleShareTraining(parseInt(btn.dataset.index, 10)));
  });
  list.querySelectorAll(".flag-btn").forEach((btn) => {
    btn.addEventListener("click", () => toggleChallengeFlag(parseInt(btn.dataset.index, 10)));
  });
}

function toggleChallengeFlag(index) {
  const history = getHistory();
  const entry = history[index];
  if (!entry) return;
  if (entry.challenge) delete entry.challenge;
  else if (isChallengeDisc(entry.disc)) entry.challenge = true;
  else return;
  saveHistory(history);
  refreshHistoryList();
}

function deleteTraining(index) {
  if (!confirm(t().confirmDelete)) return;
  const history = getHistory();
  history.splice(index, 1);
  saveHistory(history);
  refreshTotalLabel();
  refreshHistoryList();
}

// --- Podpowiedzi przy polach formularza (zamiast alertów) ---
// Błąd: czerwona ramka + komunikat pod polem. Uwaga: pomarańczowa, pulsująca ramka.
// Oba stany znikają, gdy użytkownik zacznie pisać w polu.
function setFieldError(id, message) {
  const input = document.getElementById(id);
  const err = document.getElementById(id + "Error");
  input.classList.remove("field-attn");
  input.classList.add("field-invalid");
  input.setAttribute("aria-invalid", "true");
  err.textContent = message;
  err.hidden = false;
}

function markFieldAttention(id) {
  const input = document.getElementById(id);
  input.classList.remove("field-invalid", "field-attn");
  void input.offsetWidth; // restart animacji przy ponownym oznaczeniu
  input.classList.add("field-attn");
}

function clearFieldState(id) {
  const input = document.getElementById(id);
  const err = document.getElementById(id + "Error");
  input.classList.remove("field-invalid", "field-attn");
  input.removeAttribute("aria-invalid");
  if (err) { err.hidden = true; err.textContent = ""; }
}

function showTrainHint(text) {
  document.getElementById("trainHintText").textContent = text;
  document.getElementById("trainHint").hidden = false;
}

function hideTrainHint() {
  document.getElementById("trainHint").hidden = true;
}

function focusField(id) {
  const input = document.getElementById(id);
  if (input.scrollIntoView) input.scrollIntoView({ block: "center", behavior: "smooth" });
  if (input.focus) input.focus({ preventScroll: true });
}

// --- Zapis treningu ---
function saveTraining() {
  const dist = document.getElementById("dist").value;
  if (!dist || parseFloat(dist) <= 0) {
    setFieldError("dist", t().alertDistRequired);
    focusField("dist");
    return;
  }
  clearFieldState("dist");
  clearFieldState("time");
  hideTrainHint();
  const linkedEvent = pendingEventDone;

  const entry = {
    date: document.getElementById("date").value || new Date().toISOString().slice(0, 10),
    disc: document.getElementById("discipline").value,
    dist: dist,
    time: document.getElementById("time").value || "0",
    hr: document.getElementById("hr").value || "0",
    vo2max: document.getElementById("vo2max").value || "0",
    weight: document.getElementById("weight").value || "0",
    notes: document.getElementById("notes").value.trim(),
  };
  if (pendingRoute) entry.route = pendingRoute;
  if (pendingEventDone && entry.date === pendingEventDone.ymd) entry.event = pendingEventDone.id;
  if (getChallenge() && isChallengeDisc(entry.disc) && document.getElementById("challengeFlag").checked) entry.challenge = true;

  const history = getHistory();
  const reachedBefore = reachedGoals(history);
  history.push(entry);
  saveHistory(history);
  const newlyReached = getGoals().filter((goal, i) => !reachedBefore[i] && reachedGoals(history)[i]);

  document.getElementById("dist").value = "";
  document.getElementById("notes").value = "";
  document.getElementById("challengeFlag").checked = false;
  pendingRoute = null;
  pendingEventDone = null;

  refreshTotalLabel();
  refreshHistoryList();
  if (linkedEvent && entry.event) {
    renderEvents();
    syncEventResult(entry.event);
  }
  alert(t().alertSaved);
  if (newlyReached.length) alert(t().goalReached(newlyReached.map(goalLabel)));
}

// --- Tempo / prędkość ---
function calcPace() {
  const dist = parseFloat(document.getElementById("dist").value);
  const time = parseFloat(document.getElementById("time").value);
  const disc = document.getElementById("discipline").value;

  const distOk = dist > 0;
  const timeOk = time > 0;
  if (!distOk) setFieldError("dist", t().alertDistRequired);
  else clearFieldState("dist");
  if (!timeOk) setFieldError("time", t().alertTimeRequired);
  else clearFieldState("time");
  if (!distOk || !timeOk) {
    focusField(distOk ? "time" : "dist");
    return;
  }

  if (disc === "Bieg") {
    const pace = time / dist;
    const min = Math.floor(pace);
    const sec = Math.round((pace - min) * 60);
    alert(t().paceResult(min, String(sec).padStart(2, "0")));
  } else if (SWIM_DISCIPLINES.includes(disc)) {
    alert(t().swimPaceResult(formatSwimPace(time / (dist * 10))));
  } else {
    const speed = dist / (time / 60);
    alert(t().speedResult(speed.toFixed(1)));
  }
}

// --- Wykres progresu (prosty, bez bibliotek zewnętrznych - działa offline) ---
function showChart() {
  const history = getHistory();
  const card = document.getElementById("chartCard");
  const canvas = document.getElementById("chartCanvas");

  if (history.length === 0) {
    alert(t().alertNoHistoryChart);
    return;
  }

  card.style.display = "block";
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  const padding = 40;

  ctx.clearRect(0, 0, w, h);

  const dists = history.map((item) => parseFloat(item.dist) || 0);
  const maxDist = Math.max(...dists, 1);
  const stepX = (w - 2 * padding) / Math.max(dists.length - 1, 1);

  const themeStyle = getComputedStyle(document.body);
  const accent = themeStyle.getPropertyValue("--accent").trim() || "#3D7A22";
  const axis = themeStyle.getPropertyValue("--border").trim() || "#ccc";
  ctx.strokeStyle = accent;
  ctx.fillStyle = accent;
  ctx.lineWidth = 2;

  // Oś
  ctx.beginPath();
  ctx.moveTo(padding, h - padding);
  ctx.lineTo(w - padding, h - padding);
  ctx.strokeStyle = axis;
  ctx.stroke();

  // Linia dystansu
  ctx.beginPath();
  ctx.strokeStyle = accent;
  dists.forEach((d, i) => {
    const x = padding + i * stepX;
    const y = h - padding - (d / maxDist) * (h - 2 * padding);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Punkty
  dists.forEach((d, i) => {
    const x = padding + i * stepX;
    const y = h - padding - (d / maxDist) * (h - 2 * padding);
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  });

  canvas.scrollIntoView({ behavior: "smooth" });
}

// --- Eksport CSV ---
function exportCsv() {
  const history = getHistory();
  if (history.length === 0) {
    alert(t().alertNoHistoryExport);
    return;
  }
  let csv = "Date;Discipline;Distance;Weight;HeartRate;VO2max;Notes\n";
  history.forEach((item) => {
    csv += `${item.date};${item.disc};${item.dist};${item.weight};${item.hr};${item.vo2max};${item.notes}\n`;
  });

  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "pau_data.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// --- Kopia zapasowa (plik JSON z danymi z localStorage) ---
// PIN, klucz organizatora, identyfikator urządzenia i zgoda na statystyki zostają celowo poza kopią.
const BACKUP_FORMAT = "polska-adventure-ultra-backup";
const BACKUP_KEYS = [HISTORY_KEY, PLANNED_ROUTES_KEY, GOALS_KEY, CHALLENGE_KEY, CHALLENGE_INVITE_KEY, CHALLENGE_INVITE_TOKEN_KEY, THEME_KEY, LANG_KEY, NICK_KEY, SHARE_TOKENS_KEY, ROUTE_SHARE_TOKENS_KEY, EVENT_TOKENS_KEY, EVENTS_DONE_KEY];
const BACKUP_JSON_KEYS = { [HISTORY_KEY]: "array", [PLANNED_ROUTES_KEY]: "array", [GOALS_KEY]: "array", [EVENT_TOKENS_KEY]: "object", [EVENTS_DONE_KEY]: "object", [CHALLENGE_KEY]: "object", [SHARE_TOKENS_KEY]: "object", [ROUTE_SHARE_TOKENS_KEY]: "object" };

async function createBackup() {
  const data = {};
  BACKUP_KEYS.forEach((key) => {
    const value = localStorage.getItem(key);
    if (value !== null) data[key] = value;
  });
  const backup = { format: BACKUP_FORMAT, version: 1, created: new Date().toISOString(), data };
  const fileName = `pau-kopia-${backup.created.slice(0, 10)}.json`;
  await saveFile(new File([JSON.stringify(backup)], fileName, { type: "application/json" }), fileName);
}

// Zwraca dane kopii albo null, jeśli plik nie jest poprawną kopią.
function parseBackup(text) {
  let backup;
  try {
    backup = JSON.parse(text);
  } catch (e) {
    return null;
  }
  if (!backup || backup.format !== BACKUP_FORMAT || !backup.data || typeof backup.data !== "object") return null;
  for (const [key, value] of Object.entries(backup.data)) {
    if (!BACKUP_KEYS.includes(key) || typeof value !== "string") return null;
    const kind = BACKUP_JSON_KEYS[key];
    if (!kind) continue;
    let parsed;
    try {
      parsed = JSON.parse(value);
    } catch (e) {
      return null;
    }
    const ok = kind === "array" ? Array.isArray(parsed) : parsed !== null && typeof parsed === "object" && !Array.isArray(parsed);
    if (!ok) return null;
  }
  return backup;
}

function restoreBackupFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    const backup = parseBackup(reader.result);
    if (!backup) {
      alert(t().backupInvalid);
      return;
    }
    const count = (key) => (backup.data[key] ? JSON.parse(backup.data[key]).length : 0);
    const created = String(backup.created || "").slice(0, 10) || "?";
    if (!confirm(t().confirmRestore(created, count(HISTORY_KEY), count(PLANNED_ROUTES_KEY)))) return;
    BACKUP_KEYS.forEach((key) => {
      if (key in backup.data) localStorage.setItem(key, backup.data[key]);
      else localStorage.removeItem(key);
    });
    alert(t().restoreDone);
    // Sesja (sessionStorage) zostaje, więc po przeładowaniu nie trzeba ponownie podawać PIN-u.
    location.reload();
  };
  reader.readAsText(file);
}

// --- Profil wysokości trasy (canvas pod mapą) ---
const elevationTracks = {}; // prefix -> ostatnio pokazana trasa (do przerysowania po zmianie motywu/języka)

function showElevation(prefix, track) {
  const box = document.getElementById(`${prefix}ElevationBox`);
  if (!box) return;
  const withEle = (track || []).filter((p) => Number.isFinite(p.ele));
  if (withEle.length < 2) {
    box.style.display = "none";
    delete elevationTracks[prefix];
    return;
  }
  elevationTracks[prefix] = withEle;
  box.style.display = "block";
  requestAnimationFrame(() => drawElevationProfile(prefix, withEle));
}

function redrawElevations() {
  Object.entries(elevationTracks).forEach(([prefix, track]) => drawElevationProfile(prefix, track));
}

// Trasa {lat, lon, ele} -> punkty profilu {km, ele}.
function profileFromTrack(track) {
  let km = 0;
  return track.map((p, i) => {
    if (i > 0) km += haversineKm(track[i - 1].lat, track[i - 1].lon, p.lat, p.lon);
    return { km, ele: p.ele };
  });
}

function drawElevationProfile(prefix, track) {
  drawProfile(document.getElementById(`${prefix}ElevationCanvas`), document.getElementById(`${prefix}ElevationStats`),
    profileFromTrack(track));
}

// Rysuje profil {km, ele} na canvasie i wpisuje podejścia/zejścia do statsEl.
function drawProfile(canvas, statsEl, points) {
  if (!canvas || points.length < 2) return;
  const track = points;
  const dist = points.map((p) => p.km);
  const totalKm = dist[dist.length - 1] || 1;
  const eles = track.map((p) => p.ele);
  const minEle = Math.min(...eles), maxEle = Math.max(...eles);
  let down = 0;
  for (let i = 1; i < track.length; i++) {
    if (track[i].ele < track[i - 1].ele) down += track[i - 1].ele - track[i].ele;
  }
  if (statsEl) statsEl.textContent =
    t().elevationStats(trackAscentM(track), Math.round(down), Math.round(minEle), Math.round(maxEle));

  const dpr = window.devicePixelRatio || 1;
  const cssW = canvas.clientWidth || 600, cssH = canvas.clientHeight || 160;
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cssW, cssH);

  // Minimalny zakres 20 m, żeby płaska trasa nie wyglądała jak góry.
  const range = Math.max(maxEle - minEle, 20);
  const bottom = minEle - (range - (maxEle - minEle)) / 2;

  const style = getComputedStyle(document.body);
  const accent = style.getPropertyValue("--accent").trim() || "#3D7A22";
  const subtle = style.getPropertyValue("--subtle-fg").trim() || "#555";
  const padL = 44, padR = 8, padT = 8, padB = 20;
  const plotW = cssW - padL - padR, plotH = cssH - padT - padB;
  const x = (km) => padL + (km / totalKm) * plotW;
  const y = (ele) => padT + plotH - ((ele - bottom) / range) * plotH;

  ctx.beginPath();
  ctx.moveTo(x(0), padT + plotH);
  track.forEach((p, i) => ctx.lineTo(x(dist[i]), y(p.ele)));
  ctx.lineTo(x(totalKm), padT + plotH);
  ctx.closePath();
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = accent;
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.beginPath();
  track.forEach((p, i) => (i === 0 ? ctx.moveTo(x(dist[i]), y(p.ele)) : ctx.lineTo(x(dist[i]), y(p.ele))));
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = subtle;
  ctx.font = "11px sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.fillText(`${Math.round(maxEle)} m`, padL - 4, y(maxEle));
  ctx.fillText(`${Math.round(minEle)} m`, padL - 4, y(minEle));
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.fillText("0 km", padL, padT + plotH + 4);
  ctx.textAlign = "right";
  ctx.fillText(`${totalKm.toFixed(1)} km`, padL + plotW, padT + plotH + 4);
}

// --- Trasa (z importu GPX/TCX) ---
let pendingRoute = null;
// Wydarzenie, z którego otwarto formularz („Zrobione”) - zapisany trening dostaje jego id.
let pendingEventDone = null;
let routeMapInstance = null;
let routeLayerGroup = null;

function drawRoute(points) {
  const card = document.getElementById("routeCard");
  card.style.display = "block";

  if (!routeMapInstance) {
    routeMapInstance = L.map("routeMap");
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(routeMapInstance);
    routeLayerGroup = L.layerGroup().addTo(routeMapInstance);
  }

  routeLayerGroup.clearLayers();

  const latlngs = points.map((p) => [p.lat, p.lon]);
  const polyline = L.polyline(latlngs, { color: "#3D7A22", weight: 4 }).addTo(routeLayerGroup);
  L.circleMarker(latlngs[0], { radius: 6, color: "#3D7A22", fillColor: "#3D7A22", fillOpacity: 1 }).addTo(routeLayerGroup);
  L.circleMarker(latlngs[latlngs.length - 1], { radius: 6, color: "#c62828", fillColor: "#c62828", fillOpacity: 1 }).addTo(routeLayerGroup);

  // Kontener był ukryty (display:none), więc Leaflet potrzebuje przeliczenia
  // rozmiaru po tym, jak przeglądarka faktycznie odłoży layout.
  requestAnimationFrame(() => {
    routeMapInstance.invalidateSize();
    routeMapInstance.fitBounds(polyline.getBounds(), { padding: [20, 20] });
  });
  showElevation("route", points);

  card.scrollIntoView({ behavior: "smooth" });
}

function showRoute(index) {
  const entry = getHistory()[index];
  if (!entry || !entry.route || entry.route.length < 2) return;
  drawRoute(entry.route);
}

// --- Planowanie tras (klikanie punktów na mapie + eksport GPX do zegarka) ---
// Prowadzenie po drogach/szlakach liczy darmowy serwer BRouter (brouter.de, bez konta i klucza API).
// Bez internetu albo w trybie "linia prosta" odcinki są po prostu prostymi liniami między punktami.
const BROUTER_URL = "https://brouter.de/brouter";

let planMapInstance = null;
let planLayerGroup = null;
let planWaypoints = [];   // punkty klikane przez użytkownika: { lat, lon }
let planSegments = [];    // planSegments[i] = trasa od punktu i do i+1: [{ lat, lon, ele? }]
let planEditingIndex = null; // indeks edytowanej zapisanej trasy (null = nowa trasa)
let planRequestId = 0;

function getPlannedRoutes() {
  try {
    return JSON.parse(localStorage.getItem(PLANNED_ROUTES_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function savePlannedRoutes(routes) {
  localStorage.setItem(PLANNED_ROUTES_KEY, JSON.stringify(routes));
}

function initPlanMap() {
  if (!planMapInstance) {
    planMapInstance = L.map("planMap").setView([52.1, 19.4], 6);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(planMapInstance);
    planLayerGroup = L.layerGroup().addTo(planMapInstance);
    planMapInstance.on("click", (e) => addPlanPoint(e.latlng.lat, e.latlng.lng));
  }
  // Zakładka była ukryta (display:none) - Leaflet musi przeliczyć rozmiar.
  requestAnimationFrame(() => planMapInstance.invalidateSize());
}

function getPlanTrack() {
  if (planWaypoints.length === 0) return [];
  if (planWaypoints.length === 1) return [planWaypoints[0]];
  const track = [];
  planSegments.forEach((seg, i) => {
    track.push(...(i === 0 ? seg : seg.slice(1)));
  });
  return track;
}

function trackDistanceKm(track) {
  let km = 0;
  for (let i = 1; i < track.length; i++) {
    km += haversineKm(track[i - 1].lat, track[i - 1].lon, track[i].lat, track[i].lon);
  }
  return km;
}

function trackAscentM(track) {
  let up = 0;
  for (let i = 1; i < track.length; i++) {
    if (track[i].ele != null && track[i - 1].ele != null && track[i].ele > track[i - 1].ele) {
      up += track[i].ele - track[i - 1].ele;
    }
  }
  return Math.round(up);
}

function refreshPlanStats(statusText) {
  const el = document.getElementById("planStats");
  if (!el) return;
  if (statusText) {
    el.textContent = statusText;
    return;
  }
  if (planWaypoints.length === 0) {
    el.textContent = "";
    return;
  }
  const track = getPlanTrack();
  const ascent = trackAscentM(track);
  el.textContent = t().planStats(trackDistanceKm(track).toFixed(2), planWaypoints.length) +
    (ascent > 0 ? t().planStatsAscent(ascent) : "");
}

function redrawPlan() {
  if (!planLayerGroup) return;
  planLayerGroup.clearLayers();
  const track = getPlanTrack();
  if (track.length >= 2) {
    L.polyline(track.map((p) => [p.lat, p.lon]), { color: "#3D7A22", weight: 4 }).addTo(planLayerGroup);
  }
  planWaypoints.forEach((p, i) => {
    const isLast = i === planWaypoints.length - 1 && i > 0;
    const color = i === 0 ? "#3D7A22" : isLast ? "#c62828" : "#1565C0";
    L.circleMarker([p.lat, p.lon], { radius: 6, color, fillColor: color, fillOpacity: 1 }).addTo(planLayerGroup);
  });
  refreshPlanStats();
  showElevation("plan", track);
}

async function routeSegment(from, to, mode) {
  const straight = [{ lat: from.lat, lon: from.lon }, { lat: to.lat, lon: to.lon }];
  if (mode === "straight") return { points: straight, ok: true };
  try {
    const url = `${BROUTER_URL}?lonlats=${from.lon},${from.lat}|${to.lon},${to.lat}` +
      `&profile=${mode}&alternativeidx=0&format=geojson`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    const coords = data.features[0].geometry.coordinates;
    const points = coords.map(([lon, lat, ele]) => (ele != null ? { lat, lon, ele } : { lat, lon }));
    if (points.length < 2) throw new Error("empty");
    return { points, ok: true };
  } catch (e) {
    return { points: straight, ok: false };
  }
}

async function addPlanPoint(lat, lon) {
  const point = { lat, lon };
  planWaypoints.push(point);
  if (planWaypoints.length === 1) {
    redrawPlan();
    return;
  }
  const from = planWaypoints[planWaypoints.length - 2];
  const segIndex = planWaypoints.length - 2;
  // Od razu rysujemy linię prostą, a potem podmieniamy ją na trasę po drogach.
  planSegments[segIndex] = [from, point];
  redrawPlan();

  const mode = document.getElementById("planMode").value;
  if (mode === "straight") return;
  const requestId = ++planRequestId;
  refreshPlanStats(t().planRouting);
  const result = await routeSegment(from, point, mode);
  // Użytkownik mógł w międzyczasie cofnąć punkt albo wyczyścić trasę.
  if (planWaypoints[segIndex] !== from || planWaypoints[segIndex + 1] !== point) return;
  planSegments[segIndex] = result.points;
  redrawPlan();
  if (!result.ok && requestId === planRequestId) alert(t().planRoutingError);
}

function undoPlanPoint() {
  planWaypoints.pop();
  planSegments.length = Math.max(planWaypoints.length - 1, 0);
  redrawPlan();
}

function clearPlan() {
  planWaypoints = [];
  planSegments = [];
  planEditingIndex = null;
  redrawPlan();
}

function savePlannedRoute() {
  if (planWaypoints.length < 2) {
    alert(t().planNeedPoints);
    return;
  }
  const routes = getPlannedRoutes();
  const existing = planEditingIndex != null ? routes[planEditingIndex] : null;
  const name = prompt(t().promptRouteName, existing ? existing.name : t().defaultRouteName);
  if (name === null) return;
  const track = getPlanTrack();
  const route = {
    name: name.trim() || t().defaultRouteName,
    created: existing ? existing.created : new Date().toISOString().slice(0, 10),
    mode: document.getElementById("planMode").value,
    distKm: trackDistanceKm(track).toFixed(2),
    waypoints: planWaypoints,
    segments: planSegments,
  };
  if (existing && existing.sharedId) route.sharedId = existing.sharedId;
  if (existing) routes[planEditingIndex] = route;
  else {
    routes.push(route);
    planEditingIndex = routes.length - 1;
  }
  savePlannedRoutes(routes);
  refreshSavedRoutesList();
  alert(t().routeSaved);
}

function loadPlannedRoute(index) {
  const route = getPlannedRoutes()[index];
  if (!route) return;
  initPlanMap();
  planWaypoints = route.waypoints;
  planSegments = route.segments;
  planEditingIndex = index;
  document.getElementById("planMode").value = route.mode;
  redrawPlan();
  const track = getPlanTrack();
  if (track.length >= 2) {
    planMapInstance.fitBounds(L.latLngBounds(track.map((p) => [p.lat, p.lon])), { padding: [20, 20] });
  }
  document.getElementById("planMap").scrollIntoView({ behavior: "smooth" });
}

function deletePlannedRoute(index) {
  if (!confirm(t().confirmDeleteRoute)) return;
  const routes = getPlannedRoutes();
  routes.splice(index, 1);
  savePlannedRoutes(routes);
  if (planEditingIndex === index) planEditingIndex = null;
  else if (planEditingIndex != null && planEditingIndex > index) planEditingIndex--;
  refreshSavedRoutesList();
}

function escapeXml(text) {
  return String(text).replace(/[<>&"']/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" }[c]));
}

// GPX z pojedynczym trackiem - Garmin Connect, Suunto app i Polar Flow importują go jako trasę do nawigacji.
function buildGpx(name, track) {
  const pts = track
    .map((p) => {
      const ele = p.ele != null ? `<ele>${p.ele}</ele>` : "";
      return `      <trkpt lat="${p.lat.toFixed(6)}" lon="${p.lon.toFixed(6)}">${ele}</trkpt>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Polska Adventure Ultra" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata><name>${escapeXml(name)}</name></metadata>
  <trk>
    <name>${escapeXml(name)}</name>
    <trkseg>
${pts}
    </trkseg>
  </trk>
</gpx>
`;
}

async function downloadGpx(name, track) {
  const fileName = (name.replace(/[^\p{L}\p{N}_-]+/gu, "_") || "trasa") + ".gpx";
  // Na telefonie systemowe "Udostępnij" pozwala od razu otworzyć plik np. w Suunto app.
  await saveFile(new File([buildGpx(name, track)], fileName, { type: "application/gpx+xml" }), name);
}

async function saveFile(file, title) {
  const isTouch = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
  if (isTouch && navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title });
      return;
    } catch (e) {
      if (e.name === "AbortError") return;
    }
  }
  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  a.click();
  URL.revokeObjectURL(url);
}

function exportCurrentPlan() {
  if (planWaypoints.length < 2) {
    alert(t().planNeedPoints);
    return;
  }
  const routes = getPlannedRoutes();
  const name = planEditingIndex != null && routes[planEditingIndex] ? routes[planEditingIndex].name : t().defaultRouteName;
  downloadGpx(name, getPlanTrack());
}

function plannedRouteTrack(route) {
  const track = [];
  route.segments.forEach((seg, i) => track.push(...(i === 0 ? seg : seg.slice(1))));
  return track;
}

function exportPlannedRoute(index) {
  const route = getPlannedRoutes()[index];
  if (!route) return;
  downloadGpx(route.name, plannedRouteTrack(route));
}

function refreshSavedRoutesList() {
  const list = document.getElementById("savedRoutesList");
  const routes = getPlannedRoutes();
  const dict = t();
  if (routes.length === 0) {
    list.innerHTML = `<p>${dict.noSavedRoutes}</p>`;
    return;
  }
  list.innerHTML = routes
    .map((r, index) =>
      `<div class="history-item">` +
      `<span>${escapeXml(r.name)} — ${r.distKm} km (${r.created})</span>` +
      `<div class="history-actions">` +
      `<button class="route-btn" data-index="${index}" title="${dict.editRouteTitle}">🗺</button>` +
      `<button class="gpx-btn" data-index="${index}" title="${dict.exportRouteTitle}">GPX</button>` +
      (isCommunityConfigured()
        ? `<button class="share-btn" data-index="${index}" title="${r.sharedId ? dict.unshareRouteTitle : dict.shareRouteTitle}">${r.sharedId ? "🌍" : "📤"}</button>`
        : "") +
      `<button class="delete-btn" data-index="${index}" title="${dict.deleteTitle}">🗑</button></div>` +
      `</div>`)
    .join("");

  list.querySelectorAll(".route-btn").forEach((btn) => {
    btn.addEventListener("click", () => loadPlannedRoute(parseInt(btn.dataset.index, 10)));
  });
  list.querySelectorAll(".gpx-btn").forEach((btn) => {
    btn.addEventListener("click", () => exportPlannedRoute(parseInt(btn.dataset.index, 10)));
  });
  list.querySelectorAll(".share-btn").forEach((btn) => {
    btn.addEventListener("click", () => toggleShareRoute(parseInt(btn.dataset.index, 10)));
  });
  list.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => deletePlannedRoute(parseInt(btn.dataset.index, 10)));
  });
}

// --- Społeczność: statystyki użytkowników i udostępnione aktywności (Supabase) ---
// Wszystko opt-in: statystyki tylko po zgodzie, aktywności tylko te, które użytkownik sam udostępni.
const SHARE_TRIM_KM = 0.3; // obcinamy początek i koniec trasy, żeby nie zdradzać adresu domu
let activityMapInstance = null;
let activityLayerGroup = null;
let activityCache = [];
let communityRoutesCache = [];

function isCommunityConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_KEY);
}

async function rpc(fn, args) {
  const headers = { apikey: SUPABASE_KEY, "Content-Type": "application/json" };
  // Stary format klucza "anon" (JWT) wymaga też nagłówka Authorization; nowy "publishable" - nie.
  if (SUPABASE_KEY.startsWith("eyJ")) headers.Authorization = `Bearer ${SUPABASE_KEY}`;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers,
    body: JSON.stringify(args || {}),
  });
  if (!res.ok) throw new Error(`${fn}: HTTP ${res.status}`);
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

function randomToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function getDeviceId() {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

function getShareTokens() {
  try {
    return JSON.parse(localStorage.getItem(SHARE_TOKENS_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function saveShareTokens(tokens) {
  localStorage.setItem(SHARE_TOKENS_KEY, JSON.stringify(tokens));
}

function initCommunity() {
  document.getElementById("tabActivityBtn").style.display = isCommunityConfigured() ? "" : "none";
  document.getElementById("communityPrivacyControls").style.display = isCommunityConfigured() ? "" : "none";
  if (!isCommunityConfigured()) return;
  const consent = localStorage.getItem(STATS_CONSENT_KEY);
  document.getElementById("consentCard").style.display = consent ? "none" : "block";
  if (consent === "yes") pingIfNeeded();
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && localStorage.getItem(STATS_CONSENT_KEY) === "yes") pingIfNeeded();
  });
}

// Ping co najwyżej co 10 minut (licznik „aktywni w ostatniej godzinie”), ponawiany po powrocie do aplikacji.
const PING_INTERVAL_MS = 10 * 60 * 1000;
async function pingIfNeeded() {
  const last = Number(localStorage.getItem(LAST_PING_KEY)); // stary format (data) → NaN → ping
  if (last && Date.now() - last < PING_INTERVAL_MS) return;
  try {
    await rpc("ping", { p_device: getDeviceId() });
    localStorage.setItem(LAST_PING_KEY, String(Date.now()));
  } catch (e) {
    console.warn("ping failed", e);
  }
}

function setStatsConsent(agreed) {
  localStorage.setItem(STATS_CONSENT_KEY, agreed ? "yes" : "no");
  document.getElementById("consentCard").style.display = "none";
  document.getElementById("statsConsentToggle").checked = agreed;
  if (agreed) {
    pingIfNeeded();
  } else if (localStorage.getItem(DEVICE_ID_KEY)) {
    // Wycofanie zgody: kasujemy identyfikator z serwera i z telefonu.
    const id = localStorage.getItem(DEVICE_ID_KEY);
    rpc("forget_device", { p_device: id }).catch((e) => console.warn("forget failed", e));
    localStorage.removeItem(DEVICE_ID_KEY);
    localStorage.removeItem(LAST_PING_KEY);
  }
}

function refreshPrivacyText() {
  const el = document.getElementById("privacyText");
  if (el) el.innerHTML = t().privacyHtml(escapeXml(ADMIN_CONTACT), isCommunityConfigured());
}

function refreshHelpText() {
  const el = document.getElementById("helpText");
  if (el) el.innerHTML = t().helpHtml(isCommunityConfigured(), escapeXml(ADMIN_CONTACT));
}

function showHelp() {
  refreshHelpText();
  const card = document.getElementById("helpCard");
  card.style.display = "block";
  card.scrollIntoView({ behavior: "smooth" });
}

const APP_URL = "https://polskaadventureultra.github.io/polska-adventure-ultra-pwa/";

async function shareAppLink() {
  if (navigator.share) {
    try {
      await navigator.share({ title: "Polska Adventure Ultra", text: t().shareAppText, url: APP_URL });
      return;
    } catch (e) {
      if (e.name === "AbortError") return;
    }
  }
  try {
    await navigator.clipboard.writeText(APP_URL);
    alert(t().appLinkCopied);
  } catch (e) {
    prompt(t().shareAppBtn, APP_URL);
  }
}

// Obrazek z kodem QR przez systemowe "Udostępnij" (telefon i komputer); pobranie PNG tylko gdy przeglądarka nie umie udostępniać plików.
async function shareAppQr() {
  let file;
  try {
    const res = await fetch("qr/qr-aplikacja.png");
    if (!res.ok) throw new Error(res.status);
    file = new File([await res.blob()], "polska-adventure-ultra-qr.png", { type: "image/png" });
  } catch (e) {
    alert(t().communityError);
    return;
  }
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: "Polska Adventure Ultra", text: `${t().shareAppText} ${APP_URL}` });
      return;
    } catch (e) {
      if (e.name === "AbortError") return;
    }
  }
  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  a.click();
  URL.revokeObjectURL(url);
}

function showPrivacy() {
  refreshPrivacyText();
  document.getElementById("statsConsentToggle").checked = localStorage.getItem(STATS_CONSENT_KEY) === "yes";
  const card = document.getElementById("privacyCard");
  card.style.display = "block";
  card.scrollIntoView({ behavior: "smooth" });
}

// Usuwa punkty z pierwszych i ostatnich SHARE_TRIM_KM trasy. Za krótka trasa nie jest udostępniana wcale.
function trimRouteEnds(route) {
  if (!route || route.length < 2) return null;
  const cum = [0];
  for (let i = 1; i < route.length; i++) {
    cum.push(cum[i - 1] + haversineKm(route[i - 1].lat, route[i - 1].lon, route[i].lat, route[i].lon));
  }
  const total = cum[cum.length - 1];
  const kept = route.filter((_, i) => cum[i] >= SHARE_TRIM_KM && cum[i] <= total - SHARE_TRIM_KM);
  if (kept.length < 2) return null;
  // Trzeci element (opcjonalny) = wysokość n.p.m. w metrach - do profilu wysokości u innych.
  return kept.map((p) => (Number.isFinite(p.ele)
    ? [Number(p.lat.toFixed(5)), Number(p.lon.toFixed(5)), Math.round(p.ele)]
    : [Number(p.lat.toFixed(5)), Number(p.lon.toFixed(5))]));
}

async function toggleShareTraining(index) {
  const history = getHistory();
  const entry = history[index];
  if (!entry) return;
  if (entry.sharedId) {
    if (!confirm(t().confirmUnshare)) return;
    const ok = await deleteSharedActivity(entry.sharedId);
    if (!ok) return;
    delete entry.sharedId;
    saveHistory(history);
    refreshHistoryList();
    alert(t().unshared);
    return;
  }

  const route = trimRouteEnds(entry.route);
  if (!confirm(t().shareConfirm(Boolean(route)))) return;
  const nick = prompt(t().promptNick, localStorage.getItem(NICK_KEY) || "");
  if (nick === null) return;
  const trimmedNick = nick.trim();
  if (trimmedNick.length < 1 || trimmedNick.length > 30) {
    alert(t().nickInvalid);
    return;
  }
  localStorage.setItem(NICK_KEY, trimmedNick);

  const token = randomToken();
  try {
    const time = parseFloat(entry.time);
    const id = await rpc("share_activity", {
      p_nick: trimmedNick,
      p_disc: entry.disc,
      p_date: entry.date,
      p_dist_km: parseFloat(entry.dist),
      p_time_min: time > 0 ? time : null,
      p_route: route,
      p_delete_token: token,
    });
    const tokens = getShareTokens();
    tokens[id] = token;
    saveShareTokens(tokens);
    entry.sharedId = id;
    saveHistory(history);
    refreshHistoryList();
    alert(t().shared);
  } catch (e) {
    alert(t().communityError);
  }
}

// Usuwa udostępnienie z serwera; zwraca true, gdy wpisu już tam nie ma.
async function deleteSharedActivity(id) {
  const tokens = getShareTokens();
  if (tokens[id]) {
    try {
      await rpc("delete_activity", { p_id: id, p_delete_token: tokens[id] });
    } catch (e) {
      alert(t().deleteFailed);
      return false;
    }
    delete tokens[id];
    saveShareTokens(tokens);
  }
  const history = getHistory();
  history.forEach((item) => {
    if (item.sharedId === id) delete item.sharedId;
  });
  saveHistory(history);
  return true;
}

async function deleteAllMyShares() {
  const ids = Object.keys(getShareTokens());
  const routeIds = Object.keys(getRouteShareTokens());
  if (ids.length === 0 && routeIds.length === 0) {
    alert(t().noShares);
    return;
  }
  if (!confirm(t().confirmDeleteAllShares)) return;
  let deleted = 0;
  for (const id of ids) {
    const tokens = getShareTokens();
    try {
      await rpc("delete_activity", { p_id: id, p_delete_token: tokens[id] });
      delete tokens[id];
      saveShareTokens(tokens);
      deleted++;
    } catch (e) {
      console.warn("delete failed", id, e);
    }
  }
  for (const id of routeIds) {
    if (await deleteSharedRoute(id, true)) deleted++;
  }
  const history = getHistory();
  history.forEach((item) => {
    if (item.sharedId && !getShareTokens()[item.sharedId]) delete item.sharedId;
  });
  saveHistory(history);
  refreshHistoryList();
  refreshSavedRoutesList();
  alert(deleted === ids.length + routeIds.length ? t().deletedAllShares(deleted) : t().deleteFailed);
}

function statTile(value, label) {
  return `<div class="stat-tile"><div class="stat-value">${value}</div><div class="stat-label">${label}</div></div>`;
}

// --- Wydarzenia (dodaje tylko organizator; zapisy anonimowe) ---
let eventsCache = [];
let eventMapInstance = null;
let eventMapMarker = null;
let eventPoint = null; // { lat, lon } wybrane na mapie w formularzu

function getEventTokens() {
  try {
    return JSON.parse(localStorage.getItem(EVENT_TOKENS_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function saveEventTokens(tokens) {
  localStorage.setItem(EVENT_TOKENS_KEY, JSON.stringify(tokens));
}

function getEventsDone() {
  try {
    const done = JSON.parse(localStorage.getItem(EVENTS_DONE_KEY));
    return done && typeof done === "object" && !Array.isArray(done) ? done : {};
  } catch (e) {
    return {};
  }
}

function saveEventsDone(done) {
  localStorage.setItem(EVENTS_DONE_KEY, JSON.stringify(done));
}

// Wydarzenie ukryte na serwerze dla zapisów 12 h po starcie - potem trafia do sekcji „Zakończone”.
const EVENT_ACTIVE_MS = 12 * 3600 * 1000;

async function toggleEventDone(ev) {
  const dict = t();
  const done = getEventsDone();
  const entry = done[ev.id];
  if (entry) {
    if (entry.token) {
      try {
        ev.completed = await rpc("uncomplete_event", { p_id: ev.id, p_token: entry.token });
      } catch (e) {
        alert(dict.communityError);
        return;
      }
    }
    delete done[ev.id];
    saveEventsDone(done);
    renderEvents();
    return;
  }
  const choice = await askEventDoneShare();
  if (!choice) return; // Anuluj - nic nie zaznaczamy
  let nick = null;
  if (choice === "share") {
    nick = askNick();
    if (!nick) return; // bez nicku nic nie zaznaczamy - można wybrać jeszcze raz
  }
  const newEntry = { title: ev.title, disc: ev.disc, starts_at: ev.starts_at, done_at: new Date().toISOString() };
  if (choice === "share" || choice === "anon") {
    const token = randomToken();
    try {
      ev.completed = await rpc("complete_event", { p_id: ev.id, p_token: token });
      newEntry.token = token;
      newEntry.nick = nick;
    } catch (e) {
      alert(dict.eventDoneShareFailed);
    }
  }
  done[ev.id] = newEntry;
  saveEventsDone(done);
  renderEvents();
  openTrainingFromEvent(ev);
}

// Okno wyboru po „Zrobione”: "share" (z nickiem) / "anon" / "local" / null (anulowano: Anuluj, tło albo Esc).
function askEventDoneShare() {
  const dict = t();
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML =
      `<div class="card modal-card" role="dialog" aria-modal="true" aria-labelledby="eventDoneDialogTitle">` +
      `<h3 id="eventDoneDialogTitle">${dict.eventDoneDialogTitle}</h3>` +
      `<p>${dict.eventDoneDialogText}</p>` +
      `<button class="primary" data-choice="share">${dict.eventDoneShareBtn}</button>` +
      `<button data-choice="anon">${dict.eventDoneShareAnonBtn}</button>` +
      `<button data-choice="local">${dict.eventDoneLocalBtn}</button>` +
      `<button class="link-btn" data-choice="">${dict.eventDoneCancelBtn}</button>` +
      `</div>`;
    const close = (value) => {
      document.removeEventListener("keydown", onKey);
      overlay.remove();
      resolve(value || null);
    };
    const onKey = (e) => { if (e.key === "Escape") close(null); };
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) return close(null);
      const btn = e.target.closest("button[data-choice]");
      if (btn) close(btn.dataset.choice);
    });
    document.addEventListener("keydown", onKey);
    document.body.appendChild(overlay);
    overlay.querySelector("button.primary").focus();
  });
}

// Lista wyników wydarzenia (dla wszystkich) - w kolejności ukończenia, z profilem wysokości.
async function showEventResults(ev) {
  const dict = t();
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.innerHTML =
    `<div class="card modal-card results-card" role="dialog" aria-modal="true" aria-labelledby="eventResultsTitle">` +
    `<h3 id="eventResultsTitle">${escapeXml(dict.eventResultsTitle(ev.title))}</h3>` +
    `<div class="results-body"><p>${dict.loading}</p></div>` +
    `<button class="link-btn results-close">${dict.eventResultsClose}</button></div>`;
  const close = () => { document.removeEventListener("keydown", onKey); overlay.remove(); };
  const onKey = (e) => { if (e.key === "Escape") close(); };
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay || e.target.closest(".results-close")) close();
  });
  document.addEventListener("keydown", onKey);
  document.body.appendChild(overlay);
  overlay.querySelector(".results-close").focus();
  const body = overlay.querySelector(".results-body");
  let rows;
  try {
    rows = (await rpc("list_event_results", { p_id: ev.id })) || [];
  } catch (e) {
    body.innerHTML = `<p>${dict.communityError}</p>`;
    return;
  }
  if (rows.length === 0) {
    body.innerHTML = `<p class="hint-text">${dict.eventResultsEmpty}</p>`;
    return;
  }
  body.innerHTML = `<ol class="results-list">` + rows.map((r, i) => {
    const hasElev = Array.isArray(r.elev) && r.elev.length >= 2;
    return `<li><div class="results-row"><span class="results-nick">${escapeXml(r.nick || dict.eventResultsAnon)}</span>` +
      `<b>${escapeXml(formatResult(r.dist_km, r.time_min))}</b>` +
      (hasElev ? `<button class="results-elev-btn" data-i="${i}">${dict.eventResultsProfile}</button>` : "") +
      `</div><div class="results-elev" data-i="${i}" hidden><canvas class="elevation-canvas"></canvas><p class="elevation-stats"></p></div></li>`;
  }).join("") + `</ol>`;
  body.querySelectorAll(".results-elev-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const box = body.querySelector(`.results-elev[data-i="${btn.dataset.i}"]`);
      box.hidden = !box.hidden;
      if (!box.hidden) {
        const pts = rows[parseInt(btn.dataset.i, 10)].elev
          .filter((p) => Array.isArray(p) && Number.isFinite(p[0]) && Number.isFinite(p[1]))
          .map((p) => ({ km: p[0], ele: p[1] }));
        requestAnimationFrame(() => drawProfile(box.querySelector("canvas"), box.querySelector("p"), pts));
      }
    });
  });
}

// Po „Zrobione” - formularz treningu z dyscypliną, datą i nazwą wydarzenia w notatkach.
function openTrainingFromEvent(ev) {
  showTab("train");
  if (DISCIPLINES.includes(ev.disc)) document.getElementById("discipline").value = ev.disc;
  updateDisciplineUi();
  document.getElementById("date").value = toYmd(new Date(ev.starts_at));
  const notes = document.getElementById("notes");
  if (!notes.value.trim()) notes.value = `📅 ${ev.title}`;
  clearFieldState("dist");
  clearFieldState("time");
  showTrainHint(t().eventDoneFillTraining(ev.title));
  pendingEventDone = { id: ev.id, ymd: toYmd(new Date(ev.starts_at)) };
  window.scrollTo(0, 0);
  if (!document.getElementById("dist").value) markFieldAttention("dist");
  if (!document.getElementById("time").value) markFieldAttention("time");
  const dist = document.getElementById("dist");
  if (dist.focus) dist.focus({ preventScroll: true });
}

async function removeEventDone(id) {
  const done = getEventsDone();
  const entry = done[id];
  if (!entry) return;
  if (entry.token) {
    try {
      const n = await rpc("uncomplete_event", { p_id: id, p_token: entry.token });
      const ev = eventsCache.find((e) => e.id === id);
      if (ev) ev.completed = n;
    } catch (e) {
      alert(t().communityError);
      return;
    }
  }
  delete done[id];
  saveEventsDone(done);
  renderEvents();
}

// Twój wynik z wydarzenia = trening z Historii powiązany z nim (pole event) albo - dla starszych
// wpisów - trening z tego dnia z notatką „📅 nazwa”. Usunięcie treningu usuwa też wynik.
function eventResultTraining(id, ev) {
  const ymd = toYmd(new Date(ev.starts_at));
  const prefix = `📅 ${ev.title}`;
  const history = getHistory();
  const match = history.find((h) => h.event === id) ||
    history.find((h) => !h.event && h.date === ymd && typeof h.notes === "string" && h.notes.startsWith(prefix));
  return match && parseFloat(match.dist) > 0 ? match : null;
}

function formatResult(dist, time) {
  const mins = parseFloat(time);
  return `${parseFloat(dist).toFixed(1)} km` + (mins > 0 ? ` · ${formatDuration(mins)}` : "");
}

function eventResult(id, ev) {
  const match = eventResultTraining(id, ev);
  return match ? formatResult(match.dist, match.time) : "";
}

// Profil wysokości do wysłania: [[km, m], ...] (≤150 punktów, bez współrzędnych).
function elevationProfilePoints(track, maxPoints = 150) {
  const pts = profileFromTrack((track || []).filter((p) => Number.isFinite(p.ele)));
  if (pts.length < 2) return null;
  const step = Math.max(1, Math.ceil(pts.length / maxPoints));
  const picked = pts.filter((_, i) => i % step === 0);
  if (picked[picked.length - 1] !== pts[pts.length - 1]) picked.push(pts[pts.length - 1]);
  return picked.slice(-maxPoints).map((p) => [Math.round(p.km * 100) / 100, Math.round(p.ele)]);
}

// Wysyła (albo usuwa) publiczny wynik dla ukończeń udostępnionych wszystkim. Wysyła tylko,
// gdy wynik się zmienił od ostatniego wysłania; błąd sieci = spróbujemy przy kolejnym odświeżeniu.
async function syncEventResult(id) {
  const done = getEventsDone();
  const entry = done[id];
  if (!entry || !entry.token) return;
  const match = eventResultTraining(id, entry);
  const payload = match
    ? { dist: Math.round(parseFloat(match.dist) * 100) / 100, time: parseFloat(match.time) > 0 ? parseFloat(match.time) : null,
        elev: elevationProfilePoints(match.route) }
    : null;
  const sig = JSON.stringify([entry.nick || null, payload]);
  if (entry.sentSig === sig) return;
  if (!payload && !entry.sentSig) return; // nic nie wysłano, nic do usuwania
  try {
    await rpc("set_event_result", {
      p_id: id, p_token: entry.token, p_nick: entry.nick || null,
      p_dist_km: payload ? payload.dist : null, p_time_min: payload ? payload.time : null, p_elev: payload ? payload.elev : null,
    });
    const fresh = getEventsDone();
    if (fresh[id]) { fresh[id].sentSig = sig; saveEventsDone(fresh); }
  } catch (e) {
    // offline albo wydarzenie już poza oknem 7 dni - zostawiamy, spróbujemy później
  }
}

function syncAllEventResults() {
  const visible = new Set(eventsCache.map((ev) => ev.id));
  Object.keys(getEventsDone()).filter((id) => visible.has(id)).forEach((id) => syncEventResult(id));
}

// Lista ukończonych wydarzeń - trzymana lokalnie, bo serwer usuwa wydarzenia po 30 dniach.
function eventsDoneHtml(dict) {
  const entries = Object.entries(getEventsDone())
    .sort((a, b) => String(b[1].starts_at).localeCompare(String(a[1].starts_at)));
  if (entries.length === 0) return "";
  const items = entries.map(([id, ev]) => {
    const when = new Date(ev.starts_at).toLocaleDateString(dict.dateLocale, { day: "numeric", month: "long", year: "numeric" });
    const result = eventResult(id, ev);
    return `<li>✅ <b>${escapeXml(ev.title)}</b> · ${dict.discNames[ev.disc] || escapeXml(ev.disc)} · ${escapeXml(when)}` +
      (result ? ` · <b class="event-result-km">${escapeXml(result)}</b>` : "") +
      (ev.token ? ` <span class="hint-text">${dict.eventDoneSharedTag}</span>` : "") +
      ` <button class="done-remove-btn" data-id="${escapeXml(id)}" title="${dict.eventDoneRemoveTitle}">✕</button></li>`;
  }).join("");
  return `<details class="events-done"><summary>${dict.eventsDoneTitle(entries.length)}</summary><ul>${items}</ul></details>`;
}

function getAdminKey() {
  return localStorage.getItem(ADMIN_KEY_KEY);
}

async function refreshEvents() {
  const listEl = document.getElementById("eventsList");
  const dict = t();
  listEl.innerHTML = `<p>${dict.loading}</p>`;
  try {
    eventsCache = (await rpc("list_events_v2")) || [];
    renderEvents();
    syncAllEventResults();
  } catch (e) {
    listEl.innerHTML = `<p>${dict.communityError}</p>`;
  }
}

function eventCountdown(startsAt) {
  const dict = t();
  const days = Math.round((parseYmd(toYmd(startsAt)) - parseYmd(toYmd(new Date()))) / 86400000);
  if (days <= 0) return dict.eventToday;
  if (days === 1) return dict.eventTomorrow;
  return dict.eventInDays(days);
}

function eventResultLine(id, doneEntry, dict) {
  const result = eventResult(id, doneEntry);
  return result
    ? `<div class="event-result">${dict.eventYourResult} <b>${escapeXml(result)}</b></div>`
    : `<div class="event-result hint-text">${dict.eventNoResult}</div>`;
}

function eventItemHtml(ev, index, ctx) {
  const { dict, tokens, doneMap, isAdmin, now } = ctx;
  const start = new Date(ev.starts_at);
  const active = start.getTime() > now - EVENT_ACTIVE_MS; // jeszcze można się zapisać
  const when = start.toLocaleString(dict.dateLocale, {
    weekday: "short", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit",
  });
  const joined = Boolean(tokens[ev.id]);
  const count = Number(ev.participants) || 0;
  const completed = Number(ev.completed) || 0;
  const hasPoint = Number.isFinite(ev.lat) && Number.isFinite(ev.lon);
  const nav = active && hasPoint
    ? `<a href="https://www.google.com/maps/search/?api=1&query=${ev.lat},${ev.lon}" target="_blank" rel="noopener">${dict.eventNavigate}</a>`
    : "";
  // Link przychodzi z bazy, gdzie musi zaczynać się od https:// - i tak sprawdzamy jeszcze raz.
  const link = typeof ev.link === "string" && ev.link.startsWith("https://")
    ? `<a href="${escapeXml(ev.link)}" target="_blank" rel="noopener">${dict.eventLink}</a>`
    : "";
  const del = isAdmin ? `<button class="delete-btn" data-index="${index}" title="${dict.deleteTitle}">🗑</button>` : "";
  const join = active
    ? `<button class="join-btn${joined ? " joined" : ""}" data-index="${index}" title="${joined ? dict.leaveTitle : dict.joinTitle}">` +
      `${joined ? dict.joinedBtn(count) : dict.joinBtn(count)}</button>`
    : `<span class="event-stat">${dict.eventWent(count)}</span>`;
  // „Zrobione” pojawia się dopiero, gdy wydarzenie się zaczęło; liczba ukończeń widoczna dla wszystkich.
  const isDone = Boolean(doneMap[ev.id]);
  const doneBtn = isDone || start.getTime() <= now
    ? `<button class="done-btn${isDone ? " done" : ""}" data-index="${index}" title="${isDone ? dict.eventUndoneTitle : dict.eventDoneTitle}">` +
      `${isDone ? dict.eventDoneMark(completed) : dict.eventDoneBtn(completed)}</button>`
    : "";
  const ics = active ? `<button class="ics-btn" data-index="${index}">${dict.eventCalendar}</button>` : "";
  const results = start.getTime() <= now && completed > 0
    ? `<button class="results-btn" data-index="${index}">${dict.eventResultsBtn(completed)}</button>` : "";
  return `<div class="event-item${isDone ? " event-done" : ""}${active ? "" : " event-past"}">` +
    `<div class="event-date">📅 ${escapeXml(when)}${active ? `<span class="event-countdown">${eventCountdown(start)}</span>` : ""}</div>` +
    `<div class="event-title"><b>${escapeXml(ev.title)}</b> · ${dict.discNames[ev.disc] || escapeXml(ev.disc)}</div>` +
    `<div class="hint-text">📍 ${escapeXml(ev.place)}</div>` +
    (isDone ? eventResultLine(ev.id, doneMap[ev.id], dict) : "") +
    (active && ev.description ? `<div class="event-desc">${escapeXml(ev.description)}</div>` : "") +
    `<div class="event-actions">${join}${doneBtn}${results}${nav}${link}${ics}${del}</div>` +
    `</div>`;
}

function renderEvents() {
  const listEl = document.getElementById("eventsList");
  const dict = t();
  const isAdmin = Boolean(getAdminKey());
  document.getElementById("eventAddBtn").style.display =
    isAdmin && document.getElementById("eventForm").style.display === "none" ? "block" : "none";
  document.getElementById("organizerBtn").textContent = isAdmin ? dict.organizerLogout : dict.organizerLogin;
  const now = Date.now();
  const ctx = { dict, tokens: getEventTokens(), doneMap: getEventsDone(), isAdmin, now };
  const indexed = eventsCache.map((ev, index) => ({ ev, index }));
  const isActive = ({ ev }) => new Date(ev.starts_at).getTime() > now - EVENT_ACTIVE_MS;
  const active = indexed.filter(isActive);
  const past = indexed.filter((x) => !isActive(x)).reverse(); // najnowsze zakończone na górze
  const activeHtml = active.length === 0
    ? `<p>${dict.noEvents}</p>`
    : active.map(({ ev, index }) => eventItemHtml(ev, index, ctx)).join("");
  const pastHtml = past.length === 0 ? "" :
    `<h3 class="events-past-title">${dict.eventsPastTitle}</h3>` +
    past.map(({ ev, index }) => eventItemHtml(ev, index, ctx)).join("");
  listEl.innerHTML = activeHtml + pastHtml + eventsDoneHtml(dict);
  const on = (selector, handler) => listEl.querySelectorAll(selector).forEach((btn) => {
    btn.addEventListener("click", () => handler(eventsCache[parseInt(btn.dataset.index, 10)]));
  });
  on(".join-btn", toggleJoinEvent);
  on(".ics-btn", downloadEventIcs);
  on(".delete-btn", deleteEvent);
  on(".done-btn", toggleEventDone);
  on(".results-btn", showEventResults);
  listEl.querySelectorAll(".done-remove-btn").forEach((btn) => {
    btn.addEventListener("click", () => removeEventDone(btn.dataset.id));
  });
}

async function toggleJoinEvent(ev) {
  const tokens = getEventTokens();
  try {
    if (tokens[ev.id]) {
      ev.participants = await rpc("leave_event", { p_id: ev.id, p_token: tokens[ev.id] });
      delete tokens[ev.id];
    } else {
      const token = randomToken();
      ev.participants = await rpc("join_event", { p_id: ev.id, p_token: token });
      tokens[ev.id] = token;
    }
    saveEventTokens(tokens);
    renderEvents();
  } catch (e) {
    alert(t().communityError);
  }
}

function icsText(text) {
  return String(text).replace(/\\/g, "\\\\").replace(/[;,]/g, (c) => "\\" + c).replace(/\r?\n/g, "\\n");
}

function icsDate(d) {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function downloadEventIcs(ev) {
  const start = new Date(ev.starts_at);
  const end = new Date(start.getTime() + 2 * 3600000); // czas trwania nieznany - zakładamy 2 h
  const description = [ev.description, ev.link].filter(Boolean).join("\n\n");
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Polska Adventure Ultra//PL",
    "BEGIN:VEVENT",
    `UID:${ev.id}@polskaadventureultra`,
    `DTSTAMP:${icsDate(new Date())}`,
    `DTSTART:${icsDate(start)}`,
    `DTEND:${icsDate(end)}`,
    `SUMMARY:${icsText(ev.title)}`,
    `LOCATION:${icsText(ev.place)}`,
    `DESCRIPTION:${icsText(description)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  saveFile(new File([ics], "wydarzenie.ics", { type: "text/calendar" }), ev.title);
}

async function toggleOrganizer() {
  const dict = t();
  if (getAdminKey()) {
    localStorage.removeItem(ADMIN_KEY_KEY);
    showEventForm(false);
    renderChallenge();
    return;
  }
  const key = prompt(dict.promptAdminKey);
  if (!key) return;
  try {
    if (!(await rpc("admin_check", { p_admin_key: key.trim() }))) {
      alert(dict.adminKeyInvalid);
      return;
    }
  } catch (e) {
    alert(dict.communityError);
    return;
  }
  localStorage.setItem(ADMIN_KEY_KEY, key.trim());
  alert(dict.adminLoggedIn);
  renderEvents();
  renderChallenge();
}

function showEventForm(visible) {
  document.getElementById("eventForm").style.display = visible ? "block" : "none";
  if (visible) {
    ["eventTitle", "eventStart", "eventPlace", "eventDesc", "eventLink"].forEach((id) => {
      document.getElementById(id).value = "";
    });
    eventPoint = null;
    if (!eventMapInstance) {
      eventMapInstance = L.map("eventMap").setView([52.1, 19.4], 6);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(eventMapInstance);
      eventMapInstance.on("click", (e) => {
        eventPoint = { lat: e.latlng.lat, lon: e.latlng.lng };
        if (eventMapMarker) eventMapMarker.remove();
        eventMapMarker = L.circleMarker([eventPoint.lat, eventPoint.lon], {
          radius: 8, color: "#c62828", fillColor: "#c62828", fillOpacity: 1,
        }).addTo(eventMapInstance);
      });
    }
    if (eventMapMarker) {
      eventMapMarker.remove();
      eventMapMarker = null;
    }
    requestAnimationFrame(() => eventMapInstance.invalidateSize());
  }
  renderEvents();
}

async function publishEvent() {
  const dict = t();
  const title = document.getElementById("eventTitle").value.trim();
  const startValue = document.getElementById("eventStart").value;
  const place = document.getElementById("eventPlace").value.trim();
  const link = document.getElementById("eventLink").value.trim();
  if (!title || !startValue || !place) {
    alert(dict.eventMissingFields);
    return;
  }
  if (link && !link.startsWith("https://")) {
    alert(dict.eventLinkInvalid);
    return;
  }
  try {
    await rpc("admin_create_event", {
      p_admin_key: getAdminKey(),
      p_title: title,
      p_disc: document.getElementById("eventDisc").value,
      p_starts_at: new Date(startValue).toISOString(), // datetime-local = czas lokalny telefonu
      p_place: place,
      p_lat: eventPoint ? Number(eventPoint.lat.toFixed(5)) : null,
      p_lon: eventPoint ? Number(eventPoint.lon.toFixed(5)) : null,
      p_description: document.getElementById("eventDesc").value.trim(),
      p_link: link || null,
    });
  } catch (e) {
    alert(t().communityError);
    return;
  }
  alert(dict.eventPublished);
  showEventForm(false);
  refreshEvents();
}

async function deleteEvent(ev) {
  if (!confirm(t().confirmDeleteEvent)) return;
  try {
    await rpc("admin_delete_event", { p_admin_key: getAdminKey(), p_id: ev.id });
  } catch (e) {
    alert(t().deleteFailed);
    return;
  }
  const tokens = getEventTokens();
  delete tokens[ev.id];
  saveEventTokens(tokens);
  refreshEvents();
}

async function refreshActivityTab() {
  const statsEl = document.getElementById("communityStats");
  const listEl = document.getElementById("activityList");
  const dict = t();
  if (!isCommunityConfigured()) {
    statsEl.innerHTML = "";
    listEl.innerHTML = `<p>${dict.communityOff}</p>`;
    return;
  }
  refreshEvents();
  listEl.innerHTML = `<p>${dict.loading}</p>`;
  try {
    const [stats, activities] = await Promise.all([rpc("get_stats"), rpc("list_activities", { p_limit: 50 })]);
    statsEl.innerHTML =
      statTile(stats.users_total, dict.statUsers) +
      statTile(stats.users_active_7d, dict.statActive) +
      statTile(stats.activities_total, dict.statActivities) +
      statTile(Number(stats.km_total).toFixed(1), dict.statKm) +
      statTile(stats.routes_total || 0, dict.statRoutes);
    activityCache = activities || [];
    renderActivityList();
  } catch (e) {
    listEl.innerHTML = `<p>${dict.communityError}</p>`;
  }
  // Osobno, żeby błąd tras nie psuł listy aktywności.
  const routesEl = document.getElementById("communityRoutesList");
  try {
    communityRoutesCache = (await rpc("list_routes", { p_limit: 50 })) || [];
    renderCommunityRoutesList();
  } catch (e) {
    routesEl.innerHTML = `<p>${dict.communityError}</p>`;
  }
}

function renderActivityList() {
  const listEl = document.getElementById("activityList");
  const dict = t();
  if (activityCache.length === 0) {
    listEl.innerHTML = `<p>${dict.noActivities}</p>`;
    return;
  }
  const tokens = getShareTokens();
  listEl.innerHTML = activityCache
    .map((a, index) => {
      const mine = Boolean(tokens[a.id]);
      const discName = dict.discNames[a.disc] || escapeXml(a.disc);
      const time = a.time_min ? `, ${Math.round(a.time_min)} min` : "";
      const mapBtn = Array.isArray(a.route) && a.route.length >= 2
        ? `<button class="route-btn" data-index="${index}" title="${dict.showRouteTitle}">🗺</button>`
        : "";
      const delBtn = mine
        ? `<button class="delete-btn" data-index="${index}" title="${dict.deleteTitle}">🗑</button>`
        : "";
      return `<div class="history-item">` +
        `<span><span class="activity-nick">${escapeXml(a.nick)}</span>${mine ? " " + dict.mineLabel : ""} — ` +
        `${discName}, ${Number(a.dist_km).toFixed(2)} km${time} (${escapeXml(a.activity_date)})</span>` +
        `<div class="history-actions">${mapBtn}${delBtn}</div></div>`;
    })
    .join("");

  listEl.querySelectorAll(".route-btn").forEach((btn) => {
    btn.addEventListener("click", () => showActivityRoute(parseInt(btn.dataset.index, 10)));
  });
  listEl.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!confirm(t().confirmUnshare)) return;
      const a = activityCache[parseInt(btn.dataset.index, 10)];
      if (await deleteSharedActivity(a.id)) {
        refreshHistoryList();
        refreshActivityTab();
      }
    });
  });
}

function showActivityRoute(index) {
  const a = activityCache[index];
  if (!a || !Array.isArray(a.route)) return;
  // Dane z serwera - bierzemy tylko poprawne liczby.
  const points = a.route.filter((p) => Array.isArray(p) && Number.isFinite(p[0]) && Number.isFinite(p[1]));
  const latlngs = points.map((p) => [p[0], p[1]]);
  if (latlngs.length < 2) return;
  // Starsze udostępnienia mają tylko [lat, lon] - wtedy bez profilu wysokości.
  const track = points.map((p) => (Number.isFinite(p[2]) && p[2] >= -500 && p[2] <= 9000
    ? { lat: p[0], lon: p[1], ele: p[2] } : { lat: p[0], lon: p[1] }));

  drawOnActivityMap(`${a.nick} — ${Number(a.dist_km).toFixed(2)} km`, latlngs, track);
}

function drawOnActivityMap(title, latlngs, track) {
  const card = document.getElementById("activityRouteCard");
  card.style.display = "block";
  document.getElementById("activityRouteTitle").textContent = title;
  if (!activityMapInstance) {
    activityMapInstance = L.map("activityMap");
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(activityMapInstance);
    activityLayerGroup = L.layerGroup().addTo(activityMapInstance);
  }
  activityLayerGroup.clearLayers();
  const polyline = L.polyline(latlngs, { color: "#3D7A22", weight: 4 }).addTo(activityLayerGroup);
  requestAnimationFrame(() => {
    activityMapInstance.invalidateSize();
    activityMapInstance.fitBounds(polyline.getBounds(), { padding: [20, 20] });
  });
  showElevation("activity", track);
  card.scrollIntoView({ behavior: "smooth" });
}

// --- Trasy społeczności: udostępnianie zaplanowanych tras ---
const SHARED_ROUTE_MAX_POINTS = 1200;

function getRouteShareTokens() {
  try {
    return JSON.parse(localStorage.getItem(ROUTE_SHARE_TOKENS_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function saveRouteShareTokens(tokens) {
  localStorage.setItem(ROUTE_SHARE_TOKENS_KEY, JSON.stringify(tokens));
}

// Upraszczanie trasy (Douglas-Peucker) - trasa z BRoutera potrafi mieć tysiące punktów.
function simplifyTrack(track, tolerance) {
  if (track.length <= 2) return track.slice();
  const keep = new Array(track.length).fill(false);
  keep[0] = keep[track.length - 1] = true;
  const stack = [[0, track.length - 1]];
  while (stack.length) {
    const [start, end] = stack.pop();
    const a = track[start], b = track[end];
    let maxDist = 0, maxIndex = -1;
    for (let i = start + 1; i < end; i++) {
      const p = track[i];
      const dx = b.lon - a.lon, dy = b.lat - a.lat;
      const len2 = dx * dx + dy * dy;
      let u = len2 ? ((p.lon - a.lon) * dx + (p.lat - a.lat) * dy) / len2 : 0;
      u = Math.max(0, Math.min(1, u));
      const ex = a.lon + u * dx - p.lon, ey = a.lat + u * dy - p.lat;
      const d = ex * ex + ey * ey;
      if (d > maxDist) { maxDist = d; maxIndex = i; }
    }
    if (maxIndex !== -1 && maxDist > tolerance * tolerance) {
      keep[maxIndex] = true;
      stack.push([start, maxIndex], [maxIndex, end]);
    }
  }
  return track.filter((_, i) => keep[i]);
}

function compactTrackForUpload(track) {
  let tolerance = 0.00002; // ok. 2 m
  let simplified = simplifyTrack(track, tolerance);
  while (simplified.length > SHARED_ROUTE_MAX_POINTS) {
    tolerance *= 2;
    simplified = simplifyTrack(track, tolerance);
  }
  return simplified.map((p) => {
    const point = [Number(p.lat.toFixed(5)), Number(p.lon.toFixed(5))];
    if (p.ele != null) point.push(Math.round(p.ele));
    return point;
  });
}

// Punkty z serwera -> { lat, lon, ele? }; odrzuca niepoprawne dane.
function parseServerTrack(route) {
  if (!Array.isArray(route)) return [];
  return route
    .filter((p) => Array.isArray(p) && Number.isFinite(p[0]) && Number.isFinite(p[1]))
    .map((p) => (Number.isFinite(p[2]) ? { lat: p[0], lon: p[1], ele: p[2] } : { lat: p[0], lon: p[1] }));
}

function askNick() {
  const nick = prompt(t().promptNick, localStorage.getItem(NICK_KEY) || "");
  if (nick === null) return null;
  const trimmed = nick.trim();
  if (trimmed.length < 1 || trimmed.length > 30) {
    alert(t().nickInvalid);
    return null;
  }
  localStorage.setItem(NICK_KEY, trimmed);
  return trimmed;
}

async function toggleShareRoute(index) {
  const routes = getPlannedRoutes();
  const route = routes[index];
  if (!route) return;
  if (route.sharedId) {
    if (!confirm(t().confirmUnshareRoute)) return;
    if (await deleteSharedRoute(route.sharedId)) {
      refreshSavedRoutesList();
      alert(t().unshared);
    }
    return;
  }
  if (!confirm(t().shareRouteConfirm)) return;
  const nick = askNick();
  if (!nick) return;
  const token = randomToken();
  try {
    const id = await rpc("share_route", {
      p_nick: nick,
      p_name: route.name.slice(0, 60),
      p_mode: route.mode,
      p_dist_km: parseFloat(route.distKm),
      p_route: compactTrackForUpload(plannedRouteTrack(route)),
      p_delete_token: token,
    });
    const tokens = getRouteShareTokens();
    tokens[id] = token;
    saveRouteShareTokens(tokens);
    route.sharedId = id;
    savePlannedRoutes(routes);
    refreshSavedRoutesList();
    alert(t().routeSharedMsg);
  } catch (e) {
    alert(t().communityError);
  }
}

// Usuwa udostępnioną trasę z serwera; zwraca true, gdy jej tam już nie ma.
async function deleteSharedRoute(id, silent) {
  const tokens = getRouteShareTokens();
  if (tokens[id]) {
    try {
      await rpc("delete_route", { p_id: id, p_delete_token: tokens[id] });
    } catch (e) {
      if (!silent) alert(t().deleteFailed);
      return false;
    }
    delete tokens[id];
    saveRouteShareTokens(tokens);
  }
  const routes = getPlannedRoutes();
  routes.forEach((r) => {
    if (r.sharedId === id) delete r.sharedId;
  });
  savePlannedRoutes(routes);
  return true;
}

function renderCommunityRoutesList() {
  const listEl = document.getElementById("communityRoutesList");
  const dict = t();
  if (communityRoutesCache.length === 0) {
    listEl.innerHTML = `<p>${dict.noCommunityRoutes}</p>`;
    return;
  }
  const tokens = getRouteShareTokens();
  listEl.innerHTML = communityRoutesCache
    .map((r, index) => {
      const mine = Boolean(tokens[r.id]);
      const mode = dict.modeNames[r.mode] || "";
      return `<div class="history-item">` +
        `<span><b>${escapeXml(r.name)}</b> — ${Number(r.dist_km).toFixed(1)} km, ${mode} · ` +
        `<span class="activity-nick">${escapeXml(r.nick)}</span>${mine ? " " + dict.mineLabel : ""}</span>` +
        `<div class="history-actions">` +
        `<button class="route-btn" data-index="${index}" title="${dict.showRouteTitle}">🗺</button>` +
        `<button class="gpx-btn" data-index="${index}" title="${dict.exportRouteTitle}">GPX</button>` +
        `<button class="copy-btn" data-index="${index}" title="${dict.copyRouteTitle}">➕</button>` +
        (mine ? `<button class="delete-btn" data-index="${index}" title="${dict.deleteTitle}">🗑</button>` : "") +
        `</div></div>`;
    })
    .join("");

  const on = (cls, handler) => listEl.querySelectorAll(cls).forEach((btn) => {
    btn.addEventListener("click", () => handler(communityRoutesCache[parseInt(btn.dataset.index, 10)]));
  });
  on(".route-btn", showCommunityRoute);
  on(".gpx-btn", downloadCommunityRoute);
  on(".copy-btn", copyCommunityRoute);
  on(".delete-btn", async (r) => {
    if (!confirm(t().confirmUnshareRoute)) return;
    if (await deleteSharedRoute(r.id)) {
      refreshSavedRoutesList();
      refreshActivityTab();
    }
  });
}

async function fetchCommunityTrack(r) {
  try {
    const track = parseServerTrack(await rpc("get_route", { p_id: r.id }));
    if (track.length < 2) throw new Error("empty");
    return track;
  } catch (e) {
    alert(t().communityError);
    return null;
  }
}

async function showCommunityRoute(r) {
  const track = await fetchCommunityTrack(r);
  if (track) drawOnActivityMap(`${r.name} — ${r.nick}`, track.map((p) => [p.lat, p.lon]), track);
}

async function downloadCommunityRoute(r) {
  const track = await fetchCommunityTrack(r);
  if (track) downloadGpx(r.name, track);
}

async function copyCommunityRoute(r) {
  const track = await fetchCommunityTrack(r);
  if (!track) return;
  const routes = getPlannedRoutes();
  routes.push({
    name: r.name,
    created: new Date().toISOString().slice(0, 10),
    mode: r.mode,
    distKm: trackDistanceKm(track).toFixed(2),
    // Start i meta jako punkty edycji, cała trasa jako jeden odcinek - można ją dalej wydłużać.
    waypoints: [track[0], track[track.length - 1]],
    segments: [track],
  });
  savePlannedRoutes(routes);
  refreshSavedRoutesList();
  alert(t().routeCopied(r.name));
}

// --- Import treningów z Garmin/Suunto/Polar (pliki GPX/TCX, parsowane lokalnie) ---
function haversineKm(lat1, lon1, lat2, lon2) {
  const toRad = (d) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function downsampleRoute(points, maxPoints) {
  if (points.length <= maxPoints) return points;
  const step = (points.length - 1) / (maxPoints - 1);
  return Array.from({ length: maxPoints }, (_, i) => points[Math.round(i * step)]);
}

// Dyscyplina z <trk><type> (Garmin/Suunto/Strava zapisują np. running, cycling, hiking, open_water_swimming).
function gpxDiscipline(xml) {
  const trk = xml.getElementsByTagName("trk")[0];
  const typeEl = trk ? trk.getElementsByTagName("type")[0] : null;
  return activityTypeToDisc(typeEl ? typeEl.textContent : "") || "Bieg";
}

function activityTypeToDisc(type) {
  const s = String(type || "").toLowerCase();
  if (!s) return null;
  if (/swim/.test(s)) return /pool|lap|basen/.test(s) ? "Basen" : "WodyOtwarte";
  if (/hik|walk|trek|mountaineer/.test(s)) return "Trekking";
  if (/kayak|paddl|canoe|row/.test(s)) return "Kajak";
  if (/cycl|bik|ride/.test(s)) return "Rower";
  if (/run|jog/.test(s)) return "Bieg";
  return null;
}

function parseGpx(xml) {
  const trkpts = Array.from(xml.getElementsByTagName("trkpt"));
  if (trkpts.length < 2) throw new Error(t().errNoGpxPoints);

  let distKm = 0;
  const hrValues = [];
  const route = [];

  for (let i = 0; i < trkpts.length; i++) {
    const pt = trkpts[i];
    const lat = parseFloat(pt.getAttribute("lat"));
    const lon = parseFloat(pt.getAttribute("lon"));
    const eleEl = pt.getElementsByTagName("ele")[0];
    const ele = eleEl ? parseFloat(eleEl.textContent) : NaN;
    route.push(Number.isFinite(ele) ? { lat, lon, ele } : { lat, lon });
    if (i > 0) {
      const prevLat = parseFloat(trkpts[i - 1].getAttribute("lat"));
      const prevLon = parseFloat(trkpts[i - 1].getAttribute("lon"));
      distKm += haversineKm(prevLat, prevLon, lat, lon);
    }
    Array.from(pt.getElementsByTagName("*")).forEach((el) => {
      if (el.localName.toLowerCase() === "hr") hrValues.push(parseFloat(el.textContent));
    });
  }

  const firstTimeEl = trkpts[0].getElementsByTagName("time")[0];
  const lastTimeEl = trkpts[trkpts.length - 1].getElementsByTagName("time")[0];
  let timeMin = 0;
  let date = new Date().toISOString().slice(0, 10);
  if (firstTimeEl && lastTimeEl) {
    timeMin = (new Date(lastTimeEl.textContent) - new Date(firstTimeEl.textContent)) / 60000;
    date = firstTimeEl.textContent.slice(0, 10);
  }

  const avgHr = hrValues.length ? hrValues.reduce((a, b) => a + b, 0) / hrValues.length : 0;

  return {
    date,
    dist: distKm.toFixed(2),
    time: timeMin.toFixed(1),
    hr: avgHr ? String(Math.round(avgHr)) : "0",
    disc: gpxDiscipline(xml),
    route: downsampleRoute(route, 200),
  };
}

function parseTcx(xml) {
  const laps = Array.from(xml.getElementsByTagName("Lap"));
  if (laps.length === 0) throw new Error(t().errNoTcxData);

  let distM = 0;
  let timeS = 0;
  const hrValues = [];
  const route = [];
  const startTimeAttr = laps[0].getAttribute("StartTime");
  const date = startTimeAttr ? startTimeAttr.slice(0, 10) : new Date().toISOString().slice(0, 10);

  laps.forEach((lap) => {
    const distEl = lap.getElementsByTagName("DistanceMeters")[0];
    const timeEl = lap.getElementsByTagName("TotalTimeSeconds")[0];
    const hrEl = lap.getElementsByTagName("AverageHeartRateBpm")[0];
    if (distEl) distM += parseFloat(distEl.textContent) || 0;
    if (timeEl) timeS += parseFloat(timeEl.textContent) || 0;
    if (hrEl) {
      const valueEl = hrEl.getElementsByTagName("Value")[0];
      if (valueEl) hrValues.push(parseFloat(valueEl.textContent));
    }

    Array.from(lap.getElementsByTagName("Trackpoint")).forEach((tp) => {
      const posEl = tp.getElementsByTagName("Position")[0];
      if (!posEl) return;
      const latEl = posEl.getElementsByTagName("LatitudeDegrees")[0];
      const lonEl = posEl.getElementsByTagName("LongitudeDegrees")[0];
      if (!latEl || !lonEl) return;
      const point = { lat: parseFloat(latEl.textContent), lon: parseFloat(lonEl.textContent) };
      const altEl = tp.getElementsByTagName("AltitudeMeters")[0];
      const ele = altEl ? parseFloat(altEl.textContent) : NaN;
      if (Number.isFinite(ele)) point.ele = ele;
      route.push(point);
    });
  });

  const activityEl = xml.getElementsByTagName("Activity")[0];
  const sport = activityEl ? activityEl.getAttribute("Sport") : "";
  const discMap = { Running: "Bieg", Biking: "Rower" };
  const avgHr = hrValues.length ? hrValues.reduce((a, b) => a + b, 0) / hrValues.length : 0;

  return {
    date,
    dist: (distM / 1000).toFixed(2),
    time: (timeS / 60).toFixed(1),
    hr: avgHr ? String(Math.round(avgHr)) : "0",
    disc: discMap[sport] || activityTypeToDisc(sport) || "Bieg",
    route: route.length >= 2 ? downsampleRoute(route, 200) : undefined,
  };
}

function importTrainingFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const xml = new DOMParser().parseFromString(reader.result, "application/xml");
      if (xml.getElementsByTagName("parsererror").length > 0) {
        throw new Error(t().errBadXml);
      }

      const isTcx = xml.getElementsByTagName("TrainingCenterDatabase").length > 0;
      const parsed = isTcx ? parseTcx(xml) : parseGpx(xml);

      document.getElementById("date").value = parsed.date;
      document.getElementById("dist").value = parsed.dist;
      document.getElementById("time").value = parsed.time;
      document.getElementById("hr").value = parsed.hr;
      document.getElementById("discipline").value = parsed.disc;
      updateDisciplineUi();
      pendingRoute = parsed.route && parsed.route.length >= 2 ? parsed.route : null;

      alert(t().importSuccess(parsed));
    } catch (e) {
      alert(t().importError(e.message));
    }
  };
  reader.readAsText(file);
}

// --- Zmiana PIN-u ---
function changePin() {
  const newPin = prompt(t().promptNewPin);
  if (newPin && newPin.trim().length > 0) {
    localStorage.setItem(PIN_KEY, newPin.trim());
    alert(t().pinChanged);
  }
}

// --- Inicjalizacja ---
document.addEventListener("DOMContentLoaded", () => {
  applyTheme();
  applyLanguage();

  document.getElementById("pinSubmit").addEventListener("click", tryLogin);
  document.getElementById("pinInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") tryLogin();
  });

  document.getElementById("tabTrainBtn").addEventListener("click", () => showTab("train"));
  document.getElementById("tabHistoryBtn").addEventListener("click", () => {
    showTab("history");
    refreshHistoryList();
  });
  document.getElementById("tabPlanBtn").addEventListener("click", () => {
    showTab("plan");
    initPlanMap();
  });
  document.getElementById("tabActivityBtn").addEventListener("click", () => {
    showTab("activity");
    refreshActivityTab();
  });
  document.getElementById("consentYesBtn").addEventListener("click", () => setStatsConsent(true));
  document.getElementById("consentNoBtn").addEventListener("click", () => setStatsConsent(false));
  document.getElementById("consentMoreBtn").addEventListener("click", showPrivacy);
  document.getElementById("privacyBtn").addEventListener("click", showPrivacy);
  document.getElementById("helpBtn").addEventListener("click", showHelp);
  document.getElementById("helpPrivacyBtn").addEventListener("click", showPrivacy);
  document.getElementById("shareAppBtn").addEventListener("click", shareAppLink);
  document.getElementById("shareQrBtn").addEventListener("click", shareAppQr);
  document.getElementById("helpCloseBtn").addEventListener("click", () => {
    document.getElementById("helpCard").style.display = "none";
  });
  document.getElementById("privacyCloseBtn").addEventListener("click", () => {
    document.getElementById("privacyCard").style.display = "none";
  });
  document.getElementById("statsConsentToggle").addEventListener("change", (e) => setStatsConsent(e.target.checked));
  document.getElementById("deleteMySharesBtn").addEventListener("click", deleteAllMyShares);
  document.getElementById("planUndoBtn").addEventListener("click", undoPlanPoint);
  document.getElementById("planClearBtn").addEventListener("click", clearPlan);
  document.getElementById("planSaveBtn").addEventListener("click", savePlannedRoute);
  document.getElementById("planExportBtn").addEventListener("click", exportCurrentPlan);

  document.getElementById("saveBtn").addEventListener("click", saveTraining);
  document.getElementById("discipline").addEventListener("change", updateDisciplineUi);
  ["dist", "time"].forEach((id) => document.getElementById(id).addEventListener("input", () => clearFieldState(id)));
  document.getElementById("trainHintClose").addEventListener("click", hideTrainHint);
  document.getElementById("paceBtn").addEventListener("click", calcPace);
  document.getElementById("chartBtn").addEventListener("click", showChart);
  document.getElementById("exportBtn").addEventListener("click", exportCsv);
  document.getElementById("summaryPeriod").addEventListener("change", refreshSummary);
  document.getElementById("goalAddBtn").addEventListener("click", () => showGoalForm(true));
  document.getElementById("organizerBtn").addEventListener("click", toggleOrganizer);
  document.getElementById("tabChallengeBtn").addEventListener("click", () => {
    showTab("challenge");
    renderChallenge();
    verifyChallengeInvite();
  });
  document.getElementById("challengeLeaveBtn").addEventListener("click", leaveChallenge);
  document.getElementById("challengeStart").addEventListener("change", (e) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(e.target.value)) return;
    saveChallenge({ ...getChallenge(), start: e.target.value });
    renderChallenge();
  });
  document.getElementById("eventAddBtn").addEventListener("click", () => showEventForm(true));
  document.getElementById("eventCancelBtn").addEventListener("click", () => showEventForm(false));
  document.getElementById("eventSaveBtn").addEventListener("click", publishEvent);
  document.getElementById("goalCancelBtn").addEventListener("click", () => showGoalForm(false));
  document.getElementById("goalSaveBtn").addEventListener("click", addGoal);
  document.getElementById("backupBtn").addEventListener("click", createBackup);
  document.getElementById("restoreBtn").addEventListener("click", () => {
    document.getElementById("restoreFile").click();
  });
  document.getElementById("restoreFile").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) restoreBackupFile(file);
    e.target.value = "";
  });
  document.getElementById("importBtn").addEventListener("click", () => {
    document.getElementById("importFile").click();
  });
  document.getElementById("importFile").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) importTrainingFile(file);
    e.target.value = "";
  });
  document.getElementById("themeBtn").addEventListener("click", toggleTheme);
  document.getElementById("pinChangeBtn").addEventListener("click", changePin);
  document.getElementById("langBtn").addEventListener("click", toggleLanguage);

  // Sesja logowania trwa do zamknięcia karty przeglądarki (sessionStorage).
  // Dzięki temu nie trzeba podawać PIN-u za każdym odświeżeniem, ale po
  // zamknięciu apki trzeba zalogować się ponownie.
  if (sessionStorage.getItem("pau_authed") === "1") {
    showMainApp();
  } else {
    showLogin();
  }
});
