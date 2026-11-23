// © 2026 Polska Adventure Ultra. Wszelkie prawa zastrzeżone. Kopiowanie i wykorzystanie bez zgody zabronione.
// Licencja: plik LICENSE. Kontakt: polskaadventureultra@gmail.com
// Polska Adventure Ultra - PWA logic
// Wszystkie dane trzymane lokalnie w przeglądarce telefonu (localStorage).
// Nic nie jest wysyłane na żaden serwer - każdy telefon ma swoją niezależną historię.

const PIN_KEY = "pau_pin";
const HISTORY_KEY = "pau_history";
const BODY_WEIGHT_KEY = "pau_body_weight"; // waga do liczenia kalorii przy nagrywaniu
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
const CHALLENGE_PROGRESS_TOKEN_KEY = "pau_challenge_progress_token"; // losowy token wiersza postępu w bazie (za zgodą)
const CHALLENGE_SYNCED_KEY = "pau_challenge_synced";   // ostatnio wysłany postęp - nie wysyłamy tego samego ponownie
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
    optAuto4x4: "Auto 4x4 (teren)",
    distSwimPlaceholder: "np. 1.5 = 1500 m",
    labelDate: "Data",
    labelDist: "Dystans (km)",
    labelTime: "Czas (min)",
    labelHr: "Śr. tętno (bpm)",
    labelSteps: "Kroki",
    importNoSteps: "\n👣 Ten plik nie zawiera kroków. Wyeksportuj trening jako FIT albo wpisz kroki ręcznie.",
    updateText: "🆕 Nowa wersja PAU w Sklepie Google Play. Twoje treningi zostają na telefonie.",
    updateNowBtn: "AKTUALIZUJ",
    lookNew: "✨ Nowy wygląd",
    lookClassic: "↩ Klasyczny wygląd",
    logoutBtn: "Wyloguj",
    confirmLogout: "Wylogować? Treningi i ustawienia zostają na tym telefonie — po wpisaniu PIN-u wszystko będzie jak było.",
    logoutRecording: "Trwa nagrywanie treningu — najpierw je zakończ.",
    h2Week: "Ten tydzień",
    h2Day: "Dzień wyzwania",
    h2Streak: (n, best) => `🔥 <b>${n}</b> ${n === 1 ? "dzień" : "dni"} z rzędu z treningiem · rekord ${best}`,
    h2StreakNone: (best) => (best > 0 ? `🔥 Zacznij nową serię — rekord: ${best} ${best === 1 ? "dzień" : "dni"} z rzędu` : "🔥 Pierwszy trening zaczyna serię"),
    h2VsPrev: (p) => `${p >= 0 ? "▲" : "▼"} ${Math.abs(p)}% vs poprzedni`,
    h2Days: ["PN", "WT", "ŚR", "CZ", "PT", "SO", "ND"],
    h2RouteStart: "Lublin ▸ start",
    h2RouteFinish: "meta ◂ Lublin",
    h2ChKm: (km, pct) => `🏁 Wyzwanie: ${km} km · ${pct}%`,
    h2Today: "Dziś",
    h2Yesterday: "Wczoraj",
    h2LastLbl: "Ostatni trening",
    labelVo2max: "Pułap tlenowy VO2max",
    labelWeight: "Waga (kg)",
    labelNotes: "Notatki / Samopoczucie",
    saveBtn: "ZAPISZ TRENING",
    paceBtn: "OBLICZ TEMPO",
    chartBtn: "POKAŻ WYKRES PROGRESU",
    exportBtn: "EKSPORTUJ DO CSV",
    importBtn: "📂 WCZYTAJ PLIK GPX / TCX / FIT",
    modePhone: "Trening z telefonu",
    modeWatch: "Trening z zegarka",
    modeManual: "Stwórz własny trening",
    watchTitle: "⌚ Trening z zegarka",
    watchBrandLbl: "Twój zegarek / aplikacja",
    watchBrandOther: "Strava / inny",
    watchSteps: {
      garmin: ["Na stronie connect.garmin.com otwórz aktywność (aplikacja Garmin Connect w telefonie nie eksportuje plików — użyj przeglądarki).", "Ikona koła zębatego → „Eksportuj do GPX” lub „Eksportuj do TCX”."],
      suunto: ["Suunto app: Dziennik → wybierz trening.", "⋮ / Udostępnij → Eksportuj → wybierz FIT (ma też kroki i dane z basenu; GPX zawiera tylko trasę i tętno)."],
      polar: ["Na stronie flow.polar.com otwórz trening.", "„Eksportuj sesję” → GPX lub TCX."],
      samsung: ["Samsung Health w telefonie: otwórz trening z trasą GPS.", "⋮ → „Eksportuj do pliku GPX”. Opcja jest tylko przy treningach z GPS, a plik nie zawiera tętna."],
      huawei: ["Huawei Health: otwórz trening → ⋮ / udostępnij → „Eksportuj trasę” → GPX lub TCX.", "Nie ma tej opcji? Połącz Huawei Health ze Stravą (Ja → Udostępnianie danych i autoryzacja → Strava) i pobierz plik ze Stravy (wybierz „Strava / inny”)."],
      other: ["Zsynchronizuj zegarek ze Stravą, a potem na strava.com otwórz trening → ⋯ → „Eksportuj GPX”.", "Zadziała też każdy plik GPX, TCX lub FIT z innej aplikacji."],
    },
    watchStepLast: "Kliknij „Wczytaj plik”, wybierz pobrany plik, sprawdź dane i zapisz trening.",
    recTitle: "📍 Nagraj trening telefonem",
    recIntroNative: "Bez zegarka — aplikacja zapisze trasę z GPS w telefonie, także przy zgaszonym ekranie i w tle (zobaczysz wtedy powiadomienie). Przy pierwszym starcie zezwól na lokalizację.",
    recNotifTitle: "Polska Adventure Ultra — nagrywanie",
    recNotifText: "Nagrywam trasę treningu. Zakończ w aplikacji.",
    recNoLocationPerm: "🔴 Aplikacja nie ma zgody na lokalizację. Kliknij „Otwórz ustawienia” → Uprawnienia → Lokalizacja → „Zezwalaj tylko podczas używania aplikacji” i włącz „Używaj dokładnej lokalizacji”. Potem wróć tutaj — nagrywanie ruszy samo.",
    recApproxOnly: "🟠 Aplikacja ma tylko przybliżoną lokalizację (±kilka km) — tak nie da się nagrać trasy. Kliknij „Otwórz ustawienia” → Uprawnienia → Lokalizacja i włącz „Używaj dokładnej lokalizacji”. Potem wróć tutaj.",
    recLocationOff: "🔴 Lokalizacja w telefonie jest wyłączona. Kliknij tutaj albo „📍 Włącz lokalizację” poniżej — nagrywanie ruszy samo.",
    recLocationOffManual: "🔴 Lokalizacja w telefonie jest wyłączona. Rozwiń górny pasek i włącz „Lokalizacja” — nagrywanie ruszy samo.",
    recEnableLocation: "📍 Włącz lokalizację",
    recOpenSettings: "⚙ Otwórz ustawienia",
    recIntro: "Bez zegarka — aplikacja zapisze trasę z GPS w telefonie. Ekran musi zostać włączony (aplikacja go nie wygasi) i nie przełączaj się na inne aplikacje: w tle przeglądarka wstrzymuje GPS.",
    recStartBtn: "▶ START",
    recPauseBtn: "⏸ PAUZA",
    recResumeBtn: "▶ WZNÓW",
    recFinishBtn: "■ ZAKOŃCZ",
    recDiscardBtn: "Odrzuć nagranie",
    recTimeLbl: "Czas ruchu",
    recDistLbl: "Dystans (km)",
    recPaceLbl: "Śr. tempo",
    recSpeedLbl: "Śr. prędkość",
    recWeightLbl: "Twoja waga (kg) — do liczenia kalorii",
    recWeightPh: "np. 75 (opcjonalnie)",
    recKcalLbl: "🔥 Spalone kcal",
    recKcalNoWeight: "🔥 kcal — podaj wagę przed startem",
    recKcalNote: (kcal) => `🔥 ok. ${kcal} kcal (szacunek)`,
    recGpsLbl: "Dokładność GPS",
    recWaitingGps: "Szukam sygnału GPS… (najlepiej na otwartym terenie)",
    recGpsOk: "🟢 Nagrywanie — GPS działa",
    recBackgroundOk: (min) => `✅ GPS działał przy zgaszonym ekranie${min ? ` (ok. ${min} min)` : ""} — trasa zapisana bez przerw.`,
    recWeakGps: (m) => `🟠 Słaby sygnał GPS (±${m} m) — czekam na lepszy`,
    recPausedStatus: "⏸ Wstrzymane — czas i dystans się nie liczą",
    recDenied: "Brak zgody na lokalizację. Włącz ją w ustawieniach przeglądarki/telefonu dla tej strony (Android: kłódka przy adresie → Uprawnienia → Lokalizacja; iPhone: Ustawienia → Prywatność → Usługi lokalizacji → Safari).",
    recUnavailable: "🔴 GPS niedostępny — sprawdź, czy lokalizacja w telefonie jest włączona",
    recNoGeo: "Ta przeglądarka nie obsługuje GPS.",
    recNoWakeLock: "Ta przeglądarka nie potrafi trzymać włączonego ekranu — wydłuż czas wygaszania ekranu w ustawieniach telefonu.",
    recWasHidden: (min) => `⚠️ Aplikacja była w tle${min ? ` ok. ${min} min` : ""} — w tym czasie GPS mógł nie działać; ten odcinek został połączony linią prostą.`,
    recRestored: "⚠️ Nagrywanie zostało przerwane (aplikacja była zamknięta). Kliknij WZNÓW, żeby nagrywać dalej, albo ZAKOŃCZ.",
    recConfirmFinish: "Zakończyć nagrywanie?",
    recTooShort: "Nagrana trasa jest za krótka (poniżej 50 m). Odrzucić nagranie?",
    recConfirmDiscard: "Odrzucić nagranie? Trasa zostanie usunięta.",
    recNote: "📍 Nagrane telefonem (GPS)",
    recFinishedHint: (km, time, kcal) => `📍 Nagrano ${km} km w ${time}${kcal ? `, spalono ok. ${kcal} kcal` : ""}. Sprawdź dane, dopisz tętno czy notatkę i kliknij „ZAPISZ TRENING”.`,
    chartTitle: "Progres dystansu",
    historyTitle: "Historia treningów",
    themeBtn: "Zmień motyw",
    pinChangeBtn: "Zmień PIN",
    langBtnTarget: "EN",
    totalLabel: (km) => `🏅 Łącznie: ${km} km`,
    heroTotal: "Łącznie",
    samsungHintText: "Używasz przeglądarki Samsung Internet. Żeby mieć aplikację na ekranie, wybierz menu ☰ → „Dodaj stronę do” → „Ekran startowy”. Jeśli wolisz pełną aplikację (bez paska adresu), otwórz ten link w Chrome i wybierz ⋮ → „Zainstaluj aplikację”.",
    samsungHintCopy: "KOPIUJ LINK (DO CHROME)",
    samsungHintCopied: "Link skopiowany — wklej go w Chrome.",
    heroWeek: "ten tydzień",
    addTrainingTitle: "Dodaj trening",
    noHistory: "Brak zapisanych treningów.",
    deleteTitle: "Usuń wpis",
    navRouteLbl: "🧭 Prowadź po trasie (opcjonalnie)",
    navRouteHint: "Trasa z zakładki Trasy albo z pliku GPX / TCX / FIT (np. z Garmin Connect, Komoot, Strava). Pokażę ją na mapie, policzę kilometry do końca i ostrzegę, gdy zboczysz.",
    navNone: "— bez prowadzenia —",
    navLoadFile: "📂 Wczytaj trasę z pliku (GPX / TCX / FIT)",
    navFileOpt: (name, km) => `📄 ${name} — ${km} km`,
    navNoPoints: "W pliku nie ma trasy (punktów GPS).",
    navLoadError: (msg) => `Nie udało się wczytać trasy: ${msg}`,
    navSaveToRoutes: (name) => `Zapisać trasę „${name}” w zakładce Trasy, żeby była dostępna także następnym razem?`,
    navLeft: (km) => `do końca ${km} km`,
    navWaiting: "Czekam na sygnał GPS…",
    navOn: "✅ Na trasie",
    navOff: (m) => `⚠️ Zboczyłeś z trasy o ${m} m — wróć na linię na mapie`,
    navBack: "✅ Wróciłeś na trasę",
    navNoGps: "📡 Słaby lub brak sygnału GPS — ostrzeganie o zboczeniu wstrzymane",
    navPaused: "⏸ Pauza — prowadzenie wstrzymane",
    navFinished: "🏁 Koniec trasy!",
    navBusy: "Trwa nagrywanie — prowadzenie wybierasz przed START.",
    navRouteTitle: "Prowadź po tej trasie (nagrywanie telefonem)",
    routeImportBtn: "📂 WCZYTAJ TRASĘ Z PLIKU (GPX / TCX / FIT)",
    routeImportHint: "Trasę z Garmin Connect, Komoot, Strava czy od znajomych wczytasz tutaj. Przyciskiem 🧭 przy trasie uruchomisz prowadzenie w nagrywaniu telefonem.",
    routeImported: (name, km) => `Wczytano trasę „${name}” (${km} km). Przycisk 🧭 przy trasie uruchamia prowadzenie.`,
    navNotifTitle: "Polska Adventure Ultra — trasa",
    poiTypes: { food: "Punkt żywieniowy", drop: "Przepak", sleep: "Nocleg", shop: "Sklep", water: "Woda", danger: "Uwaga – niebezpieczne miejsce", other: "Inne" },
    poiFood: "Żywienie", poiDrop: "Przepak", poiSleep: "Nocleg", poiShop: "Sklep", poiWater: "Woda", poiDanger: "Uwaga", poiOther: "Inne",
    navDanger: (m, name) => `⚠️ Za ${m} m niebezpieczne miejsce${name ? `: ${name}` : ""} — uważaj!`,
    navSayDanger: (m, name) => `Uwaga! Za ${m} ${plUnit(m, "metr", "metry", "metrów")} niebezpieczne miejsce${name ? `: ${name}` : ""}`,
    planPoiBtn: "📍 DODAJ PUNKT NA TRASIE",
    planPoiArmed: "👆 Kliknij na mapie miejsce punktu (dotknij tu, aby anulować)",
    poiNeedRoute: "Najpierw wyznacz albo wczytaj trasę — punkty dodaje się do istniejącej trasy.",
    poiFormNew: "📍 Nowy punkt na trasie",
    poiFormEdit: "✏️ Popraw punkt",
    poiTypeLbl: "Rodzaj",
    poiNameLbl: "Nazwa (np. Żabka, Schronisko Orlica)",
    poiNoteLbl: "Opis (godziny otwarcia, wskazówki…)",
    poiSaveBtn: "ZAPISZ PUNKT",
    poiDeleteBtn: "Usuń punkt",
    poiCancelBtn: "Anuluj",
    poiConfirmDelete: "Usunąć ten punkt z trasy?",
    poiListTitle: "📍 Punkty na trasie",
    poiKm: (km) => `km ${km}`,
    poiOff: (m) => `${m} m od trasy`,
    poiUnsaved: "Punkt dodany. Zapisze się razem z trasą — kliknij „ZAPISZ TRASĘ”.",
    poiCount: (n) => `📍 ${n}`,
    poiNoGps: "Poczekaj na sygnał GPS — punkt zapisuje się w miejscu, w którym jesteś.",
    recPoiBtn: "📍 PUNKT TUTAJ",
    recPoiPickHint: "Wpisz albo podyktuj nazwę (mikrofon na klawiaturze) i dotknij rodzaju punktu. Bez nazwy też się zapisze.",
    recPoiNamePh: "Nazwa / notatka (opcjonalnie), np. źródło przy kapliczce",
    recPoiRename: "Nazwa punktu (np. Żabka, źródło przy kapliczce):",
    recPoiNote: "Opis (opcjonalnie — godziny otwarcia, wskazówki):",
    recPoiAdded: (label) => `📍 Dodano punkt: ${label}`,
    recPoiCount: (n) => `📍 Dodane punkty: ${n} — po zakończeniu zapiszesz je razem z trasą w zakładce Trasy.`,
    recSaveRouteLbl: "🗺 Zapisz przebytą trasę w zakładce Trasy (np. żeby inni mogli nią potem pobiec)",
    recChallengeLbl: "🏁 Odcinek wyzwania 4000 km — kilometry dopisują się do wyzwania na żywo w trakcie",
    trainSaveRouteLbl: "🗺 Zapisz też trasę w zakładce Trasy (prowadzenie 🧭 i udostępnienie innym 📤)",
    toRoutesTitle: "Zapisz trasę w zakładce Trasy (prowadzenie 🧭, udostępnienie 📤)",
    toRoutesAgain: "Ta trasa jest już zapisana w zakładce Trasy. Zapisać ją jeszcze raz?",
    toRoutesSaved: (name) => `Zapisano „${name}” w zakładce Trasy. Tam: 🧭 prowadź po trasie, 📤 udostępnij innym, GPX do zegarka.`,
    navCommunityTitle: "Prowadź po tej trasie (zapisze ją w Twoich trasach)",
    recSaveRouteAsk: (n) => `Na trasie dodałeś punkty (${n}). Zapisać przebytą trasę razem z punktami w zakładce Trasy?`,
    recRouteSaved: (name, n) => `Trasa „${name}” zapisana w zakładce Trasy${n ? ` (punkty: ${n})` : ""}. Tam dopiszesz nazwy i opisy punktów (🗺), wyeksportujesz GPX albo udostępnisz trasę.`,
    navNextPoi: (title, km) => `Następny punkt: ${title} — za ${km} km`,
    navSayPoi: (m, label) => `Za ${m} ${plUnit(m, "metr", "metry", "metrów")}: ${label}`,
    chMsgTitle: "📢 Komunikaty organizatora",
    chMsgEmpty: "Na razie brak komunikatów. Gdy organizator coś ogłosi, zobaczysz to tutaj — a w trakcie nagrywania telefon da znać od razu.",
    chMsgNew: "nowy",
    chMsgUntil: (d) => `aktualny do ${d}`,
    chMsgBodyLbl: "Nowy komunikat dla uczestników",
    chMsgImportantLbl: "⚠️ Ważny — telefon zawibruje mocniej i pokaże okienko (każdy komunikat jest czytany na głos)",
    chMsgExpiryLbl: "Pokazuj przez",
    chMsgExpiry0: "bez terminu (do usunięcia)",
    chMsgExpiry1: "1 dzień",
    chMsgExpiry3: "3 dni",
    chMsgExpiry7: "7 dni",
    chMsgSendBtn: "📢 WYŚLIJ KOMUNIKAT",
    chMsgAdminHint: "Komunikat zobaczą uczestnicy z kodem zaproszenia: od razu, jeśli mają otwartą aplikację albo nagrywają trening, a pozostali — przy najbliższym otwarciu aplikacji.",
    chMsgEmptyBody: "Wpisz treść komunikatu.",
    chMsgConfirmSend: (important) => important ? "Wysłać WAŻNY komunikat do wszystkich uczestników? Telefony mocniej zawibrują, pokażą okienko i przeczytają go na głos." : "Wysłać komunikat do wszystkich uczestników? Telefony przeczytają go na głos.",
    chMsgSent: "Komunikat wysłany ✅",
    chMsgSendError: "Nie udało się — sprawdź internet i spróbuj ponownie.",
    chMsgConfirmDelete: "Usunąć ten komunikat? Zniknie u wszystkich uczestników.",
    chMsgNotifTitle: "📢 Komunikat organizatora",
    chMsgNotifTitleImportant: "⚠️ Ważny komunikat organizatora",
    chMsgSay: (body) => `Ważny komunikat organizatora: ${body}`,
    chMsgSayNormal: (body) => `Komunikat organizatora: ${body}`,
    chMsgStatus: (body) => `📢 Komunikat organizatora: ${body} (zakładka Wyzwanie)`,
    navVoiceLbl: "🔊 Komunikaty głosowe przy prowadzeniu",
    navChannelName: "Ostrzeżenia trasy",
    navChannelDesc: "Wibracja i komunikat, gdy zboczysz z trasy przy zgaszonym ekranie",
    navVoiceOnTitle: "Głos włączony — dotknij, aby wyciszyć",
    navVoiceOffTitle: "Głos wyciszony — dotknij, aby włączyć",
    navSayOn: "Komunikaty głosowe włączone",
    navSayStart: (km) => `Prowadzenie po trasie. Do końca ${km} ${plUnit(km, "kilometr", "kilometry", "kilometrów")}`,
    navSayOff: (m) => `Uwaga, zboczyłeś z trasy o ${m} ${plUnit(m, "metr", "metry", "metrów")}`,
    navSayBack: "Wróciłeś na trasę",
    navSayFinish: "Koniec trasy. Gratulacje!",
    editEntryTitle: "Popraw trening (dystans, czas, notatki…)",
    editTitle: "✏️ Popraw trening",
    editSaveBtn: "ZAPISZ ZMIANY",
    editCancelBtn: "Anuluj",
    editSharedHint: "Ten trening jest udostępniony — po zapisaniu zaktualizuje się też w zakładce Aktywność.",
    editRouteDist: (km) => `📏 Dystans zmierzony na trasie GPS: ${km} km — wstaw`,
    editSaved: "Zmiany zapisane.",
    editReshared: "Zmiany zapisane — udostępniony trening w Aktywności też jest poprawiony.",
    editReshareFailed: "Zmiany zapisane na telefonie, ale nie udało się poprawić udostępnionego treningu w Aktywności (brak internetu?). Spróbuj ponownie: popraw i zapisz trening jeszcze raz.",
    editUnsharedNoShare: "Zmiany zapisane. Auto 4x4 nie trafia do Aktywności, więc ten trening został z niej usunięty.",
    confirmDelete: "Usunąć ten wpis z historii?",
    alertDistRequired: "Podaj dystans większy od 0.",
    implausibleField: "Dane niepoprawne lub nierealne — sprawdź wpisane wartości.",
    implausibleAlert: (lines, contact) => `⚠️ Dane niepoprawne lub nierealne:\n\n${lines.map((l) => "• " + l).join("\n")}\n\nJeżeli wprowadzone dane są poprawne, skontaktuj się z administratorem: ${contact}`,
    implSpeed: (disc, v) => `średnia prędkość ${v} km/h (${disc}) — nierealna wartość`,
    implDist: (disc, km) => `dystans ${km} km (${disc}) — nierealna wartość`,
    implStride: (steps, km) => `${steps} kroków na ${km} km — nierealna wartość`,
    implCadence: (spm) => `${spm} kroków na minutę — nierealna wartość`,
    implHr: (hr) => `średnie tętno ${hr} bpm — nierealna wartość`,
    implTime: "czas treningu — nierealna wartość",
    implFuture: "data treningu jest w przyszłości",
    implWeight: (kg) => `waga ${kg} kg — nierealna wartość`,
    implVo2: (v) => `VO2max ${v} — nierealna wartość`,
    implNegative: "wartości nie mogą być ujemne",
    alertSaved: "Zapisano trening!",
    alertTimeRequired: "Podaj czas większy od 0.",
    paceResult: (min, sec) => `Tempo: ${min}:${sec} min/km`,
    speedResult: (v) => `Prędkość: ${v} km/h`,
    swimPaceResult: (pace) => `Tempo: ${pace}`,
    alertNoHistoryChart: "Brak danych historycznych.",
    alertNoHistoryExport: "Brak danych do eksportu.",
    importSuccess: (p) =>
      `Wczytano trening z pliku:\nData: ${p.date}\nDystans: ${p.dist} km\n` +
      `Czas: ${p.time} min\nŚr. tętno: ${p.hr} bpm\n${p.steps ? `Kroki: ${p.steps}\n` : ""}\nSprawdź dane i kliknij "ZAPISZ TRENING".`,
    importError: (msg) => `Błąd importu: ${msg}`,
    errNoGpxPoints: "Brak punktów trasy w pliku GPX.",
    errNoTcxData: "Brak danych treningu w pliku TCX.",
    errBadXml: "Nie udało się odczytać pliku (nieprawidłowy XML).",
    errBadFit: "Nie udało się odczytać pliku FIT.",
    promptNewPin: "Podaj nowy PIN:",
    pinChanged: "PIN zmieniony.",
    historyLabels: { date: "Data", disc: "Dyscyplina", dist: "Dystans", weight: "Waga", hr: "Tętno", vo2max: "VO2max", notes: "Notatki" },
    discNames: { Bieg: "Bieg", Rower: "Rower", Kajak: "Kajak", Basen: "Pływanie – basen", WodyOtwarte: "Pływanie – wody otwarte", Trekking: "Trekking", Auto4x4: "Auto 4x4 (teren)", Multi: "Multisport" },
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
    planExportBtn: "EKSPORTUJ / OTWÓRZ (GPX, KML)",
    planExportHint: "Garmin: Garmin Connect (www) → Trening → Trasy → Importuj. Suunto: otwórz plik GPX w Suunto app. Polar: Polar Flow (www) → Ulubione → Trasy → Importuj. Nawigacja po trasie: OsmAnd (GPX) albo MAPS.ME (KML).",
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
    exportRouteTitle: "Eksportuj / otwórz w innej aplikacji",
    exportMenuTitle: "Eksportuj / otwórz trasę",
    exportMenuGpx: "⌚ Plik GPX",
    exportMenuGpxHint: "zegarek (Garmin, Suunto, Polar), zapis na Dysk, wysłanie mailem",
    exportMenuOpenGpx: "🧭 Otwórz w nawigacji (GPX)",
    exportMenuOpenGpxHint: "OsmAnd, Locus Map i inne aplikacje, które otwierają GPX",
    exportMenuKml: "🗺 MAPS.ME (KML)",
    exportMenuKmlHint: "MAPS.ME czyta trasy tylko w formacie KML",
    exportMenuClose: "Zamknij",
    openInNoApp: (app) => `Na telefonie nie ma aplikacji, która otworzy ten plik. Zainstaluj np. ${app} i spróbuj ponownie.`,
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
    chShareLabel: "Pokazuj mój postęp obserwatorom (nick i kilometry)",
    chShareAsk: "Czy pokazywać Twój postęp innym osobom w aplikacji?\n\nWidoczne będą tylko: nick, data startu i przebyte kilometry (bieg/rower/kajak) — bez tras i treningów. Możesz to zmienić w każdej chwili w ustawieniach wyzwania.",
    chShareOn: (nick) => `Postęp widoczny jako „${nick}”. Lista pojawi się u obserwatorów, gdy organizator ją udostępni.`,
    chShareOff: "Twój postęp jest widoczny tylko dla Ciebie.",
    chShareRemoveFailed: "Nie udało się usunąć Twojego postępu z serwera (brak internetu?). Spróbuj ponownie.",
    chBoardTitle: (n) => `UCZESTNICY · ${n}`,
    chBoardEmpty: "Nikt jeszcze nie udostępnił postępu.",
    chBoardPreview: "Podgląd organizatora — obserwatorzy jeszcze tego nie widzą.",
    chBoardShow: "👁 POKAŻ LISTĘ OBSERWATOROM",
    chBoardHide: "🙈 UKRYJ LISTĘ PRZED OBSERWATORAMI",
    chBoardConfirmShow: "Pokazać listę uczestników (nick + km) wszystkim użytkownikom aplikacji?",
    chBoardConfirmHide: "Ukryć listę uczestników przed obserwatorami?",
    chBoardNotAllowed: "Tylko główny organizator może zmienić widoczność listy.",
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
    deleteEventNotOwner: "Możesz usuwać tylko wydarzenia dodane przez siebie.",
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
    fileSaveError: "Nie udało się zapisać pliku.",
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
          <li>Do postępu liczą się <b>tylko odcinki wyzwania</b>: przy zapisie treningu zaznacz „🏁 Odcinek wyzwania 4000 km”, przy nagrywaniu telefonem — zaznacz 🏁 przed START, wtedy kilometry dopisują się do wyzwania na żywo w trakcie; a w Historii możesz oznaczyć lub odznaczyć trening przyciskiem 🏁. Codzienne treningi gdzie indziej trafiają tylko do Historii. Wyzwanie to bieg, rower i kajak — pływanie, trekking i auto 4x4 się do niego nie liczą (nie mają pola 🏁).</li>
          <li><b>📢 Komunikaty organizatora</b>: w zakładce Wyzwanie uczestnicy widzą ogłoszenia organizatora (np. zmiany trasy, niebezpieczne miejsca, posiłki). Nowe są oznaczone czerwoną kropką na zakładce. W trakcie nagrywania telefon daje znać od razu (wibracja, a przy zgaszonym ekranie powiadomienie), a ważne komunikaty czyta na głos (wyłącznik 🔊 jak przy prowadzeniu po trasie). Gdy aplikacja jest zamknięta, nowe komunikaty zobaczysz przy jej otwarciu.</li>
          <li>Po rezygnacji ekran wraca do widoku dla obserwatorów; treningi zostają w Historii.</li>
        </ul>
      </details>
      <details><summary>🏃 Zapisywanie treningu</summary>
        <ul>
          <li>W zakładce <b>Trening</b> wybierz dyscyplinę, wpisz dystans (wymagany) i pozostałe dane, kliknij „ZAPISZ TRENING”.</li>
          <li>Dyscypliny: bieg, rower, kajak, pływanie (basen albo wody otwarte: jezioro, rzeka, morze), trekking i auto 4x4 (przejazdy terenowe). Dystans pływania też wpisujesz w km (1500 m = 1.5). Przejazdy autem 4x4 zostają tylko w Twojej Historii — nie liczą się do wyzwania i nie udostępnia się ich w Aktywności.</li>
          <li>„OBLICZ TEMPO” pokazuje tempo w min/km (bieg), tempo na 100 m (pływanie) albo prędkość w km/h (rower, kajak, trekking, auto 4x4); „POKAŻ WYKRES PROGRESU” rysuje wykres dystansów.</li>
        </ul>
      </details>
      <details><summary>📍 Nagrywanie telefonem (bez zegarka)</summary>
        <ul>
          <li>W zakładce <b>Trening</b> wybierz dyscyplinę w karcie „📍 Nagraj trening telefonem” i kliknij <b>START</b>. Aplikacja zapisuje trasę z GPS telefonu i na bieżąco pokazuje czas, dystans, tempo i mapę.</li>
          <li><b>Ekran musi zostać włączony</b> i aplikacja musi być na wierzchu — gdy zgasisz ekran albo przełączysz się na inną aplikację, przeglądarka wstrzymuje GPS (na iPhonie od razu). Aplikacja sama nie pozwala ekranowi zgasnąć; telefon najlepiej trzymać w opasce na ramię albo w uchwycie na kierownicy. Jasność ekranu możesz zmniejszyć.</li>
          <li><b>PAUZA</b> zatrzymuje liczenie czasu i dystansu, <b>ZAKOŃCZ</b> przenosi wynik do formularza — sprawdź dane i kliknij „ZAPISZ TRENING”. Trasa trafia do Historii (🗺 mapa i profil wysokości).</li>
          <li>Nagranie zapisuje się na bieżąco w telefonie — jeśli aplikacja się zamknie, po ponownym otwarciu możesz je wznowić albo zakończyć.</li>
          <li>Lokalizacja zostaje <b>tylko w Twoim telefonie</b> — nigdzie jej nie wysyłamy (chyba że sam udostępnisz trening w Aktywności).</li>
          <li>Na basenie GPS nie działa — wpisz trening ręcznie.</li>
          <li><b>Aplikacja na Androida</b> (z instalatora / Google Play): przy pierwszym nagrywaniu zezwól na lokalizację i wybierz <b>„Dokładna”</b>. Jeśli GPS nie łapie: Ustawienia telefonu → Aplikacje → Polska Adventure Ultra → Uprawnienia → Lokalizacja → „Zezwalaj tylko podczas używania aplikacji” + włącz „Używaj dokładnej lokalizacji”. Zgoda przeglądarki (Chrome) i aplikacji to dwie osobne zgody.</li>
        </ul>
      </details>
      <details><summary>🛠 Nie mogę się zalogować</summary>
        <ul>
          <li>Pod przyciskiem „Zaloguj” jest szara linijka (wersja, „treningi tutaj”). Jeśli jej nie ma, przeglądarka blokuje skrypty strony.</li>
          <li><b>Brave</b>: dotknij ikony lwa w pasku adresu i wyłącz „Blokuj skrypty” albo Shields dla tej strony.</li>
          <li>Treningi są zapisane w tej przeglądarce, w której zainstalowano ikonę. Inna przeglądarka ich nie widzi (pokaże „treningi tutaj: 0”).</li>
          <li>Nie usuwaj ikony ani danych przeglądarki — można stracić treningi. Najpierw zrób kopię zapasową w Historii.</li>
        </ul>
      </details>
      <details><summary>⌚ Import z zegarka (Garmin / Suunto / Polar / Samsung / Huawei)</summary>
        <ul>
          <li><b>Garmin Connect</b> (www): otwórz aktywność → ikona koła zębatego → „Eksportuj do GPX” lub „Eksportuj do TCX”.</li>
          <li><b>Suunto app</b>: Dziennik → trening → ⋮ / Udostępnij → Eksportuj → GPX albo FIT. Pływanie w basenie nie ma trasy GPS — wybierz <b>FIT</b> (dystans, czas i tętno wczytają się z zegarka).</li>
          <li><b>Polar Flow</b> (www): otwórz trening → „Eksportuj sesję” → GPX lub TCX.</li>
          <li><b>Samsung Health</b> (Galaxy Watch): w telefonie otwórz trening z trasą GPS → ⋮ → „Eksportuj do pliku GPX”. Opcja jest tylko przy treningach z GPS (np. bieg, rower, spacer), a plik nie zawiera tętna.</li>
          <li><b>Huawei Health</b> (Huawei Watch): otwórz trening → ikona udostępniania/⋮ → „Eksportuj trasę” → GPX lub TCX (zależnie od wersji aplikacji i zegarka). Jeśli tej opcji nie ma: połącz Huawei Health ze Stravą (Ja → Udostępnianie danych i autoryzacja → Strava), a potem na strava.com otwórz trening → ⋯ → „Eksportuj GPX”.</li>
          <li><b>Strava</b> (www): otwórz trening → ⋯ → „Eksportuj GPX” — działa dla każdego zegarka zsynchronizowanego ze Stravą.</li>
          <li>W zakładce Trening kliknij kafelek „⌚ Trening z zegarka”, potem „WCZYTAJ PLIK GPX / TCX / FIT”, wybierz plik, sprawdź dane i kliknij „ZAPISZ TRENING”. Trasa zapisze się razem z treningiem.</li>
        </ul>
      </details>
      <details><summary>📋 Historia</summary>
        <ul>
          <li><b>🎯 Cele</b>: „＋ DODAJ CEL” ustawia cel tygodniowy lub miesięczny w km — dla jednej dyscypliny albo wszystkich razem. Pasek pokazuje postęp, ile km i dni zostało; po zapisaniu treningu, który domyka cel, pojawi się gratulacja. Tydzień liczy się od poniedziałku.</li>
          <li><b>Podsumowanie</b> na górze zakładki: liczba treningów, dystans, czas i przewyższenie w wybranym okresie (tydzień, miesiąc, rok, od początku), porównanie z poprzednim okresem i rozbicie na dyscypliny.</li>
          <li><b>🔥 Passa</b> to liczba kolejnych dni z treningiem. Obecna passa trwa, jeśli ostatni trening był dziś albo wczoraj.</li>
          <li><b>🏆 Rekordy osobiste</b> dla każdej dyscypliny: najdłuższy dystans i czas, najszybsze tempo (bieg) lub prędkość (rower, kajak), największe przewyższenie, a także najlepszy tydzień i miesiąc. Tempo i prędkość liczą się dla treningów od 1 km z wpisanym czasem.</li>
          <li>🗺 — pokazuje trasę treningu na mapie wraz z profilem wysokości (dla treningów zaimportowanych z pliku).</li>
          <li>✏️ — poprawia trening: dystans, czas, datę, dyscyplinę, tętno, kroki i notatki. Trasa i profil wysokości zostają. Przy treningu z trasą GPS przycisk „📏” wstawia dystans zmierzony na trasie. Udostępniony trening poprawia się też w Aktywności.</li>
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
          <li><b>📍 Punkty na trasie</b> (żywienie, przepak, nocleg, sklep, woda, ⚠️ niebezpieczne miejsce, inne): otwórz trasę (🗺), kliknij „📍 DODAJ PUNKT NA TRASIE” i dotknij miejsca na mapie — wybierasz rodzaj, nazwę i opis; kliknięcie ikony na mapie albo ✏️ na liście pozwala punkt poprawić lub usunąć. W nagrywaniu telefonem przycisk „📍 PUNKT TUTAJ” zapisuje punkt w miejscu, w którym jesteś (nazwę możesz od razu wpisać albo podyktować, a pod spodem jest lista dodanych punktów z ✏️ i 🗑); po zakończeniu zapiszesz przebytą trasę z punktami w zakładce Trasy (albo zaznacz przed START „🗺 Zapisz przebytą trasę”). Trasę z zegarka wczytasz „📂 WCZYTAJ TRASĘ Z PLIKU” i dodasz punkty potem. Punkty trafiają do pliku GPX (zegarek pokaże je jako punkty trasy), a przy prowadzeniu po trasie widać „Następny punkt: … za X km”, a głos uprzedza ok. 300 m wcześniej (przed niebezpiecznym miejscem 500 m wcześniej, z wibracją).</li>
          <li><b>🧭 Prowadzenie po trasie w telefonie</b>: „📂 WCZYTAJ TRASĘ Z PLIKU” (GPX / TCX / FIT, np. z Garmin Connect, Komoot, Strava) dodaje trasę do listy. Przycisk 🧭 przy trasie — albo pole „Prowadź po trasie” przed START w nagrywaniu telefonem — włącza prowadzenie: trasa jest na mapie, widać kilometry do końca, a gdy zboczysz o ok. 50 m (rower 60 m, kajak i pływanie 100 m), telefon zawibruje, pokaże czerwony komunikat i powie to głosem (głos wyłączysz polem „🔊 Komunikaty głosowe” albo przyciskiem 🔊 w trakcie); w aplikacji ze Sklepu Play przy zgaszonym ekranie dostaniesz powiadomienie. Przy słabym GPS ostrzeżenia są wstrzymane, żeby nie było fałszywych alarmów — trasa zostaje na mapie.</li>
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
          <li>Aplikacja nigdy nie prosi o hasło do Garmin, Suunto, Polar, Samsung, Huawei ani Strava — pliki importujesz sam.</li>
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
        <li><b>Udostępnione aktywności</b> (tylko te, które sam udostępnisz): nick, dyscyplina, data, dystans, czas, liczba kroków (bieg, trekking) i trasa (z wysokością n.p.m., jeśli trening ją ma) bez pierwszych/ostatnich 300 m. Nie są powiązane z identyfikatorem urządzenia. Przechowywane do czasu, aż je usuniesz. Widoczne dla wszystkich użytkowników aplikacji.</li>
        <li><b>Postęp w wyzwaniu 4000 km</b> (tylko jeśli się na to zgodzisz): nick, data startu i przebyte kilometry w biegu, na rowerze i w kajaku — bez tras i szczegółów treningów. Powiązane z losowym tokenem z Twojego telefonu (w bazie tylko jego hash), nie z identyfikatorem urządzenia. Widoczne dla organizatora, a dla pozostałych użytkowników dopiero po udostępnieniu listy przez organizatora. Usuwane od razu po wyłączeniu zgody lub rezygnacji z wyzwania.</li>
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
    optAuto4x4: "4x4 off-road",
    distSwimPlaceholder: "e.g. 1.5 = 1500 m",
    labelDate: "Date",
    labelDist: "Distance (km)",
    labelTime: "Time (min)",
    labelHr: "Avg. heart rate (bpm)",
    labelSteps: "Steps",
    importNoSteps: "\n👣 This file has no steps. Export the training as FIT or enter the steps manually.",
    updateText: "🆕 New PAU version on Google Play. Your trainings stay on your phone.",
    updateNowBtn: "UPDATE",
    lookNew: "✨ New look",
    lookClassic: "↩ Classic look",
    logoutBtn: "Log out",
    confirmLogout: "Log out? Your trainings and settings stay on this phone — enter your PIN and everything will be as before.",
    logoutRecording: "A training is being recorded — finish it first.",
    h2Week: "This week",
    h2Day: "Challenge day",
    h2Streak: (n, best) => `🔥 <b>${n}</b> ${n === 1 ? "day" : "days"} in a row with training · best ${best}`,
    h2StreakNone: (best) => (best > 0 ? `🔥 Start a new streak — best: ${best} ${best === 1 ? "day" : "days"} in a row` : "🔥 Your first training starts a streak"),
    h2VsPrev: (p) => `${p >= 0 ? "▲" : "▼"} ${Math.abs(p)}% vs last week`,
    h2Days: ["MO", "TU", "WE", "TH", "FR", "SA", "SU"],
    h2RouteStart: "Lublin ▸ start",
    h2RouteFinish: "finish ◂ Lublin",
    h2ChKm: (km, pct) => `🏁 Challenge: ${km} km · ${pct}%`,
    h2Today: "Today",
    h2Yesterday: "Yesterday",
    h2LastLbl: "Last training",
    labelVo2max: "VO2max",
    labelWeight: "Weight (kg)",
    labelNotes: "Notes / How you felt",
    saveBtn: "SAVE TRAINING",
    paceBtn: "CALCULATE PACE",
    chartBtn: "SHOW PROGRESS CHART",
    exportBtn: "EXPORT TO CSV",
    importBtn: "📂 LOAD GPX / TCX / FIT FILE",
    modePhone: "Training from phone",
    modeWatch: "Training from watch",
    modeManual: "Create your own training",
    watchTitle: "⌚ Training from your watch",
    watchBrandLbl: "Your watch / app",
    watchBrandOther: "Strava / other",
    watchSteps: {
      garmin: ["On connect.garmin.com open the activity (the Garmin Connect phone app can't export files — use a browser).", "Gear icon → “Export to GPX” or “Export to TCX”."],
      suunto: ["Suunto app: Diary → choose the training.", "⋮ / Share → Export → choose FIT (it also has steps and pool data; GPX only has the route and heart rate)."],
      polar: ["On flow.polar.com open the training.", "“Export session” → GPX or TCX."],
      samsung: ["Samsung Health on your phone: open a workout with a GPS route.", "⋮ → “Export to GPX file”. Only available for GPS workouts; the file has no heart rate."],
      huawei: ["Huawei Health: open the workout → ⋮ / share → “Export route” → GPX or TCX.", "No such option? Link Huawei Health with Strava (Me → Data sharing and authorization → Strava) and download the file from Strava (choose “Strava / other”)."],
      other: ["Sync your watch with Strava, then on strava.com open the activity → ⋯ → “Export GPX”.", "Any GPX, TCX or FIT file from another app works too."],
    },
    watchStepLast: "Tap “Load file”, pick the downloaded file, check the data and save the training.",
    recTitle: "📍 Record with your phone",
    recIntroNative: "No watch needed — the app records your route with the phone's GPS, also with the screen off and in the background (you'll see a notification). Allow location on first start.",
    recNotifTitle: "Polska Adventure Ultra — recording",
    recNotifText: "Recording your training route. Finish it in the app.",
    recNoLocationPerm: "🔴 The app has no location permission. Tap “Open settings” → Permissions → Location → “Allow only while using the app” and turn on “Use precise location”. Then come back — recording starts by itself.",
    recApproxOnly: "🟠 The app only has approximate location (±a few km) — a route can't be recorded that way. Tap “Open settings” → Permissions → Location and turn on “Use precise location”. Then come back.",
    recLocationOff: "🔴 Location is turned off on your phone. Tap here or “📍 Turn on location” below — recording starts by itself.",
    recLocationOffManual: "🔴 Location is turned off on your phone. Pull down the top bar and turn on “Location” — recording starts by itself.",
    recEnableLocation: "📍 Turn on location",
    recOpenSettings: "⚙ Open settings",
    recIntro: "No watch needed — the app records your route with the phone's GPS. Keep the screen on (the app won't let it sleep) and don't switch to other apps: in the background the browser pauses GPS.",
    recStartBtn: "▶ START",
    recPauseBtn: "⏸ PAUSE",
    recResumeBtn: "▶ RESUME",
    recFinishBtn: "■ FINISH",
    recDiscardBtn: "Discard recording",
    recTimeLbl: "Moving time",
    recDistLbl: "Distance (km)",
    recPaceLbl: "Avg pace",
    recSpeedLbl: "Avg speed",
    recWeightLbl: "Your weight (kg) — for calorie count",
    recWeightPh: "e.g. 75 (optional)",
    recKcalLbl: "🔥 Calories burned",
    recKcalNoWeight: "🔥 kcal — enter your weight before start",
    recKcalNote: (kcal) => `🔥 approx. ${kcal} kcal (estimate)`,
    recGpsLbl: "GPS accuracy",
    recWaitingGps: "Looking for GPS signal… (open sky works best)",
    recGpsOk: "🟢 Recording — GPS OK",
    recBackgroundOk: (min) => `✅ GPS kept working with the screen off${min ? ` (about ${min} min)` : ""} — route recorded without gaps.`,
    recWeakGps: (m) => `🟠 Weak GPS signal (±${m} m) — waiting for a better one`,
    recPausedStatus: "⏸ Paused — time and distance are not counted",
    recDenied: "Location permission denied. Allow it for this site in your browser/phone settings (Android: padlock next to the address → Permissions → Location; iPhone: Settings → Privacy → Location Services → Safari).",
    recUnavailable: "🔴 GPS unavailable — check that location is turned on",
    recNoGeo: "This browser does not support GPS.",
    recNoWakeLock: "This browser can't keep the screen on — set a longer screen timeout in your phone settings.",
    recWasHidden: (min) => `⚠️ The app was in the background${min ? ` for about ${min} min` : ""} — GPS may have stopped; that part was joined with a straight line.`,
    recRestored: "⚠️ Recording was interrupted (the app was closed). Tap RESUME to continue or FINISH.",
    recConfirmFinish: "Finish recording?",
    recTooShort: "The recorded route is too short (under 50 m). Discard it?",
    recConfirmDiscard: "Discard the recording? The route will be deleted.",
    recNote: "📍 Recorded with phone (GPS)",
    recFinishedHint: (km, time, kcal) => `📍 Recorded ${km} km in ${time}${kcal ? `, burned approx. ${kcal} kcal` : ""}. Check the data, add heart rate or a note and tap "SAVE TRAINING".`,
    chartTitle: "Distance progress",
    historyTitle: "Training history",
    themeBtn: "Switch theme",
    pinChangeBtn: "Change PIN",
    langBtnTarget: "PL",
    totalLabel: (km) => `🏅 Total: ${km} km`,
    heroTotal: "Total",
    samsungHintText: "You're using Samsung Internet. To get the app on your screen, open the menu ☰ → “Add page to” → “Home screen”. For the full app (no address bar), open this link in Chrome and choose ⋮ → “Install app”.",
    samsungHintCopy: "COPY LINK (FOR CHROME)",
    samsungHintCopied: "Link copied — paste it in Chrome.",
    heroWeek: "this week",
    addTrainingTitle: "Add training",
    noHistory: "No saved trainings yet.",
    deleteTitle: "Delete entry",
    navRouteLbl: "🧭 Follow a route (optional)",
    navRouteHint: "A route from the Routes tab or a GPX / TCX / FIT file (e.g. from Garmin Connect, Komoot, Strava). It is shown on the map with the distance left, and you get a warning when you go off route.",
    navNone: "— no route —",
    navLoadFile: "📂 Load route from file (GPX / TCX / FIT)",
    navFileOpt: (name, km) => `📄 ${name} — ${km} km`,
    navNoPoints: "The file contains no route (GPS points).",
    navLoadError: (msg) => `Could not load the route: ${msg}`,
    navSaveToRoutes: (name) => `Save the route “${name}” in the Routes tab so it is available next time too?`,
    navLeft: (km) => `${km} km to go`,
    navWaiting: "Waiting for GPS signal…",
    navOn: "✅ On route",
    navOff: (m) => `⚠️ ${m} m off route — get back to the line on the map`,
    navBack: "✅ Back on route",
    navNoGps: "📡 Weak or no GPS signal — off-route warnings paused",
    navPaused: "⏸ Paused — route guidance on hold",
    navFinished: "🏁 End of the route!",
    navBusy: "Recording in progress — choose a route before START.",
    navRouteTitle: "Follow this route (phone recording)",
    routeImportBtn: "📂 LOAD ROUTE FROM FILE (GPX / TCX / FIT)",
    routeImportHint: "Load a route from Garmin Connect, Komoot, Strava or a friend here. The 🧭 button next to a route starts guidance in phone recording.",
    routeImported: (name, km) => `Loaded route “${name}” (${km} km). The 🧭 button next to the route starts guidance.`,
    navNotifTitle: "Polska Adventure Ultra — route",
    poiTypes: { food: "Food station", drop: "Drop bag", sleep: "Overnight stay", shop: "Shop", water: "Water", danger: "Caution – dangerous spot", other: "Other" },
    poiFood: "Food", poiDrop: "Drop bag", poiSleep: "Sleep", poiShop: "Shop", poiWater: "Water", poiDanger: "Caution", poiOther: "Other",
    navDanger: (m, name) => `⚠️ Dangerous spot in ${m} m${name ? `: ${name}` : ""} — take care!`,
    navSayDanger: (m, name) => `Caution! Dangerous spot in ${m} metres${name ? `: ${name}` : ""}`,
    planPoiBtn: "📍 ADD A POINT ON THE ROUTE",
    planPoiArmed: "👆 Tap the place on the map (tap here to cancel)",
    poiNeedRoute: "Plan or load a route first — points are added to an existing route.",
    poiFormNew: "📍 New point on the route",
    poiFormEdit: "✏️ Edit point",
    poiTypeLbl: "Type",
    poiNameLbl: "Name (e.g. shop name, mountain hut)",
    poiNoteLbl: "Description (opening hours, tips…)",
    poiSaveBtn: "SAVE POINT",
    poiDeleteBtn: "Delete point",
    poiCancelBtn: "Cancel",
    poiConfirmDelete: "Delete this point from the route?",
    poiListTitle: "📍 Points on the route",
    poiKm: (km) => `km ${km}`,
    poiOff: (m) => `${m} m from the route`,
    poiUnsaved: "Point added. It is saved together with the route — tap “SAVE ROUTE”.",
    poiCount: (n) => `📍 ${n}`,
    poiNoGps: "Wait for the GPS signal — the point is saved where you are.",
    recPoiBtn: "📍 POINT HERE",
    recPoiPickHint: "Type or dictate a name (keyboard microphone) and tap the point type. It also saves without a name.",
    recPoiNamePh: "Name / note (optional), e.g. spring by the chapel",
    recPoiRename: "Point name (e.g. shop, spring by the chapel):",
    recPoiNote: "Description (optional — opening hours, tips):",
    recPoiAdded: (label) => `📍 Point added: ${label}`,
    recPoiCount: (n) => `📍 Points added: ${n} — after finishing you can save them with the route in the Routes tab.`,
    recSaveRouteLbl: "🗺 Save the recorded route in the Routes tab (e.g. so others can follow it later)",
    recChallengeLbl: "🏁 4000 km challenge stage — kilometres are added to the challenge live as you go",
    trainSaveRouteLbl: "🗺 Also save the route in the Routes tab (follow it 🧭 and share it with others 📤)",
    toRoutesTitle: "Save the route in the Routes tab (follow 🧭, share 📤)",
    toRoutesAgain: "This route is already saved in the Routes tab. Save it again?",
    toRoutesSaved: (name) => `Saved “${name}” in the Routes tab. There: 🧭 follow the route, 📤 share it with others, GPX for your watch.`,
    navCommunityTitle: "Follow this route (saves it to your routes)",
    recSaveRouteAsk: (n) => `You added points on the way (${n}). Save the recorded route with the points in the Routes tab?`,
    recRouteSaved: (name, n) => `Route “${name}” saved in the Routes tab${n ? ` (points: ${n})` : ""}. There you can add names and descriptions of the points (🗺), export GPX or share the route.`,
    navNextPoi: (title, km) => `Next point: ${title} — in ${km} km`,
    navSayPoi: (m, label) => `In ${m} metres: ${label}`,
    chMsgTitle: "📢 Organizer messages",
    chMsgEmpty: "No messages yet. When the organizer posts something, you will see it here — and while recording the phone lets you know right away.",
    chMsgNew: "new",
    chMsgUntil: (d) => `valid until ${d}`,
    chMsgBodyLbl: "New message for participants",
    chMsgImportantLbl: "⚠️ Important — the phone vibrates harder and shows a pop-up (every message is read out loud)",
    chMsgExpiryLbl: "Show for",
    chMsgExpiry0: "no end date (until deleted)",
    chMsgExpiry1: "1 day",
    chMsgExpiry3: "3 days",
    chMsgExpiry7: "7 days",
    chMsgSendBtn: "📢 SEND MESSAGE",
    chMsgAdminHint: "Participants with an invitation code see the message right away if the app is open or they are recording, others the next time they open the app.",
    chMsgEmptyBody: "Type the message.",
    chMsgConfirmSend: (important) => important ? "Send an IMPORTANT message to all participants? Phones vibrate harder, show a pop-up and read it out loud." : "Send the message to all participants? Phones will read it out loud.",
    chMsgSent: "Message sent ✅",
    chMsgSendError: "That did not work — check the internet connection and try again.",
    chMsgConfirmDelete: "Delete this message? It disappears for all participants.",
    chMsgNotifTitle: "📢 Organizer message",
    chMsgNotifTitleImportant: "⚠️ Important organizer message",
    chMsgSay: (body) => `Important message from the organizer: ${body}`,
    chMsgSayNormal: (body) => `Message from the organizer: ${body}`,
    chMsgStatus: (body) => `📢 Organizer message: ${body} (Challenge tab)`,
    navVoiceLbl: "🔊 Voice prompts during guidance",
    navChannelName: "Route warnings",
    navChannelDesc: "Vibration and message when you go off route with the screen off",
    navVoiceOnTitle: "Voice on — tap to mute",
    navVoiceOffTitle: "Voice muted — tap to turn on",
    navSayOn: "Voice prompts on",
    navSayStart: (km) => `Route guidance started. ${km} kilometres to go`,
    navSayOff: (m) => `Warning, you are ${m} metres off route`,
    navSayBack: "Back on route",
    navSayFinish: "End of the route. Well done!",
    editEntryTitle: "Edit training (distance, time, notes…)",
    editTitle: "✏️ Edit training",
    editSaveBtn: "SAVE CHANGES",
    editCancelBtn: "Cancel",
    editSharedHint: "This training is shared — after saving it will also be updated in the Activity tab.",
    editRouteDist: (km) => `📏 Distance measured on the GPS route: ${km} km — use it`,
    editSaved: "Changes saved.",
    editReshared: "Changes saved — the shared training in Activity is updated too.",
    editReshareFailed: "Changes saved on this phone, but the shared training in Activity could not be updated (no internet?). Try again: open and save the training once more.",
    editUnsharedNoShare: "Changes saved. 4x4 drives are not shown in Activity, so this training was removed from it.",
    confirmDelete: "Delete this entry from history?",
    alertDistRequired: "Enter a distance greater than 0.",
    implausibleField: "Incorrect or unrealistic data — check the values you entered.",
    implausibleAlert: (lines, contact) => `⚠️ Incorrect or unrealistic data:\n\n${lines.map((l) => "• " + l).join("\n")}\n\nIf the data you entered is correct, please contact the administrator: ${contact}`,
    implSpeed: (disc, v) => `average speed ${v} km/h (${disc}) — unrealistic value`,
    implDist: (disc, km) => `distance ${km} km (${disc}) — unrealistic value`,
    implStride: (steps, km) => `${steps} steps over ${km} km — unrealistic value`,
    implCadence: (spm) => `${spm} steps per minute — unrealistic value`,
    implHr: (hr) => `average heart rate ${hr} bpm — unrealistic value`,
    implTime: "training duration — unrealistic value",
    implFuture: "training date is in the future",
    implWeight: (kg) => `weight ${kg} kg — unrealistic value`,
    implVo2: (v) => `VO2max ${v} — unrealistic value`,
    implNegative: "values cannot be negative",
    alertSaved: "Training saved!",
    alertTimeRequired: "Enter a time greater than 0.",
    paceResult: (min, sec) => `Pace: ${min}:${sec} min/km`,
    speedResult: (v) => `Speed: ${v} km/h`,
    swimPaceResult: (pace) => `Pace: ${pace}`,
    alertNoHistoryChart: "No historical data.",
    alertNoHistoryExport: "No data to export.",
    importSuccess: (p) =>
      `Training loaded from file:\nDate: ${p.date}\nDistance: ${p.dist} km\n` +
      `Time: ${p.time} min\nAvg. HR: ${p.hr} bpm\n${p.steps ? `Steps: ${p.steps}\n` : ""}\nCheck the data and click "SAVE TRAINING".`,
    importError: (msg) => `Import error: ${msg}`,
    errNoGpxPoints: "No track points found in the GPX file.",
    errNoTcxData: "No training data found in the TCX file.",
    errBadXml: "Could not read the file (invalid XML).",
    errBadFit: "Could not read the FIT file.",
    promptNewPin: "Enter new PIN:",
    pinChanged: "PIN changed.",
    historyLabels: { date: "Date", disc: "Discipline", dist: "Distance", weight: "Weight", hr: "HR", vo2max: "VO2max", notes: "Notes" },
    discNames: { Bieg: "Running", Rower: "Cycling", Kajak: "Kayaking", Basen: "Swimming – pool", WodyOtwarte: "Swimming – open water", Trekking: "Hiking", Auto4x4: "4x4 off-road", Multi: "Multisport" },
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
    planExportBtn: "EXPORT / OPEN (GPX, KML)",
    planExportHint: "Garmin: Garmin Connect (web) → Training → Courses → Import. Suunto: open the GPX file in the Suunto app. Polar: Polar Flow (web) → Favorites → Routes → Import. Turn-by-turn along the route: OsmAnd (GPX) or MAPS.ME (KML).",
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
    exportRouteTitle: "Export / open in another app",
    exportMenuTitle: "Export / open route",
    exportMenuGpx: "⌚ GPX file",
    exportMenuGpxHint: "watch (Garmin, Suunto, Polar), save to Drive, send by e-mail",
    exportMenuOpenGpx: "🧭 Open in navigation (GPX)",
    exportMenuOpenGpxHint: "OsmAnd, Locus Map and other apps that open GPX",
    exportMenuKml: "🗺 MAPS.ME (KML)",
    exportMenuKmlHint: "MAPS.ME reads routes only as KML",
    exportMenuClose: "Close",
    openInNoApp: (app) => `No app on this phone can open this file. Install e.g. ${app} and try again.`,
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
    chShareLabel: "Show my progress to observers (nickname and kilometres)",
    chShareAsk: "Show your progress to other people in the app?\n\nOnly your nickname, start date and distance covered (running/cycling/kayaking) will be visible — no routes or trainings. You can change this at any time in the challenge settings.",
    chShareOn: (nick) => `Progress visible as “${nick}”. Observers will see the list once the organizer makes it public.`,
    chShareOff: "Your progress is visible only to you.",
    chShareRemoveFailed: "Could not remove your progress from the server (no internet?). Please try again.",
    chBoardTitle: (n) => `PARTICIPANTS · ${n}`,
    chBoardEmpty: "Nobody has shared their progress yet.",
    chBoardPreview: "Organizer preview — observers can't see this yet.",
    chBoardShow: "👁 SHOW THE LIST TO OBSERVERS",
    chBoardHide: "🙈 HIDE THE LIST FROM OBSERVERS",
    chBoardConfirmShow: "Show the participant list (nickname + km) to all app users?",
    chBoardConfirmHide: "Hide the participant list from observers?",
    chBoardNotAllowed: "Only the main organizer can change the list visibility.",
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
    deleteEventNotOwner: "You can only delete events you added yourself.",
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
    fileSaveError: "Could not save the file.",
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
          <li>Only <b>challenge stages</b> count towards progress: when saving a training tick “🏁 4000 km challenge stage”, when recording with the phone tick 🏁 before START and the kilometres are added to the challenge live as you go; and in History you can mark or unmark a training with the 🏁 button. Everyday trainings elsewhere go only to History. The challenge is running, cycling and kayaking — swimming, hiking and 4x4 off-road don't count towards it (they have no 🏁 option).</li>
          <li><b>📢 Organizer messages</b>: in the Challenge tab participants see announcements from the organizer (e.g. route changes, dangerous spots, meals). New ones are marked with a red dot on the tab. While recording, the phone lets you know right away (vibration, and a notification with the screen off), and reads important messages out loud (🔊 switch as in route guidance). When the app is closed, you see new messages the next time you open it.</li>
          <li>After leaving, the screen returns to the observer view; your trainings stay in History.</li>
        </ul>
      </details>
      <details><summary>🏃 Saving a training</summary>
        <ul>
          <li>In the <b>Training</b> tab choose a discipline, enter the distance (required) and other data, then tap “SAVE TRAINING”.</li>
          <li>Disciplines: running, cycling, kayaking, swimming (pool or open water: lake, river, sea), hiking and 4x4 off-road driving. Swimming distance is also entered in km (1500 m = 1.5). 4x4 drives stay only in your History — they don't count towards the challenge and can't be shared in Activity.</li>
          <li>“CALCULATE PACE” shows pace per km (running), pace per 100 m (swimming) or speed in km/h (cycling, kayaking, hiking, 4x4); “SHOW PROGRESS CHART” draws a distance chart.</li>
        </ul>
      </details>
      <details><summary>📍 Recording with your phone (no watch)</summary>
        <ul>
          <li>In the <b>Training</b> tab choose a discipline in the "📍 Record with your phone" card and tap <b>START</b>. The app records your route with the phone's GPS and shows time, distance, pace and a live map.</li>
          <li><b>Keep the screen on</b> with the app in front — if you lock the screen or switch apps, the browser pauses GPS (on iPhone immediately). The app keeps the screen from sleeping; an armband or a handlebar mount works best. You can lower the brightness.</li>
          <li><b>PAUSE</b> stops counting time and distance, <b>FINISH</b> moves the result into the form — check it and tap "SAVE TRAINING". The route goes to History (🗺 map and elevation profile).</li>
          <li>The recording is saved on the phone as you go — if the app closes, reopen it to resume or finish.</li>
          <li>Your location stays <b>only on your phone</b> — we don't send it anywhere (unless you share a training in Activity yourself).</li>
          <li>GPS doesn't work in a pool — enter those trainings manually.</li>
          <li><b>Android app</b> (installer / Google Play): on the first recording allow location and choose <b>“Precise”</b>. If GPS doesn't work: phone Settings → Apps → Polska Adventure Ultra → Permissions → Location → “Allow only while using the app” + turn on “Use precise location”. The browser (Chrome) permission and the app permission are two separate permissions.</li>
        </ul>
      </details>
      <details><summary>🛠 I can't log in</summary>
        <ul>
          <li>Under the “Log in” button there is a grey line (version, “trainings here”). If it's missing, the browser is blocking the site's scripts.</li>
          <li><b>Brave</b>: tap the lion icon in the address bar and turn off “Block scripts” or Shields for this site.</li>
          <li>Trainings are stored in the browser the icon was added from. Another browser can't see them (it shows “trainings here: 0”).</li>
          <li>Don't remove the icon or clear browser data — you could lose your trainings. Make a backup in History first.</li>
        </ul>
      </details>
      <details><summary>⌚ Import from your watch (Garmin / Suunto / Polar / Samsung / Huawei)</summary>
        <ul>
          <li><b>Garmin Connect</b> (web): open the activity → gear icon → “Export to GPX” or “Export to TCX”.</li>
          <li><b>Suunto app</b>: Diary → training → ⋮ / Share → Export → GPX or FIT. Pool swims have no GPS route — choose <b>FIT</b> (distance, time and heart rate are read from the watch).</li>
          <li><b>Polar Flow</b> (web): open the training → “Export session” → GPX or TCX.</li>
          <li><b>Samsung Health</b> (Galaxy Watch): on the phone open a workout with a GPS route → ⋮ → “Export to GPX file”. Only available for GPS workouts (e.g. running, cycling, walking); the file has no heart rate.</li>
          <li><b>Huawei Health</b> (Huawei Watch): open the workout → share icon/⋮ → “Export route” → GPX or TCX (depends on app and watch version). If it's missing: link Huawei Health with Strava (Me → Data sharing and authorization → Strava), then on strava.com open the activity → ⋯ → “Export GPX”.</li>
          <li><b>Strava</b> (web): open the activity → ⋯ → “Export GPX” — works for any watch synced with Strava.</li>
          <li>On the Training tab tap the “⌚ Training from watch” tile, then “LOAD GPX / TCX / FIT FILE”, choose the file, check the data and tap “SAVE TRAINING”. The route is saved with the training.</li>
        </ul>
      </details>
      <details><summary>📋 History</summary>
        <ul>
          <li><b>🎯 Goals</b>: “＋ ADD GOAL” sets a weekly or monthly distance goal in km — for one discipline or all of them together. The bar shows progress and how many km and days are left; saving a training that completes a goal shows a congratulation. Weeks start on Monday.</li>
          <li><b>Summary</b> at the top of the tab: number of trainings, distance, time and ascent in the chosen period (week, month, year, all time), comparison with the previous period and a breakdown by discipline.</li>
          <li><b>🔥 Streak</b> is the number of consecutive days with a training. The current streak continues as long as you train today or trained yesterday.</li>
          <li><b>🏆 Personal records</b> for each discipline: longest distance and time, fastest pace (running) or speed (cycling, kayaking), biggest ascent, plus your best week and month. Pace and speed count trainings of 1 km+ with time entered.</li>
          <li>🗺 — shows the training route on a map with its elevation profile (for trainings imported from a file).</li>
          <li>✏️ — edits the training: distance, time, date, discipline, heart rate, steps and notes. The route and elevation profile are kept. For trainings with a GPS route, the “📏” button fills in the distance measured on the route. A shared training is updated in Activity too.</li>
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
          <li><b>📍 Points on the route</b> (food, drop bag, overnight, shop, water, ⚠️ dangerous spot, other): open a route (🗺), tap “📍 ADD A POINT ON THE ROUTE” and tap the place on the map — choose the type, name and description; tapping the icon on the map or ✏️ in the list lets you edit or delete it. In phone recording, “📍 POINT HERE” saves a point where you are (you can type or dictate a name right away; below there is a list of added points with ✏️ and 🗑); after finishing you can save the recorded route with the points in the Routes tab (or tick “🗺 Save the recorded route” before START). Load a watch route with “📂 LOAD ROUTE FROM FILE” and add points afterwards. Points go into the GPX file (the watch shows them as course points), and during route guidance you see “Next point: … in X km” and the voice warns about 300 m ahead (500 m ahead with vibration before a dangerous spot).</li>
          <li><b>🧭 Route guidance on the phone</b>: “📂 LOAD ROUTE FROM FILE” (GPX / TCX / FIT, e.g. from Garmin Connect, Komoot, Strava) adds a route to the list. The 🧭 button next to a route — or the “Follow a route” field before START in phone recording — turns on guidance: the route is on the map, you see the distance left, and when you go about 50 m off route (cycling 60 m, kayak and swimming 100 m) the phone vibrates, shows a red message and says it out loud (turn the voice off with the “🔊 Voice prompts” box or the 🔊 button while recording); in the Play Store app you get a notification while the screen is off. With weak GPS, warnings are paused to avoid false alarms — the route stays on the map.</li>
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
          <li>The app never asks for your Garmin, Suunto, Polar, Samsung, Huawei or Strava password — you import files yourself.</li>
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
        <li><b>Shared activities</b> (only those you share yourself): nickname, discipline, date, distance, time, step count (running, trekking) and the route (with altitude, if the training has it) without the first/last 300 m. Not linked to the device ID. Kept until you delete them. Visible to all app users.</li>
        <li><b>4000 km challenge progress</b> (only if you agree): nickname, start date and distance covered running, cycling and kayaking — no routes or training details. Linked to a random token from your phone (only its hash is stored), not to the device ID. Visible to the organizer, and to other users only after the organizer makes the list public. Deleted immediately when you withdraw consent or leave the challenge.</li>
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

