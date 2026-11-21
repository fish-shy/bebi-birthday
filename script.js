// ===== EDIT DI SINI =====

// Foto utama di atas: photos/hero.jpg
// Foto galeri: taruh di folder "photos/" lalu sesuaikan daftar ini.
// "ar" = bentuk foto (lebar / tinggi), contoh "4 / 5" (portrait), "1 / 1" (kotak), "3 / 2" (landscape).
const PHOTOS = [
  { src: "photos/1.jpg", caption: "Pertama kali ketemu", year: "2024", ar: "4 / 5" },
  { src: "photos/2.jpg", caption: "Kamu lucu banget di sini", year: "2024", ar: "3 / 4" },
  { src: "photos/3.jpg", caption: "Jalan-jalan kita", year: "2025", ar: "1 / 1" },
  { src: "photos/4.jpg", caption: "Senyum favorit aku", year: "2025", ar: "4 / 5" },
  { src: "photos/5.jpg", caption: "Momen random", year: "2025", ar: "3 / 2" },
  { src: "photos/6.jpg", caption: "Kita", year: "2026", ar: "4 / 5" },
];

// title = judul baris, detail = isi saat dibuka.
const REASONS = [
  { title: "Cara kamu ketawa", detail: "Sampai mata kamu ilang. Itu suara favorit aku di dunia." },
  { title: "Kamu perhatian sama hal kecil", detail: "Hal-hal yang orang lain lupa, kamu selalu inget." },
  { title: "Kamu sabar ngadepin aku", detail: "Aku tahu aku nggak selalu gampang. Makasih udah tetap di sini." },
  { title: "\"Udah makan belum?\"", detail: "Pesan paling sederhana, tapi selalu bikin hari aku lebih baik." },
  { title: "Kamu bikin hari jelek jadi baik-baik aja", detail: "Cukup ada kamu, semuanya terasa lebih ringan." },
  { title: "Kamu jadi diri kamu sendiri", detail: "Nggak pernah pura-pura. Dan itu yang bikin aku jatuh cinta." },
  { title: "Pelukan kamu", detail: "Tempat paling nyaman yang pernah aku tahu." },
  { title: "Semuanya", detail: "Serius. Daftar ini nggak akan pernah selesai." },
];

const CANDLE_COUNT = 3;

// ===== AKHIR BAGIAN EDIT =====

const $ = (s) => document.querySelector(s);
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Ganti foto yang belum ada dengan placeholder
function placeholderFor(img, label) {
  const ph = document.createElement("div");
  ph.className = "ph";
  ph.style.aspectRatio = getComputedStyle(img).aspectRatio;
  ph.textContent = `taruh foto di ${label}`;
  img.replaceWith(ph);
}
const heroImg = $(".hero-photo img");
heroImg.addEventListener("error", () => placeholderFor(heroImg, "photos/hero.jpg"));
if (heroImg.complete && heroImg.naturalWidth === 0) placeholderFor(heroImg, "photos/hero.jpg");

// --- Intro ---
document.body.classList.add("locked");
$("#openBtn").addEventListener("click", () => {
  $("#intro").classList.add("gone");
  document.body.classList.remove("locked");
  setTimeout(() => document.body.classList.add("loaded"), 350);
  setTimeout(burstConfetti, 900);
  tryPlayMusic();
});

// --- Musik (opsional) ---
const music = $("#music");
const musicBtn = $("#musicBtn");
music.addEventListener("canplay", () => (musicBtn.hidden = false), { once: true });
function tryPlayMusic() {
  music.play().then(() => musicBtn.classList.add("playing")).catch(() => {});
}
musicBtn.addEventListener("click", () => {
  if (music.paused) tryPlayMusic();
  else { music.pause(); musicBtn.classList.remove("playing"); }
});

// --- Lilin ---
const candlesEl = $("#candles");
let lit = CANDLE_COUNT;
for (let i = 0; i < CANDLE_COUNT; i++) {
  const c = document.createElement("button");
  c.className = "candle";
  c.setAttribute("aria-label", `Tiup lilin ${i + 1}`);
  c.innerHTML = '<span class="flame"></span>';
  c.addEventListener("click", () => {
    if (c.classList.contains("out")) return;
    c.classList.add("out");
    if (--lit === 0) {
      $("#wishMsg").classList.add("show");
      burstConfetti();
    }
  });
  candlesEl.appendChild(c);
}

// --- Galeri ---
const gallery = $("#gallery");
PHOTOS.forEach((p, i) => {
  const fig = document.createElement("figure");
  fig.className = "shot reveal";
  fig.style.setProperty("--ar", p.ar || "4 / 5");
  const wrap = document.createElement("div");
  wrap.className = "shot-img";
  const img = new Image();
  img.alt = p.caption;
  img.loading = "lazy";
  img.addEventListener("error", () => placeholderFor(img, p.src));
  img.src = p.src;
  wrap.appendChild(img);
  const cap = document.createElement("figcaption");
  const left = document.createElement("span");
  left.innerHTML = `<b>Fig. ${String(i + 1).padStart(2, "0")}</b> — `;
  left.append(p.caption);
  const right = document.createElement("span");
  right.textContent = p.year || "";
  cap.append(left, right);
  fig.append(wrap, cap);
  gallery.appendChild(fig);
});

// --- Alasan (accordion) ---
const reasonsEl = $("#reasons");
REASONS.forEach((r, i) => {
  const li = document.createElement("li");
  li.className = "reason reveal";
  li.innerHTML = `
    <button class="reason-btn" aria-expanded="false">
      <span class="n">${String(i + 1).padStart(2, "0")}</span>
      <span class="t"></span>
      <span class="plus" aria-hidden="true">+</span>
    </button>
    <div class="reason-body"><div><p></p></div></div>`;
  li.querySelector(".t").textContent = r.title;
  li.querySelector("p").textContent = r.detail;
  const btn = li.querySelector(".reason-btn");
  btn.addEventListener("click", () => {
    const open = li.classList.toggle("open");
    btn.setAttribute("aria-expanded", open);
  });
  reasonsEl.appendChild(li);
});

// --- Reveal saat scroll ---
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// --- Confetti ---
const canvas = $("#confetti");
const ctx = canvas.getContext("2d");
let pieces = [];
let running = false;
const COLORS = ["#a8475c", "#ecd5cf", "#1e1916", "#f3c15a", "#fbf8f3"];

function resize() {
  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
addEventListener("resize", resize);
resize();

function burstConfetti() {
  if (reducedMotion) return;
  for (let i = 0; i < 140; i++) {
    pieces.push({
      x: Math.random() * innerWidth,
      y: -20 - Math.random() * innerHeight * 0.5,
      vx: (Math.random() - 0.5) * 2,
      vy: Math.random() * 2 + 2,
      w: Math.random() * 6 + 4,
      h: Math.random() * 10 + 6,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.15,
      sway: Math.random() * Math.PI * 2,
      color: COLORS[(Math.random() * COLORS.length) | 0],
    });
  }
  if (!running) { running = true; requestAnimationFrame(tick); }
}

function tick() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  pieces.forEach((p) => {
    p.sway += 0.05;
    p.x += p.vx + Math.sin(p.sway) * 0.8;
    p.y += p.vy;
    p.rot += p.vr;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.scale(1, Math.cos(p.sway));
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  });
  pieces = pieces.filter((p) => p.y < innerHeight + 30);
  if (pieces.length) requestAnimationFrame(tick);
  else { running = false; ctx.clearRect(0, 0, innerWidth, innerHeight); }
}

$("#confettiBtn").addEventListener("click", burstConfetti);
