"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

// =============== Game Types ===============
type Vec = { x: number; y: number };
type PlaneKind = "fighter" | "b52";
type Plane = {
  id: number;
  kind: PlaneKind;
  pos: Vec;
  vel: Vec;
  hp: number;
  maxHp: number;
  dropCooldown: number; // time to next bomb
  width: number;
  height: number;
  alive: boolean;
};
type Bullet = { pos: Vec; vel: Vec; life: number };
type Bomb = { pos: Vec; vel: Vec; alive: boolean };

const CANVAS_W = 900;
const CANVAS_H = 420;
const TARGET_KILLS = 4;

// =============== Helpers ===============
const clamp = (v: number, a: number, b: number) =>
  Math.max(a, Math.min(b, v));

const rand = (a: number, b: number) => a + Math.random() * (b - a);

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r = 8
) {
  const rr = Math.min(r, h / 2, w / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function useDeviceCanvasSize(
  canvasRef: React.RefObject<HTMLCanvasElement | null>
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      const width = CANVAS_W;
      const height = CANVAS_H;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      const ctx = canvas.getContext("2d")!;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [canvasRef]);
}

// =============== Page ===============
export default function GameBanMayBayPage() {
  const [language, setLanguage] = useState<"vi" | "en">("vi");
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => setIsVisible(true), []);

  return (
    <div className="min-h-screen bg-background">
      <Header
        language={language}
        onLanguageChange={() => setLanguage(language === "vi" ? "en" : "vi")}
        title={
          language === "vi"
            ? "Chiến dịch 12 ngày đêm"
            : "12-Day Air Defense"
        }
        subtitle={
          language === "vi"
            ? "Mini game: Bảo vệ mặt trận, bắn hạ máy bay địch"
            : "Mini game: Defend the front, shoot down enemy aircraft"
        }
        isVisible={isVisible}
      />
      {/* Breadcrumb */}
      <div className="border-b bg-card/30">
        <nav className="container mx-auto px-4 py-3">
          <ol className="flex flex-wrap items-center gap-1 text-sm">
            <li>
              <Link href="/" className="hover:underline">
                {language === "vi" ? "Trang chủ" : "Home"}
              </Link>
            </li>
            <li className="opacity-60">/</li>
            <li className="font-medium">
              {language === "vi" ? "Game bắn máy bay" : "Air Defense Game"}
            </li>
          </ol>
        </nav>
      </div>
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px,1fr,300px]">
          {/* LEFT PANEL */}
          <aside className="rounded-xl border bg-gradient-to-b from-emerald-900/80 to-emerald-900/30 p-5 text-emerald-50">
            <p className="text-lg font-semibold">
              {language === "vi"
                ? "Ngày 2: Ta bắn rơi B-52 đầu tiên"
                : "Day 2: First B-52 shot down"}
            </p>
            <p className="text-sm opacity-80">
              {language === "vi" ? "19/12/1972" : "12/19/1972"}
            </p>
            <hr className="my-4 border-emerald-700/60" />
            <p className="text-sm">
              {language === "vi"
                ? "Nhiệm vụ: Bảo vệ sức mạnh mặt trận. Địch sẽ thả bom, đừng để chúng lọt!"
                : "Mission: Protect the front strength. Enemy drops bombs—don’t let them through!"}
            </p>
          </aside>
          {/* GAME BOARD */}
          <GameBoard />
          {/* RIGHT PANEL (tips) */}
          <aside className="rounded-xl border bg-card p-5">
            <p className="mb-2 text-base font-semibold">
              {language === "vi" ? "Điều khiển" : "Controls"}
            </p>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              <li>{language === "vi" ? "Di chuyển chuột để nhắm" : "Move mouse to aim"}</li>
              <li>{language === "vi" ? "Nhấp chuột để bắn" : "Click to shoot"}</li>
              <li>{language === "vi" ? "SPACE để tạm dừng / tiếp tục" : "SPACE to pause/resume"}</li>
            </ul>
            <hr className="my-4" />
            <p className="text-xs text-muted-foreground">
              {language === "vi"
                ? "Mẹo: B-52 bay chậm, trâu máu. Ưu tiên bắn vào giữa thân."
                : "Tip: B-52 is slower but tanky. Aim mid-body."}
            </p>
          </aside>
        </div>
      </main>
      <Footer language={language} isVisible={isVisible} />
    </div>
  );
}