// Teksty inne na iPhonie (apka natywna iOS): ustawienia, sklep. Nadpisują klucze z TRANSLATIONS.
const IOS_TEXTS = {
  pl: {
    updateText: "🆕 Nowa wersja PAU w App Store. Twoje treningi zostają na telefonie.",
    recNoLocationPerm: "🔴 Aplikacja nie ma zgody na lokalizację. Kliknij „Otwórz ustawienia” → Lokalizacja → „Podczas używania aplikacji” i włącz „Dokładna lokalizacja”. Potem wróć tutaj — nagrywanie ruszy samo.",
    recApproxOnly: "🟠 Aplikacja ma tylko przybliżoną lokalizację (±kilka km) — tak nie da się nagrać trasy. Kliknij „Otwórz ustawienia” → Lokalizacja i włącz „Dokładna lokalizacja”. Potem wróć tutaj.",
    recLocationOff: "🔴 Lokalizacja w telefonie jest wyłączona. Włącz ją: Ustawienia → Prywatność i ochrona → Usługi lokalizacji. Potem wróć tutaj — nagrywanie ruszy samo.",
    recLocationOffManual: "🔴 Lokalizacja w telefonie jest wyłączona. Włącz ją: Ustawienia → Prywatność i ochrona → Usługi lokalizacji. Potem wróć tutaj — nagrywanie ruszy samo.",
  },
  en: {
    updateText: "🆕 New PAU version on the App Store. Your trainings stay on your phone.",
    recNoLocationPerm: "🔴 The app has no location permission. Tap “Open settings” → Location → “While Using the App” and turn on “Precise Location”. Then come back — recording starts by itself.",
    recApproxOnly: "🟠 The app only has approximate location (±a few km) — a route can't be recorded that way. Tap “Open settings” → Location and turn on “Precise Location”. Then come back.",
    recLocationOff: "🔴 Location is turned off on your phone. Turn it on: Settings → Privacy & Security → Location Services. Then come back — recording starts by itself.",
    recLocationOffManual: "🔴 Location is turned off on your phone. Turn it on: Settings → Privacy & Security → Location Services. Then come back — recording starts by itself.",
  },
};
const iosDicts = {};

