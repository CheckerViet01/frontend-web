import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MssvModalComponent } from './components/mssv-modal/mssv-modal.component';
import { LoginModalComponent } from './components/login-modal/login-modal.component';
import { GalaxyBackgroundComponent } from './components/galaxy-background/galaxy-background.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    MssvModalComponent,
    LoginModalComponent,
    GalaxyBackgroundComponent
  ],
  template: `
    <!-- Animated Sparkling Cosmic Galaxy Backdrop (Hiển thị chung cho cả User Portal & Admin Portal) -->
    <app-galaxy-background></app-galaxy-background>

    <!-- Student Navigation Bar: CHỈ hiển thị ở cổng sinh viên, hoàn toàn ẩn ở cổng quản trị -->
    <app-navbar *ngIf="isUserPortal()" (openLogin)="showLoginModal = true"></app-navbar>

    <!-- Main Content Router Outlet -->
    <main [class.user-main-content]="isUserPortal()" [class.fullscreen-main]="!isUserPortal()">
      <router-outlet></router-outlet>
    </main>

    <!-- Sci-Fi Footer (Styled like Earth From Another Sun footer): CHỈ hiển thị ở cổng sinh viên -->
    <footer class="app-footer" *ngIf="isUserPortal()">
      <div class="footer-laser-strip"></div>
      <div class="footer-container">
        <div class="footer-brand font-scifi">
          <span class="footer-gem">⬡</span>
          <span class="brand-name font-scifi">HocDeThiFPT</span>
          <span class="version-tag font-mono">FPT UNIVERSITY 2026</span>
        </div>
        <div class="copyright font-sub">
          © 2026 HocDeThiFPT. Hệ thống chia sẻ đề thi Đại học FPT. All rights reserved.
        </div>
      </div>
    </footer>

    <!-- MSSV Required Modal: Yêu cầu định dạng chuẩn 2 chữ cái + 6 số (HE171199, HS112233) -->
    <app-mssv-modal *ngIf="isUserPortal() && auth.requiresMssv()"></app-mssv-modal>

    <!-- Modal Đăng Nhập / Tạo Tài Khoản Truyền Thống -->
    <app-login-modal *ngIf="showLoginModal" (close)="showLoginModal = false"></app-login-modal>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      position: relative;
    }
    .user-main-content {
      flex: 1;
      position: relative;
      z-index: 1;
    }
    .fullscreen-main {
      flex: 1;
      width: 100%;
      height: 100%;
      position: relative;
      z-index: 1;
    }
    .app-footer {
      margin-top: auto;
      padding: 24px 28px;
      background: rgba(9, 11, 34, 0.78);
      backdrop-filter: blur(22px) saturate(165%);
      -webkit-backdrop-filter: blur(22px) saturate(165%);
      border-top: 1px solid rgba(103, 232, 249, 0.25);
      box-shadow: 0 -10px 30px rgba(4, 6, 22, 0.65);
      position: relative;
      z-index: 10;
    }
    .footer-laser-strip {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent 5%, #00f0ff 30%, #e5a93c 70%, transparent 95%);
      box-shadow: 0 0 10px #00f0ff;
    }
    .footer-container {
      max-width: 1440px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
    }
    .footer-brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .footer-gem {
      font-size: 1.3rem;
      color: #00f0ff;
      filter: drop-shadow(0 0 8px #00f0ff);
    }
    .brand-name {
      font-size: 1.2rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      color: #ffffff;
      text-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
    }
    .version-tag {
      font-size: 0.72rem;
      background: rgba(0, 240, 255, 0.12);
      border: 1px solid rgba(0, 240, 255, 0.35);
      color: #00f0ff;
      padding: 3px 10px;
      border-radius: 4px;
      font-weight: 700;
      letter-spacing: 0.05em;
    }
    .copyright {
      font-size: 0.86rem;
      color: #94a3b8;
      font-weight: 500;
    }

    @media (max-width: 640px) {
      .footer-container {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
    }
  `]
})
export class App {
  currentUrl = signal('/');
  showLoginModal = false;

  constructor(private router: Router, public auth: AuthService) {
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentUrl.set(event.urlAfterRedirects || event.url);
    });
  }

  isUserPortal(): boolean {
    const url = this.currentUrl();
    return !url.startsWith('/admin') && !url.startsWith('/admin-portal');
  }
}
