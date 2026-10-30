// Polska Adventure Ultra - PWA logic
// Wszystkie dane trzymane lokalnie w przeglądarce telefonu (localStorage).
// Nic nie jest wysyłane na żaden serwer - każdy telefon ma swoją niezależną historię.

const PIN_KEY = "pau_pin";
const HISTORY_KEY = "pau_history";
const THEME_KEY = "pau_theme";
const LANG_KEY = "pau_lang";
const PLANNED_ROUTES_KEY = "pau_planned_routes";
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
    alertDistTimeRequired: "Podaj dystans i czas.",
    paceResult: (min, sec) => `Tempo: ${min}:${sec} min/km`,
    speedResult: (v) => `Prędkość: ${v} km/h`,
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
    discNames: { Bieg: "Bieg", Rower: "Rower", Kajak: "Kajak" },
    routeTitle: "Trasa",
    showRouteTitle: "Pokaż trasę",
    tabPlan: "Trasy",
    planTitle: "Wyznacz trasę",
    planHint: "Klikaj na mapie, żeby dodać kolejne punkty trasy. Gotową trasę zapisz i wyeksportuj do GPX, a potem wgraj do zegarka.",
    planModeLabel: "Prowadzenie trasy",
    planModeFoot: "Po szlakach pieszych (bieg)",
    planModeBike: "Po drogach rowerowych (rower)",
    planModeStraight: "Linia prosta (kajak / teren)",
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
    alertDistTimeRequired: "Enter distance and time.",
    paceResult: (min, sec) => `Pace: ${min}:${sec} min/km`,
    speedResult: (v) => `Speed: ${v} km/h`,
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
    discNames: { Bieg: "Running", Rower: "Cycling", Kajak: "Kayaking" },
    routeTitle: "Route",
    showRouteTitle: "Show route",
    tabPlan: "Routes",
    planTitle: "Plan a route",
    planHint: "Tap the map to add route points. Save the finished route, export it to GPX and upload it to your watch.",
    planModeLabel: "Route guidance",
    planModeFoot: "Follow footpaths (running)",
    planModeBike: "Follow cycle roads (cycling)",
    planModeStraight: "Straight lines (kayak / off-road)",
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
}

function toggleLanguage() {
  localStorage.setItem(LANG_KEY, getLang() === "pl" ? "en" : "pl");
  applyLanguage();
  refreshTotalLabel();
  refreshHistoryList();
  refreshSavedRoutesList();
  refreshPlanStats();
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
}

function toggleTheme() {
  const current = localStorage.getItem(THEME_KEY) || "light";
  localStorage.setItem(THEME_KEY, current === "light" ? "dark" : "light");
  applyTheme();
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
  train: ["tabTrain", "tabTrainBtn"],
  history: ["tabHistory", "tabHistoryBtn"],
  plan: ["tabPlan", "tabPlanBtn"],
};

function showTab(tabName) {
  document.querySelectorAll(".tab-content").forEach((el) => el.classList.remove("active"));
  document.querySelectorAll(".tabs button").forEach((el) => el.classList.remove("active"));
  const [contentId, btnId] = TAB_IDS[tabName];
  document.getElementById(contentId).classList.add("active");
  document.getElementById(btnId).classList.add("active");
}

// --- Licznik motywacyjny ---
function refreshTotalLabel() {
  const total = getTotalDistance();
  document.getElementById("totalLbl").textContent = t().totalLabel(total.toFixed(1));
}

// --- Historia ---
function refreshHistoryList() {
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
      const notes = item.notes ? `, ${l.notes}: ${item.notes}` : "";
      const routeBtn = item.route && item.route.length >= 2
        ? `<button class="route-btn" data-index="${index}" title="${dict.showRouteTitle}">🗺</button>`
        : "";
      return `<div class="history-item">` +
             `<span>${l.date}: ${item.date}, ${l.disc}: ${discName}, ${l.dist}: ${item.dist} km, ` +
             `${l.weight}: ${item.weight} kg, ${l.hr}: ${item.hr} bpm, ${l.vo2max}: ${item.vo2max}${notes}</span>` +
             `<div class="history-actions">${routeBtn}` +
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
}

function deleteTraining(index) {
  if (!confirm(t().confirmDelete)) return;
  const history = getHistory();
  history.splice(index, 1);
  saveHistory(history);
  refreshTotalLabel();
  refreshHistoryList();
}

// --- Zapis treningu ---
function saveTraining() {
  const dist = document.getElementById("dist").value;
  if (!dist || parseFloat(dist) <= 0) {
    alert(t().alertDistRequired);
    return;
  }

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

  const history = getHistory();
  history.push(entry);
  saveHistory(history);

  document.getElementById("dist").value = "";
  document.getElementById("notes").value = "";
  pendingRoute = null;

  refreshTotalLabel();
  refreshHistoryList();
  alert(t().alertSaved);
}