function isIOSApp() {
  return isNativeApp() && typeof window.Capacitor.getPlatform === "function" && window.Capacitor.getPlatform() === "ios";
}

function t() {
  const lang = getLang();
  if (!isIOSApp()) return TRANSLATIONS[lang];
  if (!iosDicts[lang]) iosDicts[lang] = Object.assign({}, TRANSLATIONS[lang], IOS_TEXTS[lang]);
  return iosDicts[lang];
}

function applyLanguage() {
  const dict = t();
  document.documentElement.lang = getLang();
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = dict[el.dataset.i18n];
  });
  document.getElementById("langBtn").textContent = dict.langBtnTarget;
  updateDisciplineUi();
  renderWatchSteps();
  document.getElementById("trainHintClose").setAttribute("aria-label", dict.hintCloseLabel);
  document.getElementById("headerThemeBtn").setAttribute("aria-label", dict.themeBtn);
  document.getElementById("recWeight").placeholder = dict.recWeightPh;
  document.getElementById("recPoiName").placeholder = dict.recPoiNamePh;
  if (isNativeApp()) document.querySelector('[data-i18n="recIntro"]').textContent = dict.recIntroNative;
  document.getElementById("samsungHintText").textContent = dict.samsungHintText;
  document.getElementById("samsungHintClose").setAttribute("aria-label", dict.hintCloseLabel);
  hideTrainHint();
  clearFieldState("dist");
  clearFieldState("time");
}

function toggleLanguage() {
  localStorage.setItem(LANG_KEY, getLang() === "pl" ? "en" : "pl");
  applyLanguage();
  applyLook();
  refreshTotalLabel();
  refreshHistoryList();
  refreshSavedRoutesList();
  refreshPlanStats();
  refreshPrivacyText();
  refreshHelpText();
  redrawElevations();
  recRender();
  renderChallenge(); // pasek z hasłami i reszta ekranu Wyzwania w nowym języku
  if (typeof renderChallengeMessages === "function") renderChallengeMessages();
  if (document.getElementById("tabActivity").classList.contains("active")) refreshActivityTab();
}

// --- Samonaprawa: strona i skrypt z różnych wersji ---
// Przy KAŻDYM wydaniu podbij APP_BUILD tutaj i PAU_PAGE_BUILD w index.html (razem z CACHE_NAME).
// Gdy się różnią, kasujemy tylko pamięć plików aplikacji (NIE dane - treningi są w localStorage)
// i przeładowujemy raz, żeby pobrać spójną wersję.
const APP_BUILD = "113";
window.PAU_APP_BUILD = APP_BUILD;
(function healMixedVersions() {
  if (window.PAU_PAGE_BUILD === APP_BUILD) return;
  let tried = false;
  try { tried = sessionStorage.getItem("pau_heal") === APP_BUILD; sessionStorage.setItem("pau_heal", APP_BUILD); } catch (e) { tried = true; }
  if (tried || !("caches" in window) || navigator.onLine === false) return; // offline: bez pamięci plików strona by się nie wczytała
  caches.keys()
    .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
    .then(() => window.location.reload());
})();

