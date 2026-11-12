import {
  Component,
  ElementRef,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  Inject,
  PLATFORM_ID,
  NgZone,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

interface TwinkleStar {
  x: number;
  y: number;
  depth: number;
  radius: number;
  baseAlpha: number;
  twinkleSpeed: number;
  phase: number;
  vx: number;
  vy: number;
  color: string;
}

interface SparkleStar {
  x: number;
  y: number;
  depth: number;
  size: number;
  phase: number;
  speed: number;
  vx: number;
  vy: number;
  angle: number;
  rotSpeed: number;
  coreColor: string;
  glowColor: string;
}

interface NebulaMote {
  x: number;
  y: number;
  depth: number;
  radius: number;
  alpha: number;
  vy: number;
  swayAmp: number;
  swayFreq: number;
  phase: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  life: number;
  maxLife: number;
  color: string;
}

@Component({
  selector: 'app-galaxy-background',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="galaxy-backdrop" aria-hidden="true">
      <!-- Layer 1: Deep Indigo-Violet Cosmic Zenith Sky -->
      <div class="cosmic-sky-base"></div>

      <!-- Layer 2: Sweeping Rotating Milky Way Diagonal Nebula Ribbon -->
      <div class="galaxy-ribbon-wrap">
        <div class="galaxy-ribbon-core"></div>
      </div>

      <!-- Layer 3: Sculpted Billowing Cosmic Nebula Clouds (Inspired by Uploaded Galaxy) -->
      <div class="nebula-stage">
        <!-- Back Deep Cloud Bank (Violet Left + Royal Blue Right) -->
        <svg class="nebula-svg nebula-back" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="leftVioletDeep" x1="0%" y1="100%" x2="72%" y2="28%">
              <stop offset="0%" stop-color="#c084fc" stop-opacity="0.92" />
              <stop offset="32%" stop-color="#a855f7" stop-opacity="0.80" />
              <stop offset="68%" stop-color="#6d28d9" stop-opacity="0.52" />
              <stop offset="100%" stop-color="#312e81" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="rightBlueDeep" x1="100%" y1="100%" x2="34%" y2="18%">
              <stop offset="0%" stop-color="#60a5fa" stop-opacity="0.90" />
              <stop offset="38%" stop-color="#3b82f6" stop-opacity="0.72" />
              <stop offset="72%" stop-color="#1d4ed8" stop-opacity="0.45" />
              <stop offset="100%" stop-color="#1e1b4b" stop-opacity="0" />
            </linearGradient>
            <filter id="nebulaSoftBlur" x="-15%" y="-15%" width="130%" height="130%">
              <feGaussianBlur stdDeviation="22" />
            </filter>
          </defs>

          <path
            filter="url(#nebulaSoftBlur)"
            fill="url(#leftVioletDeep)"
            d="M-120,940 L-120,210 C-20,175 70,220 128,288 C195,248 272,272 320,342 C382,315 460,345 505,418 C578,395 655,428 708,495 C776,472 868,512 918,595 C965,578 1045,620 1095,705 L1180,940 Z"
          />

          <path
            filter="url(#nebulaSoftBlur)"
            fill="url(#rightBlueDeep)"
            d="M1720,940 L1720,55 C1610,75 1535,148 1482,228 C1412,218 1345,265 1300,338 C1225,332 1148,382 1102,452 C1020,445 935,498 885,578 C812,568 730,618 665,708 L520,940 Z"
          />
        </svg>

        <!-- Mid Billowing Clouds: Magenta/Orchid Ridge + Electric Cyan Ridge -->
        <svg class="nebula-svg nebula-mid" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="leftOrchidMid" x1="5%" y1="95%" x2="65%" y2="42%">
              <stop offset="0%" stop-color="#f5d0fe" stop-opacity="0.88" />
              <stop offset="28%" stop-color="#e879f9" stop-opacity="0.78" />
              <stop offset="62%" stop-color="#9333ea" stop-opacity="0.46" />
              <stop offset="100%" stop-color="#4c1d95" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="rightCyanMid" x1="95%" y1="90%" x2="40%" y2="28%">
              <stop offset="0%" stop-color="#a5f3fc" stop-opacity="0.85" />
              <stop offset="30%" stop-color="#38bdf8" stop-opacity="0.72" />
              <stop offset="65%" stop-color="#2563eb" stop-opacity="0.44" />
              <stop offset="100%" stop-color="#1e3a8a" stop-opacity="0" />
            </linearGradient>
            <filter id="nebulaMidBlur" x="-15%" y="-15%" width="130%" height="130%">
              <feGaussianBlur stdDeviation="16" />
            </filter>
          </defs>

          <path
            filter="url(#nebulaMidBlur)"
            fill="url(#leftOrchidMid)"
            d="M-100,950 L-100,420 C-15,388 78,415 142,475 C210,432 308,452 365,522 C432,488 525,515 578,582 C645,555 740,595 795,672 C855,650 938,695 992,785 L1080,950 Z"
          />

          <path
            filter="url(#nebulaMidBlur)"
            fill="url(#rightCyanMid)"
            d="M1700,950 L1700,195 C1605,212 1525,282 1468,365 C1395,355 1315,412 1265,488 C1185,482 1105,535 1048,615 C972,608 885,665 825,755 L695,950 Z"
          />
        </svg>

        <!-- Foreground Luminous Cloud Crests + Drifting Nebula Wisps + Supernova Valley Rift -->
        <div class="nebula-crest-glow crest-left-pink"></div>
        <div class="nebula-crest-glow crest-right-cyan"></div>
        <div class="nebula-wisp wisp-violet"></div>
        <div class="nebula-wisp wisp-cyan"></div>
        <div class="nebula-rift-core"></div>
        <div class="nebula-rift-aurora"></div>
      </div>

      <!-- Layer 4: Subtle Cosmic Contrast Veil (Preserves crisp text contrast while keeping vibrant galaxy) -->
      <div class="readability-scrim"></div>

      <!-- Layer 5: 60FPS Sparkling Stars, 4-Point Diamond Flares, Bokeh Motes & Meteors -->
      <canvas #galaxyCanvas class="galaxy-canvas"></canvas>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      overflow: hidden;
    }

    .galaxy-backdrop {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background-color: #070822;
    }

    /* Deep Twilight Indigo-Violet Zenith */
    .cosmic-sky-base {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse 85% 60% at 52% 18%, rgba(49, 46, 129, 0.72) 0%, rgba(23, 25, 86, 0.55) 48%, rgba(7, 8, 34, 0.92) 100%),
        linear-gradient(155deg, #090a2a 0%, #161858 46%, #131c58 76%, #0b113c 100%);
    }

    /* Subtle Diagonal Swirling Galaxy Ribbon */
    .galaxy-ribbon-wrap {
      position: absolute;
      inset: -25%;
      pointer-events: none;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: ribbonDrift 38s ease-in-out infinite alternate;
      will-change: transform, opacity;
    }

    .galaxy-ribbon-core {
      width: 145%;
      height: 58%;
      transform: rotate(-22deg);
      background:
        radial-gradient(ellipse 65% 45% at 50% 50%, rgba(125, 211, 252, 0.16) 0%, rgba(192, 132, 252, 0.14) 38%, rgba(99, 102, 241, 0.08) 65%, transparent 85%);
      filter: blur(42px);
      mix-blend-mode: screen;
    }

    @keyframes ribbonDrift {
      0% { transform: translate3d(-2%, 1%, 0) scale(1) rotate(0deg); opacity: 0.78; }
      50% { transform: translate3d(1.5%, -1.5%, 0) scale(1.04) rotate(1.5deg); opacity: 0.95; }
      100% { transform: translate3d(2.5%, 1.5%, 0) scale(1.01) rotate(-1deg); opacity: 0.82; }
    }

    /* Nebula Clouds Container */
    .nebula-stage {
      position: absolute;
      inset: 0;
      overflow: hidden;
    }

    .nebula-svg {
      position: absolute;
      inset: -6%;
      width: 112%;
      height: 112%;
      will-change: transform, opacity;
    }

    .nebula-back {
      opacity: 0.78;
      animation: cloudSwellSlow 32s ease-in-out infinite alternate;
    }

    .nebula-mid {
      opacity: 0.72;
      mix-blend-mode: screen;
      animation: cloudSwellReverse 25s ease-in-out infinite alternate;
    }

    @keyframes cloudSwellSlow {
      0% { transform: translate3d(-1.4%, 1%, 0) scale(1.01); }
      50% { transform: translate3d(0.8%, -0.8%, 0) scale(1.035); }
      100% { transform: translate3d(1.8%, 0.6%, 0) scale(1.02); }
    }

    @keyframes cloudSwellReverse {
      0% { transform: translate3d(1.5%, -0.6%, 0) scale(1.03); opacity: 0.66; }
      50% { transform: translate3d(-0.6%, 1.2%, 0) scale(1); opacity: 0.82; }
      100% { transform: translate3d(-1.6%, -0.4%, 0) scale(1.04); opacity: 0.70; }
    }

    /* Soft Billowing Rim Halos & Valley Rift Glow */
    .nebula-crest-glow {
      position: absolute;
      border-radius: 50%;
      filter: blur(78px);
      mix-blend-mode: screen;
      will-change: transform, opacity;
    }

    .crest-left-pink {
      width: 58vw;
      height: 52vh;
      min-width: 420px;
      min-height: 360px;
      left: -10vw;
      bottom: -14vh;
      background: radial-gradient(circle at 42% 58%, rgba(240, 171, 252, 0.45) 0%, rgba(192, 132, 252, 0.34) 42%, rgba(147, 51, 234, 0.14) 70%, transparent 100%);
      animation: leftCrestPulse 20s ease-in-out infinite alternate;
    }

    .crest-right-cyan {
      width: 58vw;
      height: 56vh;
      min-width: 420px;
      min-height: 380px;
      right: -10vw;
      bottom: -12vh;
      background: radial-gradient(circle at 58% 48%, rgba(165, 243, 252, 0.42) 0%, rgba(56, 189, 248, 0.34) 40%, rgba(37, 99, 235, 0.16) 72%, transparent 100%);
      animation: rightCrestPulse 22s ease-in-out infinite alternate;
    }

    @keyframes leftCrestPulse {
      0% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.72; }
      100% { transform: translate3d(3vw, -2vh, 0) scale(1.08); opacity: 0.92; }
    }

    @keyframes rightCrestPulse {
      0% { transform: translate3d(0, 0, 0) scale(1.04); opacity: 0.75; }
      100% { transform: translate3d(-2.5vw, -2.5vh, 0) scale(0.98); opacity: 0.94; }
    }

    /* Supernova Core at Cloud Valley */
    .nebula-rift-core {
      position: absolute;
      left: 58%;
      top: 56%;
      width: 44vw;
      height: 38vh;
      min-width: 340px;
      min-height: 260px;
      transform: translate(-50%, -50%);
      background: radial-gradient(
        ellipse at center,
        rgba(224, 242, 254, 0.48) 0%,
        rgba(103, 232, 249, 0.34) 24%,
        rgba(167, 139, 250, 0.22) 52%,
        transparent 78%
      );
      filter: blur(48px);
      mix-blend-mode: screen;
      animation: coreBreathe 14s ease-in-out infinite alternate;
      will-change: transform, opacity;
    }

    .nebula-rift-aurora {
      position: absolute;
      left: 44%;
      top: 46%;
      width: 66vw;
      height: 46vh;
      transform: translate(-50%, -50%) rotate(-18deg);
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(217, 70, 239, 0.16) 25%,
        rgba(125, 211, 252, 0.22) 55%,
        rgba(59, 130, 246, 0.16) 80%,
        transparent 100%
      );
      filter: blur(55px);
      mix-blend-mode: screen;
      animation: auroraSweep 28s ease-in-out infinite alternate;
      will-change: transform, opacity;
    }

    @keyframes coreBreathe {
      0% { transform: translate(-50%, -50%) scale(0.92); opacity: 0.65; }
      50% { transform: translate(-48%, -52%) scale(1.08); opacity: 0.95; }
      100% { transform: translate(-51%, -49%) scale(0.98); opacity: 0.78; }
    }

    @keyframes auroraSweep {
      0% { transform: translate(-52%, -48%) rotate(-18deg) scaleX(0.96); opacity: 0.58; }
      100% { transform: translate(-46%, -52%) rotate(-14deg) scaleX(1.06); opacity: 0.85; }
    }

    /* Gliding Nebula Mist Wisps for Perceptible Cloud Motion */
    .nebula-wisp {
      position: absolute;
      border-radius: 50%;
      filter: blur(52px);
      mix-blend-mode: screen;
      will-change: transform, opacity;
    }

    .wisp-violet {
      width: 46vw;
      height: 26vh;
      left: 6%;
      bottom: 8%;
      background: radial-gradient(ellipse at center, rgba(244, 114, 182, 0.36) 0%, rgba(192, 132, 252, 0.24) 48%, transparent 80%);
      transform: rotate(-16deg);
      animation: wispFloatViolet 17s ease-in-out infinite alternate;
    }

    .wisp-cyan {
      width: 48vw;
      height: 28vh;
      right: 4%;
      top: 28%;
      background: radial-gradient(ellipse at center, rgba(125, 211, 252, 0.34) 0%, rgba(56, 189, 248, 0.22) 48%, transparent 80%);
      transform: rotate(-20deg);
      animation: wispFloatCyan 19s ease-in-out infinite alternate;
    }

    @keyframes wispFloatViolet {
      0% { transform: translate3d(-4vw, 2vh, 0) rotate(-16deg) scale(0.96); opacity: 0.65; }
      100% { transform: translate3d(5vw, -3vh, 0) rotate(-11deg) scale(1.08); opacity: 0.92; }
    }

    @keyframes wispFloatCyan {
      0% { transform: translate3d(4vw, -2vh, 0) rotate(-20deg) scale(1.04); opacity: 0.65; }
      100% { transform: translate3d(-5vw, 3vh, 0) rotate(-15deg) scale(0.96); opacity: 0.92; }
    }

    /* Gentle Balanced Scrim so Luminous Galaxy Clouds Stay Vivid & UI Stays Readable */
    .readability-scrim {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        180deg,
        rgba(6, 7, 26, 0.26) 0%,
        rgba(6, 8, 28, 0.12) 52%,
        rgba(6, 8, 28, 0.22) 100%
      );
    }

    .galaxy-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      display: block;
    }

    @media (prefers-reduced-motion: reduce) {
      .galaxy-ribbon-wrap,
      .nebula-back,
      .nebula-mid,
      .crest-left-pink,
      .crest-right-cyan,
      .nebula-wisp,
      .nebula-rift-core,
      .nebula-rift-aurora {
        animation: none !important;
      }
    }
  `]
})
export class GalaxyBackgroundComponent implements AfterViewInit, OnDestroy {
  @ViewChild('galaxyCanvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private isBrowser: boolean;
  private animId: number | null = null;
  private resizeHandler?: () => void;
  private mouseHandler?: (e: MouseEvent) => void;
  private visibilityHandler?: () => void;

  private width = 0;
  private height = 0;
  private dpr = 1;
  private reduceMotion = false;

  private stars: TwinkleStar[] = [];
  private sparkles: SparkleStar[] = [];
  private motes: NebulaMote[] = [];
  private meteors: ShootingStar[] = [];

  private mouseTargetX = 0;
  private mouseTargetY = 0;
  private parallaxX = 0;
  private parallaxY = 0;

  private lastTime = 0;
  private elapsedTime = 0;
  private nextMeteorDelay = 2.6;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private ngZone: NgZone
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    this.reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    this.ngZone.runOutsideAngular(() => {
      this.setupCanvas();
      this.seedGalaxyField();

      this.resizeHandler = () => {
        this.setupCanvas();
        this.seedGalaxyField();
      };
      window.addEventListener('resize', this.resizeHandler, { passive: true });

      this.mouseHandler = (e: MouseEvent) => {
        if (!this.width || !this.height) return;
        this.mouseTargetX = (e.clientX / this.width - 0.5) * 2;
        this.mouseTargetY = (e.clientY / this.height - 0.5) * 2;
      };
      window.addEventListener('mousemove', this.mouseHandler, { passive: true });

      this.visibilityHandler = () => {
        if (document.hidden) {
          this.stopLoop();
        } else {
          this.lastTime = performance.now();
          this.startLoop();
        }
      };
      document.addEventListener('visibilitychange', this.visibilityHandler);

      this.lastTime = performance.now();
      if (this.reduceMotion) {
        this.drawFrame(0);
      } else {
        this.startLoop();
      }
    });
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;
    this.stopLoop();
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }
    if (this.mouseHandler) {
      window.removeEventListener('mousemove', this.mouseHandler);
    }
    if (this.visibilityHandler) {
      document.removeEventListener('visibilitychange', this.visibilityHandler);
    }
  }

  private setupCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    canvas.width = Math.floor(this.width * this.dpr);
    canvas.height = Math.floor(this.height * this.dpr);
  }

  private seedGalaxyField(): void {
    const area = this.width * this.height;
    const starCount = Math.min(380, Math.max(180, Math.floor(area / 5400)));
    const sparkleCount = Math.min(34, Math.max(16, Math.floor(area / 62000)));
    const moteCount = Math.min(52, Math.max(24, Math.floor(area / 40000)));

    const starColors = [
      '#ffffff',
      '#ffffff',
      '#e0f2fe',
      '#bae6fd',
      '#f5d0fe',
      '#e9d5ff',
      '#fef9c3',
    ];

    this.stars = Array.from({ length: starCount }, () => {
      const depth = 0.25 + Math.random() * 0.75;
      // Bias slightly denser starfield in upper sky & diagonal galaxy band like the photo
      const yBias = Math.random() < 0.72 ? Math.random() * 0.78 : Math.random();
      return {
        x: Math.random() * this.width,
        y: yBias * this.height,
        depth,
        radius: 0.55 + Math.random() * 1.45 * depth,
        baseAlpha: 0.32 + Math.random() * 0.68,
        twinkleSpeed: 0.9 + Math.random() * 2.4,
        phase: Math.random() * Math.PI * 2,
        vx: (0.8 + Math.random() * 1.6) * depth * (Math.random() < 0.5 ? 1 : 0.4),
        vy: (-0.5 - Math.random() * 1.2) * depth,
        color: starColors[Math.floor(Math.random() * starColors.length)],
      };
    });

    const sparklePalettes = [
      { core: '#ffffff', glow: 'rgba(125, 211, 252, 0.85)' },
      { core: '#ffffff', glow: 'rgba(240, 171, 252, 0.85)' },
      { core: '#f0f9ff', glow: 'rgba(56, 189, 248, 0.9)' },
      { core: '#fdf4ff', glow: 'rgba(192, 132, 252, 0.85)' },
    ];

    this.sparkles = Array.from({ length: sparkleCount }, (_, idx) => {
      const palette = sparklePalettes[idx % sparklePalettes.length];
      // Place 2-3 focal bright sparkles near the center rift valley just like the image
      const isRiftBeacon = idx < 3;
      const x = isRiftBeacon
        ? this.width * (0.46 + Math.random() * 0.16)
        : Math.random() * this.width;
      const y = isRiftBeacon
        ? this.height * (0.34 + Math.random() * 0.24)
        : (0.06 + Math.random() * 0.84) * this.height;
      const depth = isRiftBeacon ? 0.95 : 0.45 + Math.random() * 0.55;

      return {
        x,
        y,
        depth,
        size: isRiftBeacon ? 10 + Math.random() * 6 : 5.5 + Math.random() * 7.5,
        phase: Math.random() * Math.PI * 2,
        speed: 1.1 + Math.random() * 1.8,
        vx: (0.6 + Math.random() * 1.2) * depth,
        vy: (-0.4 - Math.random() * 0.9) * depth,
        angle: (Math.random() - 0.5) * 0.25,
        rotSpeed: (Math.random() - 0.5) * 0.08,
        coreColor: palette.core,
        glowColor: palette.glow,
      };
    });

    const moteColors = [
      'rgba(240, 171, 252, 0.55)',
      'rgba(192, 132, 252, 0.5)',
      'rgba(103, 232, 249, 0.52)',
      'rgba(147, 197, 253, 0.5)',
      'rgba(255, 255, 255, 0.48)',
    ];

    this.motes = Array.from({ length: moteCount }, () => {
      const depth = 0.4 + Math.random() * 0.6;
      return {
        x: Math.random() * this.width,
        y: (0.22 + Math.random() * 0.78) * this.height,
        depth,
        radius: 2.2 + Math.random() * 5.2,
        alpha: 0.12 + Math.random() * 0.28,
        vy: -(5 + Math.random() * 9) * depth,
        swayAmp: 6 + Math.random() * 14,
        swayFreq: 0.35 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        color: moteColors[Math.floor(Math.random() * moteColors.length)],
      };
    });
  }

  private startLoop(): void {
    if (this.animId !== null) return;
    const tick = (now: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - this.lastTime) / 1000));
      this.lastTime = now;
      this.drawFrame(dt);
      this.animId = requestAnimationFrame(tick);
    };
    this.animId = requestAnimationFrame(tick);
  }

  private stopLoop(): void {
    if (this.animId !== null) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  private spawnMeteor(): void {
    const startFromLeft = Math.random() < 0.72;
    const x = startFromLeft
      ? this.width * (0.05 + Math.random() * 0.55)
      : this.width * (0.45 + Math.random() * 0.45);
    const y = this.height * (0.03 + Math.random() * 0.34);
    const speed = 520 + Math.random() * 340;
    const angle = startFromLeft ? 0.32 + Math.random() * 0.22 : Math.PI - (0.32 + Math.random() * 0.22);

    this.meteors.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      length: 95 + Math.random() * 85,
      life: 0,
      maxLife: 0.65 + Math.random() * 0.45,
      color: Math.random() < 0.5 ? '#bae6fd' : '#f5d0fe',
    });
  }

  private drawFrame(dt: number): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx || !this.width || !this.height) return;

    this.elapsedTime += dt;

    // Smooth parallax interpolation
    this.parallaxX += (this.mouseTargetX * 14 - this.parallaxX) * 0.05;
    this.parallaxY += (this.mouseTargetY * 10 - this.parallaxY) * 0.05;

    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Floating Nebula Bokeh Motes (behind pinpoint stars)
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const m of this.motes) {
      m.y += m.vy * dt;
      if (m.y < -20) {
        m.y = this.height + 20;
        m.x = Math.random() * this.width;
      }

      const swayX = Math.sin(this.elapsedTime * m.swayFreq + m.phase) * m.swayAmp;
      const drawX = m.x + swayX + this.parallaxX * m.depth * 1.1;
      const drawY = m.y + this.parallaxY * m.depth * 1.1;
      const pulse = 0.65 + 0.35 * Math.sin(this.elapsedTime * 1.2 + m.phase);

      const grad = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, m.radius * 2.4);
      grad.addColorStop(0, m.color);
      grad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.globalAlpha = m.alpha * pulse;
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(drawX, drawY, m.radius * 2.4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 2. Crisp Twinkling Pinpoint Starfield
    for (const s of this.stars) {
      s.x += s.vx * dt;
      s.y += s.vy * dt;

      if (s.x > this.width + 8) s.x = -8;
      if (s.y < -8) s.y = this.height + 8;

      const px = s.x + this.parallaxX * s.depth * 0.65;
      const py = s.y + this.parallaxY * s.depth * 0.65;

      const twinkleWave = 0.5 + 0.5 * Math.sin(this.elapsedTime * s.twinkleSpeed + s.phase);
      const twinkle = 0.25 + 0.75 * Math.pow(twinkleWave, 1.35);
      const alpha = s.baseAlpha * twinkle;

      ctx.globalAlpha = alpha;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(px, py, s.radius, 0, Math.PI * 2);
      ctx.fill();

      // Subtle glow ring on larger stars
      if (s.radius > 1.25) {
        ctx.globalAlpha = alpha * 0.34;
        ctx.beginPath();
        ctx.arc(px, py, s.radius * 2.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 3. Prominent 4-Point Diamond Sparkling Stars
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const sp of this.sparkles) {
      sp.x += sp.vx * dt;
      sp.y += sp.vy * dt;
      sp.angle += sp.rotSpeed * dt;

      if (sp.x > this.width + 20) sp.x = -20;
      if (sp.y < -20) sp.y = this.height + 20;

      const px = sp.x + this.parallaxX * sp.depth * 1.25;
      const py = sp.y + this.parallaxY * sp.depth * 1.25;

      const rawSin = 0.5 + 0.5 * Math.sin(this.elapsedTime * sp.speed + sp.phase);
      const pulse = 0.38 + 0.62 * Math.pow(rawSin, 1.8);
      const flare = sp.size * (0.78 + 0.48 * pulse);

      // Soft corona halo
      const halo = ctx.createRadialGradient(px, py, 0, px, py, flare * 2.1);
      halo.addColorStop(0, sp.coreColor);
      halo.addColorStop(0.28, sp.glowColor);
      halo.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.globalAlpha = 0.65 * pulse;
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(px, py, flare * 2.1, 0, Math.PI * 2);
      ctx.fill();

      // 4-point diffraction star spikes
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(sp.angle);
      ctx.globalAlpha = 0.45 + 0.55 * pulse;
      ctx.fillStyle = sp.coreColor;

      const armLong = flare * 1.55;
      const armThin = Math.max(0.85, flare * 0.14);

      ctx.beginPath();
      ctx.moveTo(0, -armLong);
      ctx.quadraticCurveTo(armThin, -armThin, armLong, 0);
      ctx.quadraticCurveTo(armThin, armThin, 0, armLong);
      ctx.quadraticCurveTo(-armThin, armThin, -armLong, 0);
      ctx.quadraticCurveTo(-armThin, -armThin, 0, -armLong);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();

    // 4. Shimmering Shooting Stars across Indigo Zenith
    if (!this.reduceMotion) {
      this.nextMeteorDelay -= dt;
      if (this.nextMeteorDelay <= 0) {
        this.spawnMeteor();
        this.nextMeteorDelay = 3.2 + Math.random() * 4.2;
      }
    }

    if (this.meteors.length > 0) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = this.meteors.length - 1; i >= 0; i--) {
        const m = this.meteors[i];
        m.life += dt;
        m.x += m.vx * dt;
        m.y += m.vy * dt;

        if (m.life >= m.maxLife) {
          this.meteors.splice(i, 1);
          continue;
        }

        const progress = m.life / m.maxLife;
        const alpha = progress < 0.2 ? progress / 0.2 : 1 - (progress - 0.2) / 0.8;
        const speedMag = Math.hypot(m.vx, m.vy) || 1;
        const tailX = m.x - (m.vx / speedMag) * m.length;
        const tailY = m.y - (m.vy / speedMag) * m.length;

        const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.28, m.color);
        grad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.globalAlpha = Math.max(0, alpha * 0.88);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.1;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        // Bright meteor head
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(m.x, m.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    ctx.globalAlpha = 1;
  }
}

