import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Dot-matrix breakout. The 404 (and the dead face above it) are the brick wall —
 * every dot is one destructible cell sampled from an offscreen rasterisation, so
 * the artwork is generated from the real Outfit font rather than hand-authored.
 */

const GRID_DESKTOP = { cols: 54, rows: 40 };
const GRID_MOBILE = { cols: 38, rows: 34 };

const STEP = 1 / 120; // fixed physics timestep — 120Hz displays must not run 2x fast
const MAX_PARTICLES = 320;
const START_LIVES = 3;
const BASE_SPEED = 470;
const MAX_SPEED = 900;

function readTokens() {
  const cs = getComputedStyle(document.documentElement);
  const g = (name, fallback) => (cs.getPropertyValue(name) || "").trim() || fallback;
  return {
    text: g("--text", "#F5F5F5"),
    text2: g("--text-2", "#A1A1AA"),
    text3: g("--text-3", "#52525B"),
    accent: g("--accent", "#4ADE80"),
  };
}

/** Rasterise a drawing at dot resolution — 1 offscreen pixel becomes 1 dot. */
function stamp(cols, rows, drawFn) {
  const oc = document.createElement("canvas");
  oc.width = cols;
  oc.height = rows;
  const c = oc.getContext("2d", { willReadFrequently: true });
  c.fillStyle = "#fff";
  c.strokeStyle = "#fff";
  c.lineCap = "round";
  drawFn(c);
  const data = c.getImageData(0, 0, cols, rows).data;
  const out = new Uint8Array(cols * rows);
  for (let i = 0; i < out.length; i++) out[i] = data[i * 4 + 3] > 120 ? 1 : 0;
  return out;
}

function drawFace(c, cols, rows) {
  const r = Math.min(cols * 0.17, rows * 0.2);
  const cx = cols / 2;
  const cy = r + 2;

  c.lineWidth = Math.max(1.4, r * 0.13);
  c.setLineDash([r * 0.5, r * 0.24]);
  c.beginPath();
  c.arc(cx, cy, r, 0, Math.PI * 2);
  c.stroke();
  c.setLineDash([]);

  // x_x eyes
  const ex = r * 0.42;
  const ey = r * 0.18;
  const s = r * 0.2;
  for (const sx of [-ex, ex]) {
    c.beginPath();
    c.moveTo(cx + sx - s, cy - ey - s);
    c.lineTo(cx + sx + s, cy - ey + s);
    c.moveTo(cx + sx + s, cy - ey - s);
    c.lineTo(cx + sx - s, cy - ey + s);
    c.stroke();
  }

  // squiggle mouth
  const mw = r * 0.6;
  const my = cy + r * 0.44;
  c.beginPath();
  for (let i = 0; i <= 24; i++) {
    const t = i / 24;
    const x = cx - mw + 2 * mw * t;
    const y = my + Math.sin(t * Math.PI * 3) * r * 0.12;
    if (i) c.lineTo(x, y);
    else c.moveTo(x, y);
  }
  c.stroke();
}

function drawDigits(c, cols, rows) {
  c.font = '900 100px Outfit, system-ui, sans-serif';
  const w100 = c.measureText("404").width || 180;
  const byWidth = (100 * (cols * 0.96)) / w100;
  const byHeight = (rows * 0.5) / 0.72;
  const size = Math.min(byWidth, byHeight);

  c.font = `900 ${size}px Outfit, system-ui, sans-serif`;
  c.textAlign = "center";
  c.textBaseline = "alphabetic";
  c.fillText("404", cols / 2, rows - 1);
}