// ==================== Game Component ====================
function GameBoard() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useDeviceCanvasSize(canvasRef);

  const stateRef = useRef({
    running: false,
    last: 0,
    cross: { x: CANVAS_W * 0.55, y: CANVAS_H * 0.55 },
    turretAngle: 0,
    bullets: [] as Bullet[],
    bombs: [] as Bomb[],
    planes: [] as Plane[],
    nextPlaneId: 1,
    kills: 0,
    killedKinds: new Set<PlaneKind>(),
    baseHp: 1000,
    goalReached: false,
    fireCooldown: 0,
  });

  const [paused, setPaused] = useState(false);
  const [kills, setKills] = useState(0);
  const [baseHp, setBaseHp] = useState(1000);
  const [goalReached, setGoalReached] = useState(false);
  const [isStart, setIsStart] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  // Tao chuyển tất cả logic game vào trong component này để nó truy cập được stateRef
  type GameState = typeof stateRef.current;

  function spawnWave(st: GameState, ensureB52 = false) {
    const pushPlane = (kind: PlaneKind) => {
      const id = st.nextPlaneId++;
      const isB52 = kind === "b52";
      const y = rand(60, 220);
      const speed = isB52 ? rand(35, 45) : rand(70, 90);
      const width = isB52 ? 90 : 52;
      const height = isB52 ? 22 : 16;
      const hp = isB52 ? 140 : 60;
      st.planes.push({
        id,
        kind,
        pos: { x: CANVAS_W + rand(20, 120), y },
        vel: { x: -speed, y: rand(-5, 5) },
        hp,
        maxHp: hp,
        dropCooldown: rand(0.8, 1.8),
        width,
        height,
        alive: true,
      });
    };
    pushPlane("fighter");
    pushPlane("fighter");
    pushPlane("fighter");
    pushPlane(ensureB52 ? "b52" : Math.random() < 0.4 ? "b52" : "fighter");
  }

  function update(st: GameState, dt: number) {
    if (st.baseHp <= 0 || st.goalReached) return;
    st.fireCooldown = Math.max(0, st.fireCooldown - dt);

    for (const p of st.planes) {
      if (!p.alive) continue;
      p.pos.x += p.vel.x * dt;
      p.pos.y += p.vel.y * dt;
      if (p.pos.y < 40 || p.pos.y > 260) p.vel.y *= -1;
      p.dropCooldown -= dt;
      if (p.dropCooldown <= 0) {
        st.bombs.push({
          pos: { x: p.pos.x - p.width * 0.2, y: p.pos.y + p.height * 0.5 },
          vel: { x: -10 + Math.random() * 20, y: rand(90, 130) },
          alive: true,
        });
        p.dropCooldown = rand(
          p.kind === "b52" ? 0.5 : 1.2,
          p.kind === "b52" ? 1.1 : 2.0
        );
      }
      if (p.pos.x < -140) {
        p.alive = false;
        st.baseHp = Math.max(0, st.baseHp - (p.kind === "b52" ? 160 : 60));
      }
    }

    st.bullets.forEach((b) => {
      b.pos.x += b.vel.x * dt;
      b.pos.y += b.vel.y * dt;
      b.life -= dt;
    });

    st.bullets = st.bullets.filter(
      (b) =>
        b.life > 0 &&
        b.pos.x >= -20 &&
        b.pos.x <= CANVAS_W + 20 &&
        b.pos.y >= -20 &&
        b.pos.y <= CANVAS_H + 20
    );

    // Thêm kiểu dữ liệu cho 'bo' ở đây
    for (const bo of st.bombs as Bomb[]) {
      if (!bo.alive) continue;
      bo.pos.x += bo.vel.x * dt;
      bo.pos.y += bo.vel.y * dt;
      if (bo.pos.y >= CANVAS_H - 28) {
        bo.alive = false;
        st.baseHp = Math.max(0, st.baseHp - 20);
      }
    }

    st.bombs = st.bombs.filter((bo) => bo.alive && bo.pos.y < CANVAS_H + 10);

    // Thêm kiểu dữ liệu cho 'p' ở đây
    for (const p of st.planes as Plane[]) {
      if (!p.alive) continue;
      for (const b of st.bullets) {
        if (rectCircleCollide(p, b.pos, 4)) {
          b.life = 0;
          p.hp -= 30;
          if (p.hp <= 0) {
            p.alive = false;
            st.kills += 1;
            st.killedKinds.add(p.kind);
          }
        }
      }
    }

    st.planes = st.planes.filter((p) => p.alive);
    if (!st.goalReached && st.planes.length < 3 && st.kills < TARGET_KILLS) {
      const needB52 = !st.killedKinds.has("b52") && st.kills >= 1;
      spawnWave(st, needB52);
    }
    if (st.kills >= TARGET_KILLS && st.killedKinds.has("b52")) {
      st.goalReached = true;
    }
  }

  function rectCircleCollide(rect: Plane, c: Vec, cr: number) {
    const rx = rect.pos.x - rect.width / 2;
    const ry = rect.pos.y - rect.height / 2;
    const cx = clamp(c.x, rx, rx + rect.width);
    const cy = clamp(c.y, ry, ry + rect.height);
    const dx = c.x - cx;
    const dy = c.y - cy;
    return dx * dx + dy * dy <= cr * cr;
  }

  function fire(st: GameState) {
    if (st.fireCooldown > 0 || st.baseHp <= 0 || st.goalReached) return;
    const muzzle: Vec = { x: CANVAS_W * 0.5, y: CANVAS_H - 28 };
    const dir = unit({ x: st.cross.x - muzzle.x, y: st.cross.y - muzzle.y });
    st.bullets.push({
      pos: { x: muzzle.x + dir.x * 20, y: muzzle.y + dir.y * 20 },
      vel: { x: dir.x * 300, y: dir.y * 300 },
      life: 2.2,
    });
    st.fireCooldown = 0.18;
  }

  function unit(v: Vec): Vec {
    const m = Math.hypot(v.x, v.y) || 1;
    return { x: v.x / m, y: v.y / m };
  }

  function draw(canvas: HTMLCanvasElement, st: GameState) {
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
    g.addColorStop(0, "#9cd3f0");
    g.addColorStop(0.5, "#b7e0bf");
    g.addColorStop(1, "#89b37c");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    ctx.fillStyle = "#6c8b6b";
    ctx.beginPath();
    ctx.moveTo(0, CANVAS_H * 0.62);
    ctx.quadraticCurveTo(
      CANVAS_W * 0.25,
      CANVAS_H * 0.52,
      CANVAS_W * 0.5,
      CANVAS_H * 0.6
    );
    ctx.quadraticCurveTo(
      CANVAS_W * 0.75,
      CANVAS_H * 0.68,
      CANVAS_W,
      CANVAS_H * 0.56
    );
    ctx.lineTo(CANVAS_W, CANVAS_H);
    ctx.lineTo(0, CANVAS_H);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "rgba(255,215,0,0.18)";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(0, CANVAS_H - 22);
    ctx.lineTo(CANVAS_W, CANVAS_H - 22);
    ctx.stroke();

    // Thêm kiểu dữ liệu cho 'bo' ở đây
    for (const bo of st.bombs as Bomb[]) {
      ctx.save();
      ctx.translate(bo.pos.x, bo.pos.y);
      ctx.rotate(Math.atan2(bo.vel.y, bo.vel.x));
      ctx.fillStyle = "#8b5e3b";
      drawRoundedRect(ctx, -2, -8, 4, 16, 2);
      ctx.fill();
      ctx.restore();
    }

    // Thêm kiểu dữ liệu cho 'p' ở đây
    for (const p of st.planes as Plane[]) {
      drawPlane(ctx, p);
    }

    const base: Vec = { x: CANVAS_W * 0.5, y: CANVAS_H - 28 };
    const dir = unit({ x: st.cross.x - base.x, y: st.cross.y - base.y });
    const angle = Math.atan2(dir.y, dir.x);
    ctx.save();
    ctx.translate(base.x, base.y);
    ctx.rotate(angle);
    ctx.fillStyle = "#2b2f39";
    drawRoundedRect(ctx, 0, -4, 40, 8, 4);
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.translate(base.x, base.y);
    ctx.fillStyle = "#3a3f4b";
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#6b7280";
    drawRoundedRect(ctx, -30, 12, 60, 8, 4);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = "#ffe082";
    for (const b of st.bullets) {
      ctx.beginPath();
      ctx.arc(b.pos.x, b.pos.y, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.save();
    ctx.translate(st.cross.x, st.cross.y);
    ctx.strokeStyle = "#ff4d4d";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.moveTo(-14, 0);
    ctx.lineTo(-4, 0);
    ctx.moveTo(4, 0);
    ctx.lineTo(14, 0);
    ctx.moveTo(0, -14);
    ctx.lineTo(0, -4);
    ctx.moveTo(0, 4);
    ctx.lineTo(0, 14);
    ctx.stroke();
    ctx.restore();
  }

  function drawPlane(ctx: CanvasRenderingContext2D, p: Plane) {
    ctx.save();
    ctx.translate(p.pos.x, p.pos.y);
    if (p.kind === "b52") {
      ctx.fillStyle = "#2d3842";
      drawRoundedRect(ctx, -45, -8, 90, 18, 8);
      ctx.fill();
      ctx.fillStyle = "#26313a";
      drawRoundedRect(ctx, -25, -16, 50, 8, 3);
      ctx.fill();
      drawRoundedRect(ctx, -20, 8, 40, 6, 3);
      ctx.fill();
      ctx.fillStyle = "#1f2730";
      drawRoundedRect(ctx, -28, -5, 8, 6, 2);
      ctx.fill();
      drawRoundedRect(ctx, 20, -5, 8, 6, 2);
      ctx.fill();
    } else {
      ctx.fillStyle = "#3a4a5a";
      drawRoundedRect(ctx, -26, -6, 52, 14, 7);
      ctx.fill();
      ctx.fillStyle = "#2c3947";
      drawRoundedRect(ctx, -8, -12, 16, 6, 2);
      ctx.fill();
      drawRoundedRect(ctx, -6, 6, 12, 4, 2);
      ctx.fill();
    }
    const pct = clamp(p.hp / p.maxHp, 0, 1);
    ctx.translate(0, -p.height * 0.8 - 6);
    ctx.fillStyle = "rgba(0,0,0,.35)";
    drawRoundedRect(ctx, -18, -3, 36, 6, 3);
    ctx.fill();
    ctx.fillStyle = pct > 0.5 ? "#22c55e" : pct > 0.25 ? "#f59e0b" : "#ef4444";
    drawRoundedRect(ctx, -18, -3, 36 * pct, 6, 3);
    ctx.fill();
    ctx.restore();
  }

  const startGame = () => {
    const st = stateRef.current;
    st.running = true;
    st.last = 0;
    st.cross = { x: CANVAS_W * 0.55, y: CANVAS_H * 0.55 };
    st.bullets = [];
    st.bombs = [];
    st.planes = [];
    st.nextPlaneId = 1;
    st.kills = 0;
    st.killedKinds = new Set<PlaneKind>();
    st.baseHp = 1000;
    st.goalReached = false;
    st.fireCooldown = 0;
    setPaused(false);
    setKills(0);
    setBaseHp(1000);
    setGoalReached(false);
    setIsStart(true);
    setIsGameOver(false);
    spawnWave(st, true);
  };

  useEffect(() => {
    let raf = 0;
    const step = (now: number) => {
      const st = stateRef.current;
      if (!st.running || isGameOver) {
        raf = requestAnimationFrame(step);
        return;
      }
      if (paused) {
        st.last = now;
        raf = requestAnimationFrame(step);
        return;
      }
      const dt = Math.min(33, now - (st.last || now)) / 1000;
      st.last = now;

      update(st, dt);
      const canvas = canvasRef.current;
      if (canvas) {
        draw(canvas, st);
      }
      if (st.baseHp <= 0 || st.goalReached) {
        st.running = false;
        setIsGameOver(true);
      }

      setKills(st.kills);
      setBaseHp(st.baseHp);
      setGoalReached(st.goalReached);

      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [paused, isGameOver]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      stateRef.current.cross.x = clamp(x, 0, CANVAS_W);
      stateRef.current.cross.y = clamp(y, 0, CANVAS_H);
    };
    const onClick = () => fire(stateRef.current);
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (isStart && !isGameOver) {
          togglePause();
        }
      }
    };
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [isStart, isGameOver]);

  const togglePause = () => {
    setPaused((p: boolean) => {
      return !p;
    });
  };

  return (
    <div className="relative rounded-xl border bg-gradient-to-b from-emerald-950 to-emerald-900/70 p-3">
      <div className="mb-3 flex items-center justify-between rounded-lg border bg-neutral-900 px-4 py-2 text-neutral-100">
        <p className="text-center text-lg font-serif font-semibold">
          Mục tiêu:{" "}
          <span className="font-bold">
            Tiêu diệt 4 máy bay (có 1 B-52) trong đêm
          </span>
        </p>
        <button
          onClick={togglePause}
          className="grid h-10 w-10 place-items-center rounded-full border-2 border-yellow-400 bg-yellow-300 text-blue-700 shadow disabled:opacity-50 disabled:cursor-not-allowed"
          title="Pause (Space)"
          disabled={!isStart || isGameOver}
        >
          {paused ? "▶" : "⏸"}
        </button>
      </div>
      <div className="relative mx-auto max-w-[920px]">
        <div className="rounded-xl border-2 border-yellow-400/80 bg-black/20 p-2 shadow-lg">
          <canvas
            ref={canvasRef}
            className="block rounded-lg bg-[#9cd3f0]"
            width={CANVAS_W}
            height={CANVAS_H}
          />
        </div>
        <div className="pointer-events-none absolute left-4 top-4 z-10 rounded bg-black/20 px-2 py-1 text-xs font-bold text-white">
          <span className="text-yellow-400 font-bold">{kills}</span>/
          {TARGET_KILLS}
        </div>
        <div className="pointer-events-none absolute right-6 top-4 z-10 rounded bg-black/20 px-2 py-1 text-xs font-bold text-white">
          {/* Tao đã xóa phần hiển thị thời gian ở đây */}
        </div>
        <div className="absolute left-6 right-6 top-4 flex items-center gap-2 z-20">
          <div className="w-auto text-[11px] font-semibold text-white min-w-[130px] text-right">
            Sức Mạnh Mặt Trận
          </div>
          <div className="h-4 flex-1 rounded bg-neutral-700">
            <div
              className="h-4 rounded bg-green-500 transition-all duration-200"
              style={{ width: `${(baseHp / 1000) * 100}%` }}
            />
          </div>
          <div className="w-auto text-right text-[11px] font-semibold text-white min-w-[50px]">
            {baseHp}/1000
          </div>
        </div>
      </div>
      {!isStart && (
        <div className="absolute inset-0 grid place-items-center">
          <div className="rounded-2xl border bg-card p-6 text-center shadow-xl">
            <h3 className="text-2xl font-bold">Sẵn sàng chiến đấu!</h3>
            <p className="text-sm text-muted-foreground">
              Nhấp vào nút bên dưới để bắt đầu nhiệm vụ.
            </p>
            <button
              onClick={startGame}
              className="mt-4 rounded-full bg-blue-500 px-6 py-2 text-white font-semibold hover:bg-blue-600 transition-colors"
            >
              Bắt đầu
            </button>
          </div>
        </div>
      )}
      {isGameOver && (
        <div className="absolute inset-0 grid place-items-center">
          <div className="rounded-2xl border bg-card p-6 text-center shadow-xl">
            {goalReached ? (
              <>
                <h3 className="text-2xl font-bold">Hoàn thành nhiệm vụ!</h3>
                <p className="text-sm text-muted-foreground">
                  Mày đã tiêu diệt đủ mục tiêu (có ít nhất 1 B-52).
                </p>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-bold">Thất bại!</h3>
                <p className="text-sm text-muted-foreground">
                  Mặt trận bị phá hủy.
                </p>
              </>
            )}
            <button
              onClick={startGame}
              className="mt-4 rounded-full bg-blue-500 px-6 py-2 text-white font-semibold hover:bg-blue-600 transition-colors"
            >
              Chơi Lại
            </button>
          </div>
        </div>
      )}
    </div>
  );
}