// --- Rejestracja Service Workera (offline) ---
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    if (isNativeApp()) return; // natywna aplikacja ma pliki w sobie - bez service workera
    navigator.serviceWorker.register("service-worker.js").catch((e) => console.warn("SW error", e));
  });
  // Nowa wersja przejęła stronę w trakcie wczytywania -> strona mogła dostać pliki z dwóch różnych wersji
  // (np. stary index.html i nowy app.js). Przeładowujemy raz, żeby wszystko było z jednej wersji.
  // Nie przy pierwszej wizycie (wtedy nie było poprzedniej wersji) i nie w trakcie nagrywania GPS.
  const hadController = Boolean(navigator.serviceWorker.controller);
  let reloadedForUpdate = false;
  let reloadPending = false;
  // Po wczytaniu strona działa na starym kodzie bez problemu - przeładowanie nie może przerwać
  // nagrywania ani wypełnianego formularza (np. powrót z wyboru pliku z zegarka).
  const busyForReload = () => {
    let recording = false;
    try { recording = Boolean(localStorage.getItem("pau_recording")); } catch (e) { /* brak dostępu */ }
    if (recording) return true;
    if (document.readyState !== "complete") return false; // w trakcie wczytywania - przeładowujemy od razu
    try { if (trainFormOpen) return true; } catch (e) { /* jeszcze nie zainicjowane */ }
    const el = document.activeElement;
    return Boolean(el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
  };
  const reloadForUpdate = () => {
    if (busyForReload()) { reloadPending = true; return; }
    reloadedForUpdate = true;
    window.location.reload();
  };
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!hadController || reloadedForUpdate) return;
    reloadForUpdate();
  });
  // Aplikacja długo otwarta w tle nie wczytuje się na nowo - przy powrocie pytamy serwer o nową wersję
  // (najwyżej co 15 minut). Nowy service worker przejmuje stronę -> controllerchange -> przeładowanie.
  let lastUpdateCheck = Date.now();
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible" || isNativeApp()) return;
    if (reloadPending) { reloadPending = false; reloadForUpdate(); return; }
    if (Date.now() - lastUpdateCheck < 15 * 60 * 1000 || navigator.onLine === false) return;
    lastUpdateCheck = Date.now();
    navigator.serviceWorker.getRegistration()
      .then((reg) => reg && reg.update())
      .catch(() => { /* offline / serwer niedostępny - spróbujemy następnym razem */ });
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
  const v2 = document.body.classList.contains("v2");
  if (meta) meta.setAttribute("content", theme === "dark" ? (v2 ? "#090C11" : "#0B1422") : (v2 ? "#F2F4F7" : "#F3F5F8"));
  // Apka natywna (od 0.1.23): strona rysuje się pod paskami systemowymi (viewport-fit=cover), więc tło paska
  // = tło apki; tu tylko kolor ikon (zegar, bateria): jasne w ciemnym motywie, ciemne w jasnym.
  try {
    const bars = (window.capacitorExports && window.capacitorExports.SystemBars) ||
      (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.SystemBars);
    if (bars && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()) {
      const p = bars.setStyle({ style: theme === "dark" ? "DARK" : "LIGHT" });
      if (p && p.catch) p.catch(() => {});
    }
  } catch (e) { /* starsza apka bez SystemBars */ }
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
  if (rec) recInitMap();
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
function formatKm(km) {
  return km.toLocaleString(getLang() === "pl" ? "pl-PL" : "en-GB", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

function refreshTotalLabel() {
  document.getElementById("totalKm").textContent = formatKm(getTotalDistance());
  const today = new Date();
  const monday = toYmd(addDays(today, -((today.getDay() + 6) % 7)));
  const week = getHistory().filter((item) => item.date >= monday);
  const weekKm = week.reduce((sum, item) => sum + (parseFloat(item.dist) || 0), 0);
  document.getElementById("weekKm").textContent = `${formatKm(weekKm)} km · ${week.length}×`;
  renderHero2();
}

// --- Nowy wygląd (test) - body.v2 ---
// Domyślnie wszyscy mają klasyczny wygląd; przycisk na dole strony przełącza (wybór zapamiętany w tej
// przeglądarce / apce). Link ?wyglad=nowy / ?wyglad=stary ustawia wygląd od razu.
const LOOK_KEY = "pau_look";            // "v2" = nowy wygląd
// Uproszczony przebieg trasy wyzwania na pasku (bez nazw punktów - dokładna trasa jeszcze nieznana).
const HERO2_ROUTE_D = "M4 40 L24 36 L44 39 L64 27 L84 32 L104 17 L119 24 L134 10 L154 27 L178 31 L202 36 L226 29 L250 38 L274 32 L298 39 L316 36";

function lsGet(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
function lsSet(key, value) { try { if (value === null) localStorage.removeItem(key); else localStorage.setItem(key, value); } catch (e) { /* tryb prywatny */ } }

function isLookV2() { return lsGet(LOOK_KEY) === "v2"; }

function applyLook() {
  const v2 = isLookV2();
  document.body.classList.toggle("v2", v2);
  const btn = document.getElementById("lookBtn");
  if (btn) {
    btn.hidden = false;
    btn.textContent = v2 ? t().lookClassic : t().lookNew;
  }
  applyTheme();
}

function initLook() {
  let param = null;
  try { param = new URLSearchParams(window.location.search).get("wyglad"); } catch (e) { /* stara przeglądarka */ }
  if (param === "nowy") lsSet(LOOK_KEY, "v2");
  else if (param === "stary") lsSet(LOOK_KEY, null);
  if (param && window.history && window.history.replaceState) {
    window.history.replaceState(null, "", window.location.pathname + window.location.hash);
  }
  applyLook();
  document.getElementById("lookBtn").addEventListener("click", () => {
    lsSet(LOOK_KEY, isLookV2() ? null : "v2");
    applyLook();
    renderHero2();
    window.scrollTo(0, 0);
  });
}

function weekBarsHtml(history, dict) {
  const today = new Date();
  const monday = addDays(today, -((today.getDay() + 6) % 7));
  const days = [0, 1, 2, 3, 4, 5, 6].map((i) => toYmd(addDays(monday, i)));
  const kmOn = (ymd) => history.filter((item) => item.date === ymd).reduce((sum, item) => sum + (parseFloat(item.dist) || 0), 0);
  const week = days.map(kmOn);
  const weekKm = week.reduce((a, b) => a + b, 0);
  const prevFrom = toYmd(addDays(monday, -7));
  const prevKm = history.filter((item) => item.date >= prevFrom && item.date < days[0])
    .reduce((sum, item) => sum + (parseFloat(item.dist) || 0), 0);
  const max = Math.max(0, ...week);
  const todayYmd = toYmd(today);
  const bars = week.map((km, i) => {
    const h = max > 0 ? Math.max(4, Math.round((km / max) * 100)) : 4;
    const cls = [km > 0 && km === max ? "hl" : "", days[i] === todayYmd ? "today" : ""].join(" ").trim();
    return `<div class="${days[i] === todayYmd ? "today" : ""}"><i class="${cls}" style="height:${h}%"></i>${dict.h2Days[i]}</div>`;
  }).join("");
  const vs = prevKm > 0
    ? `<span class="${weekKm >= prevKm ? "h2-up" : "h2-down"}">${dict.h2VsPrev(Math.round(((weekKm - prevKm) / prevKm) * 100))}</span>` : "";
  return { weekKm, html: `<div class="h2-lbl"><span>${dict.h2Week}</span>${vs}</div><div class="h2-bars">${bars}</div>` };
}

function renderHero2() {
  const hero = document.getElementById("hero2");
  if (!hero || !document.body.classList.contains("v2")) return;
  const dict = t();
  const history = getHistory();
  document.getElementById("h2Km").textContent = formatKm(getTotalDistance());
  const week = weekBarsHtml(history, dict);
  let st = null;
  if (getChallenge()) { try { st = challengeStats(); } catch (e) { st = null; } }

  document.getElementById("h2SideLbl").textContent = st ? dict.h2Day : dict.h2Week;
  document.getElementById("h2SideVal").textContent = st ? String(st.day) : `${formatKm(week.weekKm)} km`;
  const pct = document.getElementById("h2Pct");
  pct.hidden = !st;
  if (st) {
    document.getElementById("h2PctFill").style.width = `${(st.fraction * 100).toFixed(1)}%`;
    document.getElementById("h2PctVal").textContent = `${st.pct}%`;
  }
  const sk = streaks(history);
  document.getElementById("h2Streak").innerHTML = sk.current > 0 ? dict.h2Streak(sk.current, sk.best) : dict.h2StreakNone(sk.best);

  const box = document.getElementById("h2Box");
  if (st) {
    box.className = "h2-box h2-route";
    box.innerHTML = `<div class="h2-lbl"><span>${dict.h2RouteStart}</span><span>${dict.h2RouteFinish}</span></div>` +
      `<svg viewBox="0 0 320 50" aria-hidden="true"><path class="h2-r-base" d="${HERO2_ROUTE_D}"></path>` +
      `<path class="h2-r-prog" d="${HERO2_ROUTE_D}" pathLength="100" stroke-dasharray="${(st.fraction * 100).toFixed(2)} 100"></path>` +
      `<circle class="h2-r-start" cx="4" cy="40" r="4"></circle><circle class="h2-r-end" cx="316" cy="36" r="4"></circle>` +
      `<circle class="h2-r-dot" r="6" cx="4" cy="40"></circle></svg>` +
      `<div class="h2-lbl h2-chkm"><span>${dict.h2ChKm(formatKm(st.km), st.pct)}</span></div>`;
    const path = box.querySelector(".h2-r-prog");
    const dot = box.querySelector(".h2-r-dot");
    if (path && dot && typeof path.getTotalLength === "function" && typeof path.getPointAtLength === "function") {
      try {
        const pt = path.getPointAtLength(path.getTotalLength() * st.fraction);
        dot.setAttribute("cx", pt.x.toFixed(1));
        dot.setAttribute("cy", pt.y.toFixed(1));
      } catch (e) { /* zostaje na starcie */ }
    }
  } else {
    box.className = "h2-box h2-week";
    box.innerHTML = week.html;
  }

  document.getElementById("h2Split").innerHTML = CHALLENGE_DISCIPLINES.map((disc) => {
    const km = st ? st.byDisc[disc] : summarize(history.filter((item) => item.disc === disc)).km;
    return `<div class="h2-d h2-d-${disc}"><b>${Math.round(km).toLocaleString(getLang() === "pl" ? "pl-PL" : "en-GB")}</b><span>${escapeXml(dict.discNames[disc])}</span></div>`;
  }).join("");

  const lastEl = document.getElementById("h2Last");
  let last = null;
  history.forEach((item) => { if (!last || (item.date || "") >= (last.date || "")) last = item; });
  lastEl.hidden = !last;
  if (last) {
    const today = new Date();
    const when = last.date === toYmd(today) ? dict.h2Today
      : last.date === toYmd(addDays(today, -1)) ? dict.h2Yesterday
      : (last.date || "").split("-").reverse().slice(0, 2).join(".");
    const parts = [when];
    const min = parseFloat(last.time) || 0;
    if (min > 0) parts.push(formatDuration(min));
    const pace = entryPaceText(last);
    if (pace) parts.push(pace);
    lastEl.innerHTML = `<span class="h2-ic disc-${escapeXml(last.disc)}">${discIcon(last.disc)}</span>` +
      `<div class="h2-lt"><small class="h2-lt-lbl">${dict.h2LastLbl}</small>` +
      `<b>${formatKm(parseFloat(last.dist) || 0)} km · ${escapeXml(dict.discNames[last.disc] || last.disc)}</b>` +
      `<small>${escapeXml(parts.join(" · "))}</small></div>`;
  }
}

// Wyloguj = zablokuj apkę (powrót do PIN-u). Dane zostają na telefonie.
function logout() {
  if (rec) { alert(t().logoutRecording); return; }
  if (!confirm(t().confirmLogout)) return;
  try { sessionStorage.removeItem("pau_authed"); } catch (e) { /* brak sessionStorage */ }
  const pin = document.getElementById("pinInput");
  if (pin) pin.value = "";
  showLogin();
  window.scrollTo(0, 0);
}

// --- Podsumowanie, passa i rekordy (liczone na bieżąco z historii) ---
const DISCIPLINES = ["Bieg", "Rower", "Kajak", "Basen", "WodyOtwarte", "Trekking", "Auto4x4"];
// Do wyzwania 4000 km liczą się tylko te dyscypliny (pływanie i trekking - tylko do Historii/statystyk).
const CHALLENGE_DISCIPLINES = ["Bieg", "Rower", "Kajak"];
const SWIM_DISCIPLINES = ["Basen", "WodyOtwarte"];
// Auto 4x4 (przejazdy terenowe) - tylko Historia; Supabase (activities) go nie przyjmuje, więc bez udostępniania.
const NO_SHARE_DISCIPLINES = ["Auto4x4"];
function isShareableDisc(disc) {
  return !NO_SHARE_DISCIPLINES.includes(disc);
}
// Kroki mają sens tylko w dyscyplinach pieszych.
const STEP_DISCIPLINES = ["Bieg", "Trekking"];
const MAX_STEPS = 300000;

// --- Wiarygodność danych treningu ---
// Granice celowo z zapasem (rekordy świata + margines), żeby nie blokować prawdziwych treningów.
// Te same limity sprawdza serwer w share_activity (supabase/wiarygodnosc-danych.sql) - zmieniać razem.
const PLAUSIBLE_LIMITS = {
  Bieg:        { maxKmh: 25, maxKm: 400 },
  Trekking:    { maxKmh: 15, maxKm: 200 },
  Rower:       { maxKmh: 70, maxKm: 1200 },
  Kajak:       { maxKmh: 25, maxKm: 300 },
  Basen:       { maxKmh: 8,  maxKm: 30 },
  WodyOtwarte: { maxKmh: 8,  maxKm: 100 },
  Auto4x4:     { maxKmh: 150, maxKm: 1500 }, // tylko lokalnie (nie idzie do share_activity)
};
const MAX_TIME_MIN = 7 * 24 * 60;

// Zwraca listę problemów (teksty do pokazania); pusta = dane realne.
function implausibleReasons(entry) {
  const dict = t();
  const out = [];
  const lim = PLAUSIBLE_LIMITS[entry.disc];
  const disc = dict.discNames[entry.disc] || entry.disc;
  const km = parseFloat(entry.dist) || 0;
  const min = parseFloat(entry.time) || 0;
  const hr = parseFloat(entry.hr) || 0;
  const steps = STEP_DISCIPLINES.includes(entry.disc) ? Math.round(Number(entry.steps) || 0) : 0;
  const fmt = (n) => String(Math.round(n * 10) / 10).replace(".", getLang() === "pl" ? "," : ".");
  if (lim && km > lim.maxKm) out.push(dict.implDist(disc, fmt(km), lim.maxKm));
  if (lim && km > 0 && min > 0 && km / (min / 60) > lim.maxKmh) out.push(dict.implSpeed(disc, fmt(km / (min / 60)), lim.maxKmh));
  if (min > MAX_TIME_MIN) out.push(dict.implTime);
  if (steps > 0 && km > 0) {
    const stride = (km * 1000) / steps;
    if (stride > 2.5 || stride < 0.3) out.push(dict.implStride(steps, fmt(km), fmt(stride)));
  }
  if (steps > 0 && min > 0 && steps / min > 300) out.push(dict.implCadence(Math.round(steps / min)));
  if (hr > 0 && (hr < 25 || hr > 250)) out.push(dict.implHr(Math.round(hr)));
  const weight = parseFloat(String(entry.weight || "").replace(",", ".")) || 0;
  if (weight > 0 && (weight < 20 || weight > 300)) out.push(dict.implWeight(fmt(weight)));
  const vo2 = parseFloat(String(entry.vo2max || "").replace(",", ".")) || 0;
  if (vo2 > 0 && (vo2 < 10 || vo2 > 100)) out.push(dict.implVo2(fmt(vo2)));
  if ([entry.dist, entry.time, entry.hr, entry.steps, entry.weight, entry.vo2max].some((v) => parseFloat(String(v || "").replace(",", ".")) < 0)) out.push(dict.implNegative);
  if (entry.date) {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    if (entry.date > tomorrow) out.push(dict.implFuture);
  }
  return out;
}

// Pokazuje komunikat i zwraca false, gdy dane są nierealne. fieldId - pole, pod którym ma się pojawić błąd.
function confirmPlausible(entry, fieldId) {
  const reasons = implausibleReasons(entry);
  if (!reasons.length) return true;
  if (fieldId) { setFieldError(fieldId, t().implausibleField); focusField(fieldId); }
  alert(t().implausibleAlert(reasons, ADMIN_CONTACT));
  return false;
}

// Liczba kroków z pola / wpisu; 0 = brak.
function parseSteps(value) {
  const n = Math.round(Number(value));
  return Number.isFinite(n) && n > 0 && n <= MAX_STEPS ? n : 0;
}

function formatSteps(n) {
  return n.toLocaleString(getLang() === "pl" ? "pl-PL" : "en-GB");
}

// Zegarki zapisują kroki albo „cykle” (1 cykl = 2 kroki). Wybieramy wariant z sensowną kadencją.
function normalizeSteps(count, minutes, cyclesFirst) {
  if (!(count > 0)) return 0;
  const options = cyclesFirst ? [count * 2, count] : [count, count * 2];
  if (minutes > 0) {
    const fit = options.find((v) => v / minutes >= 40 && v / minutes <= 230);
    return fit ? parseSteps(fit) : 0;
  }
  return parseSteps(options[0]);
}

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
  document.getElementById("stepsRow").hidden = !STEP_DISCIPLINES.includes(disc);
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
// url (opcjonalny) = strona partnera; logo bez url nie jest klikalne.
const CHALLENGE_PARTNERS = [
  { name: "Cedrus", url: "https://cedrus.com.pl/", logo: "partners/cedrus.png", ratio: 360 / 56 },
  { name: "TVP3 Lublin", url: "https://lublin.tvp.pl/", logo: "partners/tvplublin.png", ratio: 199 / 49 },
  { name: "Agnieszka Danieluk", url: "https://agnieszkadanieluk.pl/", logo: "partners/agnieszkadanieluk.png", ratio: 196 / 200 },
  { name: "4evolve", url: "https://4evolve.com/pl/", logo: "partners/4evolve.png", ratio: 226 / 84 },
  { name: "Gospodarstwo rolne Szymon Gorzałczany", url: "https://gospodarstwo-gorzalczany.pl/", logo: "partners/szymong.png", ratio: 360 / 96 },
  { name: "Stokrotka", url: "https://stokrotka.pl/", logo: "partners/stokrotka.png", ratio: 254 / 200 },
  { name: "MOSiR Lublin", url: "https://mosir.lublin.pl/", logo: "partners/mosir.png", ratio: 360 / 157 },
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
  const challenge = { start: toYmd(new Date()) };
  if (isCommunityConfigured() && confirm(t().chShareAsk) && askChallengeNick()) challenge.share = true;
  saveChallenge(challenge);
  renderChallenge();
}

async function leaveChallenge() {
  if (!confirm(t().confirmLeaveChallenge)) return;
  const challenge = getChallenge();
  if (challenge && challenge.share && !(await removeChallengeProgress())) return;
  saveChallenge(null);
  renderChallenge();
  loadChallengeBoard();
}

// --- Postęp uczestników widoczny dla innych (za zgodą uczestnika; listę udostępnia organizator) ---
function askChallengeNick() {
  const dict = t();
  const nick = prompt(dict.promptNick, localStorage.getItem(NICK_KEY) || "");
  if (nick === null) return false;
  const trimmed = nick.trim();
  if (trimmed.length < 1 || trimmed.length > 30) {
    alert(dict.nickInvalid);
    return false;
  }
  localStorage.setItem(NICK_KEY, trimmed);
  return true;
}

function getChallengeProgressToken() {
  let token = localStorage.getItem(CHALLENGE_PROGRESS_TOKEN_KEY);
  if (!token) {
    token = randomToken();
    localStorage.setItem(CHALLENGE_PROGRESS_TOKEN_KEY, token);
  }
  return token;
}

function challengeProgressPayload() {
  const st = challengeStats();
  const km = (d) => Math.round((st.byDisc[d] || 0) * 10) / 10;
  return {
    p_nick: localStorage.getItem(NICK_KEY) || "",
    p_start: getChallenge().start,
    p_km_bieg: km("Bieg"),
    p_km_rower: km("Rower"),
    p_km_kajak: km("Kajak"),
  };
}

// Wysyła postęp, gdy się zmienił. Bez internetu - spróbujemy przy następnym odświeżeniu.
let challengeSyncTimer = null;
function scheduleChallengeSync() {
  clearTimeout(challengeSyncTimer);
  challengeSyncTimer = setTimeout(syncChallengeProgress, 1500);
}

async function syncChallengeProgress() {
  const challenge = getChallenge();
  if (!challenge || !challenge.share || !isCommunityConfigured()) return;
  const payload = challengeProgressPayload();
  if (!payload.p_nick) return;
  const key = JSON.stringify(payload);
  if (localStorage.getItem(CHALLENGE_SYNCED_KEY) === key) return;
  try {
    // Serwer przyjmuje postęp tylko od zaproszonych (przypisany kod) albo superadmina - inaczej zwraca false.
    const inviteToken = localStorage.getItem(CHALLENGE_INVITE_KEY) ? localStorage.getItem(CHALLENGE_INVITE_TOKEN_KEY) : null;
    await rpc("save_challenge_progress_v2", {
      p_token: getChallengeProgressToken(), ...payload,
      p_invite_token: inviteToken, p_admin_key: getAdminKey() || null,
    });
    localStorage.setItem(CHALLENGE_SYNCED_KEY, key);
  } catch (e) {
    /* offline - ponowimy */
  }
}

async function removeChallengeProgress() {
  const token = localStorage.getItem(CHALLENGE_PROGRESS_TOKEN_KEY);
  if (token && isCommunityConfigured()) {
    try {
      await rpc("delete_challenge_progress", { p_token: token });
    } catch (e) {
      alert(t().chShareRemoveFailed);
      return false;
    }
  }
  localStorage.removeItem(CHALLENGE_SYNCED_KEY);
  return true;
}

async function toggleChallengeShare(e) {
  const challenge = getChallenge();
  if (!challenge) return;
  if (e.target.checked) {
    if (!askChallengeNick()) {
      e.target.checked = false;
      return;
    }
    localStorage.removeItem(CHALLENGE_SYNCED_KEY); // nick mógł się zmienić - wyślij na pewno
    saveChallenge({ ...challenge, share: true });
    renderChallengeShare();
    await syncChallengeProgress();
  } else {
    if (!(await removeChallengeProgress())) {
      e.target.checked = true;
      return;
    }
    const { share, ...rest } = challenge;
    saveChallenge(rest);
    renderChallengeShare();
  }
  loadChallengeBoard();
}

function renderChallengeShare() {
  const challenge = getChallenge();
  const row = document.getElementById("challengeShareRow");
  const hint = document.getElementById("challengeShareHint");
  const on = Boolean(challenge && challenge.share);
  row.style.display = challenge && isCommunityConfigured() ? "flex" : "none";
  document.getElementById("challengeShare").checked = on;
  hint.textContent = !challenge || !isCommunityConfigured() ? ""
    : on ? t().chShareOn(localStorage.getItem(NICK_KEY) || "") : t().chShareOff;
}

// Lista uczestników z serwera: { visible, admin, superadmin, participants: [...] }.
let challengeBoard = null;
async function loadChallengeBoard() {
  if (!isCommunityConfigured()) return;
  try {
    challengeBoard = await rpc("list_challenge_progress", { p_admin_key: getAdminKey() || null });
  } catch (e) {
    return; // bez internetu zostaje poprzedni stan
  }
  renderChallengeBoard();
  renderChallenge();
}

function renderChallengeBoard() {
  const el = document.getElementById("challengeBoard");
  if (!el) return;
  const b = challengeBoard;
  if (!b || !(b.visible || b.admin)) {
    el.hidden = true;
    el.innerHTML = "";
    return;
  }
  const dict = t();
  const list = Array.isArray(b.participants) ? b.participants : [];
  const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
  const rows = list.map((p, i) => {
    const km = num(p.km_bieg) + num(p.km_rower) + num(p.km_kajak);
    const pct = Math.min(100, Math.floor((km / CHALLENGE_KM) * 100));
    const discs = CHALLENGE_DISCIPLINES.map((d) => `${discIcon(d)}${Math.round(num(p["km_" + d.toLowerCase()]))}`).join(" ");
    return `<li class="ch-board-row"><span class="ch-board-rank">${i + 1}</span>` +
      `<span class="ch-board-main"><b>${escapeXml(String(p.nick || ""))}</b><span class="ch-board-discs">${discs}</span></span>` +
      `<span class="ch-board-km"><b>${Math.round(km).toLocaleString(dict.dateLocale)}</b> km<span>${pct}%</span></span></li>`;
  }).join("");
  el.hidden = false;
  el.innerHTML = `<div class="ch-box"><div class="ch-row"><span class="ch-label">${dict.chBoardTitle(list.length)}</span></div>` +
    (!b.visible ? `<p class="ch-lock">${dict.chBoardPreview}</p>` : "") +
    (rows ? `<ol class="ch-board">${rows}</ol>` : `<span class="ch-note">${dict.chBoardEmpty}</span>`) +
    (b.superadmin ? `<button class="ch-invite" id="challengeBoardToggle">${b.visible ? dict.chBoardHide : dict.chBoardShow}</button>` : "") +
    `</div>`;
  const toggle = document.getElementById("challengeBoardToggle");
  if (toggle) toggle.addEventListener("click", toggleChallengeBoardVisible);
}

async function toggleChallengeBoardVisible() {
  const dict = t();
  const show = !(challengeBoard && challengeBoard.visible);
  if (!confirm(show ? dict.chBoardConfirmShow : dict.chBoardConfirmHide)) return;
  try {
    await rpc("admin_set_challenge_visible", { p_admin_key: getAdminKey(), p_visible: show });
  } catch (e) {
    alert(String(e && e.message).includes("not allowed") ? dict.chBoardNotAllowed : dict.communityError);
    return;
  }
  loadChallengeBoard();
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
  // Trwające nagranie oznaczone 🏁 liczy się na żywo (po ZAKOŃCZ zastąpi je zapisany trening).
  if (rec && rec.challenge && isChallengeDisc(rec.disc) && rec.distKm > 0) {
    items.push({ disc: rec.disc, dist: String(rec.distKm), time: "0", date: rec.challengeDate || toYmd(new Date()), challenge: true, live: true });
  }
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
      const img = `<img class="ch-partner" src="${p.logo}" alt="${escapeXml(p.name)}" width="${Math.round(w)}" height="${Math.round(h)}" loading="lazy">`;
      return p.url ? `<a class="ch-partner-link" href="${p.url}" target="_blank" rel="noopener" title="${escapeXml(p.name)}">${img}</a>` : img;
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
    (challengeBoard && challengeBoard.visible ? "" :
      `<p class="ch-lock"><svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="5" y="11" width="14" height="10" rx="2"></rect><path d="M8 11V7a4 4 0 0 1 8 0v4"></path></svg>${dict.chParticipantsOnly}</p>`) +
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
  updateRecChallengeRow();
  el.innerHTML = challenge ? challengeParticipantHtml() : challengeObserverHtml();
  bindChallengeTicker(el);
  renderChallengeShare();
  if (challenge) {
    document.getElementById("challengeStart").value = challenge.start;
    if (challenge.share) scheduleChallengeSync();
  } else {
    document.getElementById("challengeJoinBtn").addEventListener("click", joinChallenge);
    const inviteBtn = document.getElementById("challengeInviteBtn");
    if (inviteBtn) inviteBtn.addEventListener("click", enterChallengeInvite);
    if (document.getElementById("tabChallenge").classList.contains("active")) startChallengeDemo(el);
  }
}

// --- Komunikaty organizatora dla uczestników wyzwania (Supabase: challenge_messages) ---
// Pisze tylko superadmin; czytają uczestnicy z kodem zaproszenia i organizatorzy.
// Sprawdzamy przy starcie, po powrocie do aplikacji, co 5 min gdy apka jest otwarta
// i przy odczytach GPS podczas nagrywania (wtedy działa też przy zgaszonym ekranie).
const CH_MSG_CACHE_KEY = "pau_ch_msgs";
const CH_MSG_SEEN_KEY = "pau_ch_msgs_seen";         // created_at najnowszego przeczytanego
const CH_MSG_NOTIFIED_KEY = "pau_ch_msgs_notified"; // created_at najnowszego, o którym już powiadomiliśmy
const CH_MSG_POLL_MS = 5 * 60 * 1000;
const CH_MSG_NOTIF_ID = 7302;
let chMsgState = null;
let chMsgLastFetch = 0;
let chMsgFetching = false;
let chMsgLabelSeen = null; // stan „przeczytane” z chwili wejścia w zakładkę - etykiety „nowy” zostają do następnego wejścia

function chMsgLoadCache() {
  try { chMsgState = JSON.parse(localStorage.getItem(CH_MSG_CACHE_KEY)) || null; } catch (e) { chMsgState = null; }
}

function chMsgEligible() {
  return isCommunityConfigured() && Boolean(getChallenge() || getAdminKey() ||
    localStorage.getItem(CHALLENGE_INVITE_KEY) || toYmd(new Date()) >= CHALLENGE_SIGNUP_FROM);
}

function chMsgList() {
  const now = Date.now();
  const list = chMsgState && Array.isArray(chMsgState.messages) ? chMsgState.messages : [];
  return list.filter((m) => !m.expires_at || Date.parse(m.expires_at) > now);
}

function chMsgUnreadCount() {
  const seen = localStorage.getItem(CH_MSG_SEEN_KEY) || "";
  return chMsgList().filter((m) => m.created_at > seen).length;
}

async function fetchChallengeMessages() {
  if (chMsgFetching || !chMsgEligible()) return;
  chMsgFetching = true;
  chMsgLastFetch = Date.now();
  try {
    const inviteToken = localStorage.getItem(CHALLENGE_INVITE_KEY) ? localStorage.getItem(CHALLENGE_INVITE_TOKEN_KEY) : null;
    const res = await rpc("list_challenge_messages", { p_invite_token: inviteToken, p_admin_key: getAdminKey() || null });
    if (!res || typeof res !== "object") return;
    chMsgState = { allowed: Boolean(res.allowed), superadmin: Boolean(res.superadmin), messages: Array.isArray(res.messages) ? res.messages : [] };
    try { localStorage.setItem(CH_MSG_CACHE_KEY, JSON.stringify(chMsgState)); } catch (e) { /* brak miejsca */ }
    chMsgCheckNew();
  } catch (e) {
    /* bez internetu - zostaje poprzedni stan */
  } finally {
    chMsgFetching = false;
  }
  renderChallengeMessages();
}

// Nowe komunikaty od ostatniego sprawdzenia: wibracja, powiadomienie (zgaszony ekran), ważne - głosem.
// Przy pierwszym pobraniu nie powiadamiamy o starych komunikatach (zobaczysz je z kropką w zakładce).
function chMsgCheckNew() {
  const list = chMsgList();
  if (!list.length) return;
  const newest = list.reduce((a, m) => (m.created_at > a ? m.created_at : a), "");
  const notified = localStorage.getItem(CH_MSG_NOTIFIED_KEY);
  localStorage.setItem(CH_MSG_NOTIFIED_KEY, newest > (notified || "") ? newest : notified);
  if (!notified) return;
  const fresh = list.filter((m) => m.created_at > notified).sort((a, b) => (a.created_at < b.created_at ? -1 : 1));
  if (!fresh.length) return;
  const dict = t();
  const important = fresh.filter((m) => m.important);
  navVibrate(important.length ? [300, 150, 300, 150, 300] : [200, 100, 200]);
  if (isNativeApp() && document.visibilityState === "hidden") {
    try {
      navEnsureChannel().then(() => capPlugin("LocalNotifications").schedule({
        notifications: fresh.slice(-3).map((m, i) => ({
          id: CH_MSG_NOTIF_ID + i,
          title: m.important ? dict.chMsgNotifTitleImportant : dict.chMsgNotifTitle,
          body: String(m.body).slice(0, 300),
          channelId: NAV_CHANNEL_ID,
        })),
      })).catch(() => {});
    } catch (e) { /* brak wtyczki */ }
  }
  // Każdy nowy komunikat głosem (najwyżej 2 ostatnie w kolejce; wyłącznik 🔊/🔇 z nawigacji obowiązuje).
  navSpeakQueue(fresh.slice(-2).map((m) => (m.important ? dict.chMsgSay : dict.chMsgSayNormal)(String(m.body).slice(0, 400))));
  if (rec) recSetStatus(dict.chMsgStatus(String(fresh[fresh.length - 1].body).slice(0, 120)), false, 30000);
  else if (document.visibilityState === "visible" && important.length) {
    alert(`${dict.chMsgNotifTitleImportant}\n\n${important[important.length - 1].body}`);
  }
}

function chMsgFormatDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(t().dateLocale, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

function renderChallengeMessages() {
  const card = document.getElementById("chMsgCard");
  if (!card) return;
  const dict = t();
  const allowed = chMsgEligible() && chMsgState && chMsgState.allowed;
  card.hidden = !allowed;
  chMsgRenderBadge();
  if (!allowed) return;
  const superadmin = Boolean(chMsgState.superadmin);
  document.getElementById("chMsgAdmin").hidden = !superadmin;
  const seen = chMsgLabelSeen != null ? chMsgLabelSeen : localStorage.getItem(CH_MSG_SEEN_KEY) || "";
  const list = chMsgList();
  const box = document.getElementById("chMsgList");
  box.innerHTML = list.length ? list.map((m) =>
    `<div class="ch-msg${m.important ? " ch-msg-important" : ""}${m.created_at > seen ? " ch-msg-new" : ""}">` +
    `<div class="ch-msg-head"><span>${m.important ? "⚠️ " : "📢 "}${escapeXml(chMsgFormatDate(m.created_at))}` +
    (m.created_at > seen ? ` <b class="ch-msg-badge">${dict.chMsgNew}</b>` : "") + `</span>` +
    (superadmin ? `<button class="ch-msg-del" data-id="${escapeXml(m.id)}" title="${dict.deleteTitle}">🗑</button>` : "") + `</div>` +
    `<p>${escapeXml(m.body).replace(/\n/g, "<br>")}</p>` +
    (m.expires_at ? `<small>${dict.chMsgUntil(escapeXml(chMsgFormatDate(m.expires_at)))}</small>` : "") +
    `</div>`).join("") : `<p class="hint-text">${dict.chMsgEmpty}</p>`;
  box.querySelectorAll(".ch-msg-del").forEach((btn) => btn.addEventListener("click", () => chMsgDelete(btn.dataset.id)));
}

function chMsgRenderBadge() {
  const btn = document.getElementById("tabChallengeBtn");
  if (btn) btn.classList.toggle("has-dot", chMsgEligible() && Boolean(chMsgState && chMsgState.allowed) && chMsgUnreadCount() > 0);
}

// Zakładka Wyzwanie otwarta = komunikaty przeczytane (kropka „nowy” zostaje do następnego wejścia).
function chMsgMarkSeen() {
  const list = chMsgList();
  if (!list.length) return;
  const newest = list.reduce((a, m) => (m.created_at > a ? m.created_at : a), "");
  if (newest > (localStorage.getItem(CH_MSG_SEEN_KEY) || "")) localStorage.setItem(CH_MSG_SEEN_KEY, newest);
  chMsgRenderBadge();
}

async function chMsgSend() {
  const dict = t();
  const bodyEl = document.getElementById("chMsgBody");
  const body = bodyEl.value.trim();
  if (!body) { alert(dict.chMsgEmptyBody); return; }
  const days = parseInt(document.getElementById("chMsgExpiry").value, 10) || 0;
  const important = document.getElementById("chMsgImportant").checked;
  if (!confirm(dict.chMsgConfirmSend(important))) return;
  try {
    await rpc("admin_post_challenge_message", {
      p_admin_key: getAdminKey() || null,
      p_body: body,
      p_important: important,
      p_expires_at: days ? new Date(Date.now() + days * 86400000).toISOString() : null,
    });
  } catch (e) {
    alert(dict.chMsgSendError);
    return;
  }
  bodyEl.value = "";
  document.getElementById("chMsgImportant").checked = false;
  await fetchChallengeMessages();
  chMsgMarkSeen();
  renderChallengeMessages();
  alert(dict.chMsgSent);
}

async function chMsgDelete(id) {
  if (!confirm(t().chMsgConfirmDelete)) return;
  try {
    await rpc("admin_delete_challenge_message", { p_admin_key: getAdminKey() || null, p_id: id });
  } catch (e) {
    alert(t().chMsgSendError);
    return;
  }
  await fetchChallengeMessages();
}

function chMsgMaybePoll() {
  if (Date.now() - chMsgLastFetch >= CH_MSG_POLL_MS) fetchChallengeMessages();
}

function initChallengeMessages() {
  chMsgLoadCache();
  renderChallengeMessages();
  document.getElementById("chMsgSendBtn").addEventListener("click", chMsgSend);
  document.getElementById("tabChallengeBtn").addEventListener("click", async () => {
    chMsgLabelSeen = localStorage.getItem(CH_MSG_SEEN_KEY) || "";
    renderChallengeMessages(); // najpierw pokaż z etykietą „nowy”, potem oznacz jako przeczytane
    chMsgMarkSeen();
    await fetchChallengeMessages();
    if (document.getElementById("tabChallenge").classList.contains("active")) chMsgMarkSeen();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && Date.now() - chMsgLastFetch > 60000) fetchChallengeMessages();
  });
  setInterval(() => { if (document.visibilityState === "visible" || rec) chMsgMaybePoll(); }, 60000);
  fetchChallengeMessages();
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
        ? `<button class="route-btn" data-index="${index}" title="${dict.showRouteTitle}">🗺</button>` +
          `<button class="to-routes-btn${item.routeSaved ? " on" : ""}" data-index="${index}" title="${dict.toRoutesTitle}">🧭</button>`
        : "";
      const flagBtn = getChallenge() && (isChallengeDisc(item.disc) || item.challenge)
        ? `<button class="flag-btn${item.challenge ? " on" : ""}" data-index="${index}" title="${item.challenge ? dict.flagOnTitle : dict.flagOffTitle}" aria-pressed="${item.challenge ? "true" : "false"}">🏁</button>`
        : "";
      const shareBtn = isCommunityConfigured() && (isShareableDisc(item.disc) || item.sharedId)
        ? `<button class="share-btn" data-index="${index}" title="${item.sharedId ? dict.unshareTitle : dict.shareTitle}">${item.sharedId ? "🌍" : "📤"}</button>`
        : "";
      const meta = [item.date];
      const min = parseFloat(item.time) || 0;
      if (min > 0) meta.push(formatDuration(min));
      const pace = entryPaceText(item);
      if (pace) meta.push(pace);
      if (parseFloat(item.hr) > 0) meta.push(`♥ ${item.hr}`);
      const steps = parseSteps(item.steps);
      if (steps) meta.push(`👣 ${formatSteps(steps)}`);
      const extra = [];
      if (parseFloat(item.weight) > 0) extra.push(`${l.weight}: ${item.weight} kg`);
      if (parseFloat(item.vo2max) > 0) extra.push(`${l.vo2max}: ${item.vo2max}`);
      if (item.notes) extra.push(escapeXml(item.notes));
      return `<div class="history-item">` +
             `<span class="disc-ico disc-${escapeXml(item.disc)}">${discIcon(item.disc)}</span>` +
             `<div class="history-main"><div class="history-title">${escapeXml(discName)} · ${escapeXml(item.dist)} km</div>` +
             `<div class="history-meta">${meta.join(" · ")}</div>` +
             (extra.length ? `<div class="history-meta">${extra.join(" · ")}</div>` : "") + `</div>` +
             `<div class="history-actions">${flagBtn}${shareBtn}${routeBtn}` +
             `<button class="edit-btn" data-index="${index}" title="${dict.editEntryTitle}">✏️</button>` +
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
  list.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => openEditTraining(parseInt(btn.dataset.index, 10)));
  });
  list.querySelectorAll(".share-btn").forEach((btn) => {
    btn.addEventListener("click", () => toggleShareTraining(parseInt(btn.dataset.index, 10)));
  });
  list.querySelectorAll(".flag-btn").forEach((btn) => {
    btn.addEventListener("click", () => toggleChallengeFlag(parseInt(btn.dataset.index, 10)));
  });
  list.querySelectorAll(".to-routes-btn").forEach((btn) => {
    btn.addEventListener("click", () => historyRouteToRoutes(parseInt(btn.dataset.index, 10)));
  });
}

// Ikony dyscyplin w Historii (SVG, kolor z CSS).
const DISC_ICON_PATHS = {
  Bieg: '<circle cx="14" cy="4.5" r="2"></circle><path d="M7 21l3-6 3 2v5M10 15l1.5-6L8 10l-2 3M11.5 9l3 2.5 3.5.5"></path>',
  Rower: '<circle cx="5.5" cy="17" r="3.5"></circle><circle cx="18.5" cy="17" r="3.5"></circle><path d="M5.5 17l4-8h6l3 8M9.5 9L8 6H6M15.5 9l-3 8"></path>',
  Kajak: '<path d="M3 15c3 2 6 2 9 0s6-2 9 0M5 19c2.5 1.5 4.5 1.5 7 0s4.5-1.5 7 0M7 13L17 3M15 3h3v3"></path>',
  Basen: '<path d="M2 12c2.5 2 5 2 7.5 0s5-2 7.5 0 3.5 1.5 5 1M2 17c2.5 2 5 2 7.5 0s5-2 7.5 0 3.5 1.5 5 1"></path><circle cx="16" cy="6" r="2"></circle><path d="M6 9l4-3 3 3"></path>',
  Trekking: '<path d="M3 20l6-10 4 6 3-4 5 8z"></path><path d="M12 5l2 2"></path>',
};
DISC_ICON_PATHS.WodyOtwarte = DISC_ICON_PATHS.Basen;
DISC_ICON_PATHS.Auto4x4 = '<path d="M3 15v-3l2-5h11l3 5h2v3z"></path><path d="M6 7v5M11 7v5"></path><circle cx="7" cy="17" r="2.5"></circle><circle cx="17" cy="17" r="2.5"></circle>';
DISC_ICON_PATHS.Multi = '<circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 3"></path>';

