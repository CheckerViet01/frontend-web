import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar-wrapper">
      <div class="nav-container">
        <!-- Logo Brand: Earth From Another Sun Sci-Fi Style -->
        <a routerLink="/" class="logo-group">
          <div class="scifi-emblem-box">
            <span class="scifi-shard-icon">⬡</span>
            <div class="emblem-core-glow"></div>
            <div class="emblem-laser-line"></div>
          </div>
          <div class="brand-text-block">
            <div class="brand-title font-scifi">HocDeThiFPT</div>
          </div>
        </a>

        <!-- Right Action Controls (Student Portal) -->
        <div class="nav-actions">
          <ng-container *ngIf="auth.currentUser() as user; else loginButton">
            <div class="student-pill glass-panel">
              <div class="avatar-ring-wrap">
                <img [src]="user.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + user.email" class="user-avatar" alt="Avatar">
                <span class="online-indicator"></span>
              </div>
              <div class="user-meta-block">
                <span class="user-name">{{ user.fullName }}</span>
                <span class="mssv-badge font-mono">
                  <i class="fa-solid fa-id-badge text-cyan"></i> {{ user.mssv || 'CHƯA CÓ MSSV' }}
                </span>
              </div>
              <button class="btn-cyber-logout" title="Đăng xuất khỏi tài khoản" (click)="auth.logout()">
                <i class="fa-solid fa-right-from-bracket"></i>
              </button>
            </div>
          </ng-container>

          <ng-template #loginButton>
            <button type="button" class="btn-scifi-cyan" (click)="openLogin.emit()">
              <i class="fa-solid fa-bolt-lightning"></i>
              <span>ĐĂNG NHẬP</span>
            </button>
          </ng-template>
        </div>
      </div>
      <!-- Sci-Fi Laser Underline Accent -->
      <div class="navbar-bottom-laser"></div>
    </nav>
  `,
  styles: [`
    .navbar-wrapper {
      position: sticky;
      top: 0;
      z-index: 500;
      background: rgba(9, 11, 34, 0.76);
      backdrop-filter: blur(20px) saturate(170%);
      -webkit-backdrop-filter: blur(20px) saturate(170%);
      border-bottom: 1px solid rgba(103, 232, 249, 0.25);
      box-shadow: 0 10px 30px rgba(4, 6, 24, 0.65), 0 0 25px rgba(168, 85, 247, 0.14);
    }
    .navbar-bottom-laser {
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent 5%, #00f0ff 30%, #e5a93c 70%, transparent 95%);
      box-shadow: 0 0 10px #00f0ff;
    }
    .nav-container {
      max-width: 1440px;
      margin: 0 auto;
      padding: 12px 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
    }
    .logo-group {
      display: flex;
      align-items: center;
      gap: 14px;
      text-decoration: none;
      color: inherit;
      transition: transform 0.25s ease;
    }
    .logo-group:hover {
      transform: translateY(-1px);
    }
    
    /* Sci-Fi Emblem Box */
    .scifi-emblem-box {
      position: relative;
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 240, 255, 0.1);
      border: 1.5px solid #00f0ff;
      clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);
      box-shadow: 0 0 16px rgba(0, 240, 255, 0.4), inset 0 0 10px rgba(0, 240, 255, 0.2);
    }
    .scifi-shard-icon {
      font-size: 1.5rem;
      color: #00f0ff;
      filter: drop-shadow(0 0 8px #00f0ff);
      animation: emblemRotate 16s linear infinite;
    }
    @keyframes emblemRotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .emblem-core-glow {
      position: absolute;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #00f0ff;
      filter: blur(6px);
      pointer-events: none;
    }

    .brand-text-block {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .brand-title {
      font-size: 1.48rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      color: #ffffff;
      text-shadow: 0 0 14px rgba(0, 240, 255, 0.5);
      line-height: 1.1;
    }
    .brand-telemetry {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .beacon-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #00f0ff;
      box-shadow: 0 0 8px #00f0ff;
      animation: beaconPulse 2s infinite;
    }
    @keyframes beaconPulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.35; transform: scale(0.75); }
    }
    .telemetry-text {
      font-size: 0.62rem;
      color: #00f0ff;
      letter-spacing: 0.18em;
      font-weight: 700;
    }

    /* Student Info Pill */
    .student-pill {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 6px 14px 6px 8px;
      background: rgba(9, 15, 30, 0.90);
      border: 1px solid rgba(0, 240, 255, 0.35);
      clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.7), 0 0 15px rgba(0, 240, 255, 0.15);
      transition: all 0.25s ease;
    }
    .student-pill:hover {
      border-color: #00f0ff;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.85), 0 0 25px rgba(0, 240, 255, 0.3);
    }
    .avatar-ring-wrap {
      position: relative;
      width: 36px;
      height: 36px;
    }
    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      object-fit: cover;
      border: 1.5px solid #00f0ff;
      box-shadow: 0 0 10px rgba(0, 240, 255, 0.4);
    }
    .online-indicator {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: #10b981;
      border: 1.5px solid #060a14;
      box-shadow: 0 0 6px #10b981;
    }
    .user-meta-block {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .user-name {
      font-size: 0.88rem;
      font-weight: 600;
      color: #ffffff;
      letter-spacing: 0.01em;
      max-width: 170px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .mssv-badge {
      font-size: 0.76rem;
      color: #00f0ff;
      font-weight: 700;
      letter-spacing: 0.04em;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .btn-cyber-logout {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      background: rgba(244, 63, 94, 0.15);
      border: 1px solid rgba(244, 63, 94, 0.4);
      color: #fb7185;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 0.82rem;
      transition: all 0.2s ease;
      margin-left: 4px;
    }
    .btn-cyber-logout:hover {
      background: #f43f5e;
      color: #ffffff;
      border-color: #f43f5e;
      box-shadow: 0 0 14px rgba(244, 63, 94, 0.6);
      transform: scale(1.06);
    }

    @media (max-width: 640px) {
      .nav-container {
        padding: 10px 16px;
      }
      .brand-title {
        font-size: 1.15rem;
      }
      .brand-telemetry {
        display: none;
      }
      .user-name {
        max-width: 90px;
      }
    }
  `]
})
export class NavbarComponent {
  @Output() openLogin = new EventEmitter<void>();

  constructor(public auth: AuthService) {}
}
