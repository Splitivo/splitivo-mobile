/**
 * Splitivo app icon generator — pure Node.js, no deps
 * Output: assets/icon_preview.png  (1080×1080 RGB PNG)
 */
const zlib = require("zlib");
const fs = require("fs");

const W = 1080,
  H = 1080;
const px = Buffer.alloc(W * H * 3); // RGB

/* ── pixel helpers ─────────────────────────────────────── */
function set(x, y, r, g, b) {
  x = Math.round(x);
  y = Math.round(y);
  if (x < 0 || x >= W || y < 0 || y >= H) return;
  const i = (y * W + x) * 3;
  px[i] = r;
  px[i + 1] = g;
  px[i + 2] = b;
}

function get(x, y) {
  x = Math.round(x);
  y = Math.round(y);
  if (x < 0 || x >= W || y < 0 || y >= H) return [0, 0, 0];
  const i = (y * W + x) * 3;
  return [px[i], px[i + 1], px[i + 2]];
}

function blend(x, y, r, g, b, a) {
  x = Math.round(x);
  y = Math.round(y);
  if (x < 0 || x >= W || y < 0 || y >= H) return;
  const i = (y * W + x) * 3;
  px[i] = Math.round(px[i] * (1 - a) + r * a);
  px[i + 1] = Math.round(px[i + 1] * (1 - a) + g * a);
  px[i + 2] = Math.round(px[i + 2] * (1 - a) + b * a);
}

/* ── background: radial gradient, near-black ───────────── */
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const dx = x - W / 2,
      dy = y - H / 2;
    const d = Math.sqrt(dx * dx + dy * dy) / (W * 0.62);
    const v = Math.round(22 - Math.min(1, d) * 13); // 22 → 9
    set(x, y, v, v, v);
  }
}

/* ── shape helpers ─────────────────────────────────────── */
function fillRR(x0, y0, w, h, r, R, G, B) {
  for (let y = y0; y < y0 + h; y++) {
    for (let x = x0; x < x0 + w; x++) {
      const rx = x - x0,
        ry = y - y0;
      let clip = false;
      if (rx < r && ry < r) {
        const dx = rx - r,
          dy = ry - r;
        clip = dx * dx + dy * dy > r * r;
      } else if (rx >= w - r && ry < r) {
        const dx = rx - (w - r),
          dy = ry - r;
        clip = dx * dx + dy * dy > r * r;
      } else if (rx < r && ry >= h - r) {
        const dx = rx - r,
          dy = ry - (h - r);
        clip = dx * dx + dy * dy > r * r;
      } else if (rx >= w - r && ry >= h - r) {
        const dx = rx - (w - r),
          dy = ry - (h - r);
        clip = dx * dx + dy * dy > r * r;
      }
      if (!clip) set(x, y, R, G, B);
    }
  }
}

function fillRect(x0, y0, w, h, R, G, B) {
  for (let y = y0; y < y0 + h; y++)
    for (let x = x0; x < x0 + w; x++) set(x, y, R, G, B);
}

function fillCircleAA(cx, cy, r, R, G, B) {
  for (let y = Math.floor(cy - r - 1); y <= Math.ceil(cy + r + 1); y++) {
    for (let x = Math.floor(cx - r - 1); x <= Math.ceil(cx + r + 1); x++) {
      const dx = x - cx,
        dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= r - 0.5) {
        set(x, y, R, G, B);
      } else if (dist <= r + 0.5) {
        blend(x, y, R, G, B, r + 0.5 - dist);
      }
    }
  }
}

/* ── receipt ───────────────────────────────────────────── */
const rX = 290,
  rY = 168,
  rW = 500,
  rH = 744,
  rR = 52;
const rX2 = rX + rW,
  rY2 = rY + rH;

// receipt body (white)
fillRR(rX, rY, rW, rH, rR, 255, 255, 255);

// ── serrated / perforated bottom edge (zigzag tearline)
const zigY = rY2 - 90;
const teethCount = 18;
const toothW = Math.round(rW / teethCount);
const teethH = 22;
// cut out triangles from the bottom part of the receipt
for (let t = 0; t < teethCount; t++) {
  const tx = rX + t * toothW;
  // fill a downward-pointing triangle below zigY using black (bg)
  for (let dy = 0; dy < teethH; dy++) {
    const hw = Math.round(((teethH - dy) / teethH) * (toothW / 2));
    const midX = tx + toothW / 2;
    for (let x = midX - hw; x <= midX + hw; x++) {
      const [bgR, bgG, bgB] = get(x, zigY + dy); // preserve bg gradient
      set(x, zigY + dy, bgR, bgG, bgB);
    }
  }
}

// ── merchant header block (dark strip at top of receipt)
fillRR(rX, rY, rW, 88, rR, 18, 18, 18);
// header accent bar (thin white line at bottom of header)
fillRect(rX + rR, rY + 88, rW - rR * 2, 3, 230, 230, 230);

// ── "SPLITIVO" stub in header: 3 white rounded bars (abstract wordmark)
const wbY = rY + 28,
  wbH = 18,
  wbGap = 10;
const wbWidths = [120, 80, 160];
let wbX = rX + (rW - wbWidths.reduce((a, b) => a + b + wbGap, -wbGap)) / 2;
for (const wbw of wbWidths) {
  fillRR(wbX, wbY, wbw, wbH, 9, 255, 255, 255);
  wbX += wbw + wbGap;
}