function discIcon(disc) {
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${DISC_ICON_PATHS[disc] || DISC_ICON_PATHS.Multi}</svg>`;
}

// Tempo (bieg/trekking pieszo /km, pływanie /100 m) albo prędkość (rower, kajak).
function entryPaceText(item) {
  const km = parseFloat(item.dist) || 0;
  const min = parseFloat(item.time) || 0;
  if (km <= 0 || min <= 0) return "";
  if (SWIM_DISCIPLINES.includes(item.disc)) return formatSwimPace(min / (km * 10));
  if (item.disc === "Bieg") return formatPace(min / km);
  return `${(km / (min / 60)).toFixed(1)} km/h`;
}

function toggleChallengeFlag(index) {
  const history = getHistory();
  const entry = history[index];
  if (!entry) return;
  if (entry.challenge) delete entry.challenge;
  else if (isChallengeDisc(entry.disc)) {
    // Stary wpis sprzed sprawdzania - nierealne km nie mogą trafić do postępu wyzwania.
    if (!confirmPlausible(entry, null)) return;
    entry.challenge = true;
  } else return;
  saveHistory(history);
  refreshHistoryList();
}

// --- Poprawianie zapisanego treningu (✏️ w Historii) ---
// Zmienia tylko wpisane pola - trasa (z wysokością), flaga wyzwania i powiązanie z wydarzeniem zostają.
let editIndex = null;

function editNum(value) {
  const n = parseFloat(value);
  return n > 0 ? String(value) : "";
}

function updateEditStepsRow() {
  document.getElementById("editStepsRow").hidden = !STEP_DISCIPLINES.includes(document.getElementById("editDisc").value);
}

function openEditTraining(index) {
  const entry = getHistory()[index];
  if (!entry) return;
  editIndex = index;
  document.getElementById("editDisc").value = entry.disc;
  document.getElementById("editDate").value = entry.date || "";
  document.getElementById("editDist").value = entry.dist || "";
  document.getElementById("editTime").value = editNum(entry.time);
  document.getElementById("editHr").value = editNum(entry.hr);
  document.getElementById("editSteps").value = parseSteps(entry.steps) || "";
  document.getElementById("editVo2max").value = editNum(entry.vo2max);
  document.getElementById("editWeight").value = editNum(entry.weight);
  document.getElementById("editNotes").value = entry.notes || "";
  clearFieldState("editDist");
  updateEditStepsRow();
  const routeBtn = document.getElementById("editRouteDistBtn");
  const routeKm = entry.route && entry.route.length >= 2 ? Math.round(trackDistanceKm(entry.route) * 100) / 100 : 0;
  routeBtn.hidden = !(routeKm > 0);
  routeBtn.dataset.km = routeKm > 0 ? String(routeKm) : "";
  routeBtn.textContent = routeKm > 0 ? t().editRouteDist(formatKm(routeKm)) : "";
  document.getElementById("editSharedHint").hidden = !entry.sharedId;
  const card = document.getElementById("editCard");
  card.hidden = false;
  if (card.scrollIntoView) card.scrollIntoView({ block: "start", behavior: "smooth" });
}

function closeEditTraining() {
  editIndex = null;
  const card = document.getElementById("editCard");
  if (card) card.hidden = true;
}

async function saveEditTraining() {
  const history = getHistory();
  const entry = editIndex != null ? history[editIndex] : null;
  if (!entry) { closeEditTraining(); return; }
  const dist = document.getElementById("editDist").value;
  if (!dist || parseFloat(dist) <= 0) {
    setFieldError("editDist", t().alertDistRequired);
    focusField("editDist");
    return;
  }
  clearFieldState("editDist");
  const draft = {
    disc: document.getElementById("editDisc").value,
    date: document.getElementById("editDate").value || entry.date,
    dist: dist,
    time: document.getElementById("editTime").value,
    hr: document.getElementById("editHr").value,
    steps: parseSteps(document.getElementById("editSteps").value),
    vo2max: document.getElementById("editVo2max").value,
    weight: document.getElementById("editWeight").value,
  };
  if (!confirmPlausible(draft, "editDist")) return;
  const index = editIndex;
  entry.disc = document.getElementById("editDisc").value;
  entry.date = document.getElementById("editDate").value || entry.date;
  entry.dist = dist;
  entry.time = document.getElementById("editTime").value || "0";
  entry.hr = document.getElementById("editHr").value || "0";
  entry.vo2max = document.getElementById("editVo2max").value || "0";
  entry.weight = document.getElementById("editWeight").value || "0";
  entry.notes = document.getElementById("editNotes").value.trim();
  const steps = parseSteps(document.getElementById("editSteps").value);
  if (steps && STEP_DISCIPLINES.includes(entry.disc)) entry.steps = steps;
  else delete entry.steps;
  if (entry.challenge && !isChallengeDisc(entry.disc)) delete entry.challenge;
  saveHistory(history);
  closeEditTraining();
  refreshTotalLabel();
  refreshHistoryList();
  if (entry.event) { renderEvents(); syncEventResult(entry.event); }

  if (!entry.sharedId) { alert(t().editSaved); return; }
  if (!isShareableDisc(entry.disc)) {
    // Zmieniono na dyscyplinę bez Aktywności (auto 4x4) - zdejmujemy wpis z Aktywności.
    const ok = await deleteSharedActivity(entry.sharedId);
    const fresh = getHistory();
    if (ok && fresh[index]) { delete fresh[index].sharedId; saveHistory(fresh); }
    refreshHistoryList();
    alert(ok ? t().editUnsharedNoShare : t().editReshareFailed);
    return;
  }
  // Udostępniony: najpierw wysyłamy poprawioną wersję, potem usuwamy starą - przy błędzie sieci stara zostaje.
  const oldId = entry.sharedId;
  const nick = (localStorage.getItem(NICK_KEY) || "").trim();
  if (!isCommunityConfigured() || nick.length < 1 || nick.length > 30) { alert(t().editReshareFailed); return; }
  let newId;
  try {
    newId = await shareActivityRpc(entry, nick);
  } catch (e) {
    alert(t().editReshareFailed);
    return;
  }
  await deleteSharedActivity(oldId);
  const fresh = getHistory();
  if (fresh[index]) {
    fresh[index].sharedId = newId;
    saveHistory(fresh);
  }
  refreshHistoryList();
  alert(t().editReshared);
}

function initEditTraining() {
  document.getElementById("editDisc").addEventListener("change", updateEditStepsRow);
  document.getElementById("editDist").addEventListener("input", () => clearFieldState("editDist"));
  document.getElementById("editRouteDistBtn").addEventListener("click", (e) => {
    const km = e.currentTarget.dataset.km;
    if (km) { document.getElementById("editDist").value = km; clearFieldState("editDist"); }
  });
  document.getElementById("editSaveBtn").addEventListener("click", saveEditTraining);
  document.getElementById("editCancelBtn").addEventListener("click", closeEditTraining);
}

function deleteTraining(index) {
  if (!confirm(t().confirmDelete)) return;
  closeEditTraining();
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
  const steps = parseSteps(document.getElementById("steps").value);
  if (steps && STEP_DISCIPLINES.includes(entry.disc)) entry.steps = steps;
  if (!confirmPlausible(entry, "dist")) return;
  if (pendingRoute) entry.route = pendingRoute;
  const saveRouteToo = pendingRoute && pendingRouteImported && document.getElementById("trainSaveRoute").checked;
  if (pendingEventDone && entry.date === pendingEventDone.ymd) entry.event = pendingEventDone.id;
  if (getChallenge() && isChallengeDisc(entry.disc) && document.getElementById("challengeFlag").checked) entry.challenge = true;

  let savedRouteName = null;
  if (saveRouteToo) {
    savedRouteName = saveEntryRouteToRoutes(entry);
    if (savedRouteName) entry.routeSaved = true;
  }

  const history = getHistory();
  const reachedBefore = reachedGoals(history);
  history.push(entry);
  saveHistory(history);
  const newlyReached = getGoals().filter((goal, i) => !reachedBefore[i] && reachedGoals(history)[i]);

  document.getElementById("dist").value = "";
  document.getElementById("steps").value = "";
  document.getElementById("notes").value = "";
  document.getElementById("challengeFlag").checked = false;
  pendingRoute = null;
  pendingRouteImported = false;
  updateTrainSaveRouteRow();
  if (savedRouteName) alert(t().toRoutesSaved(savedRouteName));
  pendingEventDone = null;
  trainFormOpen = false;
  trainMode = null; // po zapisie wracamy do kafelków
  renderTrainMode();

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
  let csv = "Date;Discipline;Distance;Weight;HeartRate;VO2max;Steps;Notes\n";
  history.forEach((item) => {
    csv += `${item.date};${item.disc};${item.dist};${item.weight};${item.hr};${item.vo2max};${parseSteps(item.steps) || ""};${item.notes}\n`;
  });

  saveFile(new File(["﻿" + csv], "pau_data.csv", { type: "text/csv;charset=utf-8" }), "pau_data.csv");
}

// --- Kopia zapasowa (plik JSON z danymi z localStorage) ---
// PIN, klucz organizatora, identyfikator urządzenia i zgoda na statystyki zostają celowo poza kopią.
const BACKUP_FORMAT = "polska-adventure-ultra-backup";
const BACKUP_KEYS = [HISTORY_KEY, BODY_WEIGHT_KEY, PLANNED_ROUTES_KEY, GOALS_KEY, CHALLENGE_KEY, CHALLENGE_INVITE_KEY, CHALLENGE_INVITE_TOKEN_KEY, CHALLENGE_PROGRESS_TOKEN_KEY, THEME_KEY, LANG_KEY, NICK_KEY, SHARE_TOKENS_KEY, ROUTE_SHARE_TOKENS_KEY, EVENT_TOKENS_KEY, EVENTS_DONE_KEY];
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
// Trasa z pliku z zegarka - w formularzu pokazujemy wtedy „Zapisz też trasę w zakładce Trasy”.
let pendingRouteImported = false;

function updateTrainSaveRouteRow() {
  const show = Boolean(pendingRoute) && pendingRouteImported;
  document.getElementById("trainSaveRouteRow").style.display = show ? "flex" : "none";
  if (!show) document.getElementById("trainSaveRoute").checked = false;
}
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

// --- Punkty na trasie (żywienie, przepak, nocleg, sklep, woda...) ---
// Zapisywane w trasie jako route.pois = [{ lat, lon, type, name, note }]. Kilometr liczymy na bieżąco
// (najbliższy punkt trasy), więc po zmianie przebiegu trasy punkty same „przesuwają się” po kilometrach.
const POI_TYPES = ["food", "drop", "sleep", "shop", "water", "danger", "other"];
const POI_ICONS = { food: "🍌", drop: "🎒", sleep: "🛏", shop: "🛒", water: "💧", danger: "⚠️", other: "📍" };
// Symbole GPX rozpoznawane przez Garmina (Garmin Connect pokazuje je jako punkty kursu).
const POI_GPX_SYM = { food: "Restaurant", drop: "Flag, Blue", sleep: "Lodging", shop: "Shopping Center", water: "Drinking Water", danger: "Danger Area", other: "Flag, Red" };
let planPois = [];
let poiArmed = false;
let poiEditIndex = null; // indeks edytowanego punktu w planPois, -1 = nowy
let poiDraft = null;     // { lat, lon } nowego punktu

function poiLabel(type) {
  const types = t().poiTypes;
  return types[type] || types.other;
}

function poiNormalize(p) {
  const lat = +Number(p.lat).toFixed(6);
  const lon = +Number(p.lon).toFixed(6);
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
  const out = { lat, lon, type: POI_TYPES.includes(p.type) ? p.type : "other" };
  const name = String(p.name || "").trim().slice(0, 60);
  const note = String(p.note || "").trim().slice(0, 300);
  if (name) out.name = name;
  if (note) out.note = note;
  return out;
}

function poiTitle(p) {
  return `${POI_ICONS[p.type] || POI_ICONS.other} ${p.name || poiLabel(p.type)}`;
}

// Kilometr każdego punktu wzdłuż trasy i odległość od niej. Zwraca kopie posortowane po km.
function poisWithKm(track, pois) {
  if (!pois || !pois.length) return [];
  const cum = [0];
  for (let i = 1; i < track.length; i++) cum.push(cum[i - 1] + haversineKm(track[i - 1].lat, track[i - 1].lon, track[i].lat, track[i].lon));
  return pois.map((p, index) => {
    let best = Infinity;
    let bi = 0;
    for (let i = 0; i < track.length; i++) {
      const d = haversineKm(p.lat, p.lon, track[i].lat, track[i].lon);
      if (d < best) { best = d; bi = i; }
    }
    return { ...p, index, km: track.length ? cum[bi] : 0, offKm: track.length ? best : 0 };
  }).sort((a, b) => a.km - b.km);
}

function poiMarker(p) {
  const icon = L.divIcon({
    className: "poi-icon",
    html: `<span>${POI_ICONS[p.type] || POI_ICONS.other}</span>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
  return L.marker([p.lat, p.lon], { icon, title: p.name || poiLabel(p.type), keyboard: false });
}

function poiTypeOptionsHtml(selected) {
  return POI_TYPES.map((type) =>
    `<option value="${type}"${type === selected ? " selected" : ""}>${POI_ICONS[type]} ${escapeXml(poiLabel(type))}</option>`).join("");
}

// Punkty edytowanej (już zapisanej) trasy zapisujemy od razu - żeby nie przepadły, gdy ktoś zapomni „ZAPISZ TRASĘ”.
function poiAutosave() {
  if (planEditingIndex == null) return false;
  const routes = getPlannedRoutes();
  const route = routes[planEditingIndex];
  if (!route) return false;
  if (planPois.length) route.pois = planPois.slice();
  else delete route.pois;
  savePlannedRoutes(routes);
  refreshSavedRoutesList();
  return true;
}

function poiSetArmed(on) {
  poiArmed = on;
  const btn = document.getElementById("planPoiBtn");
  if (!btn) return;
  btn.textContent = on ? t().planPoiArmed : t().planPoiBtn;
  btn.classList.toggle("poi-armed", on);
}

function poiToggleArmed() {
  if (!poiArmed && getPlanTrack().length < 2) {
    alert(t().poiNeedRoute);
    return;
  }
  poiCloseForm();
  poiSetArmed(!poiArmed);
}

function poiPlaceDraft(lat, lon) {
  poiSetArmed(false);
  poiDraft = { lat, lon };
  poiEditIndex = -1;
  poiOpenForm({ type: "food", name: "", note: "" });
}

function poiEdit(index) {
  const p = planPois[index];
  if (!p) return;
  poiSetArmed(false);
  poiDraft = null;
  poiEditIndex = index;
  poiOpenForm(p);
}

function poiOpenForm(p) {
  const dict = t();
  const form = document.getElementById("poiForm");
  document.getElementById("poiFormTitle").textContent = poiEditIndex === -1 ? dict.poiFormNew : dict.poiFormEdit;
  document.getElementById("poiType").innerHTML = poiTypeOptionsHtml(p.type || "food");
  document.getElementById("poiName").value = p.name || "";
  document.getElementById("poiNote").value = p.note || "";
  document.getElementById("poiDeleteBtn").hidden = poiEditIndex === -1;
  form.hidden = false;
  form.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function poiCloseForm() {
  const form = document.getElementById("poiForm");
  if (form) form.hidden = true;
  poiEditIndex = null;
  poiDraft = null;
}

function poiSaveForm() {
  const base = poiEditIndex === -1 ? poiDraft : planPois[poiEditIndex];
  if (!base) { poiCloseForm(); return; }
  const p = poiNormalize({
    lat: base.lat,
    lon: base.lon,
    type: document.getElementById("poiType").value,
    name: document.getElementById("poiName").value,
    note: document.getElementById("poiNote").value,
  });
  if (!p) { poiCloseForm(); return; }
  if (poiEditIndex === -1) planPois.push(p);
  else planPois[poiEditIndex] = p;
  poiCloseForm();
  const saved = poiAutosave();
  redrawPlan();
  if (!saved) refreshPlanStats(t().poiUnsaved);
}

function poiDeleteCurrent() {
  if (poiEditIndex == null || poiEditIndex < 0) { poiCloseForm(); return; }
  if (!confirm(t().poiConfirmDelete)) return;
  planPois.splice(poiEditIndex, 1);
  poiCloseForm();
  poiAutosave();
  redrawPlan();
}

function renderPlanPoiList(track) {
  const box = document.getElementById("planPoiList");
  if (!box) return;
  const dict = t();
  const list = poisWithKm(track, planPois);
  if (!list.length) { box.innerHTML = ""; return; }
  box.innerHTML = `<h3>${dict.poiListTitle}</h3>` + list.map((p) =>
    `<div class="poi-item">` +
    `<span class="poi-km">${dict.poiKm(formatKm(p.km))}</span>` +
    `<span class="poi-text"><b>${escapeXml(poiTitle(p))}</b>` +
    (p.name ? ` <small>${escapeXml(poiLabel(p.type))}</small>` : "") +
    (p.offKm > 0.15 ? ` <small>· ${dict.poiOff(Math.round(p.offKm * 1000))}</small>` : "") +
    (p.note ? `<br><small>${escapeXml(p.note)}</small>` : "") + `</span>` +
    `<button class="poi-edit" data-index="${p.index}" title="${dict.poiFormEdit}">✏️</button>` +
    `</div>`).join("");
  box.querySelectorAll(".poi-edit").forEach((btn) => {
    btn.addEventListener("click", () => poiEdit(parseInt(btn.dataset.index, 10)));
  });
}

function drawPlanPois() {
  planPois.forEach((p, i) => {
    poiMarker(p).bindTooltip(escapeXml(poiTitle(p))).on("click", () => poiEdit(i)).addTo(planLayerGroup);
  });
}

// Typ punktu z pliku GPX: nasz zapis "pau:<typ>", a w obcych plikach zgadujemy po symbolu i nazwie.
function poiGuessType(text) {
  const s = String(text || "").toLowerCase();
  const m = s.match(/pau:(\w+)/);
  if (m && POI_TYPES.includes(m[1])) return m[1];
  if (/danger|uwaga|niebezp|ostrzeż|ostrzez|caution|warning|hazard|stromo|stromy|śliski|sliski|ruchliw/.test(s)) return "danger";
  if (/water|woda|wody|drink|źród|zrod|fountain|kran/.test(s)) return "water";
  if (/przepak|drop ?bag|depozyt/.test(s)) return "drop";
  if (/lodg|hotel|nocleg|camp|biwak|schronisk|hostel|shelter|bed/.test(s)) return "sleep";
  if (/shop|sklep|store|market|stacja|convenience|grocery|żabka|zabka|biedronka|lidl|dino|lewiatan|stokrotka|carrefour|netto|delikatesy|orlen/.test(s)) return "shop";
  if (/food|restaur|jedzen|żyw|zyw|bufet|aid station|bar |cafe|kawiarn|posił/.test(s)) return "food";
  return "other";
}

function parseGpxPois(xml) {
  return Array.from(xml.getElementsByTagName("wpt")).map((w) => {
    const child = (tag) => {
      const el = Array.from(w.children).find((c) => c.localName === tag);
      return el ? el.textContent.trim() : "";
    };
    const name = child("name");
    return poiNormalize({
      lat: parseFloat(w.getAttribute("lat")),
      lon: parseFloat(w.getAttribute("lon")),
      type: poiGuessType(`${child("type")} ${child("sym")} ${name}`),
      name,
      note: child("desc") || child("cmt"),
    });
  }).filter(Boolean).slice(0, 500);
}

function gpxWaypoints(pois) {
  return (pois || []).map((p) =>
    `  <wpt lat="${p.lat.toFixed(6)}" lon="${p.lon.toFixed(6)}">` +
    `<name>${escapeXml(p.name || poiLabel(p.type))}</name>` +
    (p.note ? `<desc>${escapeXml(p.note)}</desc>` : "") +
    `<sym>${POI_GPX_SYM[p.type] || POI_GPX_SYM.other}</sym><type>pau:${p.type}</type></wpt>\n`).join("");
}

// --- Punkt „tutaj” podczas nagrywania telefonem ---
let recPoiLayer = null;

function recTogglePoiPick() {
  const pick = document.getElementById("recPoiPick");
  if (!rec) return;
  if (!rec.points.length) { alert(t().poiNoGps); return; }
  pick.hidden = !pick.hidden;
}

function recAddPoi(type) {
  if (!rec || !rec.points.length) return;
  const last = rec.points[rec.points.length - 1];
  const nameEl = document.getElementById("recPoiName");
  const p = poiNormalize({ lat: last[0], lon: last[1], type, name: nameEl.value });
  if (!p) return;
  rec.pois = (rec.pois || []).concat(p);
  recSave(true);
  nameEl.value = "";
  document.getElementById("recPoiPick").hidden = true;
  recSetStatus(t().recPoiAdded(poiTitle(p)), false, 6000);
  recDrawPois();
  recRender();
}

function recDrawPois() {
  if (!recMap || typeof L === "undefined") return;
  if (!recPoiLayer) recPoiLayer = L.layerGroup().addTo(recMap);
  recPoiLayer.clearLayers();
  const navPois = rec && rec.nav && rec.nav.pois ? rec.nav.pois : [];
  const own = rec && rec.pois ? rec.pois : [];
  navPois.concat(own).forEach((p) => poiMarker(p).bindTooltip(escapeXml(poiTitle(p))).addTo(recPoiLayer));
}

function recRenderPoiInfo() {
  const info = document.getElementById("recPoiInfo");
  const list = document.getElementById("recPoiList");
  if (!info || !list) return;
  const dict = t();
  const pois = rec && rec.pois ? rec.pois : [];
  info.hidden = pois.length === 0;
  info.textContent = pois.length ? dict.recPoiCount(pois.length) : "";
  const sig = JSON.stringify(pois) + getLang();
  if (list.dataset.sig === sig) return; // recRender woła to przy każdym odczycie GPS - nie przebudowujemy listy bez potrzeby
  list.dataset.sig = sig;
  list.innerHTML = pois.map((p, i) =>
    `<div class="poi-item"><span class="poi-text"><b>${escapeXml(poiTitle(p))}</b>` +
    (p.note ? `<br><small>${escapeXml(p.note)}</small>` : "") + `</span>` +
    `<button class="poi-edit rec-poi-edit" data-index="${i}" title="${dict.poiFormEdit}">✏️</button>` +
    `<button class="poi-edit rec-poi-del" data-index="${i}" title="${dict.poiDeleteBtn}">🗑</button></div>`).join("");
  list.querySelectorAll(".rec-poi-edit").forEach((btn) => btn.addEventListener("click", () => recEditPoi(parseInt(btn.dataset.index, 10))));
  list.querySelectorAll(".rec-poi-del").forEach((btn) => btn.addEventListener("click", () => recDeletePoi(parseInt(btn.dataset.index, 10))));
}

function recEditPoi(index) {
  const p = rec && rec.pois ? rec.pois[index] : null;
  if (!p) return;
  const dict = t();
  const name = prompt(dict.recPoiRename, p.name || "");
  if (name === null) return;
  const note = prompt(dict.recPoiNote, p.note || "");
  const updated = poiNormalize({ ...p, name, note: note === null ? p.note : note });
  if (!updated) return;
  rec.pois[index] = updated;
  recSave(true);
  recDrawPois();
  recRender();
}

function recDeletePoi(index) {
  if (!rec || !rec.pois || !rec.pois[index]) return;
  if (!confirm(t().poiConfirmDelete)) return;
  rec.pois.splice(index, 1);
  recSave(true);
  recDrawPois();
  recRender();
}

// Po zakończeniu nagrania: przebyta trasa (z punktami) do zakładki Trasy - np. żeby inni mogli nią pobiec.
function recOfferSaveRoute(finished) {
  const dict = t();
  const pois = finished.pois || [];
  if (!finished.saveRoute && !pois.length) return;
  if (!finished.saveRoute && !confirm(dict.recSaveRouteAsk(pois.length))) return;
  const defName = `${dict.discNames[finished.disc] || finished.disc} ${toYmd(new Date(finished.startedAt))}`;
  const name = prompt(dict.promptRouteName, defName);
  if (name === null) return;
  const track = finished.points.map((p) => (p[2] == null ? { lat: p[0], lon: p[1] } : { lat: p[0], lon: p[1], ele: p[2] }));
  const index = saveImportedRoute(name.trim() || defName, simplifyTrack(track, 0.00002), pois);
  const routes = getPlannedRoutes();
  routes[index].recorded = true;
  savePlannedRoutes(routes);
  refreshSavedRoutesList();
  alert(dict.recRouteSaved(routes[index].name, pois.length));
}

// --- Najbliższy punkt podczas prowadzenia po trasie ---
const NAV_POI_SAY_KM = 0.3;
const NAV_DANGER_SAY_KM = 0.5; // niebezpieczne miejsca - uprzedzamy wcześniej i z wibracją

function navPoisFor(pts, pois) {
  if (!pois || !pois.length) return undefined;
  const track = pts.map(([lat, lon]) => ({ lat, lon }));
  return poisWithKm(track, pois).filter((p) => p.offKm <= 2).map((p) => {
    const out = { lat: p.lat, lon: p.lon, type: p.type, km: +p.km.toFixed(3) };
    if (p.name) out.name = p.name;
    return out;
  });
}

function navNextPoi() {
  if (!rec || !rec.nav || !rec.nav.pois || navRt.progressKm == null) return null;
  return rec.nav.pois.find((p) => p.km > navRt.progressKm + 0.02) || null;
}

function navCheckPoi() {
  const next = navNextPoi();
  if (!next) return;
  const leftKm = next.km - navRt.progressKm;
  const key = `${next.km}`;
  const danger = next.type === "danger";
  if (leftKm <= (danger ? NAV_DANGER_SAY_KM : NAV_POI_SAY_KM) + 0.01 && !navRt.poiSaid[key]) {
    navRt.poiSaid[key] = true;
    const m = Math.max(50, Math.round((leftKm * 1000) / 50) * 50);
    if (danger) {
      const text = t().navDanger(m, next.name || "");
      navVibrate([300, 150, 300]);
      if (isNativeApp() && document.visibilityState === "hidden") navNotify(text);
      navSpeak(t().navSayDanger(m, next.name || ""));
    } else {
      navSpeak(t().navSayPoi(m, next.name || poiLabel(next.type)));
    }
  }
}

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
    planMapInstance.on("click", (e) => (poiArmed ? poiPlaceDraft(e.latlng.lat, e.latlng.lng) : addPlanPoint(e.latlng.lat, e.latlng.lng)));
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
  drawPlanPois();
  refreshPlanStats();
  renderPlanPoiList(track);
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
  planPois = [];
  poiCloseForm();
  poiSetArmed(false);
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
  if (planPois.length) route.pois = planPois.slice();
  if (existing && existing.imported) route.imported = true;
  if (existing && existing.recorded) route.recorded = true;
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
  planPois = (route.pois || []).slice();
  poiCloseForm();
  poiSetArmed(false);
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
  if (navSelected === "r:" + index) navSelected = "";
  else if (navSelected.startsWith("r:") && parseInt(navSelected.slice(2), 10) > index) navSelected = "r:" + (parseInt(navSelected.slice(2), 10) - 1);
  if (planEditingIndex === index) planEditingIndex = null;
  else if (planEditingIndex != null && planEditingIndex > index) planEditingIndex--;
  refreshSavedRoutesList();
}

function escapeXml(text) {
  return String(text).replace(/[<>&"']/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" }[c]));
}