// --- Tempo / prędkość ---
function calcPace() {
  const dist = parseFloat(document.getElementById("dist").value);
  const time = parseFloat(document.getElementById("time").value);
  const disc = document.getElementById("discipline").value;

  if (!dist || !time || dist <= 0 || time <= 0) {
    alert(t().alertDistTimeRequired);
    return;
  }

  if (disc === "Bieg") {
    const pace = time / dist;
    const min = Math.floor(pace);
    const sec = Math.round((pace - min) * 60);
    alert(t().paceResult(min, String(sec).padStart(2, "0")));
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

  const isDark = document.body.classList.contains("dark");
  ctx.strokeStyle = isDark ? "#00FF7F" : "#2E7D32";
  ctx.fillStyle = isDark ? "#00FF7F" : "#2E7D32";
  ctx.lineWidth = 2;

  // Oś
  ctx.beginPath();
  ctx.moveTo(padding, h - padding);
  ctx.lineTo(w - padding, h - padding);
  ctx.strokeStyle = isDark ? "#555" : "#ccc";
  ctx.stroke();

  // Linia dystansu
  ctx.beginPath();
  ctx.strokeStyle = isDark ? "#00FF7F" : "#2E7D32";
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

// --- Trasa (z importu GPX/TCX) ---
let pendingRoute = null;
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
  const polyline = L.polyline(latlngs, { color: "#2E7D32", weight: 4 }).addTo(routeLayerGroup);
  L.circleMarker(latlngs[0], { radius: 6, color: "#2E7D32", fillColor: "#2E7D32", fillOpacity: 1 }).addTo(routeLayerGroup);
  L.circleMarker(latlngs[latlngs.length - 1], { radius: 6, color: "#c62828", fillColor: "#c62828", fillOpacity: 1 }).addTo(routeLayerGroup);

  // Kontener był ukryty (display:none), więc Leaflet potrzebuje przeliczenia
  // rozmiaru po tym, jak przeglądarka faktycznie odłoży layout.
  requestAnimationFrame(() => {
    routeMapInstance.invalidateSize();
    routeMapInstance.fitBounds(polyline.getBounds(), { padding: [20, 20] });
  });

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
    L.polyline(track.map((p) => [p.lat, p.lon]), { color: "#2E7D32", weight: 4 }).addTo(planLayerGroup);
  }
  planWaypoints.forEach((p, i) => {
    const isLast = i === planWaypoints.length - 1 && i > 0;
    const color = i === 0 ? "#2E7D32" : isLast ? "#c62828" : "#1565C0";
    L.circleMarker([p.lat, p.lon], { radius: 6, color, fillColor: color, fillOpacity: 1 }).addTo(planLayerGroup);
  });
  refreshPlanStats();
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
  const gpx = buildGpx(name, track);
  // Na telefonie systemowe "Udostępnij" pozwala od razu otworzyć plik np. w Suunto app.
  const file = new File([gpx], fileName, { type: "application/gpx+xml" });
  const isTouch = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
  if (isTouch && navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: name });
      return;
    } catch (e) {
      if (e.name === "AbortError") return;
    }
  }
  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
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

function exportPlannedRoute(index) {
  const route = getPlannedRoutes()[index];
  if (!route) return;
  const track = [];
  route.segments.forEach((seg, i) => track.push(...(i === 0 ? seg : seg.slice(1))));
  downloadGpx(route.name, track);
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
      `<button class="delete-btn" data-index="${index}" title="${dict.deleteTitle}">🗑</button></div>` +
      `</div>`)
    .join("");

  list.querySelectorAll(".route-btn").forEach((btn) => {
    btn.addEventListener("click", () => loadPlannedRoute(parseInt(btn.dataset.index, 10)));
  });
  list.querySelectorAll(".gpx-btn").forEach((btn) => {
    btn.addEventListener("click", () => exportPlannedRoute(parseInt(btn.dataset.index, 10)));
  });
  list.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => deletePlannedRoute(parseInt(btn.dataset.index, 10)));
  });
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
    route.push({ lat, lon });
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
    disc: "Bieg",
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
      if (latEl && lonEl) route.push({ lat: parseFloat(latEl.textContent), lon: parseFloat(lonEl.textContent) });
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
    disc: discMap[sport] || "Bieg",
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
  document.getElementById("planUndoBtn").addEventListener("click", undoPlanPoint);
  document.getElementById("planClearBtn").addEventListener("click", clearPlan);
  document.getElementById("planSaveBtn").addEventListener("click", savePlannedRoute);
  document.getElementById("planExportBtn").addEventListener("click", exportCurrentPlan);

  document.getElementById("saveBtn").addEventListener("click", saveTraining);
  document.getElementById("paceBtn").addEventListener("click", calcPace);
  document.getElementById("chartBtn").addEventListener("click", showChart);
  document.getElementById("exportBtn").addEventListener("click", exportCsv);
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
