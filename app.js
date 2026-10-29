// Polska Adventure Ultra - PWA logic
// Wszystkie dane trzymane lokalnie w przeglądarce telefonu (localStorage).
// Nic nie jest wysyłane na żaden serwer - każdy telefon ma swoją niezależną historię.

const PIN_KEY = "pau_pin";
const HISTORY_KEY = "pau_history";
const THEME_KEY = "pau_theme";
const LANG_KEY = "pau_lang";
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
function showTab(tabName) {
  document.querySelectorAll(".tab-content").forEach((el) => el.classList.remove("active"));
  document.querySelectorAll(".tabs button").forEach((el) => el.classList.remove("active"));
  document.getElementById(tabName === "train" ? "tabTrain" : "tabHistory").classList.add("active");
  document.getElementById(tabName === "train" ? "tabTrainBtn" : "tabHistoryBtn").classList.add("active");
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
