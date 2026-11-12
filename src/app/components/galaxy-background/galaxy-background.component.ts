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

interface VolumetricBeam {
  originXFrac: number;
  originYFrac: number;
  angle: number;
  lengthFrac: number;
  baseWidth: number;
  endWidth: number;
  alpha: number;
  phase: number;
  speed: number;
  swayAmp: number;
  depth: number;
  colorInner: string;
  colorMid: string;
}

interface MicroStar {
  x: number;
  y: number;
  depth: number;
  radius: number;
  maxAlpha: number;
  fadeSpeed: number;
  phase: number;
  vx: number;
  vy: number;
  color: string;
}

interface TinyGlint {
  x: number;
  y: number;
  depth: number;
  armLength: number;
  phase: number;
  speed: number;
  vx: number;
  vy: number;
  angle: number;
  color: string;
}

interface CosmicDew {
  x: number;
  y: number;
  depth: number;
  radius: number;
  tailLength: number;
  vx: number;
  vy: number;
  swayAmp: number;
  swayFreq: number;
  phase: number;
  fadeSpeed: number;
  maxAlpha: number;
  color: string;
}

interface HorizonEmber {
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

interface WaterSpecularStreak {
  xFrac: number;
  yFrac: number;
  width: number;
  thickness: number;
  phase: number;
  speed: number;
  driftAmp: number;
  alpha: number;
  color: string;
}

interface AnimeMeteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  width: number;
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
      <!-- Layer 1: Full-Bleed Animated Twilight Sky & Sunset Extension -->
      <div class="ambient-wings-wrap" [style.transform]="parallaxStyle(0.30)">
        <img
          src="/assets/galaxy-bg.jpg"
          alt=""
          class="bg-wings-img"
          decoding="async"
        />
      </div>

      <!-- Layer 2: Crisp Feathered Artwork Stage + Sky-Only Moving Cloud Mist Veil -->
      <div class="artwork-stage" [style.transform]="parallaxStyle(0.66)">
        <div class="artwork-kenburns-wrap">
          <img
            src="/assets/galaxy-bg.jpg"
            alt=""
            class="bg-artwork-img"
            decoding="async"
          />
          <img
            src="/assets/galaxy-bg.jpg"
            alt=""
            class="bg-sky-cloud-veil"
            decoding="async"
          />
        </div>
      </div>

      <!-- Layer 3: HDRP Volumetric Light Shafts, Milky Way Canyon Glow & Horizon Water Shimmer -->
      <div class="hdrp-atmosphere-layer">
        <div class="hdrp-godray hdrp-godray-cyan"></div>
        <div class="hdrp-godray hdrp-godray-violet"></div>
        <div class="milkyway-core-glow"></div>
        <div class="cloud-drift cloud-drift-violet"></div>
        <div class="cloud-drift cloud-drift-cyan"></div>
        <div class="horizon-sunset-pulse"></div>
        <div class="water-shimmer-band"></div>
      </div>

      <!-- Layer 4: Balanced Contrast Vignette Over Artwork Only (Protects Foreground UI Readability) -->
      <div class="readability-scrim"></div>

