// Polska Adventure Ultra - PWA logic
// Wszystkie dane trzymane lokalnie w przeglądarce telefonu (localStorage).
// Nic nie jest wysyłane na żaden serwer - każdy telefon ma swoją niezależną historię.

const PIN_KEY = "pau_pin";
const HISTORY_KEY = "pau_history";
const THEME_KEY = "pau_theme";
const DEFAULT_PIN = "1234";

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
    errorEl.textContent = "Nieprawidłowy PIN";
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
  document.getElementById("totalLbl").textContent = `🏅 Łącznie: ${total.toFixed(1)} km`;
}

// --- Historia ---
function refreshHistoryList() {
  const list = document.getElementById("historyList");
  const history = getHistory().slice().reverse();
  if (history.length === 0) {
    list.innerHTML = "<p>Brak zapisanych treningów.</p>";
    return;
  }
  list.innerHTML = history
    .map((item) => {
      const notes = item.notes ? `, Notes: ${item.notes}` : "";
      return `<div class="history-item">Date: ${item.date}, Disc: ${item.disc}, Dist: ${item.dist} km, ` +
             `Weight: ${item.weight} kg, HR: ${item.hr} bpm, VO2max: ${item.vo2max}${notes}</div>`;
    })
    .join("");
}

// --- Zapis treningu ---
function saveTraining() {
  const dist = document.getElementById("dist").value;
  if (!dist || parseFloat(dist) <= 0) {
    alert("Podaj dystans większy od 0.");
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

  const history = getHistory();
  history.push(entry);
  saveHistory(history);

  document.getElementById("dist").value = "";
  document.getElementById("notes").value = "";

  refreshTotalLabel();
  refreshHistoryList();
  alert("Zapisano trening!");
}

// --- Tempo / prędkość ---
function calcPace() {
  const dist = parseFloat(document.getElementById("dist").value);
  const time = parseFloat(document.getElementById("time").value);
  const disc = document.getElementById("discipline").value;

  if (!dist || !time || dist <= 0 || time <= 0) {
    alert("Podaj dystans i czas.");
    return;
  }

  if (disc === "Bieg") {
    const pace = time / dist;
    const min = Math.floor(pace);
    const sec = Math.round((pace - min) * 60);
    alert(`Tempo: ${min}:${String(sec).padStart(2, "0")} min/km`);
  } else {
    const speed = dist / (time / 60);
    alert(`Prędkość: ${speed.toFixed(1)} km/h`);
  }
}

// --- Wykres progresu (prosty, bez bibliotek zewnętrznych - działa offline) ---
function showChart() {
  const history = getHistory();
  const card = document.getElementById("chartCard");
  const canvas = document.getElementById("chartCanvas");

  if (history.length === 0) {
    alert("Brak danych historycznych.");
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
    alert("Brak danych do eksportu.");
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

function parseGpx(xml) {
  const trkpts = Array.from(xml.getElementsByTagName("trkpt"));
  if (trkpts.length < 2) throw new Error("Brak punktów trasy w pliku GPX.");

  let distKm = 0;
  const hrValues = [];

  for (let i = 0; i < trkpts.length; i++) {
    const pt = trkpts[i];
    const lat = parseFloat(pt.getAttribute("lat"));
    const lon = parseFloat(pt.getAttribute("lon"));
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
  };
}

function parseTcx(xml) {
  const laps = Array.from(xml.getElementsByTagName("Lap"));
  if (laps.length === 0) throw new Error("Brak danych treningu w pliku TCX.");

  let distM = 0;
  let timeS = 0;
  const hrValues = [];
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
  };
}

function importTrainingFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const xml = new DOMParser().parseFromString(reader.result, "application/xml");
      if (xml.getElementsByTagName("parsererror").length > 0) {
        throw new Error("Nie udało się odczytać pliku (nieprawidłowy XML).");
      }

      const isTcx = xml.getElementsByTagName("TrainingCenterDatabase").length > 0;
      const parsed = isTcx ? parseTcx(xml) : parseGpx(xml);

      document.getElementById("date").value = parsed.date;
      document.getElementById("dist").value = parsed.dist;
      document.getElementById("time").value = parsed.time;
      document.getElementById("hr").value = parsed.hr;
      document.getElementById("discipline").value = parsed.disc;

      alert(
        `Wczytano trening z pliku:\nData: ${parsed.date}\nDystans: ${parsed.dist} km\n` +
        `Czas: ${parsed.time} min\nŚr. tętno: ${parsed.hr} bpm\n\nSprawdź dane i kliknij "ZAPISZ TRENING".`
      );
    } catch (e) {
      alert("Błąd importu: " + e.message);
    }
  };
  reader.readAsText(file);
}

// --- Zmiana PIN-u ---
function changePin() {
  const newPin = prompt("Podaj nowy PIN:");
  if (newPin && newPin.trim().length > 0) {
    localStorage.setItem(PIN_KEY, newPin.trim());
    alert("PIN zmieniony.");
  }
}

// --- Inicjalizacja ---
document.addEventListener("DOMContentLoaded", () => {
  applyTheme();

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

  // Sesja logowania trwa do zamknięcia karty przeglądarki (sessionStorage).
  // Dzięki temu nie trzeba podawać PIN-u za każdym odświeżeniem, ale po
  // zamknięciu apki trzeba zalogować się ponownie.
  if (sessionStorage.getItem("pau_authed") === "1") {
    showMainApp();
  } else {
    showLogin();
  }
});