// GPX z pojedynczym trackiem - Garmin Connect, Suunto app i Polar Flow importują go jako trasę do nawigacji.
function buildGpx(name, track, pois) {
  const pts = track
    .map((p) => {
      const ele = p.ele != null ? `<ele>${p.ele}</ele>` : "";
      return `      <trkpt lat="${p.lat.toFixed(6)}" lon="${p.lon.toFixed(6)}">${ele}</trkpt>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Polska Adventure Ultra" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata><name>${escapeXml(name)}</name></metadata>
${gpxWaypoints(pois)}  <trk>
    <name>${escapeXml(name)}</name>
    <trkseg>
${pts}
    </trkseg>
  </trk>
</gpx>
`;
}

function routeFileName(name, ext) {
  return (String(name || "").replace(/[^\p{L}\p{N}_-]+/gu, "_") || "trasa") + "." + ext;
}

async function downloadGpx(name, track, pois) {
  // Na telefonie systemowe "Udostępnij" pozwala od razu otworzyć plik np. w Suunto app.
  await saveFile(new File([buildGpx(name, track, pois)], routeFileName(name, "gpx"), { type: "application/gpx+xml" }), name);
}

// KML (Google Earth) - MAPS.ME importuje trasy tylko w tym formacie (GPX nie czyta).
// Linia trasy = LineString, punkty 📍 = osobne Placemarki (w MAPS.ME stają się zakładkami).
function buildKml(name, track, pois) {
  const coords = track
    .map((p) => `${p.lon.toFixed(6)},${p.lat.toFixed(6)}${p.ele != null ? "," + p.ele : ""}`)
    .join(" ");
  const marks = (pois || []).map((p) =>
    `    <Placemark><name>${escapeXml(p.name || poiLabel(p.type))}</name>` +
    (p.note ? `<description>${escapeXml(p.note)}</description>` : "") +
    `<Point><coordinates>${p.lon.toFixed(6)},${p.lat.toFixed(6)}</coordinates></Point></Placemark>\n`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${escapeXml(name)}</name>
    <Style id="pau-line"><LineStyle><color>ff2b6aff</color><width>5</width></LineStyle></Style>
    <Placemark>
      <name>${escapeXml(name)}</name>
      <styleUrl>#pau-line</styleUrl>
      <LineString><tessellate>1</tessellate><coordinates>${coords}</coordinates></LineString>
    </Placemark>
${marks}  </Document>
</kml>
`;
}

const ROUTE_FILE_TYPES = {
  gpx: { mime: "application/gpx+xml", build: buildGpx },
  kml: { mime: "application/vnd.google-earth.kml+xml", build: buildKml },
};

// Natywna apka: zapis do pamięci podręcznej + systemowe "Otwórz w..." (Android ACTION_VIEW z wyborem
// aplikacji, iPhone "Otwórz w"). W przeciwieństwie do "Udostępnij" lista pokazuje aplikacje, które
// umieją OTWORZYĆ plik danego typu (OsmAnd, Locus, MAPS.ME...), a nie tylko wysłać go dalej.
async function openRouteInApp(name, track, pois, ext) {
  const type = ROUTE_FILE_TYPES[ext];
  const file = new File([type.build(name, track, pois)], routeFileName(name, ext), { type: type.mime });
  if (!isNativeApp()) return saveFile(file, name);
  try {
    const data = await blobToBase64(file);
    const res = await capPlugin("Filesystem").writeFile({ path: file.name, data, directory: "CACHE" });
    await capPlugin("FileOpener").open({ filePath: res.uri, contentType: type.mime, openWithDefault: false });
  } catch (e) {
    const msg = String((e && e.message) || e);
    if (/cancel/i.test(msg)) return;
    if (String((e && e.code) || "") === "8" || /activity not found|no app/i.test(msg)) {
      alert(t().openInNoApp(ext === "kml" ? "MAPS.ME" : "OsmAnd"));
      return;
    }
    alert(t().fileSaveError + "\n" + msg);
  }
}

// Okienko przy przycisku GPX: zegarek / inna nawigacja / MAPS.ME.
function openRouteExportMenu(name, track, pois) {
  if (!track || track.length < 2) return;
  const dict = t();
  const native = isNativeApp();
  const opts = [
    { act: "gpx", label: dict.exportMenuGpx, hint: dict.exportMenuGpxHint },
    native ? { act: "open-gpx", label: dict.exportMenuOpenGpx, hint: dict.exportMenuOpenGpxHint } : null,
    { act: native ? "open-kml" : "kml", label: dict.exportMenuKml, hint: dict.exportMenuKmlHint },
  ].filter(Boolean);
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.innerHTML =
    `<div class="card modal-card export-menu" role="dialog" aria-modal="true" aria-labelledby="exportMenuTitle">` +
    `<h3 id="exportMenuTitle">${escapeXml(dict.exportMenuTitle)}</h3>` +
    `<p class="export-menu-route">${escapeXml(name)}</p>` +
    opts.map((o) => `<button class="export-opt" data-act="${o.act}">${o.label}<small>${o.hint}</small></button>`).join("") +
    `<button class="link-btn export-close">${dict.exportMenuClose}</button></div>`;
  const close = () => { document.removeEventListener("keydown", onKey); overlay.remove(); };
  const onKey = (e) => { if (e.key === "Escape") close(); };
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay || e.target.closest(".export-close")) { close(); return; }
    const btn = e.target.closest(".export-opt");
    if (!btn) return;
    close();
    const act = btn.dataset.act;
    if (act === "gpx") downloadGpx(name, track, pois);
    else if (act === "kml") openRouteInApp(name, track, pois, "kml"); // w przeglądarce = zapis pliku
    else if (act === "open-gpx") openRouteInApp(name, track, pois, "gpx");
    else if (act === "open-kml") openRouteInApp(name, track, pois, "kml");
  });
  document.addEventListener("keydown", onKey);
  document.body.appendChild(overlay);
  overlay.querySelector(".export-opt").focus();
}

// Natywna aplikacja: plik trafia do pamięci podręcznej apki, a systemowe "Udostępnij" pozwala zapisać go
// na Dysku Google, wysłać mailem albo otworzyć w innej aplikacji (np. GPX w aplikacji zegarka).
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

async function nativeSaveFile(file, title) {
  try {
    const data = await blobToBase64(file);
    const res = await capPlugin("Filesystem").writeFile({ path: file.name, data, directory: "CACHE" });
    await capPlugin("Share").share({ title: title || file.name, dialogTitle: title || file.name, files: [res.uri] });
  } catch (e) {
    if (/cancel/i.test(String((e && e.message) || e))) return;
    alert(t().fileSaveError + "\n" + ((e && e.message) || e));
  }
}

async function saveFile(file, title) {
  // W natywnej aplikacji WebView nie umie ani pobierać plików (<a download>), ani udostępniać ich przez navigator.share.
  if (isNativeApp()) return nativeSaveFile(file, title);
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
  openRouteExportMenu(name, getPlanTrack(), planPois);
}

function plannedRouteTrack(route) {
  const track = [];
  route.segments.forEach((seg, i) => track.push(...(i === 0 ? seg : seg.slice(1))));
  return track;
}

function exportPlannedRoute(index) {
  const route = getPlannedRoutes()[index];
  if (!route) return;
  openRouteExportMenu(route.name, plannedRouteTrack(route), route.pois);
}

function refreshSavedRoutesList() {
  navRefreshSelect();
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
      `<span>${escapeXml(r.name)} — ${r.distKm} km (${r.created})${r.pois && r.pois.length ? ` · ${dict.poiCount(r.pois.length)}` : ""}</span>` +
      `<div class="history-actions">` +
      `<button class="nav-btn" data-index="${index}" title="${dict.navRouteTitle}">🧭</button>` +
      `<button class="route-btn" data-index="${index}" title="${dict.editRouteTitle}">🗺</button>` +
      `<button class="gpx-btn" data-index="${index}" title="${dict.exportRouteTitle}">📲</button>` +
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
  list.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => navStartFromRoute(parseInt(btn.dataset.index, 10)));
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

// --- Samsung Internet: zamiast instalacji (blokowanej przez Play Protect) skrót albo Chrome ---
const SAMSUNG_HINT_KEY = "pau_samsung_hint_closed";

function isSamsungBrowser() {
  return /SamsungBrowser/i.test(navigator.userAgent);
}

function isStandalone() {
  return (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true;
}

function initSamsungHint() {
  const card = document.getElementById("samsungHint");
  let closed = false;
  try { closed = localStorage.getItem(SAMSUNG_HINT_KEY) === "1"; } catch (e) { /* brak dostępu */ }
  card.hidden = !isSamsungBrowser() || isStandalone() || closed;
  document.getElementById("samsungHintClose").addEventListener("click", () => {
    card.hidden = true;
    try { localStorage.setItem(SAMSUNG_HINT_KEY, "1"); } catch (e) { /* brak dostępu */ }
  });
  document.getElementById("samsungHintCopy").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(APP_URL);
      alert(t().samsungHintCopied);
    } catch (e) {
      prompt(t().samsungHintCopy, APP_URL);
    }
  });
}

async function shareAppLink() {
  if (isNativeApp()) {
    try {
      await capPlugin("Share").share({ title: "Polska Adventure Ultra", text: t().shareAppText, url: APP_URL, dialogTitle: "Polska Adventure Ultra" });
      return;
    } catch (e) {
      if (/cancel/i.test(String((e && e.message) || e))) return;
    }
  }
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
  if (isNativeApp()) return saveFile(file, "Polska Adventure Ultra");
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

  if (!isShareableDisc(entry.disc)) return;
  if (!confirmPlausible(entry, null)) return;
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

  try {
    entry.sharedId = await shareActivityRpc(entry, trimmedNick);
    saveHistory(history);
    refreshHistoryList();
    alert(t().shared);
  } catch (e) {
    alert(t().communityError);
  }
}

// Wysyła trening do Aktywności i zapamiętuje token do usuwania; zwraca id wpisu na serwerze.
async function shareActivityRpc(entry, nick) {
  const token = randomToken();
  const time = parseFloat(entry.time);
  const id = await rpc("share_activity", {
    p_nick: nick,
    p_disc: entry.disc,
    p_date: entry.date,
    p_dist_km: parseFloat(entry.dist),
    p_time_min: time > 0 ? time : null,
    p_steps: STEP_DISCIPLINES.includes(entry.disc) ? parseSteps(entry.steps) || null : null,
    p_route: trimRouteEnds(entry.route),
    p_delete_token: token,
  });
  const tokens = getShareTokens();
  tokens[id] = token;
  saveShareTokens(tokens);
  return id;
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
  trainFormOpen = true;
  trainMode = "manual";
  renderTrainMode();
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

// Organizator usuwa tylko własne wydarzenia (superadmin - wszystkie). null = nie wiadomo (stara baza) - pokazujemy 🗑 wszędzie.
let deletableEventIds = null;
async function fetchDeletableEventIds() {
  if (!getAdminKey()) return null;
  try {
    const ids = await rpc("admin_deletable_event_ids", { p_admin_key: getAdminKey() });
    return new Set((ids || []).map((row) => (typeof row === "object" && row ? Object.values(row)[0] : row)));
  } catch (e) {
    return null;
  }
}

async function refreshEvents() {
  const listEl = document.getElementById("eventsList");
  const dict = t();
  listEl.innerHTML = `<p>${dict.loading}</p>`;
  try {
    eventsCache = (await rpc("list_events_v2")) || [];
    deletableEventIds = await fetchDeletableEventIds();
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
  const canDelete = isAdmin && (!deletableEventIds || deletableEventIds.has(ev.id));
  const del = canDelete ? `<button class="delete-btn" data-index="${index}" title="${dict.deleteTitle}">🗑</button>` : "";
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
    loadChallengeBoard();
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
  refreshEvents(); // pobiera też listę wydarzeń, które ten organizator może usuwać
  renderChallenge();
  loadChallengeBoard();
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
    if ((await rpc("admin_delete_event", { p_admin_key: getAdminKey(), p_id: ev.id })) === false) {
      alert(t().deleteEventNotOwner);
      return;
    }
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
      const steps = parseSteps(a.steps) ? `, 👣 ${formatSteps(parseSteps(a.steps))}` : "";
      const mapBtn = Array.isArray(a.route) && a.route.length >= 2
        ? `<button class="route-btn" data-index="${index}" title="${dict.showRouteTitle}">🗺</button>`
        : "";
      const delBtn = mine
        ? `<button class="delete-btn" data-index="${index}" title="${dict.deleteTitle}">🗑</button>`
        : "";
      return `<div class="history-item">` +
        `<span><span class="activity-nick">${escapeXml(a.nick)}</span>${mine ? " " + dict.mineLabel : ""} — ` +
        `${discName}, ${Number(a.dist_km).toFixed(2)} km${time}${steps} (${escapeXml(a.activity_date)})</span>` +
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
        `<button class="nav-btn" data-index="${index}" title="${dict.navCommunityTitle}">🧭</button>` +
        `<button class="route-btn" data-index="${index}" title="${dict.showRouteTitle}">🗺</button>` +
        `<button class="gpx-btn" data-index="${index}" title="${dict.exportRouteTitle}">📲</button>` +
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
  on(".nav-btn", navCommunityRoute);
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
  if (track) openRouteExportMenu(r.name, track);
}

async function copyCommunityRoute(r, quiet) {
  const track = await fetchCommunityTrack(r);
  if (!track) return -1;
  const routes = getPlannedRoutes();
  routes.push({
    name: r.name,
    created: new Date().toISOString().slice(0, 10),
    mode: r.mode,
    distKm: trackDistanceKm(track).toFixed(2),
    // Start i meta jako punkty edycji, cała trasa jako jeden odcinek - można ją dalej wydłużać.
    waypoints: [track[0], track[track.length - 1]],
    segments: [track],
    communityId: r.id,
  });
  savePlannedRoutes(routes);
  refreshSavedRoutesList();
  if (!quiet) alert(t().routeCopied(r.name));
  return routes.length - 1;
}

// 🧭 przy trasie społeczności: kopia w Twoich trasach (raz) i od razu prowadzenie w nagrywaniu telefonem.
async function navCommunityRoute(r) {
  if (rec) { alert(t().navBusy); return; }
  let index = getPlannedRoutes().findIndex((x) => x.communityId === r.id);
  if (index < 0) index = await copyCommunityRoute(r, true);
  if (index >= 0) navStartFromRoute(index);
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
  if (/driv|4x4|off.?road/.test(s)) return "Auto4x4";
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
  let stepCount = 0;
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
    Array.from(lap.getElementsByTagName("*")).forEach((el) => {
      if (el.localName === "Steps") stepCount += parseFloat(el.textContent) || 0;
    });
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
  const tcxDisc = discMap[sport] || activityTypeToDisc(sport) || "Bieg";

  return {
    date,
    dist: (distM / 1000).toFixed(2),
    time: (timeS / 60).toFixed(1),
    hr: avgHr ? String(Math.round(avgHr)) : "0",
    disc: tcxDisc,
    steps: STEP_DISCIPLINES.includes(tcxDisc) ? normalizeSteps(stepCount, timeS / 60, false) : 0,
    route: route.length >= 2 ? downsampleRoute(route, 200) : undefined,
  };
}

// --- Pliki FIT (binarny format zegarków: Suunto, Garmin, Polar, Coros, Wahoo) ---
// Czytamy tylko to, czego potrzebuje formularz: sesję (sport, start, czas, dystans, tętno)
// i punkty GPS. Basen nie ma trasy - dystans i czas bierzemy z podsumowania sesji.
const FIT_EPOCH_MS = Date.UTC(1989, 11, 31);
const FIT_INVALID = { 0: 0xff, 1: 0x7f, 2: 0xff, 3: 0x7fff, 4: 0xffff, 5: 0x7fffffff, 6: 0xffffffff, 10: 0, 11: 0, 12: 0, 13: 0xff };
const FIT_SIZES = { 0: 1, 1: 1, 2: 1, 3: 2, 4: 2, 5: 4, 6: 4, 8: 4, 9: 8, 10: 1, 11: 2, 12: 4, 13: 1 };

function isFitFile(buf) {
  if (buf.byteLength < 12) return false;
  const b = new Uint8Array(buf, 8, 4);
  return String.fromCharCode(b[0], b[1], b[2], b[3]) === ".FIT";
}

// Zwraca { 0: [file_id...], 18: [session...], 20: [record...] } - pola jako { numer: wartość }.
function readFitMessages(buf, wanted) {
  const view = new DataView(buf);
  const headerSize = view.getUint8(0);
  const end = Math.min(buf.byteLength, headerSize + view.getUint32(4, true));
  const defs = {};
  const out = {};
  wanted.forEach((g) => { out[g] = []; });
  let p = headerSize;
  let lastTs = 0;
  while (p < end) {
    const h = view.getUint8(p++);
    let local;
    let tsFromHeader = null;
    if (h & 0x80) {
      // skompresowany nagłówek z przesunięciem czasu (5 bitów)
      local = (h >> 5) & 3;
      const offset = h & 0x1f;
      tsFromHeader = (lastTs & ~0x1f) + offset + (offset < (lastTs & 0x1f) ? 0x20 : 0);
      lastTs = tsFromHeader;
    } else if (h & 0x40) {
      local = h & 0x0f;
      const little = view.getUint8(p + 1) === 0;
      const global = view.getUint16(p + 2, little);
      const n = view.getUint8(p + 4);
      p += 5;
      const fields = [];
      for (let i = 0; i < n; i++, p += 3) {
        fields.push({ num: view.getUint8(p), size: view.getUint8(p + 1), type: view.getUint8(p + 2) & 0x1f });
      }
      let devSize = 0;
      if (h & 0x20) {
        const nd = view.getUint8(p++);
        for (let i = 0; i < nd; i++, p += 3) devSize += view.getUint8(p + 1);
      }
      defs[local] = { global, little, fields, devSize };
      continue;
    } else {
      local = h & 0x0f;
    }
    const def = defs[local];
    if (!def) throw new Error(t().errBadFit);
    const keep = out[def.global];
    const msg = keep ? {} : null;
    def.fields.forEach((f) => {
      if (msg && FIT_SIZES[f.type] === f.size) {
        const v = fitValue(view, p, f.type, def.little);
        if (v !== null && v !== FIT_INVALID[f.type]) msg[f.num] = v;
      }
      if (f.num === 253 && f.size === 4) {
        const ts = view.getUint32(p, def.little);
        if (ts !== 0xffffffff) lastTs = ts;
      }
      p += f.size;
    });
    p += def.devSize;
    if (msg) {
      if (tsFromHeader !== null && msg[253] === undefined) msg[253] = tsFromHeader;
      keep.push(msg);
    }
  }
  return out;
}

function fitValue(view, p, type, little) {
  switch (type) {
    case 0: case 2: case 10: case 13: return view.getUint8(p);
    case 1: return view.getInt8(p);
    case 3: return view.getInt16(p, little);
    case 4: case 11: return view.getUint16(p, little);
    case 5: return view.getInt32(p, little);
    case 6: case 12: return view.getUint32(p, little);
    case 8: return view.getFloat32(p, little);
    case 9: return view.getFloat64(p, little);
    default: return null;
  }
}

// Sport z FIT (sport, sub_sport) -> dyscyplina aplikacji.
function fitSportToDisc(sport, subSport) {
  if (sport === 5) return subSport === 18 ? "WodyOtwarte" : "Basen";   // 17 = basen, 18 = wody otwarte
  if (sport === 2) return "Rower";
  if (sport === 11 || sport === 17) return "Trekking";                 // marsz, wędrówka
  if (sport === 19 || sport === 41 || sport === 37 || sport === 15) return "Kajak"; // paddling, kajak, SUP, wiosłowanie
  if (sport === 1) return "Bieg";
  return null;
}

function parseFit(buf) {
  const msgs = readFitMessages(buf, [18, 20]);
  const sessions = msgs[18];
  const records = msgs[20];
  const fitDate = (ts) => new Date(FIT_EPOCH_MS + ts * 1000);

  const route = [];
  const hrValues = [];
  records.forEach((r) => {
    if (r[3] > 0) hrValues.push(r[3]);
    if (r[0] === undefined || r[1] === undefined) return;
    const point = { lat: r[0] * (180 / 2 ** 31), lon: r[1] * (180 / 2 ** 31) };
    const alt = r[78] !== undefined ? r[78] / 5 - 500 : r[2] !== undefined ? r[2] / 5 - 500 : NaN;
    if (Number.isFinite(alt)) point.ele = alt;
    route.push(point);
  });

  let distM = 0;
  let timeS = 0;
  let hrSum = 0;
  let hrTime = 0;
  let cycles = 0;
  let startTs = null;
  let disc = null;
  sessions.forEach((s) => {
    if (s[10] > 0) cycles += s[10];
    const sTime = (s[8] !== undefined ? s[8] : s[7] || 0) / 1000;   // czas ruchu, a gdy brak - całkowity
    distM += (s[9] || 0) / 100;
    timeS += sTime;
    if (s[16]) { hrSum += s[16] * sTime; hrTime += sTime; }
    const st = s[2] !== undefined ? s[2] : s[253];
    if (st !== undefined && (startTs === null || st < startTs)) startTs = st;
    if (!disc) disc = fitSportToDisc(s[5], s[6]);
  });

  // Brak podsumowania sesji (rzadkie) - liczymy z punktów pomiarowych.
  if (!sessions.length) {
    const timed = records.filter((r) => r[253] !== undefined);
    if (timed.length < 2) throw new Error(t().errBadFit);
    startTs = timed[0][253];
    timeS = timed[timed.length - 1][253] - startTs;
    const withDist = records.filter((r) => r[5] !== undefined);
    if (withDist.length) distM = withDist[withDist.length - 1][5] / 100;
    else for (let i = 1; i < route.length; i++) distM += haversineKm(route[i - 1].lat, route[i - 1].lon, route[i].lat, route[i].lon) * 1000;
  }

  const avgHr = hrTime ? hrSum / hrTime : hrValues.length ? hrValues.reduce((a, b) => a + b, 0) / hrValues.length : 0;
  return {
    date: startTs !== null ? toYmd(fitDate(startTs)) : toYmd(new Date()),
    dist: (distM / 1000).toFixed(2),
    time: (timeS / 60).toFixed(1),
    hr: avgHr ? String(Math.round(avgHr)) : "0",
    disc: disc || "Bieg",
    // W pływaniu i na rowerze „cykle” to ruchy ramion / obroty korby - nie kroki.
    steps: STEP_DISCIPLINES.includes(disc || "Bieg") ? normalizeSteps(cycles, timeS / 60, true) : 0,
    route: route.length >= 2 ? downsampleRoute(route, 200) : undefined,
    routeFull: route.length >= 2 ? route : undefined, // pełna trasa - do prowadzenia (nawigacji)
  };
}

// --- Zakładka Trening: kafelki 📱 telefon / ⌚ zegarek / ✏️ własny trening (formularz) ---
// Wybór nie jest zapamiętywany - za każdym razem można wybrać inaczej. Zapamiętujemy tylko markę zegarka.
const WATCH_BRAND_KEY = "pau_watch_brand";
const WATCH_BRANDS = ["garmin", "suunto", "polar", "samsung", "huawei", "other"];
let trainMode = null;       // null | "phone" | "watch" | "manual"
let trainFormOpen = false;  // formularz z danymi z importu / nagrania / „Zrobione” czeka na zapis

function getWatchBrand() {
  const b = localStorage.getItem(WATCH_BRAND_KEY);
  return WATCH_BRANDS.includes(b) ? b : "garmin";
}

function renderWatchSteps() {
  const dict = t();
  const brand = getWatchBrand();
  const select = document.getElementById("watchBrand");
  if (!select) return;
  select.value = brand;
  const ol = document.getElementById("watchSteps");
  ol.innerHTML = "";
  [...dict.watchSteps[brand], dict.watchStepLast].forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    ol.appendChild(li);
  });
}

function renderTrainMode() {
  const phone = trainMode === "phone" || Boolean(rec);
  const watch = trainMode === "watch";
  const form = trainMode === "manual" || trainFormOpen;
  document.getElementById("recCard").hidden = !phone;
  document.getElementById("watchCard").hidden = !watch;
  document.getElementById("trainFormCard").hidden = !form;
  [["modePhoneBtn", phone], ["modeWatchBtn", watch], ["modeManualBtn", form]].forEach(([id, on]) => {
    const btn = document.getElementById(id);
    btn.setAttribute("aria-pressed", String(on));
    btn.classList.toggle("active", on);
  });
  if (phone && rec) recInitMap();
}

// Kliknięcie aktywnego kafelka go zwija.
function setTrainMode(mode) {
  const closing = trainMode === mode || (mode === "manual" && trainFormOpen && trainMode !== "manual");
  if (mode === "manual" && closing) trainFormOpen = false;
  trainMode = closing ? null : mode;
  renderTrainMode();
}

// Dane z importu / nagrania / „Zrobione” są już w formularzu - pokazujemy go i przewijamy do niego.
function openTrainForm() {
  trainFormOpen = true;
  trainMode = "manual";
  renderTrainMode();
  const card = document.getElementById("trainFormCard");
  if (card.scrollIntoView) card.scrollIntoView({ block: "start", behavior: "smooth" });
}

function initTrainModes() {
  document.getElementById("modePhoneBtn").addEventListener("click", () => setTrainMode("phone"));
  document.getElementById("modeWatchBtn").addEventListener("click", () => setTrainMode("watch"));
  document.getElementById("modeManualBtn").addEventListener("click", () => setTrainMode("manual"));
  document.getElementById("watchBrand").addEventListener("change", (e) => {
    localStorage.setItem(WATCH_BRAND_KEY, e.target.value);
    renderWatchSteps();
  });
  renderWatchSteps();
  renderTrainMode();
}

function importTrainingFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      let parsed;
      if (isFitFile(reader.result)) {
        parsed = parseFit(reader.result);
      } else {
        const text = new TextDecoder("utf-8").decode(reader.result);
        const xml = new DOMParser().parseFromString(text, "application/xml");
        if (xml.getElementsByTagName("parsererror").length > 0) {
          throw new Error(t().errBadXml);
        }
        const isTcx = xml.getElementsByTagName("TrainingCenterDatabase").length > 0;
        parsed = isTcx ? parseTcx(xml) : parseGpx(xml);
      }

      document.getElementById("date").value = parsed.date;
      document.getElementById("dist").value = parsed.dist;
      document.getElementById("time").value = parsed.time;
      document.getElementById("hr").value = parsed.hr;
      document.getElementById("steps").value = parsed.steps || "";
      document.getElementById("discipline").value = parsed.disc;
      updateDisciplineUi();
      pendingRoute = parsed.route && parsed.route.length >= 2 ? parsed.route : null;
      pendingRouteImported = true;
      openTrainForm();
      updateTrainSaveRouteRow();

      const noSteps = STEP_DISCIPLINES.includes(parsed.disc) && !parsed.steps;
      alert(t().importSuccess(parsed) + (noSteps ? t().importNoSteps : ""));
    } catch (e) {
      alert(t().importError(e.message));
    }
  };
  reader.readAsArrayBuffer(file);
}

// --- Nagrywanie treningu GPS-em telefonu (bez zegarka) ---
// Punkty trasy zbierane przez navigator.geolocation.watchPosition. Ekran trzymany włączony
// (Screen Wake Lock), bo przeglądarka wstrzymuje GPS, gdy aplikacja jest w tle.
// Bieżące nagranie zapisywane w localStorage - zamknięcie aplikacji nie gubi trasy.
const RECORDING_KEY = "pau_recording";
const REC_DISCIPLINES = ["Bieg", "Rower", "Kajak", "WodyOtwarte", "Trekking", "Auto4x4"];
const REC_MAX_ACCURACY_M = 35;   // gorsze odczyty pomijamy
const REC_MIN_STEP_M = 5;        // drobniejsze ruchy to szum GPS
const REC_GAP_S = 20;            // dłuższa przerwa = aplikacja była w tle / brak sygnału
const REC_MAX_KMH = { Bieg: 30, Trekking: 15, Kajak: 20, WodyOtwarte: 10, Rower: 90, Auto4x4: 160 };
const REC_SAVE_MS = 10000;

// Kalorie = MET × waga (kg) × czas (h). MET zależy od prędkości odcinka (km/h);
// wartości wg Compendium of Physical Activities, między punktami - interpolacja liniowa.
const MET_TABLES = {
  Bieg: [[0, 2.0], [4, 3.5], [6.4, 6.5], [8, 8.3], [9.7, 9.8], [11.3, 11.0], [12.9, 11.8], [14.5, 12.8], [16.1, 14.5], [19.3, 19.0], [22.5, 23.0]],
  Trekking: [[0, 2.0], [3.2, 4.0], [4.8, 5.3], [5.6, 6.0], [6.4, 7.0], [8, 8.3]],
  Rower: [[0, 2.0], [10, 4.0], [16, 6.8], [19.3, 8.0], [22.5, 10.0], [25.7, 12.0], [32, 15.8]],
  Kajak: [[0, 2.0], [4, 3.5], [6, 5.0], [8, 8.0], [10, 12.5]],
  WodyOtwarte: [[0, 2.0], [1.5, 5.8], [2.5, 8.3], [3.5, 10.0], [4.5, 11.0]],
  Auto4x4: [[0, 2.0]], // prowadzenie auta terenowego ~2 MET niezależnie od prędkości
};

function metFor(disc, kmh) {
  const table = MET_TABLES[disc] || MET_TABLES.Trekking;
  if (kmh <= table[0][0]) return table[0][1];
  for (let i = 1; i < table.length; i++) {
    const [x1, y1] = table[i];
    if (kmh <= x1) {
      const [x0, y0] = table[i - 1];
      return y0 + ((kmh - x0) / (x1 - x0)) * (y1 - y0);
    }
  }
  return table[table.length - 1][1];
}

function parseBodyWeight(value) {
  const kg = parseFloat(String(value).replace(",", "."));
  return kg >= 20 && kg <= 300 ? kg : null;
}

// Ostatnio wpisana waga; jeśli brak - waga z ostatniego treningu w historii.
function getBodyWeight() {
  try {
    const kg = parseBodyWeight(localStorage.getItem(BODY_WEIGHT_KEY));
    if (kg) return kg;
  } catch (e) { /* brak dostępu */ }
  const withWeight = getHistory().filter((h) => parseBodyWeight(h.weight)).sort((a, b) => String(b.date).localeCompare(String(a.date)));
  return withWeight.length ? parseBodyWeight(withWeight[0].weight) : null;
}

function recAddKcal(disc, kmh, seconds) {
  if (!rec || !rec.weightKg) return;
  rec.kcal = (rec.kcal || 0) + metFor(disc, kmh) * rec.weightKg * (seconds / 3600);
}

let rec = null;            // { disc, startedAt, pausedMs, pausedAt, points: [[lat, lon, ele|null, t]], distKm, gaps }
let recWatchId = null;
let recTimer = null;
let recWakeLock = null;
let recLastSave = 0;
let recRejects = 0;
let recLastAccuracy = null;
let recHiddenAt = null;
let recLastFixAt = 0;      // czas ostatniego odczytu GPS (także odrzuconego - liczy się, że GPS odpowiadał)
let recHiddenMaxGap = 0;   // najdłuższa przerwa między odczytami, gdy ekran był zgaszony / aplikacja w tle (ms)
let recStatusHoldUntil = 0;
let recMap = null;
let recLine = null;
let recDot = null;

function recSave(force) {
  if (!rec) return;
  const now = Date.now();
  if (!force && now - recLastSave < REC_SAVE_MS) return;
  recLastSave = now;
  try {
    localStorage.setItem(RECORDING_KEY, JSON.stringify({ ...rec, savedAt: now }));
  } catch (e) {
    console.warn("Nie udało się zapisać nagrania", e);
  }
}

function recLoad() {
  try {
    const data = JSON.parse(localStorage.getItem(RECORDING_KEY));
    return data && Array.isArray(data.points) ? data : null;
  } catch (e) {
    return null;
  }
}

function recMovingMs(now = Date.now()) {
  if (!rec) return 0;
  const paused = rec.pausedMs + (rec.pausedAt ? now - rec.pausedAt : 0);
  return Math.max(0, now - rec.startedAt - paused);
}

function formatClock(ms) {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${h}:${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

function recPaceText() {
  const min = recMovingMs() / 60000;
  if (!rec || rec.distKm < 0.05 || min <= 0) return "–";
  if (SWIM_DISCIPLINES.includes(rec.disc)) return formatSwimPace(min / (rec.distKm * 10));
  if (rec.disc === "Bieg") return formatPace(min / rec.distKm);
  return `${(rec.distKm / (min / 60)).toFixed(1)} km/h`;
}

async function recRequestWakeLock() {
  if (!("wakeLock" in navigator) || !rec || rec.pausedAt) return;
  try {
    recWakeLock = await navigator.wakeLock.request("screen");
    recWakeLock.addEventListener("release", () => { recWakeLock = null; });
  } catch (e) {
    recWakeLock = null;
  }
}

function recReleaseWakeLock() {
  if (recWakeLock) recWakeLock.release().catch(() => {});
  recWakeLock = null;
}

// holdMs: komunikat zostaje na ekranie, zanim nadpisze go zwykłe „GPS działa”.
function recSetStatus(text, warn, holdMs) {
  if (!holdMs && text === t().recGpsOk && Date.now() < recStatusHoldUntil) return;
  recStatusHoldUntil = holdMs ? Date.now() + holdMs : 0;
  const el = document.getElementById("recStatus");
  el.textContent = text || "";
  el.classList.toggle("rec-warn", Boolean(warn));
}

function recRender() {
  const active = Boolean(rec);
  if (document.getElementById("trainFormCard")) renderTrainMode();
  document.getElementById("recIdle").hidden = active;
  document.getElementById("recActive").hidden = !active;
  if (!active) return;
  const dict = t();
  document.getElementById("recTime").textContent = formatClock(recMovingMs());
  document.getElementById("recDist").textContent = rec.distKm.toFixed(2);
  document.getElementById("recPace").textContent = recPaceText();
  document.getElementById("recKcal").textContent = rec.weightKg ? String(Math.round(rec.kcal || 0)) : "–";
  document.getElementById("recKcalLbl").textContent = rec.weightKg ? dict.recKcalLbl : dict.recKcalNoWeight;
  document.getElementById("recPaceLbl").textContent =
    rec.disc === "Bieg" || SWIM_DISCIPLINES.includes(rec.disc) ? dict.recPaceLbl : dict.recSpeedLbl;
  document.getElementById("recGps").textContent = recLastAccuracy == null ? "–" : `±${Math.round(recLastAccuracy)} m`;
  document.getElementById("recDiscLbl").textContent = `📍 ${dict.discNames[rec.disc] || rec.disc}`;
  document.getElementById("recPauseBtn").textContent = rec.pausedAt ? dict.recResumeBtn : dict.recPauseBtn;
  document.getElementById("recCard").classList.toggle("rec-paused", Boolean(rec.pausedAt));
  recRenderPoiInfo();
  navRender();
}

function recInitMap() {
  if (typeof L === "undefined") return;
  if (!recMap) {
    recMap = L.map("recMap", { zoomControl: false, attributionControl: true });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(recMap);
    navLine = L.polyline([], { color: "#2F6FD0", weight: 7, opacity: 0.55 }).addTo(recMap);
    navStartMarker = L.circleMarker([0, 0], { radius: 6, color: "#fff", weight: 2, fillColor: "#3D7A22", fillOpacity: 1 });
    navEndMarker = L.circleMarker([0, 0], { radius: 6, color: "#fff", weight: 2, fillColor: "#C62828", fillOpacity: 1 });
    recLine = L.polyline([], { color: "#3D7A22", weight: 5 }).addTo(recMap);
    recDot = L.circleMarker([52.07, 19.48], { radius: 8, color: "#fff", weight: 3, fillColor: "#D86C28", fillOpacity: 1 });
    recMap.setView([52.07, 19.48], 6);
  }
  requestAnimationFrame(() => recMap.invalidateSize());
  navDraw();
  recUpdateMap(true);
}

function recUpdateMap(fit) {
  if (!recMap || !rec) return;
  const latlngs = rec.points.map((p) => [p[0], p[1]]);
  recLine.setLatLngs(latlngs);
  if (fit && rec.nav && latlngs.length < 2 && navLine.getLatLngs().length > 1) {
    recMap.fitBounds(navLine.getBounds(), { padding: [20, 20], maxZoom: 16 });
    if (latlngs.length) { recDot.setLatLng(latlngs[0]); if (!recMap.hasLayer(recDot)) recDot.addTo(recMap); }
    return;
  }
  if (!latlngs.length) return;
  const last = latlngs[latlngs.length - 1];
  recDot.setLatLng(last);
  if (!recMap.hasLayer(recDot)) recDot.addTo(recMap);
  if (fit && latlngs.length > 1) recMap.fitBounds(recLine.getBounds(), { padding: [20, 20], maxZoom: 17 });
  else recMap.setView(last, Math.max(recMap.getZoom(), 16));
}

// Postęp w wyzwaniu na żywo: najwyżej co 0,5 km albo co 5 min, tylko gdy kilometry się zmieniły.
const REC_LIVE_SYNC_KM = 0.5;
const REC_LIVE_SYNC_MS = 5 * 60 * 1000;
let recLiveSync = { km: 0, at: 0 };
function recChallengeLiveSync() {
  const now = Date.now();
  if (rec.distKm - recLiveSync.km < REC_LIVE_SYNC_KM && now - recLiveSync.at < REC_LIVE_SYNC_MS) return;
  if (rec.distKm - recLiveSync.km < 0.1) return;
  recLiveSync = { km: rec.distKm, at: now };
  syncChallengeProgress();
}

function recOnPosition(pos) {
  if (!rec) return;
  const now = Date.now();
  if (recHiddenAt && recLastFixAt) recHiddenMaxGap = Math.max(recHiddenMaxGap, now - Math.max(recLastFixAt, recHiddenAt));
  recLastFixAt = now;
  const c = pos.coords;
  recLastAccuracy = c.accuracy;
  if (rec.pausedAt) { recRender(); return; }
  if (c.accuracy > REC_MAX_ACCURACY_M) {
    recSetStatus(t().recWeakGps(Math.round(c.accuracy)), true);
    recRender();
    return;
  }
  if (rec.nav) navOnFix(c.latitude, c.longitude, c.accuracy);
  if (rec.challenge) recChallengeLiveSync();
  chMsgMaybePoll(); // komunikaty organizatora - działa też przy zgaszonym ekranie (odczyty GPS budzą JS)
  const ts = pos.timestamp || Date.now();
  const ele = Number.isFinite(c.altitude) ? Math.round(c.altitude) : null;
  const point = [+c.latitude.toFixed(6), +c.longitude.toFixed(6), ele, ts];
  const last = rec.points[rec.points.length - 1];

  if (!last || rec.resumed) {
    // Pierwszy punkt albo pierwszy po pauzie: ruch w czasie pauzy się nie liczy.
    rec.points.push(point);
    rec.resumed = false;
    recSetStatus(t().recGpsOk);
  } else {
    const d = haversineKm(last[0], last[1], point[0], point[1]);
    const dt = Math.max(1, (ts - last[3]) / 1000);
    const kmh = d / (dt / 3600);
    const maxKmh = REC_MAX_KMH[rec.disc] || 60;
    if (d * 1000 < REC_MIN_STEP_M) { recRender(); return; }
    if (dt <= REC_GAP_S && kmh > maxKmh) {
      // Skok GPS - pomijamy; po kilku z rzędu uznajemy nowe miejsce, ale bez doliczania dystansu.
      recRejects++;
      if (recRejects < 3) { recRender(); return; }
      rec.points.push(point);
    } else {
      if (dt > REC_GAP_S) rec.gaps = (rec.gaps || 0) + 1;
      if (kmh <= maxKmh) {
        rec.distKm += d;
        recAddKcal(rec.disc, kmh, dt);
      }
      rec.points.push(point);
    }
    recRejects = 0;
    recSetStatus(t().recGpsOk);
  }
  recSave(false);
  recUpdateMap(false);
  recRender();
}

function recOnError(err) {
  const dict = t();
  if (err.code === 1) {
    recSetStatus(dict.recDenied, true);
    alert(dict.recDenied);
  } else if (err.code === 2) {
    recSetStatus(dict.recUnavailable, true);
  }
  // kod 3 (timeout) - czekamy dalej
}

// --- Natywna aplikacja Android (Capacitor) ---
// W natywnej aplikacji GPS idzie przez wtyczkę BackgroundGeolocation (usługa z powiadomieniem),
// więc nagrywanie działa też przy zgaszonym ekranie i w tle. W przeglądarce - zwykłe watchPosition.
// Proxy wtyczki natywnej. Capacitor 8: registerPlugin pochodzi z dołączonego capacitor.js
// (natywny most już go nie daje); zapamiętujemy, bo drugie registerPlugin tej samej nazwy ostrzega.
const capPlugins = {};
function capPlugin(name) {
  if (!capPlugins[name]) {
    const cap = window.Capacitor || {};
    if (typeof cap.registerPlugin === "function") capPlugins[name] = cap.registerPlugin(name);
    else if (cap.Plugins && cap.Plugins[name]) capPlugins[name] = cap.Plugins[name];
    else throw Object.assign(new Error("Capacitor plugin " + name + " unavailable"), { code: "NO_BRIDGE" });
  }
  return capPlugins[name];
}

// --- Aktualizacje apki natywnej ze Sklepu Play (wtyczka @capawesome/capacitor-app-update) ---
// Przy starcie i powrocie do apki (najwyżej co 6 godzin) pytamy Sklep Play o nową wersję.
// Pasek nie pojawia się w trakcie nagrywania; „✕” chowa go do następnego uruchomienia.
const UPDATE_AVAILABLE = 2;      // AppUpdateAvailability.UPDATE_AVAILABLE
let updateCheckedAt = 0;
let updateDismissed = false;

async function checkNativeUpdate() {
  if (!isNativeApp() || updateDismissed || Date.now() - updateCheckedAt < 6 * 3600 * 1000) return;
  updateCheckedAt = Date.now();
  try {
    const info = await capPlugin("AppUpdate").getAppUpdateInfo();
    const available = info && info.updateAvailability === UPDATE_AVAILABLE;
    document.getElementById("updateBanner").hidden = !available || Boolean(rec);
  } catch (e) {
    // np. apka zainstalowana spoza Sklepu Play albo brak internetu - bez komunikatu
    updateCheckedAt = 0;
  }
}

async function startNativeUpdate() {
  document.getElementById("updateBanner").hidden = true;
  const plugin = capPlugin("AppUpdate");
  try {
    const info = await plugin.getAppUpdateInfo();
    // Pełnoekranowe okno Google: pobiera, instaluje i uruchamia apkę ponownie.
    if (info && info.immediateUpdateAllowed) {
      await plugin.performImmediateUpdate();
      return;
    }
  } catch (e) { /* niżej: Sklep Play */ }
  try { await plugin.openAppStore(); } catch (e) { /* brak Sklepu Play */ }
}

function initNativeUpdates() {
  if (!isNativeApp()) return;
  document.getElementById("updateNowBtn").addEventListener("click", startNativeUpdate);
  document.getElementById("updateLaterBtn").addEventListener("click", () => {
    updateDismissed = true;
    document.getElementById("updateBanner").hidden = true;
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") checkNativeUpdate();
  });
  checkNativeUpdate();
}

function isNativeApp() {
  return Boolean(window.Capacitor && typeof window.Capacitor.isNativePlatform === "function" && window.Capacitor.isNativePlatform());
}

let nativeGeo = null;
let recNativeWatch = null; // Promise z id watchera wtyczki

function getNativeGeo() {
  if (!nativeGeo && isNativeApp()) nativeGeo = capPlugin("BackgroundGeolocation");
  return nativeGeo;
}

// Wywołanie wtyczki z limitem czasu - zawieszone wywołanie nie może zablokować nagrywania.
function recWithTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(Object.assign(new Error(label + " timeout"), { code: "TIMEOUT" })), ms)),
  ]);
}

// Diagnostyka natywnej apki: szara linijka pod statusem (ostatnie kroki: zgoda, watcher, odczyty).
const recDiagLog = [];
// Linijka jest ukryta; pokazuje się dopiero po błędzie (isError), razem z ostatnimi krokami.
function recDiag(msg, isError) {
  if (!isNativeApp()) return;
  const time = new Date().toTimeString().slice(0, 8);
  recDiagLog.push(time + " " + msg);
  while (recDiagLog.length > 4) recDiagLog.shift();
  const el = document.getElementById("recDiag");
  if (!el) return;
  if (isError) el.hidden = false;
  el.textContent = recDiagLog.join(" · ");
}
function recErrText(e) {
  return ((e && e.code) || "") + " " + ((e && e.message) || String(e)).slice(0, 60);
}

// Android 13+: bez zgody na powiadomienia powiadomienie „Nagrywanie trasy” jest niewidoczne
// (GPS działa, ale użytkownik nie widzi, że nagrywanie trwa). Pytamy raz, przy pierwszym starcie nagrywania.
async function recEnsureNotificationPermission() {
  try {
    const notif = capPlugin("LocalNotifications");
    const status = await recWithTimeout(notif.checkPermissions(), 5000, "notif.check");
    if (status && status.display === "prompt") await recWithTimeout(notif.requestPermissions(), 60000, "notif.req");
  } catch (e) {
    console.warn("Notification permission", e);
    recDiag("notif: " + recErrText(e), true);
  }
}

// Problem ze zgodą/lokalizacją: komunikat + (opcjonalnie) przycisk do ustawień aplikacji.
// Po powrocie z ustawień (visibilitychange) recRetryNativeWatch() próbuje jeszcze raz.
// action: "settings" (ustawienia aplikacji - zgoda) albo "location" (systemowe okienko „Włączyć lokalizację?”).
// Klikalny jest przycisk pod komunikatem i sam czerwony komunikat.
let recPermAction = null;
function recShowPermProblem(text, action) {
  if (action === "location" && isIOSApp()) action = null; // iOS: brak okienka „Włączyć lokalizację?” - tylko instrukcja
  recSetStatus(text, true);
  recPermAction = action || null;
  const btn = document.getElementById("recSettingsBtn");
  const status = document.getElementById("recStatus");
  if (btn) {
    btn.hidden = !action;
    if (action) btn.textContent = action === "location" ? t().recEnableLocation : t().recOpenSettings;
  }
  if (status) status.classList.toggle("rec-clickable", Boolean(action));
}

function recHideSettingsBtn() {
  recPermAction = null;
  const btn = document.getElementById("recSettingsBtn");
  if (btn) btn.hidden = true;
  const status = document.getElementById("recStatus");
  if (status) status.classList.remove("rec-clickable");
}

// Klik w komunikat/przycisk problemu z lokalizacją.
async function recOnPermAction() {
  if (recPermAction === "settings") {
    try { getNativeGeo().openSettings(); } catch (e) { console.warn("openSettings", e); }
    return;
  }
  if (recPermAction !== "location") return;
  // getCurrentPosition wtyczki Geolocation przy wyłączonej lokalizacji pokazuje systemowe
  // okienko Google „Włączyć lokalizację?” (OK = włącza bez wychodzenia z aplikacji).
  try {
    await recWithTimeout(capPlugin("Geolocation").getCurrentPosition({ enableHighAccuracy: true, timeout: 15000 }), 60000, "geo.enable");
    recDiag("enable: ok");
  } catch (e) {
    console.warn("enable location", e);
    recDiag("enable: " + recErrText(e), true);
    const code = (e && e.code) || "";
    if (code === "OS-PLUG-GLOC-0009") return; // użytkownik kliknął „Nie” - komunikat zostaje
    if (code === "OS-PLUG-GLOC-0010" || code === "OS-PLUG-GLOC-0002") { /* włączona, tylko brak fixa - OK */ }
    else if (recIsLocationOffError(e) || /SETTINGS|SERVICES/i.test(e && e.message || "")) {
      recSetStatus(t().recLocationOffManual, true); // okienko niedostępne - tylko ręcznie z paska
      return;
    }
  }
  recHideSettingsBtn();
  recSetStatus(t().recWaitingGps);
  clearTimeout(recRetryTimer);
  recRetryNativeWatch();
}

// Najpierw jawnie pytamy o lokalizację (wtyczka Geolocation zwraca, czy zgoda jest dokładna
// czy tylko przybliżona). Wcześniej prośba szła dopiero z wtyczki tła, zaraz po prośbie
// o powiadomienia, i potrafiła przepaść bez śladu - apka czekała na GPS bez zgody.
// ask=false: tylko sprawdź (ponowienia w tle - bez natrętnego pytania o zgodę co kilka sekund).
async function recEnsureLocationPermission(ask = true) {
  const dict = t();
  let st;
  try {
    const geo = capPlugin("Geolocation");
    st = await recWithTimeout(geo.checkPermissions(), 5000, "geo.check");
    recDiag("check: " + (st && st.location) + "/" + (st && st.coarseLocation));
    if (ask && st.location !== "granted") {
      st = await recWithTimeout(geo.requestPermissions({ permissions: ["location", "coarseLocation"] }), 60000, "geo.req");
      recDiag("req: " + (st && st.location) + "/" + (st && st.coarseLocation));
    }
  } catch (e) {
    console.warn("Location permission", e);
    recDiag("check: " + recErrText(e), true);
    const code = (e && e.code) || "";
    if (recIsLocationOffError(e)) { // usługi lokalizacji w telefonie wyłączone
      recShowPermProblem(dict.recLocationOff, "location");
      return false;
    }
    // Inny błąd wtyczki (albo jej brak) - nie zgadujemy; zgodę obsłuży wtyczka tła, a kod błędu
    // zostaje w statusie do diagnozy, dopóki nie przyjdzie pierwszy odczyt GPS.
    recPermDiag = code === "UNIMPLEMENTED" ? "" : " [" + (code || (e && e.message) || "?") + "]";
    return true;
  }
  if (st && st.location === "granted") {
    recHideSettingsBtn();
    return true;
  }
  recShowPermProblem(st && st.coarseLocation === "granted" ? dict.recApproxOnly : dict.recNoLocationPerm, "settings");
  return false;
}

let recPermChecking = false;

function recIsLocationOffError(e) {
  return Boolean(e) && (e.code === "OS-PLUG-GLOC-0007" || /not enabled|disabled/i.test(e.message || ""));
}

// Gdy watcher działa, ale od 10 s nie ma odczytu: sprawdź, czy ktoś nie wyłączył lokalizacji
// w trakcie (wtedy wtyczka tła nie zgłasza błędu, tylko milknie - apka „szukała sygnału” bez końca).
let recHealthTimer = null;
let recLocOffShown = false;
async function recNativeHealthCheck() {
  if (!rec || rec.pausedAt || recWatchId !== "native" || !recNativeWatch || recPermChecking) return;
  if (recLastFixAt && Date.now() - recLastFixAt < 10000) return;
  try {
    await recWithTimeout(capPlugin("Geolocation").checkPermissions(), 5000, "geo.health");
    if (recLocOffShown) { recLocOffShown = false; recHideSettingsBtn(); recSetStatus(t().recWaitingGps); }
  } catch (e) {
    recDiag("health: " + recErrText(e), true);
    if (recIsLocationOffError(e)) {
      recLocOffShown = true;
      recShowPermProblem(t().recLocationOff, "location");
    }
  }
}

let recRetryTimer = null;
let recPermDiag = ""; // kod nieoczekiwanego błędu wtyczki Geolocation - do diagnozy w statusie

async function recStartNativeWatch(ask = true) {
  const dict = t();
  recWatchId = "native";
  if (recPermChecking) return;
  recPermChecking = true;
  let ok = false;
  try {
    ok = await recEnsureLocationPermission(ask);
    if (ok) await recEnsureNotificationPermission();
  } finally {
    recPermChecking = false;
  }
  recDiag("perm ok=" + ok);
  if (!ok) {
    // Czekamy, aż użytkownik włączy lokalizację/zgodę. Rozwinięcie górnego paska nie zmienia
    // widoczności strony, więc oprócz visibilitychange sprawdzamy co 3 s (bez pytania o zgodę).
    clearTimeout(recRetryTimer);
    recRetryTimer = setTimeout(recRetryNativeWatch, 3000);
    return;
  }
  if (recWatchId !== "native" || recNativeWatch) return; // nagrywanie zatrzymane w trakcie pytania o zgodę
  if (rec && !rec.pausedAt) recSetStatus(dict.recWaitingGps + recPermDiag);
  clearInterval(recHealthTimer);
  recHealthTimer = setInterval(recNativeHealthCheck, 5000);
  const watch = getNativeGeo().addWatcher({
    backgroundTitle: dict.recNotifTitle,
    backgroundMessage: dict.recNotifText,
    requestPermissions: true,
    stale: false,
    distanceFilter: 0,
  }, (location, error) => {
    if (error) {
      recDiag("watch: " + recErrText(error), true);
      if (recNativeWatch === watch) recNativeWatch = null; // pozwól ponowić po powrocie z ustawień
      if (recIsLocationOffError(error)) { // wtyczka tła: „Location services disabled.”
        recShowPermProblem(dict.recLocationOff, "location");
        clearTimeout(recRetryTimer);
        recRetryTimer = setTimeout(recRetryNativeWatch, 3000);
      } else if (error.code === "NOT_AUTHORIZED") {
        recEnsureLocationPermission(false).then((ok) => { // pokaże właściwy komunikat (brak zgody / przybliżona / wyłączona)
          if (ok) recShowPermProblem(dict.recNoLocationPerm, "settings"); // wtyczka tła i tak odmawia
          clearTimeout(recRetryTimer);
          recRetryTimer = setTimeout(recRetryNativeWatch, 3000);
        });
      } else {
        recSetStatus(dict.recUnavailable, true);
      }
      return;
    }
    recHideSettingsBtn();
    recLocOffShown = false;
    if (!location) return;
    if (!recLastFixAt || Date.now() - recLastFixAt > 10000) recDiag("fix ±" + Math.round(location.accuracy) + " m");
    recOnPosition({
      coords: { latitude: location.latitude, longitude: location.longitude, accuracy: location.accuracy, altitude: location.altitude },
      timestamp: location.time || Date.now(),
    });
  });
  recNativeWatch = watch;
  recDiag("watch: start");
  watch.then((id) => recDiag("watch: id " + id)).catch((e) => {
    recDiag("watch: " + recErrText(e), true);
    if (recNativeWatch === watch) recNativeWatch = null;
  });
}

// Wywoływane po powrocie do aplikacji (np. z ustawień): jeśli nagrywamy, a watcher nie działa - ponów.
function recRetryNativeWatch() {
  if (!rec || rec.pausedAt || recWatchId !== "native" || recNativeWatch || recPermChecking) return;
  recStartNativeWatch(false);
}

function recStartWatching() {
  if (recWatchId != null) return;
  if (isNativeApp()) {
    recStartNativeWatch();
    if (!recTimer) recTimer = setInterval(recRender, 1000);
    return;
  }
  recWatchId = navigator.geolocation.watchPosition(recOnPosition, recOnError, {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 30000,
  });
  if (!recTimer) recTimer = setInterval(recRender, 1000);
}

function recStopWatching() {
  if (recWatchId === "native") {
    const watch = recNativeWatch;
    recNativeWatch = null;
    if (watch) watch.then((id) => getNativeGeo().removeWatcher({ id })).catch(() => {});
  } else if (recWatchId != null) navigator.geolocation.clearWatch(recWatchId);
  recWatchId = null;
  clearTimeout(recRetryTimer);
  clearInterval(recHealthTimer);
  recLocOffShown = false;
  const diagEl = document.getElementById("recDiag");
  if (diagEl) diagEl.hidden = true;
  recDiagLog.length = 0;
  recHideSettingsBtn();
  clearInterval(recTimer);
  recTimer = null;
}

// --- Prowadzenie po trasie (nawigacja) podczas nagrywania telefonem ---
// Trasa (zapisana w Trasach albo z pliku GPX/TCX/FIT) jest na mapie; liczymy km do końca
// i ostrzegamy wibracją (+ powiadomieniem w apce natywnej przy zgaszonym ekranie), gdy zboczysz.
// Przy słabym GPS ostrzeżenia są wstrzymane - żeby nie było fałszywych alarmów.
// Komunikaty idą przez navAlert() - tam można później dodać głos (z wyłącznikiem).
const NAV_MAX_POINTS = 2000;
const NAV_OFF_M = { Rower: 60, Kajak: 100, WodyOtwarte: 100, Auto4x4: 80 }; // pozostałe: NAV_OFF_DEFAULT_M
const NAV_OFF_DEFAULT_M = 50;
const NAV_GOOD_ACC_M = 25;     // tylko przy takiej dokładności oceniamy zboczenie
const NAV_NO_FIX_MS = 15000;   // tyle bez dobrego odczytu = „brak sygnału GPS”
const NAV_REPEAT_MS = 60000;   // przypomnienie, gdy nadal poza trasą
const NAV_NOTIF_ID = 7301;
let navSelected = "";          // "" | "r:<indeks zapisanej trasy>" | "file"
let navFileRoute = null;       // { name, track } - trasa wczytana z pliku przed START (bez zapisu w Trasach)
let navLine = null;
let navStartMarker = null;
let navEndMarker = null;
let navCum = null;             // skumulowane km dla rec.nav.pts
let navCumFor = null;
let navRt = {};                // stan bieżący (nie zapisywany - po wznowieniu liczony od nowa)

function navReset() {
  navRt = { idx: 0, progressKm: null, offM: null, off: false, offCount: 0, lastAlertAt: 0, lastGoodFixAt: 0, since: Date.now(), finished: false, poiSaid: {} };
  navCum = null;
  navCumFor = null;
}
navReset();

function navOffLimit() {
  return (rec && NAV_OFF_M[rec.disc]) || NAV_OFF_DEFAULT_M;
}

// Upraszcza trasę do NAV_MAX_POINTS punktów (Douglas-Peucker z rosnącą tolerancją).
function navSimplify(track) {
  let out = track;
  let tol = 0.00001; // ok. 1 m
  while (out.length > NAV_MAX_POINTS && tol < 0.01) {
    out = simplifyTrack(track, tol);
    tol *= 2;
  }
  return out.length > NAV_MAX_POINTS ? downsampleRoute(out, NAV_MAX_POINTS) : out;
}

function plannedRouteTrack(route) {
  const track = [];
  (route.segments || []).forEach((seg, i) => track.push(...(i === 0 ? seg : seg.slice(1))));
  if (track.length < 2 && route.waypoints && route.waypoints.length >= 2) return route.waypoints.slice();
  return track;
}

function navMake(name, track, pois) {
  if (!track || track.length < 2) return null;
  const pts = navSimplify(track).map((p) => [+p.lat.toFixed(6), +p.lon.toFixed(6)]);
  const nav = { name: String(name || "").slice(0, 60), pts, totalKm: trackDistanceKm(pts.map(([lat, lon]) => ({ lat, lon }))) };
  const navPois = navPoisFor(pts, pois);
  if (navPois && navPois.length) nav.pois = navPois;
  return nav;
}

function navBuildSelected() {
  if (navSelected === "file" && navFileRoute) return navMake(navFileRoute.name, navFileRoute.track, navFileRoute.pois);
  if (navSelected.startsWith("r:")) {
    const route = getPlannedRoutes()[parseInt(navSelected.slice(2), 10)];
    if (route) return navMake(route.name, plannedRouteTrack(route), route.pois);
  }
  return null;
}

function navRefreshSelect() {
  const select = document.getElementById("recNavRoute");
  if (!select) return;
  const dict = t();
  const routes = getPlannedRoutes();
  if (navSelected.startsWith("r:") && !routes[parseInt(navSelected.slice(2), 10)]) navSelected = "";
  if (navSelected === "file" && !navFileRoute) navSelected = "";
  const opts = [`<option value="">${escapeXml(dict.navNone)}</option>`];
  routes.forEach((r, i) => opts.push(`<option value="r:${i}">🗺 ${escapeXml(r.name)} — ${escapeXml(r.distKm)} km</option>`));
  if (navFileRoute) opts.push(`<option value="file">${escapeXml(dict.navFileOpt(navFileRoute.name, trackDistanceKm(navFileRoute.track).toFixed(2)))}</option>`);
  select.innerHTML = opts.join("");
  select.value = navSelected;
}

// Odczyt pliku z trasą: GPX (trkpt albo rtept - trasy z planerów), TCX (Trackpoint), FIT (rekordy).
function navParseFile(buf, fileName) {
  const fallbackName = String(fileName || "").replace(/\.[^.]+$/, "") || t().defaultRouteName;
  let track = [];
  let name = "";
  let pois = [];
  if (isFitFile(buf)) {
    const parsed = parseFit(buf);
    track = parsed.routeFull || parsed.route || [];
  } else {
    const text = new TextDecoder("utf-8").decode(buf);
    const xml = new DOMParser().parseFromString(text, "application/xml");
    if (xml.getElementsByTagName("parsererror").length > 0) throw new Error(t().errBadXml);
    const fromPts = (tag) => Array.from(xml.getElementsByTagName(tag)).map((pt) => {
      const lat = parseFloat(pt.getAttribute("lat"));
      const lon = parseFloat(pt.getAttribute("lon"));
      const eleEl = pt.getElementsByTagName("ele")[0];
      const ele = eleEl ? parseFloat(eleEl.textContent) : NaN;
      return Number.isFinite(ele) ? { lat, lon, ele } : { lat, lon };
    });
    track = fromPts("trkpt");
    if (track.length < 2) track = fromPts("rtept");
    if (track.length < 2) {
      track = Array.from(xml.getElementsByTagName("Trackpoint")).map((tp) => {
        const lat = tp.getElementsByTagName("LatitudeDegrees")[0];
        const lon = tp.getElementsByTagName("LongitudeDegrees")[0];
        if (!lat || !lon) return null;
        const altEl = tp.getElementsByTagName("AltitudeMeters")[0];
        const ele = altEl ? parseFloat(altEl.textContent) : NaN;
        const p = { lat: parseFloat(lat.textContent), lon: parseFloat(lon.textContent) };
        if (Number.isFinite(ele)) p.ele = ele;
        return p;
      }).filter(Boolean);
    }
    const nameEl = ["trk", "rte", "metadata"].map((tag) => {
      const parent = xml.getElementsByTagName(tag)[0];
      return parent ? Array.from(parent.children).find((el) => el.localName === "name") : null;
    }).find(Boolean) || (xml.getElementsByTagName("Course")[0] ? Array.from(xml.getElementsByTagName("Course")[0].children).find((el) => el.localName === "Name") : null);
    name = nameEl ? nameEl.textContent.trim() : "";
    pois = parseGpxPois(xml);
  }
  track = track.filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lon) && Math.abs(p.lat) <= 90 && Math.abs(p.lon) <= 180);
  if (track.length < 2) throw new Error(t().navNoPoints);
  return { name: (name || fallbackName).slice(0, 60), track, pois };
}

function readFileBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || new Error("read"));
    reader.readAsArrayBuffer(file);
  });
}

// Trasa treningu (z zegarka albo nagrana) zapisana w zakładce Trasy - wtedy 🧭 prowadzenie i 📤 udostępnianie.
function entryRouteName(entry) {
  return `${t().discNames[entry.disc] || entry.disc} ${entry.date} (${entry.dist} km)`;
}

function saveEntryRouteToRoutes(entry) {
  if (!entry.route || entry.route.length < 2) return null;
  const def = entryRouteName(entry);
  const name = prompt(t().promptRouteName, def);
  if (name === null) return null;
  const index = saveImportedRoute(name.trim() || def, entry.route);
  refreshSavedRoutesList();
  return getPlannedRoutes()[index].name;
}

function historyRouteToRoutes(index) {
  const history = getHistory();
  const entry = history[index];
  if (!entry || !entry.route) return;
  if (entry.routeSaved && !confirm(t().toRoutesAgain)) return;
  const name = saveEntryRouteToRoutes(entry);
  if (!name) return;
  entry.routeSaved = true;
  saveHistory(history);
  refreshHistoryList();
  alert(t().toRoutesSaved(name));
}

// Trasa z pliku zapisana jako zwykła zapisana trasa (Trasy): GPX do zegarka, udostępnianie i 🧭 działają tak samo.
function saveImportedRoute(name, track, pois) {
  const pts = navSimplify(track).map((p) => (Number.isFinite(p.ele)
    ? { lat: +p.lat.toFixed(6), lon: +p.lon.toFixed(6), ele: Math.round(p.ele) }
    : { lat: +p.lat.toFixed(6), lon: +p.lon.toFixed(6) }));
  const routes = getPlannedRoutes();
  routes.push({
    name: name || t().defaultRouteName,
    created: toYmd(new Date()),
    mode: "straight",
    distKm: trackDistanceKm(pts).toFixed(2),
    waypoints: [pts[0], pts[pts.length - 1]],
    segments: [pts],
    imported: true,
  });
  if (pois && pois.length) routes[routes.length - 1].pois = pois.slice();
  savePlannedRoutes(routes);
  return routes.length - 1;
}

async function importRouteFile(file) {
  const dict = t();
  try {
    const parsed = navParseFile(await readFileBuffer(file), file.name);
    const name = prompt(dict.promptRouteName, parsed.name);
    if (name === null) return;
    const index = saveImportedRoute(name.trim() || parsed.name, parsed.track, parsed.pois);
    refreshSavedRoutesList();
    try { loadPlannedRoute(index); } catch (e) { console.warn("Podgląd trasy", e); } // trasa jest już zapisana
    const route = getPlannedRoutes()[index];
    alert(dict.routeImported(route.name, route.distKm));
  } catch (e) {
    alert(dict.navLoadError(e.message));
  }
}

// Wczytanie pliku z pola „Prowadź po trasie” przed START.
async function navLoadFileForRecording(file) {
  const dict = t();
  try {
    const parsed = navParseFile(await readFileBuffer(file), file.name);
    if (confirm(dict.navSaveToRoutes(parsed.name))) {
      const index = saveImportedRoute(parsed.name, parsed.track, parsed.pois);
      navSelected = "r:" + index;
      refreshSavedRoutesList();
    } else {
      navFileRoute = parsed;
      navSelected = "file";
      navRefreshSelect();
    }
  } catch (e) {
    alert(dict.navLoadError(e.message));
    navRefreshSelect();
  }
}

function navStartFromRoute(index) {
  if (rec) { alert(t().navBusy); return; }
  navSelected = "r:" + index;
  navRefreshSelect();
  showTab("train");
  if (trainMode !== "phone") setTrainMode("phone");
  const card = document.getElementById("recCard");
  if (card && card.scrollIntoView) card.scrollIntoView({ block: "start", behavior: "smooth" });
}

function navCumulative() {
  if (navCumFor === rec.nav && navCum) return navCum;
  const pts = rec.nav.pts;
  navCum = [0];
  for (let i = 1; i < pts.length; i++) navCum.push(navCum[i - 1] + haversineKm(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1]));
  navCumFor = rec.nav;
  return navCum;
}

// Najbliższy punkt trasy: najpierw okno wokół ostatniej pozycji (trasy tam i z powrotem / pętle),
// a gdy w oknie nic blisko - cała trasa. Zwraca { i, d (m), km (przebyte wzdłuż trasy) }.
function navLocate(lat, lon) {
  const pts = rec.nav.pts;
  const cum = navCumulative();
  const kx = 111320 * Math.cos(lat * Math.PI / 180);
  const ky = 110540;
  const scan = (from, to) => {
    let best = { i: from, d: Infinity, km: 0 };
    for (let i = from; i <= to && i < pts.length - 1; i++) {
      const ax = (pts[i][1] - lon) * kx, ay = (pts[i][0] - lat) * ky;
      const bx = (pts[i + 1][1] - lon) * kx, by = (pts[i + 1][0] - lat) * ky;
      const dx = bx - ax, dy = by - ay;
      const len2 = dx * dx + dy * dy;
      let u = len2 ? -(ax * dx + ay * dy) / len2 : 0;
      u = Math.max(0, Math.min(1, u));
      const ex = ax + u * dx, ey = ay + u * dy;
      const d = Math.sqrt(ex * ex + ey * ey);
      if (d < best.d) best = { i, d, km: cum[i] + u * (cum[i + 1] - cum[i]) };
    }
    return best;
  };
  let best = scan(Math.max(0, navRt.idx - 30), navRt.idx + 300);
  if (best.d > 150) {
    const all = scan(0, pts.length - 2);
    if (all.d < best.d - 20) best = all;
  }
  return best;
}

function navOnFix(lat, lon, accuracy) {
  if (!rec || !rec.nav || rec.pausedAt) return;
  const now = Date.now();
  const loc = navLocate(lat, lon);
  navRt.idx = loc.i;
  navRt.progressKm = loc.km;
  navRt.offM = loc.d;
  if (accuracy > NAV_GOOD_ACC_M) return; // za słaby GPS, żeby oceniać zboczenie
  navRt.lastGoodFixAt = now;
  const limit = navOffLimit();
  navRt.offCount = loc.d > limit ? navRt.offCount + 1 : 0;
  if (!navRt.off && navRt.offCount >= 2) {
    navRt.off = true;
    navAlert("off", loc.d);
  } else if (navRt.off && loc.d < limit * 0.6) {
    navRt.off = false;
    navAlert("back");
  } else if (navRt.off && now - navRt.lastAlertAt > NAV_REPEAT_MS) {
    navAlert("off", loc.d);
  }
  if (!navRt.off) navCheckPoi();
  const total = rec.nav.totalKm;
  if (!navRt.finished && !navRt.off && total - loc.km < 0.1 && rec.distKm >= total * 0.5) {
    navRt.finished = true;
    navAlert("finish");
  }
}

function navAlert(kind, meters) {
  const dict = t();
  navRt.lastAlertAt = Date.now();
  const text = kind === "off" ? dict.navOff(Math.round(meters)) : kind === "back" ? dict.navBack : dict.navFinished;
  const pattern = kind === "off" ? [400, 200, 400, 200, 400] : kind === "back" ? [150] : [200, 100, 200, 100, 600];
  navVibrate(pattern);
  if (isNativeApp() && document.visibilityState === "hidden") navNotify(text);
  navSpeak(kind === "off" ? dict.navSayOff(Math.round(meters)) : kind === "back" ? dict.navSayBack : dict.navSayFinish);
}

// Odmiana polska: 1 metr, 2-4 metry, 5+ metrów; ułamki ("16,7") -> "kilometra".
function plUnit(n, one, few, many) {
  const s = String(n);
  if (/[.,]/.test(s)) return one === "kilometr" ? "kilometra" : many;
  const v = Math.abs(parseInt(s, 10));
  if (v === 1) return one;
  const d = v % 10, h = v % 100;
  return d >= 2 && d <= 4 && (h < 12 || h > 14) ? few : many;
}

// Wibracja: w apce natywnej przez wtyczkę Haptics (Android Vibrator) - działa też przy zgaszonym
// ekranie, bo nagrywanie trzyma usługę pierwszego planu; navigator.vibrate w WebView jest wtedy ignorowane.
// Wzór [wibracja, przerwa, wibracja, ...] w ms jak w navigator.vibrate.
function navVibrate(pattern) {
  if (isNativeApp()) {
    try {
      const haptics = capPlugin("Haptics");
      let at = 0;
      pattern.forEach((ms, i) => {
        if (i % 2 === 0) {
          const d = ms;
          if (at === 0) haptics.vibrate({ duration: d }).catch(() => {});
          else setTimeout(() => haptics.vibrate({ duration: d }).catch(() => {}), at);
        }
        at += ms;
      });
      return;
    } catch (e) { /* brak wtyczki - spróbuj wibracji przeglądarki */ }
  }
  try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (e) { /* brak wibracji */ }
}

// ---- Głos (synteza mowy) - z wyłącznikiem, zapamiętywanym w localStorage ----
const NAV_VOICE_KEY = "pau_nav_voice";
function navVoiceOn() {
  try { return localStorage.getItem(NAV_VOICE_KEY) !== "0"; } catch (e) { return true; }
}
function navSetVoice(on) {
  try { localStorage.setItem(NAV_VOICE_KEY, on ? "1" : "0"); } catch (e) { /* brak storage */ }
  const box = document.getElementById("navVoice");
  if (box) box.checked = on;
  navRenderVoiceBtn();
  if (on) navSpeak(t().navSayOn);
  else navStopSpeech();
}
function navSpeechLang() {
  return getLang() === "en" ? "en-GB" : "pl-PL";
}
// Liczby czytane po polsku z przecinkiem (16,7), po angielsku z kropką.
function navSayKm(km) {
  const s = (Math.round(km * 10) / 10).toFixed(1).replace(/\.0$/, "");
  return getLang() === "en" ? s : s.replace(".", ",");
}
function navWebSpeak(text) {
  try {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = navSpeechLang();
    window.speechSynthesis.speak(u);
  } catch (e) { /* brak syntezy mowy */ }
}
function navSpeak(text) {
  if (!text || !navVoiceOn()) return;
  if (isNativeApp()) {
    try {
      // queueStrategy 0 = przerwij poprzedni komunikat
      capPlugin("TextToSpeech").speak({ text, lang: navSpeechLang(), rate: 1.0, queueStrategy: 0 })
        .catch(() => navWebSpeak(text));
      return;
    } catch (e) { /* brak wtyczki - spróbuj mowy przeglądarki */ }
  }
  navWebSpeak(text);
}
// Kilka komunikatów po kolei: navSpeak przerywa poprzedni, więc kolejny dopiero po przybliżonym czasie czytania.
function navSpeakQueue(texts) {
  let delay = 0;
  texts.forEach((text) => {
    if (delay) setTimeout(() => navSpeak(text), delay); else navSpeak(text);
    delay += 1500 + text.length * 70;
  });
}

function navStopSpeech() {
  if (isNativeApp()) {
    try { capPlugin("TextToSpeech").stop().catch(() => {}); } catch (e) { /* brak wtyczki */ }
  }
  try { if ("speechSynthesis" in window) window.speechSynthesis.cancel(); } catch (e) { /* brak */ }
}
function navRenderVoiceBtn() {
  const btn = document.getElementById("recNavVoiceBtn");
  if (!btn) return;
  const on = navVoiceOn();
  btn.textContent = on ? "🔊" : "🔇";
  btn.title = on ? t().navVoiceOnTitle : t().navVoiceOffTitle;
  btn.setAttribute("aria-label", btn.title);
  btn.setAttribute("aria-pressed", on ? "true" : "false");
}

// Przy zgaszonym ekranie WebView ignoruje navigator.vibrate - wibrację daje powiadomienie
// na osobnym kanale z wibracją (ważność wysoka). Ustawień kanału nie da się zmienić po utworzeniu,
// więc przy zmianie parametrów trzeba nadać nowe id.
const NAV_CHANNEL_ID = "pau_nav_alerts";
let navChannelReady = null;
function navEnsureChannel() {
  if (!navChannelReady) {
    navChannelReady = capPlugin("LocalNotifications").createChannel({
      id: NAV_CHANNEL_ID,
      name: t().navChannelName,
      description: t().navChannelDesc,
      importance: 4,
      visibility: 1,
      vibration: true,
    }).catch(() => {});
  }
  return navChannelReady;
}
function navNotify(text) {
  try {
    navEnsureChannel().then(() => capPlugin("LocalNotifications").schedule({
      notifications: [{ id: NAV_NOTIF_ID, title: t().navNotifTitle, body: text, channelId: NAV_CHANNEL_ID }],
    })).catch(() => {});
  } catch (e) { /* brak wtyczki */ }
}

function navDraw() {
  if (!navLine) return;
  const pts = rec && rec.nav ? rec.nav.pts : [];
  navLine.setLatLngs(pts);
  [navStartMarker, navEndMarker].forEach((m) => { if (recMap.hasLayer(m)) m.remove(); });
  if (pts.length >= 2) {
    navStartMarker.setLatLng(pts[0]).addTo(recMap);
    navEndMarker.setLatLng(pts[pts.length - 1]).addTo(recMap);
  }
  recDrawPois();
}

function navRender() {
  const box = document.getElementById("recNav");
  if (!box) return;
  if (!rec || !rec.nav) { box.hidden = true; return; }
  const dict = t();
  box.hidden = false;
  document.getElementById("recNavName").textContent = `🧭 ${rec.nav.name}`;
  navRenderVoiceBtn();
  const left = navRt.progressKm == null ? rec.nav.totalKm : Math.max(0, rec.nav.totalKm - navRt.progressKm);
  document.getElementById("recNavLeft").textContent = dict.navLeft(formatKm(left));
  let status;
  let cls = "";
  const now = Date.now();
  const noFix = now - (navRt.lastGoodFixAt || navRt.since) > NAV_NO_FIX_MS;
  if (rec.pausedAt) status = dict.navPaused;
  else if (navRt.finished) status = dict.navFinished;
  else if (noFix) {
    status = !navRt.lastGoodFixAt && now - navRt.since < NAV_NO_FIX_MS * 2 ? dict.navWaiting : dict.navNoGps;
    cls = "nav-gps";
  } else if (navRt.off) { status = dict.navOff(Math.round(navRt.offM)); cls = "nav-off"; }
  else if (navRt.progressKm != null) status = dict.navOn;
  else status = dict.navWaiting;
  document.getElementById("recNavStatus").textContent = status;
  const nextEl = document.getElementById("recNavNext");
  const next = navNextPoi();
  nextEl.hidden = !next;
  if (next) nextEl.textContent = dict.navNextPoi(`${POI_ICONS[next.type] || POI_ICONS.other} ${next.name || poiLabel(next.type)}`, formatKm(next.km - navRt.progressKm));
  box.classList.toggle("nav-off", cls === "nav-off");
  box.classList.toggle("nav-gps", cls === "nav-gps");
}

function initNavigation() {
  const select = document.getElementById("recNavRoute");
  const fileInput = document.getElementById("navFile");
  // Osobny przycisk zamiast pozycji „Wczytaj z pliku…” w liście: na iPhonie wybór z <select> nie liczy się
  // jako stuknięcie, więc iOS nie otwierał okna wyboru pliku. Klik w przycisk otwiera je wszędzie.
  select.addEventListener("change", () => { navSelected = select.value; });
  document.getElementById("navFileBtn").addEventListener("click", () => {
    fileInput.value = "";
    fileInput.click();
  });
  fileInput.addEventListener("change", () => {
    const file = fileInput.files && fileInput.files[0];
    if (file) navLoadFileForRecording(file);
  });
  const importInput = document.getElementById("routeImportFile");
  document.getElementById("routeImportBtn").addEventListener("click", () => { importInput.value = ""; importInput.click(); });
  importInput.addEventListener("change", () => {
    const file = importInput.files && importInput.files[0];
    if (file) importRouteFile(file);
  });
  const voiceBox = document.getElementById("navVoice");
  voiceBox.checked = navVoiceOn();
  voiceBox.addEventListener("change", () => navSetVoice(voiceBox.checked));
  document.getElementById("recNavVoiceBtn").addEventListener("click", () => navSetVoice(!navVoiceOn()));
  navRenderVoiceBtn();
  navRefreshSelect();
}


function startRecording() {
  if (!("geolocation" in navigator)) {
    alert(t().recNoGeo);
    return;
  }
  if (rec) return;
  rec = {
    disc: document.getElementById("recDisc").value,
    startedAt: Date.now(),
    pausedMs: 0,
    pausedAt: null,
    points: [],
    distKm: 0,
    gaps: 0,
    weightKg: parseBodyWeight(document.getElementById("recWeight").value),
    kcal: 0,
  };
  const nav = navBuildSelected();
  if (nav) rec.nav = nav;
  if (document.getElementById("recSaveRoute").checked) rec.saveRoute = true;
  if (getChallenge() && isChallengeDisc(rec.disc) && document.getElementById("recChallenge").checked) {
    rec.challenge = true;
    rec.challengeDate = toYmd(new Date(rec.startedAt));
  }
  recLiveSync = { km: 0, at: Date.now() };
  document.getElementById("recSaveRoute").checked = false;
  navReset();
  if (nav) navSpeak(t().navSayStart(navSayKm(nav.totalKm)));
  if (nav && isNativeApp()) { try { navEnsureChannel(); } catch (e) { /* brak wtyczki */ } }
  if (rec.weightKg) {
    try { localStorage.setItem(BODY_WEIGHT_KEY, String(rec.weightKg)); } catch (e) { /* brak dostępu */ }
  }
  recRejects = 0;
  recLastAccuracy = null;
  recSave(true);
  recRender();
  recSetStatus(t().recWaitingGps);
  recInitMap();
  recStartWatching();
  recRequestWakeLock();
  if (!("wakeLock" in navigator) && !isNativeApp()) recSetStatus(t().recNoWakeLock, true);
}

function toggleRecordingPause() {
  if (!rec) return;
  if (rec.pausedAt) {
    rec.pausedMs += Date.now() - rec.pausedAt;
    rec.pausedAt = null;
    rec.resumed = true;
    navRt.since = Date.now();
    recStartWatching();
    recRequestWakeLock();
    recSetStatus(t().recWaitingGps);
  } else {
    rec.pausedAt = Date.now();
    recReleaseWakeLock();
    recSetStatus(t().recPausedStatus);
  }
  recSave(true);
  recRender();
}

function recTrackForHistory() {
  const track = rec.points.map((p) => (p[2] == null ? { lat: p[0], lon: p[1] } : { lat: p[0], lon: p[1], ele: p[2] }));
  return downsampleRoute(simplifyTrack(track, 0.00002), 300);
}

function finishRecording() {
  if (!rec) return;
  const dict = t();
  if (!confirm(dict.recConfirmFinish)) return;
  if (rec.distKm < 0.05 || rec.points.length < 2) {
    if (!confirm(dict.recTooShort)) return;
    discardRecording(true);
    return;
  }
  if (rec.pausedAt) { rec.pausedMs += Date.now() - rec.pausedAt; rec.pausedAt = null; }
  const moving = recMovingMs();
  const finished = rec;

  document.getElementById("discipline").value = finished.disc;
  updateDisciplineUi();
  document.getElementById("date").value = toYmd(new Date(finished.startedAt));
  document.getElementById("dist").value = finished.distKm.toFixed(2);
  document.getElementById("time").value = (moving / 60000).toFixed(1);
  document.getElementById("steps").value = "";
  const kcal = finished.weightKg ? Math.round(finished.kcal || 0) : 0;
  const weightField = document.getElementById("weight");
  if (finished.weightKg && !parseBodyWeight(weightField.value)) weightField.value = String(finished.weightKg);
  const notes = document.getElementById("notes");
  if (!notes.value.trim()) notes.value = dict.recNote;
  if (kcal) notes.value += ` · ${dict.recKcalNote(kcal)}`;
  pendingRoute = recTrackForHistory();
  pendingRouteImported = false; // nagranie ma własny wybór „Zapisz przebytą trasę” przed START
  if (finished.challenge && getChallenge() && isChallengeDisc(finished.disc)) document.getElementById("challengeFlag").checked = true;
  recOfferSaveRoute(finished);
  clearFieldState("dist");
  clearFieldState("time");

  rec.challenge = false; // km na żywo zastąpi zapisany trening z 🏁 - bez cofania postępu w międzyczasie
  discardRecording(true);
  openTrainForm();
  showTrainHint(dict.recFinishedHint(finished.distKm.toFixed(2), formatClock(moving), kcal));
  focusField("dist");
}

function discardRecording(skipConfirm) {
  if (!rec) return;
  if (!skipConfirm && !confirm(t().recConfirmDiscard)) return;
  const wasLive = Boolean(rec.challenge);
  recStopWatching();
  recReleaseWakeLock();
  rec = null;
  recLastAccuracy = null;
  localStorage.removeItem(RECORDING_KEY);
  recRender();
  if (wasLive) scheduleChallengeSync(); // odrzucone nagranie - zdejmujemy km dopisane na żywo
}

// Aplikacja w tle -> przeglądarka zwykle wstrzymuje GPS. Po powrocie mówimy o tym wprost.
function recOnVisibilityChange() {
  if (!rec) return;
  if (document.visibilityState === "hidden") {
    recHiddenAt = Date.now();
    recHiddenMaxGap = 0;
    recSave(true);
    return;
  }
  if (!rec.pausedAt) recRequestWakeLock();
  if (isNativeApp()) recRetryNativeWatch();
  const now = Date.now();
  if (recHiddenAt && !rec.pausedAt && now - recHiddenAt > REC_GAP_S * 1000) {
    // Czy GPS odpowiadał, gdy ekran był zgaszony? Liczymy najdłuższą przerwę między odczytami.
    const gap = Math.max(recHiddenMaxGap, now - Math.max(recLastFixAt, recHiddenAt));
    const min = Math.round((now - recHiddenAt) / 60000);
    if (gap <= REC_GAP_S * 3 * 1000) recSetStatus(t().recBackgroundOk(min), false, 20000);
    else recSetStatus(t().recWasHidden(Math.round(gap / 60000)), true, 30000);
  }
  recHiddenAt = null;
  recHiddenMaxGap = 0;
  recRender();
}

// Po zamknięciu/odświeżeniu aplikacji wracamy do nagrania jako wstrzymanego,
// żeby czas, gdy aplikacja była zamknięta, nie liczył się jako ruch.
function restoreRecording() {
  const saved = recLoad();
  if (!saved) return;
  rec = saved;
  if (!rec.pausedAt) rec.pausedAt = saved.savedAt || Date.now();
  delete rec.savedAt;
  navReset();
  recSave(true);
  recRender();
  recSetStatus(t().recRestored, true);
}

// „🏁 Odcinek wyzwania” przed START - tylko uczestnik wyzwania i bieg/rower/kajak; pamiętamy ostatni wybór.
const REC_CHALLENGE_KEY = "pau_rec_challenge";
function updateRecChallengeRow() {
  const row = document.getElementById("recChallengeRow");
  if (!row) return;
  const show = Boolean(getChallenge()) && isChallengeDisc(document.getElementById("recDisc").value);
  row.style.display = show ? "flex" : "none";
  let pref = false;
  try { pref = localStorage.getItem(REC_CHALLENGE_KEY) === "1"; } catch (e) { /* brak dostępu */ }
  document.getElementById("recChallenge").checked = show && pref;
}

function initRecorder() {
  const select = document.getElementById("recDisc");
  const current = document.getElementById("discipline").value;
  if (REC_DISCIPLINES.includes(current)) select.value = current;
  select.addEventListener("change", updateRecChallengeRow);
  document.getElementById("recChallenge").addEventListener("change", (e) => {
    try { localStorage.setItem(REC_CHALLENGE_KEY, e.target.checked ? "1" : "0"); } catch (err) { /* brak dostępu */ }
  });
  updateRecChallengeRow();
  const savedWeight = getBodyWeight();
  if (savedWeight) document.getElementById("recWeight").value = String(savedWeight);
  document.getElementById("recStartBtn").addEventListener("click", startRecording);
  initNavigation();
  document.getElementById("recPauseBtn").addEventListener("click", toggleRecordingPause);
  document.getElementById("recFinishBtn").addEventListener("click", finishRecording);
  document.getElementById("recDiscardBtn").addEventListener("click", () => discardRecording(false));
  document.getElementById("recPoiBtn").addEventListener("click", recTogglePoiPick);
  document.querySelectorAll("#recPoiPick button[data-type]").forEach((btn) => {
    btn.addEventListener("click", () => recAddPoi(btn.dataset.type));
  });
  document.getElementById("recSettingsBtn").addEventListener("click", recOnPermAction);
  document.getElementById("recStatus").addEventListener("click", recOnPermAction);
  document.getElementById("tabTrainBtn").addEventListener("click", () => { if (rec) recInitMap(); });
  document.addEventListener("visibilitychange", recOnVisibilityChange);
  window.addEventListener("pagehide", () => recSave(true));
  restoreRecording();
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
  // Logowanie podpinamy NAJPIERW - błąd w dalszej inicjalizacji nie może zablokować wejścia do aplikacji.
  document.getElementById("pinSubmit").addEventListener("click", tryLogin);
  document.getElementById("pinInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") tryLogin();
  });
  try {
    applyTheme();
    applyLanguage();
  } catch (e) {
    console.error("Init error", e);
  }

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
  document.getElementById("planPoiBtn").addEventListener("click", poiToggleArmed);
  document.getElementById("poiSaveBtn").addEventListener("click", poiSaveForm);
  document.getElementById("poiDeleteBtn").addEventListener("click", poiDeleteCurrent);
  document.getElementById("poiCancelBtn").addEventListener("click", poiCloseForm);
  document.getElementById("planClearBtn").addEventListener("click", clearPlan);
  document.getElementById("planSaveBtn").addEventListener("click", savePlannedRoute);
  document.getElementById("planExportBtn").addEventListener("click", exportCurrentPlan);

  document.getElementById("saveBtn").addEventListener("click", saveTraining);
  initEditTraining();
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
    loadChallengeBoard();
  });
  document.getElementById("challengeLeaveBtn").addEventListener("click", leaveChallenge);
  document.getElementById("challengeShare").addEventListener("change", toggleChallengeShare);
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
  document.getElementById("headerThemeBtn").addEventListener("click", toggleTheme);
  document.getElementById("pinChangeBtn").addEventListener("click", changePin);
  document.getElementById("langBtn").addEventListener("click", toggleLanguage);
  document.getElementById("logoutBtn").addEventListener("click", logout);
  initLook();
  initRecorder();
  initChallengeMessages();
  initTrainModes();
  initSamsungHint();
  initNativeUpdates();

  // Sesja logowania trwa do zamknięcia karty przeglądarki (sessionStorage).
  // Dzięki temu nie trzeba podawać PIN-u za każdym odświeżeniem, ale po
  // zamknięciu apki trzeba zalogować się ponownie.
  if (sessionStorage.getItem("pau_authed") === "1") {
    showMainApp();
  } else {
    showLogin();
  }
});