export default function Game404({ onExit }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const comboRef = useRef(null);
  const scoreRef = useRef(null);
  const leftRef = useRef(null);
  const livesRef = useRef(null);

  const [phase, setPhase] = useState("ready"); // ready | playing | dead | won

  const G = useRef({
    w: 0,
    h: 0,
    cols: 0,
    rows: 0,
    cell: 0,
    ox: 0,
    oy: 0,
    alive: null,
    tone: null,
    total: 0,
    left: 0,
    paddle: { x: 0, y: 0, w: 150, h: 10 },
    ball: { x: 0, y: 0, vx: 0, vy: 0, r: 7, speed: BASE_SPEED },
    trail: [],
    particles: [],
    lives: START_LIVES,
    score: 0,
    combo: 0,
    best: 0,
    shake: 0,
    flash: 0,
    phase: "ready",
    pointerX: null,
    keys: {},
    acc: 0,
    last: 0,
    colors: null,
  }).current;

  const syncHud = useCallback(() => {
    if (comboRef.current) comboRef.current.textContent = `×${G.combo}`;
    if (scoreRef.current) scoreRef.current.textContent = String(G.score).padStart(4, "0");
    if (leftRef.current) leftRef.current.textContent = String(G.left);
    if (livesRef.current) livesRef.current.textContent = "●".repeat(Math.max(0, G.lives));
  }, [G]);

  /** Lay out the dot field for the current viewport, optionally preserving progress. */
  const layout = useCallback(
    (preserve) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const ctx = canvas.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const mobile = w < 680;
      const { cols, rows } = mobile ? GRID_MOBILE : GRID_DESKTOP;

      const availW = Math.min(w * (mobile ? 0.92 : 0.66), 860);
      const availH = h * 0.6;
      const cell = Math.max(4, Math.min(availW / cols, availH / rows));

      G.w = w;
      G.h = h;
      G.cell = cell;
      G.ox = (w - cols * cell) / 2;
      G.oy = Math.max(h * 0.1, h * 0.13 - cell);

      const sameGrid = preserve && G.cols === cols && G.rows === rows && G.alive;
      G.cols = cols;
      G.rows = rows;

      if (!sameGrid) {
        const face = stamp(cols, rows, (c) => drawFace(c, cols, rows));
        const digits = stamp(cols, rows, (c) => drawDigits(c, cols, rows));
        const alive = new Uint8Array(cols * rows);
        const tone = new Uint8Array(cols * rows);
        let total = 0;
        for (let i = 0; i < alive.length; i++) {
          if (digits[i]) {
            alive[i] = 1;
            tone[i] = 1; // bright
            total++;
          } else if (face[i]) {
            alive[i] = 1;
            tone[i] = 0; // dim
            total++;
          }
        }
        G.alive = alive;
        G.tone = tone;
        G.total = total;
        G.left = total;
      }

      G.paddle.w = Math.max(96, Math.min(w * 0.16, 170));
      G.paddle.y = h - Math.max(64, h * 0.1);
      if (!preserve || G.paddle.x === 0) G.paddle.x = w / 2;
      G.paddle.x = Math.max(G.paddle.w / 2, Math.min(w - G.paddle.w / 2, G.paddle.x));

      if (G.phase === "ready") parkBall();
      syncHud();
    },
    [G, syncHud] // eslint-disable-line react-hooks/exhaustive-deps
  );

  function parkBall() {
    G.ball.x = G.paddle.x;
    G.ball.y = G.paddle.y - G.ball.r - 2;
    G.ball.vx = 0;
    G.ball.vy = 0;
    G.trail.length = 0;
  }

  function launch() {
    if (G.phase !== "ready") return;
    G.phase = "playing";
    setPhase("playing");
    G.ball.speed = BASE_SPEED;
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.5;
    G.ball.vx = Math.cos(angle) * G.ball.speed;
    G.ball.vy = Math.sin(angle) * G.ball.speed;
  }

  const reset = useCallback(() => {
    G.lives = START_LIVES;
    G.score = 0;
    G.combo = 0;
    G.particles.length = 0;
    G.phase = "ready";
    setPhase("ready");
    layout(false);
    parkBall();
    syncHud();
  }, [G, layout, syncHud]); // eslint-disable-line react-hooks/exhaustive-deps

  function burst(x, y, tone, dirX, dirY, label) {
    const p = G.particles;
    if (p.length >= MAX_PARTICLES) p.splice(0, p.length - MAX_PARTICLES + 1);
    p.push({
      x,
      y,
      vx: dirX * (40 + Math.random() * 130) + (Math.random() - 0.5) * 90,
      vy: dirY * (40 + Math.random() * 130) - Math.random() * 120,
      rot: Math.random() * Math.PI,
      vrot: (Math.random() - 0.5) * 9,
      life: 1,
      decay: 0.5 + Math.random() * 0.5,
      size: G.cell * 0.78,
      tone,
      label: label || null,
    });
  }

  /**
   * Clear every live dot within `radius` of an impact. The 404 is a solid mass,
   * so a surface-only ball would take hundreds of passes — the crater is what
   * makes each hit read, and gives the eroded silhouette from the reference.
   */
  function explode(px, py, radius) {
    const { cell, ox, oy, cols, rows, alive } = G;
    const c0 = Math.floor((px - radius - ox) / cell);
    const c1 = Math.floor((px + radius - ox) / cell);
    const r0 = Math.floor((py - radius - oy) / cell);
    const r1 = Math.floor((py + radius - oy) / cell);
    let n = 0;

    for (let r = r0; r <= r1; r++) {
      if (r < 0 || r >= rows) continue;
      for (let c = c0; c <= c1; c++) {
        if (c < 0 || c >= cols) continue;
        const idx = r * cols + c;
        if (!alive[idx]) continue;

        const bx = ox + c * cell;
        const by = oy + r * cell;
        const dx = bx + cell / 2 - px;
        const dy = by + cell / 2 - py;
        if (dx * dx + dy * dy > radius * radius) continue;

        alive[idx] = 0;
        G.left--;
        n++;
        G.combo++;
        G.score += 1 + Math.floor(G.combo / 5);

        const mag = Math.hypot(dx, dy) || 1;
        const label = G.combo % 25 === 0 ? `×${G.combo}` : null;
        burst(bx, by, G.tone[idx], dx / mag, dy / mag, label);
      }
    }
    return n;
  }

  function loseLife() {
    G.lives -= 1;
    G.combo = 0;
    G.shake = 14;
    if (G.lives <= 0) {
      G.phase = "dead";
      setPhase("dead");
    } else {
      G.phase = "ready";
      setPhase("ready");
      parkBall();
    }
    syncHud();
  }

  function step(dt) {
    const { ball, paddle } = G;

    // paddle: pointer wins, keyboard as fallback
    if (G.pointerX != null) {
      paddle.x += (G.pointerX - paddle.x) * Math.min(1, dt * 22);
    }
    const kb = (G.keys.right ? 1 : 0) - (G.keys.left ? 1 : 0);
    if (kb) paddle.x += kb * 780 * dt;
    paddle.x = Math.max(paddle.w / 2, Math.min(G.w - paddle.w / 2, paddle.x));

    if (G.shake > 0) G.shake = Math.max(0, G.shake - dt * 46);
    if (G.flash > 0) G.flash = Math.max(0, G.flash - dt * 3.4);

    for (let i = G.particles.length - 1; i >= 0; i--) {
      const p = G.particles[i];
      p.vy += 1250 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.vrot * dt;
      p.life -= p.decay * dt;
      if (p.life <= 0 || p.y > G.h + 60) G.particles.splice(i, 1);
    }

    if (G.phase === "ready") {
      parkBall();
      return;
    }
    if (G.phase !== "playing") return;

    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;

    G.trail.push(ball.x, ball.y);
    if (G.trail.length > 24) G.trail.splice(0, G.trail.length - 24);

    // walls
    if (ball.x - ball.r < 0) {
      ball.x = ball.r;
      ball.vx = Math.abs(ball.vx);
    } else if (ball.x + ball.r > G.w) {
      ball.x = G.w - ball.r;
      ball.vx = -Math.abs(ball.vx);
    }
    if (ball.y - ball.r < 0) {
      ball.y = ball.r;
      ball.vy = Math.abs(ball.vy);
    }

    // paddle
    if (
      ball.vy > 0 &&
      ball.y + ball.r >= paddle.y &&
      ball.y - ball.r <= paddle.y + paddle.h &&
      ball.x >= paddle.x - paddle.w / 2 - ball.r &&
      ball.x <= paddle.x + paddle.w / 2 + ball.r
    ) {
      const offset = (ball.x - paddle.x) / (paddle.w / 2);
      const angle = -Math.PI / 2 + Math.max(-1, Math.min(1, offset)) * 1.05;
      ball.speed = Math.min(MAX_SPEED, ball.speed + 6);
      ball.vx = Math.cos(angle) * ball.speed;
      ball.vy = Math.sin(angle) * ball.speed;
      ball.y = paddle.y - ball.r - 1;
      if (G.combo > G.best) G.best = G.combo;
      G.combo = 0;
      syncHud();
    }

    // bricks — direct grid lookup, no broadphase needed
    const { cell, ox, oy, cols, rows, alive } = G;
    const c0 = Math.floor((ball.x - ball.r - ox) / cell);
    const c1 = Math.floor((ball.x + ball.r - ox) / cell);
    const r0 = Math.floor((ball.y - ball.r - oy) / cell);
    const r1 = Math.floor((ball.y + ball.r - oy) / cell);

    let hitAxis = null;
    let contact = false;

    // detect only — clearing happens in one blast so the bounce axis stays sane
    for (let r = r0; r <= r1 && !contact; r++) {
      if (r < 0 || r >= rows) continue;
      for (let c = c0; c <= c1; c++) {
        if (c < 0 || c >= cols) continue;
        const idx = r * cols + c;
        if (!alive[idx]) continue;

        const bx = ox + c * cell;
        const by = oy + r * cell;
        const nx = Math.max(bx, Math.min(ball.x, bx + cell));
        const ny = Math.max(by, Math.min(ball.y, by + cell));
        const dx = ball.x - nx;
        const dy = ball.y - ny;
        if (dx * dx + dy * dy > ball.r * ball.r) continue;

        const penX = cell / 2 + ball.r - Math.abs(ball.x - (bx + cell / 2));
        const penY = cell / 2 + ball.r - Math.abs(ball.y - (by + cell / 2));
        hitAxis = penX < penY ? "x" : "y";
        contact = true;
        break;
      }
    }

    const hits = contact ? explode(ball.x, ball.y, cell * 1.9 + ball.r) : 0;

    if (hits) {
      if (hitAxis === "x") ball.vx = -ball.vx;
      else ball.vy = -ball.vy;
      ball.speed = Math.min(MAX_SPEED, ball.speed + hits * 1.6);
      const mag = Math.hypot(ball.vx, ball.vy) || 1;
      ball.vx = (ball.vx / mag) * ball.speed;
      ball.vy = (ball.vy / mag) * ball.speed;
      G.shake = Math.min(10, G.shake + hits * 1.6);
      G.flash = 1;
      syncHud();

      if (G.left <= 0) {
        G.score += 500;
        G.phase = "won";
        setPhase("won");
        syncHud();
      }
    }

    if (ball.y - ball.r > G.h) loseLife();
  }

  function draw(ctx) {
    const { w, h, cell, ox, oy, cols, rows, alive, tone, colors, ball, paddle } = G;
    ctx.clearRect(0, 0, w, h);

    ctx.save();
    if (G.shake > 0.2) {
      ctx.translate((Math.random() - 0.5) * G.shake, (Math.random() - 0.5) * G.shake);
    }

    // dot field
    const dot = cell * 0.74;
    const inset = (cell - dot) / 2;
    for (let r = 0; r < rows; r++) {
      const y = oy + r * cell + inset;
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        if (!alive[idx]) continue;
        ctx.fillStyle = tone[idx] ? colors.text : colors.text3;
        ctx.fillRect(ox + c * cell + inset, y, dot, dot);
      }
    }

    // debris
    for (const p of G.particles) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life));
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.label ? colors.accent : p.tone ? colors.text : colors.text3;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      if (p.label) {
        ctx.fillStyle = colors.accent;
        ctx.font = `600 ${Math.max(9, cell * 1.1)}px JetBrains Mono, monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.label, 0, -cell * 1.6);
      }
      ctx.restore();
    }

    // subtitle, under the wall
    ctx.globalAlpha = 1;
    ctx.fillStyle = colors.text2;
    ctx.font = `500 ${Math.max(11, cell * 1.15)}px JetBrains Mono, monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("( might as well play )", w / 2, oy + rows * cell + cell * 1.6);

    // ball trail
    for (let i = 0; i < G.trail.length; i += 2) {
      const t = i / Math.max(1, G.trail.length - 2);
      ctx.globalAlpha = t * 0.28;
      ctx.fillStyle = colors.accent;
      ctx.beginPath();
      ctx.arc(G.trail[i], G.trail[i + 1], ball.r * (0.3 + t * 0.6), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // ball
    if (G.phase !== "dead") {
      ctx.save();
      ctx.shadowColor = colors.accent;
      ctx.shadowBlur = 18;
      ctx.fillStyle = colors.accent;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // paddle
    ctx.fillStyle = colors.text;
    ctx.fillRect(paddle.x - paddle.w / 2, paddle.y, paddle.w, paddle.h);
    ctx.fillStyle = colors.accent;
    ctx.fillRect(paddle.x - paddle.w / 2, paddle.y, paddle.w, 2);

    ctx.restore();
  }

  // ── main loop ───────────────────────────────────────────────────────────
  useEffect(() => {
    let raf = 0;
    let cancelled = false;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    G.colors = readTokens();

    const start = () => {
      if (cancelled) return;
      layout(false);
      G.last = performance.now();
      const frame = (now) => {
        if (cancelled) return;
        const dt = Math.min(0.05, (now - G.last) / 1000);
        G.last = now;
        G.acc += dt;
        let guard = 0;
        while (G.acc >= STEP && guard++ < 8) {
          step(STEP);
          G.acc -= STEP;
        }
        draw(ctx);
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    };

    // wait for Outfit so the digits rasterise in the real face, not a fallback
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(start);
    else start();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── input ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const onMove = (e) => {
      G.pointerX = e.clientX;
    };
    const onTouch = (e) => {
      if (e.touches && e.touches[0]) {
        G.pointerX = e.touches[0].clientX;
        e.preventDefault();
      }
    };
    const onDown = () => {
      if (G.phase === "ready") launch();
    };
    const onKey = (e) => {
      const k = e.key;
      if (k === "ArrowLeft" || k === "a") G.keys.left = true;
      if (k === "ArrowRight" || k === "d") G.keys.right = true;
      if (k === " " || k === "Spacebar") {
        e.preventDefault();
        if (G.phase === "ready") launch();
        else if (G.phase === "dead" || G.phase === "won") reset();
      }
      if (k === "r" || k === "R") reset();
      if (k === "Escape" && onExit) onExit();
      if (k === "ArrowLeft" || k === "ArrowRight" || k === "ArrowUp" || k === "ArrowDown") {
        e.preventDefault();
      }
    };
    const onKeyUp = (e) => {
      const k = e.key;
      if (k === "ArrowLeft" || k === "a") G.keys.left = false;
      if (k === "ArrowRight" || k === "d") G.keys.right = false;
    };
    const onResize = () => layout(true);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouch, { passive: false });
    window.addEventListener("touchstart", onTouch, { passive: false });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("resize", onResize);
    };
  }, [G, layout, reset, onExit]); // eslint-disable-line react-hooks/exhaustive-deps

  // theme toggle → re-read CSS vars
  useEffect(() => {
    const obs = new MutationObserver(() => {
      G.colors = readTokens();
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, [G]);

  return (
    <div ref={wrapRef} className="absolute inset-0 select-none" data-testid="game-404">
      <canvas ref={canvasRef} className="absolute inset-0 block" />

      {/* combo — top centre, matches the reference's counter position */}
      <div className="pointer-events-none absolute top-5 left-1/2 -translate-x-1/2 font-mono text-[11px] tracking-widest uppercase text-zinc-500">
        combo <span ref={comboRef} className="text-[var(--accent)]">×0</span>
      </div>

      {/* right rail */}
      <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 hidden sm:flex flex-col items-end gap-6 font-mono text-[10px] uppercase tracking-widest text-zinc-600">
        <div className="text-right">
          <div>score</div>
          <div ref={scoreRef} className="mt-1 text-lg tracking-normal text-[var(--text)]">
            0000
          </div>
        </div>
        <div className="text-right">
          <div>dots left</div>
          <div ref={leftRef} className="mt-1 text-lg tracking-normal text-[var(--text)]">
            0
          </div>
        </div>
        <div className="text-right">
          <div>lives</div>
          <div ref={livesRef} className="mt-1 text-lg tracking-[0.2em] text-[var(--accent)]">
            ●●●
          </div>
        </div>
      </div>

      {/* prompts */}
      {phase === "ready" && (
        <div className="pointer-events-none absolute bottom-[16%] left-1/2 -translate-x-1/2 font-mono text-[11px] text-zinc-500">
          <span className="cursor-blink text-[var(--accent)]">▍</span> click or press{" "}
          <span className="text-[var(--text)]">space</span> to launch
        </div>
      )}

      {(phase === "dead" || phase === "won") && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg)]/70 backdrop-blur-sm">
          <div className="text-center font-mono">
            <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">
              {phase === "won" ? "route cleared" : "game over"}
            </p>
            <p className="mt-3 text-3xl text-[var(--text)]">
              {phase === "won" ? "exit 0" : "exit 404"}
            </p>
            <p className="mt-2 text-[12px] text-zinc-500">
              score <span className="text-[var(--accent)]">{G.score}</span> · best combo{" "}
              <span className="text-[var(--accent)]">×{Math.max(G.best, G.combo)}</span>
            </p>
            <button
              data-testid="game-restart"
              onClick={reset}
              className="mt-6 h-10 rounded-full bg-white px-5 text-sm font-medium text-black transition-colors hover:bg-zinc-200"
            >
              play again
            </button>
          </div>
        </div>
      )}

      {/* controls hint */}
      <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] text-zinc-600">
        // move: mouse or <span className="text-zinc-500">← →</span> · restart:{" "}
        <span className="text-zinc-500">r</span> · leave:{" "}
        <span className="text-zinc-500">esc</span>
      </div>
    </div>
  );
}