// ── item lines
const itemLines = [
  { y: rY + 118, w: 0.82, h: 16 },
  { y: rY + 158, w: 0.55, h: 16 },
  { y: rY + 198, w: 0.72, h: 16 },
  { y: rY + 238, w: 0.44, h: 16 },
  { y: rY + 278, w: 0.65, h: 16 },
  { y: rY + 318, w: 0.38, h: 16 },
  { y: rY + 358, w: 0.78, h: 16 },
  { y: rY + 398, w: 0.5, h: 16 },
];
const padX = 52;
for (const { y, w, h } of itemLines) {
  // label bar (left)
  fillRR(
    rX + padX,
    y,
    Math.round((rW - padX * 2) * w * 0.55),
    h,
    8,
    200,
    200,
    200,
  );
  // amount bar (right)
  const amtW = Math.round((rW - padX * 2) * 0.22);
  fillRR(rX + rW - padX - amtW, y, amtW, h, 8, 200, 200, 200);
}

// ── separator line
fillRect(rX + padX, rY + 442, rW - padX * 2, 3, 180, 180, 180);

// ── total row
fillRR(
  rX + padX,
  rY + 460,
  Math.round((rW - padX * 2) * 0.38),
  22,
  11,
  140,
  140,
  140,
);
const totalAmtW = Math.round((rW - padX * 2) * 0.3);
fillRR(rX + rW - padX - totalAmtW, rY + 460, totalAmtW, 22, 11, 50, 50, 50);

// ── split-share indicators (3 small circles near bottom of receipt)
const circleY = rY + 540;
const circleR = 22;
const circleCenters = [
  rX + rW / 2 - circleR * 3,
  rX + rW / 2,
  rX + rW / 2 + circleR * 3,
];
for (const cx of circleCenters) {
  fillCircleAA(cx, circleY, circleR, 220, 220, 220);
  fillCircleAA(cx, circleY, circleR - 5, 110, 110, 110);
}

// ── "split" label bar under circles
fillRR(rX + rW / 2 - 70, circleY + circleR + 14, 140, 18, 9, 180, 180, 180);

/* ── diagonal cut through receipt ──────────────────────── */
// Line from (rX + rW*0.62, rY-14) → (rX + rW*0.38, rY+rH+14)
// Slight backward-leaning diagonal — the "split"
const lx1 = rX + rW * 0.62,
  ly1 = rY - 14;
const lx2 = rX + rW * 0.38,
  ly2 = rY + rH + 14;
const ldx = lx2 - lx1,
  ldy = ly2 - ly1;
const llen = Math.sqrt(ldx * ldx + ldy * ldy);
const lnx = -ldy / llen,
  lny = ldx / llen; // perpendicular normal
const cutHW = 14; // half-width of the cut

for (let y = rY - 14; y <= rY + rH + 14; y++) {
  for (let x = rX - 4; x <= rX + rW + 4; x++) {
    const t = ((x - lx1) * ldx + (y - ly1) * ldy) / (llen * llen);
    const nearX = lx1 + t * ldx;
    const nearY = ly1 + t * ldy;
    const dist = Math.sqrt((x - nearX) ** 2 + (y - nearY) ** 2);
    if (dist <= cutHW - 0.5) {
      // inside cut — restore background gradient
      const dx = x - W / 2,
        dy = y - H / 2;
      const d = Math.sqrt(dx * dx + dy * dy) / (W * 0.62);
      const v = Math.round(22 - Math.min(1, d) * 13);
      set(x, y, v, v, v);
    } else if (dist <= cutHW + 0.5) {
      // AA edge
      const a = cutHW + 0.5 - dist;
      const dx = x - W / 2,
        dy = y - H / 2;
      const d2 = Math.sqrt(dx * dx + dy * dy) / (W * 0.62);
      const v = Math.round(22 - Math.min(1, d2) * 13);
      blend(x, y, v, v, v, a);
    }
  }
}

/* ── PNG encode ─────────────────────────────────────────── */
const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++)
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const tb = Buffer.from(type, "ascii");
  const lb = Buffer.alloc(4);
  lb.writeUInt32BE(data.length);
  const cb = Buffer.alloc(4);
  cb.writeUInt32BE(crc32(Buffer.concat([tb, data])));
  return Buffer.concat([lb, tb, data, cb]);
}

// IHDR
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 2; // color type: RGB

// Raw scanlines (filter byte 0 per row)
const raw = Buffer.alloc(H * (1 + W * 3));
for (let y = 0; y < H; y++) {
  raw[y * (1 + W * 3)] = 0; // filter: None
  for (let x = 0; x < W; x++) {
    const s = (y * W + x) * 3;
    const d = y * (1 + W * 3) + 1 + x * 3;
    raw[d] = px[s];
    raw[d + 1] = px[s + 1];
    raw[d + 2] = px[s + 2];
  }
}

const idat = zlib.deflateSync(raw, { level: 9 });

const out = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk("IHDR", ihdr),
  chunk("IDAT", idat),
  chunk("IEND", Buffer.alloc(0)),
]);

const outPath = "assets/icon_preview.png";
fs.writeFileSync(outPath, out);
console.log(`✓ Written ${outPath}  (${(out.length / 1024).toFixed(1)} KB)`);