      <!-- Layer 5: 60FPS HiDPI Shooting Stars, Cosmic Dew, Micro-Stars, Horizon Embers & Water Glints -->
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
      view-transition-name: galaxy-sky;
    }

    .galaxy-backdrop {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: linear-gradient(180deg, #090b28 0%, #151446 56%, #1c1238 100%);
    }

    /* Layer 1: Full-Bleed Animated Wings */
    .ambient-wings-wrap {
      position: absolute;
      inset: -7%;
      will-change: transform;
      transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .bg-wings-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center 60%;
      filter: blur(26px) saturate(1.22) contrast(1.05) brightness(0.76);
      animation: wingsFlowMotion 20s ease-in-out infinite alternate;
      will-change: transform;
      user-select: none;
      pointer-events: none;
    }

    @keyframes wingsFlowMotion {
      0% { transform: scale(1.12) translate3d(-1.5%, 1%, 0); }
      100% { transform: scale(1.18) translate3d(1.5%, -1.2%, 0); }
    }

    /* Layer 2: Feathered Primary Artwork Stage + Sky-Only Moving Veil */
    .artwork-stage {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      will-change: transform;
      transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .artwork-kenburns-wrap {
      position: relative;
      width: min(100vw, 1220px);
      height: 100%;
      overflow: hidden;
      -webkit-mask-image: linear-gradient(
        90deg,
        transparent 0%,
        rgba(0, 0, 0, 0.62) 10%,
        #000000 22%,
        #000000 78%,
        rgba(0, 0, 0, 0.62) 90%,
        transparent 100%
      );
      mask-image: linear-gradient(
        90deg,
        transparent 0%,
        rgba(0, 0, 0, 0.62) 10%,
        #000000 22%,
        #000000 78%,
        rgba(0, 0, 0, 0.62) 90%,
        transparent 100%
      );
    }

    .bg-artwork-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center 62%;
      animation: cosmicKenBurns 19s ease-in-out infinite alternate;
      will-change: transform, filter;
      user-select: none;
      pointer-events: none;
    }

    /* Masked Sky-Only Translucent Milky Way Veil (Swirls Clouds Above Without Doubling Silhouette Figure) */
    .bg-sky-cloud-veil {
      position: absolute;
      inset: -5%;
      width: 110%;
      height: 110%;
      object-fit: cover;
      object-position: center 36%;
      mix-blend-mode: screen;
      opacity: 0.30;
      filter: blur(14px) saturate(1.28);
      -webkit-mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.92) 0%, #000000 50%, transparent 72%);
      mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.92) 0%, #000000 50%, transparent 72%);
      animation: skyVeilDrift 15s ease-in-out infinite alternate;
      will-change: transform, opacity;
      user-select: none;
      pointer-events: none;
    }

    @keyframes cosmicKenBurns {
      0% {
        transform: scale(1.03) translate3d(-0.9%, 0.7%, 0);
        filter: blur(0.45px) saturate(1.12) contrast(1.06) brightness(0.84);
      }
      50% {
        transform: scale(1.085) translate3d(0.8%, -1.0%, 0);
        filter: blur(0.35px) saturate(1.18) contrast(1.08) brightness(0.91);
      }
      100% {
        transform: scale(1.05) translate3d(-0.4%, -0.3%, 0);
        filter: blur(0.45px) saturate(1.14) contrast(1.07) brightness(0.87);
      }
    }

    @keyframes skyVeilDrift {
      0% {
        transform: scale(1.06) translate3d(2.8%, -1.8%, 0) rotate(1.4deg);
        opacity: 0.22;
      }
      50% {
        transform: scale(1.13) translate3d(-2.4%, 1.4%, 0) rotate(-1.2deg);
        opacity: 0.38;
      }
      100% {
        transform: scale(1.09) translate3d(1.6%, 1.8%, 0) rotate(0.8deg);
        opacity: 0.26;
      }
    }

    /* Layer 3: HDRP Volumetric Atmosphere & Horizon Mirror Water Glow */
    .hdrp-atmosphere-layer {
      position: absolute;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
    }

    .hdrp-godray {
      position: absolute;
      top: -20%;
      height: 138%;
      pointer-events: none;
      filter: blur(46px);
      mix-blend-mode: screen;
      will-change: transform, opacity;
    }

    .hdrp-godray-cyan {
      left: 16%;
      width: 24vw;
      transform: rotate(-16deg);
      background: linear-gradient(
        180deg,
        rgba(125, 211, 252, 0.18) 0%,
        rgba(56, 189, 248, 0.09) 46%,
        transparent 88%
      );
      animation: godRaySweepA 12s ease-in-out infinite alternate;
    }

    .hdrp-godray-violet {
      right: 14%;
      width: 22vw;
      transform: rotate(15deg);
      background: linear-gradient(
        180deg,
        rgba(192, 132, 252, 0.16) 0%,
        rgba(129, 140, 248, 0.08) 48%,
        transparent 88%
      );
      animation: godRaySweepB 14s ease-in-out infinite alternate;
    }

    @keyframes godRaySweepA {
      0% { transform: rotate(-18deg) translateX(-3vw); opacity: 0.48; }
      100% { transform: rotate(-12deg) translateX(4vw); opacity: 0.86; }
    }

    @keyframes godRaySweepB {
      0% { transform: rotate(17deg) translateX(3vw); opacity: 0.44; }
      100% { transform: rotate(11deg) translateX(-4vw); opacity: 0.82; }
    }

    .milkyway-core-glow {
      position: absolute;
      left: 50%;
      top: 38%;
      width: 44vw;
      height: 60vh;
      transform: translate(-50%, -50%) rotate(-12deg);
      background: radial-gradient(
        ellipse at center,
        rgba(125, 211, 252, 0.22) 0%,
        rgba(167, 139, 250, 0.16) 40%,
        rgba(232, 121, 249, 0.09) 66%,
        transparent 86%
      );
      filter: blur(46px);
      mix-blend-mode: screen;
      animation: corePulseBreath 9s ease-in-out infinite alternate;
      will-change: transform, opacity;
    }

    @keyframes corePulseBreath {
      0% { transform: translate(-50%, -50%) rotate(-12deg) scale(0.94); opacity: 0.48; }
      100% { transform: translate(-48%, -52%) rotate(-9deg) scale(1.10); opacity: 0.88; }
    }

    .cloud-drift {
      position: absolute;
      border-radius: 50%;
      filter: blur(56px);
      mix-blend-mode: screen;
      will-change: transform, opacity;
    }

    .cloud-drift-violet {
      width: 58vw;
      height: 28vh;
      left: -8vw;
      top: 42%;
      background: radial-gradient(
        ellipse at center,
        rgba(192, 132, 252, 0.20) 0%,
        rgba(244, 114, 182, 0.12) 48%,
        transparent 80%
      );
      animation: cloudDriftRight 14s ease-in-out infinite alternate;
    }

    .cloud-drift-cyan {
      width: 54vw;
      height: 28vh;
      right: -8vw;
      top: 22%;
      background: radial-gradient(
        ellipse at center,
        rgba(56, 189, 248, 0.18) 0%,
        rgba(129, 140, 248, 0.14) 50%,
        transparent 82%
      );
      animation: cloudDriftLeft 16s ease-in-out infinite alternate;
    }

    @keyframes cloudDriftRight {
      0% { transform: translate3d(-5vw, 0, 0) scale(0.95); opacity: 0.48; }
      100% { transform: translate3d(7vw, -2vh, 0) scale(1.07); opacity: 0.84; }
    }

    @keyframes cloudDriftLeft {
      0% { transform: translate3d(5vw, 1.5vh, 0) scale(1.05); opacity: 0.46; }
      100% { transform: translate3d(-6vw, -2vh, 0) scale(0.94); opacity: 0.82; }
    }

    .horizon-sunset-pulse {
      position: absolute;
      left: 50%;
      bottom: -6vh;
      width: 84vw;
      height: 26vh;
      transform: translateX(-50%);
      background: radial-gradient(
        ellipse at center bottom,
        rgba(253, 186, 116, 0.22) 0%,
        rgba(251, 113, 133, 0.16) 44%,
        rgba(168, 85, 247, 0.07) 72%,
        transparent 92%
      );
      filter: blur(40px);
      mix-blend-mode: screen;
      animation: horizonGlowWave 10s ease-in-out infinite alternate;
    }

    .water-shimmer-band {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 13vh;
      background: linear-gradient(
        90deg,
        transparent 10%,
        rgba(253, 224, 71, 0.05) 36%,
        rgba(251, 146, 60, 0.10) 50%,
        rgba(244, 114, 182, 0.06) 66%,
        transparent 90%
      );
      filter: blur(14px);
      mix-blend-mode: screen;
      animation: waterRippleDrift 7s ease-in-out infinite alternate;
    }

    @keyframes horizonGlowWave {
      0% { opacity: 0.54; transform: translateX(-50%) scaleX(0.95); }
      100% { opacity: 0.90; transform: translateX(-50%) scaleX(1.06); }
    }

    @keyframes waterRippleDrift {
      0% { opacity: 0.42; transform: translateX(-2.5%) scaleY(0.94); }
      100% { opacity: 0.82; transform: translateX(2.5%) scaleY(1.06); }
    }

    /* Layer 4: Contrast Readability Vignette Over Artwork Layer Only */
    .readability-scrim {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(
          ellipse 66% 64% at 50% 42%,
          rgba(5, 7, 22, 0.46) 0%,
          rgba(6, 7, 24, 0.34) 62%,
          rgba(4, 5, 18, 0.54) 100%
        ),
        linear-gradient(
          180deg,
          rgba(5, 6, 20, 0.44) 0%,
          rgba(6, 7, 24, 0.28) 54%,
          rgba(8, 6, 20, 0.38) 100%
        );
    }

    /* Layer 5: 60FPS HiDPI Animated Sky VFX Canvas */
    .galaxy-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      display: block;
    }

    @media (max-width: 768px) {
      .artwork-kenburns-wrap {
        width: 100vw;
        -webkit-mask-image: none;
        mask-image: none;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .bg-wings-img,
      .bg-artwork-img,
      .bg-sky-cloud-veil,
      .hdrp-godray,
      .milkyway-core-glow,
      .cloud-drift,
      .horizon-sunset-pulse,
      .water-shimmer-band {
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

  private beams: VolumetricBeam[] = [];
  private microStars: MicroStar[] = [];
  private tinyGlints: TinyGlint[] = [];
  private cosmicDew: CosmicDew[] = [];
  private embers: HorizonEmber[] = [];
  private waterStreaks: WaterSpecularStreak[] = [];
  private meteors: AnimeMeteor[] = [];

  private mouseTargetX = 0;
  private mouseTargetY = 0;
  private parallaxX = 0;
  private parallaxY = 0;

  private lastTime = 0;
  private elapsedTime = 0;
  private nextMeteorDelay = 1.0;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private ngZone: NgZone
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  parallaxStyle(depth: number): string {
    return `translate3d(${(-this.parallaxX * depth).toFixed(2)}px, ${(-this.parallaxY * depth).toFixed(2)}px, 0)`;
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    this.reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    this.ngZone.runOutsideAngular(() => {
      this.setupCanvas();
      this.seedGalaxyVfx();

      if (!this.reduceMotion) {
        this.spawnMeteor(true);
      }

      this.resizeHandler = () => {
        this.setupCanvas();
        this.seedGalaxyVfx();
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
    if (this.resizeHandler) window.removeEventListener('resize', this.resizeHandler);
    if (this.mouseHandler) window.removeEventListener('mousemove', this.mouseHandler);
    if (this.visibilityHandler) document.removeEventListener('visibilitychange', this.visibilityHandler);
  }

  private setupCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    canvas.width = Math.floor(this.width * this.dpr);
    canvas.height = Math.floor(this.height * this.dpr);
  }

  private seedGalaxyVfx(): void {
    const area = this.width * this.height;
    const starCount = Math.min(200, Math.max(100, Math.floor(area / 9200)));
    const glintCount = Math.min(18, Math.max(8, Math.floor(area / 105000)));
    const dewCount = Math.min(64, Math.max(32, Math.floor(area / 28000)));
    const emberCount = Math.min(44, Math.max(20, Math.floor(area / 45000)));
    const streakCount = Math.min(22, Math.max(12, Math.floor(this.width / 85)));

    // 1. Directional Volumetric Milky Way & Sunset Scattering Shafts
    this.beams = [
      {
        originXFrac: 0.42,
        originYFrac: -0.08,
        angle: Math.PI * 0.58,
        lengthFrac: 0.9,
        baseWidth: 70,
        endWidth: 280,
        alpha: 0.036,
        phase: 0.2,
        speed: 0.26,
        swayAmp: 0.038,
        depth: 0.45,
        colorInner: 'rgba(125, 211, 252, 1)',
        colorMid: 'rgba(167, 139, 250, 0.52)',
      },
      {
        originXFrac: 0.56,
        originYFrac: -0.06,
        angle: Math.PI * 0.44,
        lengthFrac: 0.86,
        baseWidth: 65,
        endWidth: 260,
        alpha: 0.032,
        phase: 1.9,
        speed: 0.22,
        swayAmp: 0.032,
        depth: 0.55,
        colorInner: 'rgba(192, 132, 252, 1)',
        colorMid: 'rgba(56, 189, 248, 0.48)',
      },
      {
        originXFrac: 0.5,
        originYFrac: 0.9,
        angle: -Math.PI * 0.62,
        lengthFrac: 0.44,
        baseWidth: 85,
        endWidth: 300,
        alpha: 0.034,
        phase: 0.8,
        speed: 0.24,
        swayAmp: 0.034,
        depth: 0.65,
        colorInner: 'rgba(253, 186, 116, 1)',
        colorMid: 'rgba(251, 113, 133, 0.45)',
      },
    ];

    // 2. Refined Small Fading Milky Way Stars (0.38px - 0.95px — Crisp, Delicate, Never Overwhelming)
    const starPalette = ['#ffffff', '#e0f2fe', '#7dd3fc', '#f5d0fe', '#fde68a', '#fed7aa'];
    this.microStars = Array.from({ length: starCount }, () => {
      const depth = 0.25 + Math.random() * 0.75;
      const inChannel = Math.random() < 0.6;
      const x = inChannel
        ? this.width * (0.22 + (Math.random() + Math.random()) * 0.28)
        : Math.random() * this.width;
      const y = Math.random() * this.height * 0.86;

      return {
        x,
        y,
        depth,
        radius: 0.38 + Math.random() * 0.55 * depth,
        maxAlpha: 0.36 + Math.random() * 0.44,
        fadeSpeed: 0.75 + Math.random() * 1.1,
        phase: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 2.2 * depth,
        vy: -(1.2 + Math.random() * 2.8) * depth,
        color: starPalette[Math.floor(Math.random() * starPalette.length)],
      };
    });

    // 3. Delicate Small Pinpoint Glints (Max 3.8px, Weighted Around Outer Upper Sky & Wings)
    const glintColors = ['#e0f2fe', '#f5d0fe', '#fef3c7', '#ffffff'];
    this.tinyGlints = Array.from({ length: glintCount }, (_, idx) => {
      const x =
        idx % 3 === 0
          ? this.width * (0.05 + Math.random() * 0.24)
          : idx % 3 === 1
          ? this.width * (0.71 + Math.random() * 0.24)
          : this.width * (0.28 + Math.random() * 0.44);
      const y =
        idx % 3 === 2
          ? this.height * (0.04 + Math.random() * 0.22)
          : this.height * (0.08 + Math.random() * 0.66);

      return {
        x,
        y,
        depth: 0.45 + Math.random() * 0.45,
        armLength: 2.2 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
        speed: 0.8 + Math.random() * 0.75,
        vx: (Math.random() - 0.5) * 1.8,
        vy: -(0.6 + Math.random() * 1.5),
        angle: (Math.random() - 0.5) * 0.35,
        color: glintColors[idx % glintColors.length],
      };
    });

    // 4. Falling Cosmic Dewdrops Drifting Down From Starry Night Sky
    const dewColors = ['#e0f2fe', '#f5d0fe', '#bae6fd', '#fde68a'];
    this.cosmicDew = Array.from({ length: dewCount }, (_, i) => {
      const depth = 0.3 + Math.random() * 0.7;
      return {
        x: Math.random() * this.width,
        y: Math.random() * this.height * 0.86,
        depth,
        radius: 0.58 + Math.random() * 0.65 * depth,
        tailLength: 9 + Math.random() * 14 * depth,
        vx: (3.0 + Math.random() * 5.5) * depth,
        vy: (17 + Math.random() * 24) * depth,
        swayAmp: 5 + Math.random() * 12,
        swayFreq: 0.55 + Math.random() * 0.85,
        phase: Math.random() * Math.PI * 2,
        fadeSpeed: 0.6 + Math.random() * 0.7,
        maxAlpha: 0.32 + Math.random() * 0.34,
        color: dewColors[i % dewColors.length],
      };
    });

    // 5. Warm Sunset & Cosmic Rising Embers From Mirror Water Horizon
    const emberColors = [
      'rgba(253, 186, 116, 0.62)',
      'rgba(251, 113, 133, 0.56)',
      'rgba(240, 171, 252, 0.54)',
      'rgba(103, 232, 249, 0.52)',
    ];
    this.embers = Array.from({ length: emberCount }, () => {
      const depth = 0.4 + Math.random() * 0.6;
      return {
        x: Math.random() * this.width,
        y: (0.48 + Math.random() * 0.5) * this.height,
        depth,
        radius: 1.5 + Math.random() * 3.2,
        alpha: 0.16 + Math.random() * 0.28,
        vy: -(8 + Math.random() * 14) * depth,
        swayAmp: 7 + Math.random() * 16,
        swayFreq: 0.45 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2,
        color: emberColors[Math.floor(Math.random() * emberColors.length)],
      };
    });

    // 6. Planar Mirror Water Specular Shimmer (Strictly Confined to Bottom Water Mirror >= 88.5%)
    const waterColors = [
      'rgba(253, 224, 71, 0.82)',
      'rgba(253, 186, 116, 0.82)',
      'rgba(251, 113, 133, 0.75)',
      'rgba(240, 171, 252, 0.70)',
    ];
    this.waterStreaks = Array.from({ length: streakCount }, (_, i) => ({
      xFrac: 0.22 + (Math.random() + Math.random()) * 0.28,
      yFrac: 0.885 + Math.random() * 0.105,
      width: 32 + Math.random() * 72,
      thickness: 1.1 + Math.random() * 2.0,
      phase: Math.random() * Math.PI * 2,
      speed: 0.6 + Math.random() * 0.65,
      driftAmp: 10 + Math.random() * 20,
      alpha: 0.1 + Math.random() * 0.14,
      color: waterColors[i % waterColors.length],
    }));
  }

  private spawnMeteor(fromRightCorner = Math.random() < 0.65): void {
    const angle = fromRightCorner
      ? Math.PI - (0.54 + Math.random() * 0.2)
      : 0.5 + Math.random() * 0.2;

    const x = fromRightCorner
      ? this.width * (0.58 + Math.random() * 0.38)
      : this.width * (0.04 + Math.random() * 0.36);
    const y = this.height * (0.02 + Math.random() * 0.36);
    const speed = 580 + Math.random() * 340;

    const colors = ['#bae6fd', '#7dd3fc', '#f5d0fe', '#fde68a'];
    this.meteors.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      length: 110 + Math.random() * 90,
      width: 1.15 + Math.random() * 0.65,
      life: 0,
      maxLife: 0.52 + Math.random() * 0.38,
      color: colors[Math.floor(Math.random() * colors.length)],
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

  private centerProtectionFactor(x: number, y: number): number {
    if (!this.width || !this.height) return 1;
    const dx = Math.abs(x / this.width - 0.5) * 2;
    const dy = Math.abs(y / this.height - 0.44) * 2;
    const dist = Math.hypot(dx * 0.95, dy * 0.85);
    return 0.44 + 0.56 * Math.min(1, dist / 0.86);
  }

  private drawFrame(dt: number): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx || !this.width || !this.height) return;

    this.elapsedTime += dt;

    this.parallaxX += (this.mouseTargetX * 12 - this.parallaxX) * 0.045;
    this.parallaxY += (this.mouseTargetY * 9 - this.parallaxY) * 0.045;

    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.width, this.height);

    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    // 1. Volumetric God Rays
    const diag = Math.hypot(this.width, this.height);
    for (const b of this.beams) {
      const waveAngle = b.angle + Math.sin(this.elapsedTime * b.speed + b.phase) * b.swayAmp;
      const ox = this.width * b.originXFrac + this.parallaxX * b.depth;
      const oy = this.height * b.originYFrac + this.parallaxY * b.depth;
      const len = diag * b.lengthFrac;
      const ex = ox + Math.cos(waveAngle) * len;
      const ey = oy + Math.sin(waveAngle) * len;

      const perpX = -Math.sin(waveAngle);
      const perpY = Math.cos(waveAngle);

      const exposureWave = 0.78 + 0.22 * Math.sin(this.elapsedTime * (b.speed * 0.85) + b.phase);
      ctx.globalAlpha = b.alpha * exposureWave;

      const grad = ctx.createLinearGradient(ox, oy, ex, ey);
      grad.addColorStop(0, b.colorInner);
      grad.addColorStop(0.45, b.colorMid);
      grad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(ox + perpX * b.baseWidth * 0.5, oy + perpY * b.baseWidth * 0.5);
      ctx.lineTo(ex + perpX * b.endWidth * 0.5, ey + perpY * b.endWidth * 0.5);
      ctx.lineTo(ex - perpX * b.endWidth * 0.5, ey - perpY * b.endWidth * 0.5);
      ctx.lineTo(ox - perpX * b.baseWidth * 0.5, oy - perpY * b.baseWidth * 0.5);
      ctx.closePath();
      ctx.fill();
    }

    // 2. Warm Sunset & Cosmic Rising Embers From Horizon Water
    for (const e of this.embers) {
      e.y += e.vy * dt;
      if (e.y < this.height * 0.14) {
        e.y = this.height + 16;
        e.x = Math.random() * this.width;
      }

      const swayX = Math.sin(this.elapsedTime * e.swayFreq + e.phase) * e.swayAmp;
      const drawX = e.x + swayX + this.parallaxX * e.depth * 1.1;
      const drawY = e.y + this.parallaxY * e.depth * 1.1;
      const shimmer = 0.5 + 0.5 * Math.sin(this.elapsedTime * 1.4 + e.phase);

      const grad = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, e.radius * 2.5);
      grad.addColorStop(0, e.color);
      grad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.globalAlpha = e.alpha * (0.55 + 0.45 * shimmer) * this.centerProtectionFactor(drawX, drawY);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(drawX, drawY, e.radius * 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Falling Cosmic Dewdrops Drifting Down From Night Sky
    for (const dw of this.cosmicDew) {
      dw.x += dw.vx * dt;
      dw.y += dw.vy * dt;

      if (dw.y > this.height * 0.88) {
        dw.y = -20;
        dw.x = Math.random() * this.width;
      }
      if (dw.x > this.width + 20) dw.x = -20;

      const sway = Math.sin(this.elapsedTime * dw.swayFreq + dw.phase) * dw.swayAmp;
      const px = dw.x + sway + this.parallaxX * dw.depth * 0.95;
      const py = dw.y + this.parallaxY * dw.depth * 0.95;

      const horizonFade = py > this.height * 0.74 ? Math.max(0, 1 - (py - this.height * 0.74) / (this.height * 0.14)) : 1;
      const pulse = 0.55 + 0.45 * Math.sin(this.elapsedTime * dw.fadeSpeed + dw.phase);
      const alpha = dw.maxAlpha * pulse * horizonFade * this.centerProtectionFactor(px, py);
      if (alpha < 0.02) continue;

      const tailX = px - dw.vx * 0.25;
      const tailY = py - dw.tailLength;
      const tailGrad = ctx.createLinearGradient(px, py, tailX, tailY);
      tailGrad.addColorStop(0, dw.color);
      tailGrad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.globalAlpha = alpha * 0.65;
      ctx.strokeStyle = tailGrad;
      ctx.lineWidth = dw.radius * 1.1;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();

      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(px, py, dw.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Delicate Small Fading Milky Way Stars (0.38px - 0.95px)
    for (const s of this.microStars) {
      s.x += s.vx * dt;
      s.y += s.vy * dt;

      if (s.x > this.width + 8) s.x = -8;
      if (s.x < -8) s.x = this.width + 8;
      if (s.y < -8) s.y = this.height * 0.88;

      const px = s.x + this.parallaxX * s.depth * 0.75;
      const py = s.y + this.parallaxY * s.depth * 0.75;

      const wave = 0.5 + 0.5 * Math.sin(this.elapsedTime * s.fadeSpeed + s.phase);
      const visibility = Math.pow(wave, 1.9);
      const alpha = s.maxAlpha * visibility * this.centerProtectionFactor(px, py);
      if (alpha < 0.015) continue;

      ctx.globalAlpha = alpha;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(px, py, s.radius, 0, Math.PI * 2);
      ctx.fill();

      if (s.radius > 0.72) {
        ctx.globalAlpha = alpha * 0.3;
        ctx.beginPath();
        ctx.arc(px, py, s.radius * 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 5. Delicate Pinpoint Star Glints (Max 3.8px Along Outer Sky & Upper Crown)
    for (const g of this.tinyGlints) {
      g.x += g.vx * dt;
      g.y += g.vy * dt;

      if (g.x > this.width + 12) g.x = -12;
      if (g.x < -12) g.x = this.width + 12;
      if (g.y < -12) g.y = this.height * 0.74;

      const px = g.x + this.parallaxX * g.depth;
      const py = g.y + this.parallaxY * g.depth;
      const wave = 0.5 + 0.5 * Math.sin(this.elapsedTime * g.speed + g.phase);
      const visibility = Math.pow(wave, 2.0);
      if (visibility < 0.05) continue;

      const arm = g.armLength * (0.7 + 0.3 * visibility);
      const core = Math.max(0.4, arm * 0.14);

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(g.angle);
      ctx.globalAlpha = 0.58 * visibility * this.centerProtectionFactor(px, py);
      ctx.fillStyle = g.color;

      ctx.beginPath();
      ctx.moveTo(0, -arm);
      ctx.quadraticCurveTo(core, -core, arm, 0);
      ctx.quadraticCurveTo(core, core, 0, arm);
      ctx.quadraticCurveTo(-core, core, -arm, 0);
      ctx.quadraticCurveTo(-core, -core, 0, -arm);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // 6. Planar Mirror Water Specular Reflections Along Bottom Horizon
    for (const w of this.waterStreaks) {
      const sway = Math.sin(this.elapsedTime * w.speed + w.phase) * w.driftAmp;
      const cx = this.width * w.xFrac + sway + this.parallaxX * 0.8;
      const cy = this.height * w.yFrac + this.parallaxY * 0.5;
      const stretch = 0.85 + 0.25 * Math.cos(this.elapsedTime * (w.speed * 0.9) + w.phase);
      const halfW = w.width * 0.5 * stretch;

      const waterGrad = ctx.createLinearGradient(cx - halfW, cy, cx + halfW, cy);
      waterGrad.addColorStop(0, 'rgba(0,0,0,0)');
      waterGrad.addColorStop(0.5, w.color);
      waterGrad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.globalAlpha = w.alpha * (0.65 + 0.35 * Math.sin(this.elapsedTime * w.speed + w.phase));
      ctx.strokeStyle = waterGrad;
      ctx.lineWidth = w.thickness;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(cx - halfW, cy);
      ctx.lineTo(cx + halfW, cy);
      ctx.stroke();
    }

    // 7. Anime Shooting Star Showers Matching Artwork Vectors (Refined Thin Streaks)
    if (!this.reduceMotion) {
      this.nextMeteorDelay -= dt;
      if (this.nextMeteorDelay <= 0) {
        const burst = Math.random() < 0.3 ? 2 : 1;
        for (let b = 0; b < burst; b++) {
          this.spawnMeteor();
        }
        this.nextMeteorDelay = 2.0 + Math.random() * 2.4;
      }
    }

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
      const alpha = (progress < 0.18 ? progress / 0.18 : Math.max(0, 1 - (progress - 0.18) / 0.82)) * 0.72;
      const speedMag = Math.hypot(m.vx, m.vy) || 1;
      const tailX = m.x - (m.vx / speedMag) * m.length;
      const tailY = m.y - (m.vy / speedMag) * m.length;

      const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.25, m.color);
      grad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.globalAlpha = alpha;
      ctx.strokeStyle = grad;
      ctx.lineWidth = m.width;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();

      const headHalo = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, 5.5);
      headHalo.addColorStop(0, '#ffffff');
      headHalo.addColorStop(0.45, m.color);
      headHalo.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = headHalo;
      ctx.beginPath();
      ctx.arc(m.x, m.y, 5.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
    ctx.globalAlpha = 1;
  }
}
