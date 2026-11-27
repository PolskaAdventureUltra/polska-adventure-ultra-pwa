const NAV_TURN_WIN_KM = 0.025;
const NAV_TURN_MIN_DEG = 40;
const NAV_TURN_FAR_M = { Rower: 200, Auto4x4: 300 };   // pozostałe: 100 m
const NAV_TURN_NEAR_M = { Rower: 35, Auto4x4: 50 };    // pozostałe: 20 m
const NAV_TURN_OFF_DISC = ["Kajak", "WodyOtwarte", "Basen"];
const NAV_STRAIGHT_SAY_KM = 0.4; // „Teraz prosto przez…” tylko gdy do następnego skrętu co najmniej tyle
let navTurnsCache=null, navTurnsFor=null, navCum=null, navCumFor=null;
let lang="pl"; function getLang(){return lang;}
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
function bearingDeg(lat1, lon1, lat2, lon2) {
  const toRad = Math.PI / 180;
  const y = Math.sin((lon2 - lon1) * toRad) * Math.cos(lat2 * toRad);
  const x = Math.cos(lat1 * toRad) * Math.sin(lat2 * toRad) - Math.sin(lat1 * toRad) * Math.cos(lat2 * toRad) * Math.cos((lon2 - lon1) * toRad);
  return (Math.atan2(y, x) / toRad + 360) % 360;
}
function navPointAtKm(pts, cum, km) {
  if (km <= 0) return pts[0];
  if (km >= cum[cum.length - 1]) return pts[pts.length - 1];
  let lo = 0, hi = cum.length - 1;
  while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (cum[mid] <= km) lo = mid; else hi = mid; }
  const seg = cum[hi] - cum[lo];
  const u = seg > 0 ? (km - cum[lo]) / seg : 0;
  return [pts[lo][0] + u * (pts[hi][0] - pts[lo][0]), pts[lo][1] + u * (pts[hi][1] - pts[lo][1])];
}
function navTurnKind(angle) {
  const a = Math.abs(angle);
  const side = angle < 0 ? "Left" : "Right";
  if (a >= 160) return "uturn";
  if (a >= 135) return "sharp" + side;
  if (a >= 65) return side.toLowerCase();
  return "slight" + side;
}
function navComputeTurns(pts, cum) {
  const total = cum[cum.length - 1];
  const L = NAV_TURN_WIN_KM;
  const cand = [];
  for (let i = 1; i < pts.length - 1; i++) {
    const km = cum[i];
    if (km < 0.03 || total - km < 0.03) continue; // nie przy samym starcie i mecie
    const a = navPointAtKm(pts, cum, km - L);
    const c = navPointAtKm(pts, cum, km + L);
    const b = pts[i];
    // Kłębek punktów (postój przy nagrywaniu) - cięciwa dużo krótsza niż droga wzdłuż trasy, to nie skręt.
    if (haversineKm(a[0], a[1], b[0], b[1]) < L * 0.6 || haversineKm(b[0], b[1], c[0], c[1]) < L * 0.6) continue;
    let angle = bearingDeg(b[0], b[1], c[0], c[1]) - bearingDeg(a[0], a[1], b[0], b[1]);
    angle = ((angle + 540) % 360) - 180;
    if (Math.abs(angle) >= NAV_TURN_MIN_DEG) cand.push({ km, angle });
  }
  // Kilka sąsiednich punktów tego samego zakrętu - zostaje ten z największym kątem.
  const turns = [];
  cand.forEach((t) => {
    const prev = turns[turns.length - 1];
    if (prev && t.km - prev.km < L * 1.5 && Math.sign(prev.angle) === Math.sign(t.angle)) {
      if (Math.abs(t.angle) > Math.abs(prev.angle)) turns[turns.length - 1] = t;
    } else turns.push(t);
  });
  return turns.map((t) => ({ km: t.km, angle: Math.round(t.angle), kind: navTurnKind(t.angle) }));
}
function navTurns() {
  if (!rec || !rec.nav || NAV_TURN_OFF_DISC.includes(rec.disc)) return [];
  if (navTurnsFor === rec.nav && navTurnsCache) return navTurnsCache;
  navTurnsCache = navComputeTurns(rec.nav.pts, navCumulative());
  navTurnsFor = rec.nav;
  return navTurnsCache;
}
function navNextTurnIndex() {
  const turns = navTurns();
  if (navRt.progressKm == null) return -1;
  return turns.findIndex((tr) => tr.km > navRt.progressKm + 0.005);
}
function navSayDist(km) {
  if (km < 1) {
    const m = Math.max(50, Math.round((km * 1000) / 50) * 50);
    return `${m} ${getLang() === "en" ? "metres" : plUnit(m, "metr", "metry", "metrów")}`;
  }
  const s = navSayKm(km);
  return `${s} ${getLang() === "en" ? (s === "1" ? "kilometre" : "kilometres") : plUnit(s, "kilometr", "kilometry", "kilometrów")}`;
}
function navCapitalize(text) {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}
function navCheckTurn() {
  const turns = navTurns();
  if (!turns.length || navRt.progressKm == null) return false;
  const dict = t();
  if (!navRt.turnSaid) navRt.turnSaid = {};
  const idx = navNextTurnIndex();
  const near = NAV_TURN_NEAR_M[rec.disc] || 20;
  // Po minięciu skrętu: ile prosto do następnego (albo do mety). Dopiero kawałek za skrętem,
  // żeby nie przerwać komunikatu „Skręć…” (nowy komunikat przerywa poprzedni).
  const lastNow = navRt.lastTurnNow;
  if (lastNow != null && idx !== lastNow && navRt.straightFor !== lastNow &&
      navRt.progressKm >= turns[lastNow].km + Math.max(0.03, (near * 2) / 1000)) {
    navRt.straightFor = navRt.lastTurnNow;
    const toKm = idx >= 0 ? turns[idx].km : rec.nav.totalKm;
    if (toKm - navRt.progressKm >= NAV_STRAIGHT_SAY_KM) {
      navSpeak(dict.navSayStraight(navSayDist(toKm - navRt.progressKm)));
      return true;
    }
  }
  if (idx < 0) return false;
  const turn = turns[idx];
  const leftM = (turn.km - navRt.progressKm) * 1000;
  const far = NAV_TURN_FAR_M[rec.disc] || 100;
  const said = navRt.turnSaid[idx] || "";
  const what = dict.turnWhat[turn.kind];
  if (leftM <= near && said !== "now") {
    navRt.turnSaid[idx] = "now";
    navRt.lastTurnNow = idx;
    const next = turns[idx + 1];
    let text = navCapitalize(what);
    if (next && (next.km - turn.km) * 1000 <= 60) {
      text = dict.navSayTurnThen(text, dict.turnWhat[next.kind]);
      navRt.turnSaid[idx + 1] = "now"; // oba skręty powiedziane naraz
      navRt.lastTurnNow = idx + 1;
    }
    navVibrate([150, 100, 150]);
    navSpeak(text);
    return true;
  }
  if (leftM <= far + 15 && leftM > near * 2 && !said) {
    navRt.turnSaid[idx] = "far";
    const m = leftM >= 100 ? Math.round(leftM / 50) * 50 : Math.max(near * 2, Math.round(leftM / 10) * 10);
    navSpeak(dict.navSayTurnIn(m, what));
    return true;
  }
  return false;
}
function navCumulative() {
  if (navCumFor === rec.nav && navCum) return navCum;
  const pts = rec.nav.pts;
  navCum = [0];
  for (let i = 1; i < pts.length; i++) navCum.push(navCum[i - 1] + haversineKm(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1]));
  navCumFor = rec.nav;
  return navCum;
}
function navSayKm(km) {
  const s = (Math.round(km * 10) / 10).toFixed(1).replace(/\.0$/, "");
  return getLang() === "en" ? s : s.replace(".", ",");
}
function plUnit(n, one, few, many) {
  const s = String(n);
  if (/[.,]/.test(s)) return one === "kilometr" ? "kilometra" : many;
  const v = Math.abs(parseInt(s, 10));
  if (v === 1) return one;
  const d = v % 10, h = v % 100;
  return d >= 2 && d <= 4 && (h < 12 || h > 14) ? few : many;
}
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
      if (d < best.d) best = { i, d, u, km: cum[i] + u * (cum[i + 1] - cum[i]) };
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
const dict = {turnWhat: { left: "skręć w lewo", right: "skręć w prawo", slightLeft: "lekko w lewo", slightRight: "lekko w prawo", sharpLeft: "ostro w lewo", sharpRight: "ostro w prawo", uturn: "zawróć" },
    navSayTurnIn: (m, what) => `Za ${m} ${plUnit(m, "metr", "metry", "metrów")} ${what}`,
    navSayTurnThen: (a, b) => `${a}, a zaraz potem ${b}`,
    navSayStraight: (dist) => `Teraz prosto przez ${dist}`,
    };
function t(){return dict;}
function navVibrate(){}
const said=global.__said=[]; function navSpeak(x){said.push(x);}
module.exports = { navComputeTurns, navCheckTurn, navLocate, setRec(r){rec=r; navRt={idx:0}; navTurnsCache=null;}, get navRt(){return navRt;} };
var rec, navRt;