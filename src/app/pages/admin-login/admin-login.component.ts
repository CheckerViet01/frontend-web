import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="admin-portal-wrapper">
      <div class="portal-bg-ring ring-1"></div>
      <div class="portal-bg-ring ring-2"></div>
      
      <div class="portal-card">
        <div class="card-laser-top"></div>

        <!-- Seal of Grand Command -->
        <div class="portal-header">
          <div class="seal-icon-box">
            <span class="seal-emoji">⬡</span>
            <div class="seal-glow"></div>
          </div>
          <span class="portal-badge font-scifi">HOCDETHIFPT • BẢO MẬT QUẢN TRỊ</span>
          <h1 class="portal-title font-scifi text-gradient-gold">CỔNG QUẢN TRỊ VIÊN</h1>
          <p class="portal-desc font-sub">
            Khu vực bảo mật cấp cao hệ thống <strong>HocDeThiFPT</strong>. Dành riêng cho Quản Trị Viên đăng nhập bằng tài khoản được cấp trong cơ sở dữ liệu.
          </p>
        </div>

        <!-- Form Login -->
        <form (ngSubmit)="onAdminLogin()" class="portal-form">
          <div class="form-group">
            <label class="form-label font-scifi">
              <i class="fa-solid fa-user-shield text-gold"></i> TÀI KHOẢN / EMAIL:
            </label>
            <div class="input-wrap">
              <input 
                type="text" 
                [(ngModel)]="email" 
                name="adminEmail" 
                placeholder="Nhập email / tài khoản quản trị" 
                class="scifi-admin-input font-sub" 
                required 
                autofocus
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label font-scifi">
              <i class="fa-solid fa-key text-gold"></i> MẬT KHẨU BẢO MẬT:
            </label>
            <div class="input-wrap">
              <input 
                [type]="showPassword ? 'text' : 'password'" 
                [(ngModel)]="password" 
                name="adminPassword" 
                placeholder="••••••••" 
                class="scifi-admin-input font-sub" 
                required 
              />
              <button type="button" class="eye-btn" (click)="showPassword = !showPassword">
                <i [class]="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
              </button>
            </div>
          </div>

          <div class="error-box font-sub" *ngIf="errorMessage()">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <span>{{ errorMessage() }}</span>
          </div>

          <button type="submit" class="btn-scifi-gold w-full font-scifi" [disabled]="loading()">
            <span *ngIf="!loading()"><i class="fa-solid fa-unlock-keyhole"></i> ĐĂNG NHẬP QUẢN TRỊ</span>
            <span *ngIf="loading()"><i class="fa-solid fa-spinner fa-spin"></i> ĐANG XÁC THỰC...</span>
          </button>
        </form>

        <div class="portal-footer">
          <a routerLink="/" class="back-link font-scifi">
            <i class="fa-solid fa-arrow-left"></i> QUAY LẠI KHO ĐỀ THI SINH VIÊN
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-portal-wrapper {
      min-height: calc(100vh - 100px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      position: relative;
    }
    .portal-bg-ring {
      position: absolute;
      border-radius: 50%;
      border: 1px dashed rgba(229, 169, 60, 0.25);
      pointer-events: none;
      animation: rotateRings 60s linear infinite;
    }
    .ring-1 {
      width: 700px;
      height: 700px;
    }
    .ring-2 {
      width: 900px;
      height: 900px;
      border-color: rgba(0, 240, 255, 0.2);
      animation-direction: reverse;
      animation-duration: 90s;
    }
    @keyframes rotateRings {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .portal-card {
      width: 100%;
      max-width: 480px;
      padding: 42px 36px;
      position: relative;
      z-index: 10;
      background: rgba(7, 12, 24, 0.97);
      border: 1.5px solid rgba(229, 169, 60, 0.45);
      clip-path: polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px);
      box-shadow: 0 25px 70px -15px rgba(0, 0, 0, 0.95), 0 0 35px rgba(229, 169, 60, 0.25);
      animation: portalWarpOpen 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .card-laser-top {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, transparent, #fbbf24 40%, #00f0ff 60%, transparent);
      box-shadow: 0 0 12px #fbbf24;
    }
    .portal-header {
      text-align: center;
      margin-bottom: 28px;
    }
    .seal-icon-box {
      width: 68px;
      height: 68px;
      margin: 0 auto 16px;
      clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
      background: rgba(229, 169, 60, 0.15);
      border: 1.5px solid #fbbf24;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      box-shadow: 0 0 20px rgba(229, 169, 60, 0.35);
    }
    .seal-emoji {
      font-size: 2rem;
      color: #fbbf24;
      filter: drop-shadow(0 0 8px #fbbf24);
    }
    .portal-badge {
      font-size: 0.78rem;
      letter-spacing: 0.05em;
      color: #fbbf24;
      font-weight: 700;
    }
    .portal-title {
      font-size: 1.7rem;
      font-weight: 700;
      margin: 8px 0 10px;
      letter-spacing: 0.03em;
    }
    .portal-desc {
      font-size: 0.92rem;
      color: #cbd5e1;
      line-height: 1.6;
    }
    .portal-desc strong {
      color: #00f0ff;
    }
    .form-group {
      margin-bottom: 18px;
    }
    .form-label {
      display: block;
      font-size: 0.82rem;
      font-weight: 700;
      color: #e2e8f0;
      letter-spacing: 0.03em;
      margin-bottom: 8px;
    }
    .input-wrap {
      position: relative;
    }
    .scifi-admin-input {
      width: 100%;
      background: #050814;
      border: 1.5px solid rgba(229, 169, 60, 0.35);
      clip-path: polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px);
      color: #ffffff;
      padding: 12px 14px;
      font-size: 0.95rem;
      font-weight: 600;
      outline: none;
      transition: all 0.2s;
    }
    .scifi-admin-input:focus {
      border-color: #fbbf24;
      box-shadow: 0 0 16px rgba(229, 169, 60, 0.4);
    }
    .scifi-admin-input::placeholder {
      color: #556980;
    }
    .eye-btn {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: transparent;
      border: none;
      color: #fbbf24;
      cursor: pointer;
      font-size: 1rem;
    }
    .error-box {
      margin-bottom: 16px;
      padding: 10px 14px;
      clip-path: polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px);
      background: rgba(244, 63, 94, 0.15);
      border: 1px solid rgba(244, 63, 94, 0.4);
      color: #fb7185;
      font-size: 0.82rem;
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
    }
    .w-full {
      width: 100%;
      justify-content: center;
      padding: 13px;
      font-size: 0.95rem;
    }
    .portal-footer {
      margin-top: 24px;
      text-align: center;
    }
    .back-link {
      color: #00f0ff;
      text-decoration: none;
      font-size: 0.86rem;
      font-weight: 700;
      letter-spacing: 0.02em;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }
    .back-link:hover {
      text-shadow: 0 0 10px rgba(0, 240, 255, 0.7);
      transform: translateX(-3px);
    }
  `]
})
export class AdminLoginComponent {
  email = '';
  password = '';
  showPassword = false;
  loading = signal(false);
  errorMessage = signal('');

  constructor(private auth: AuthService, private router: Router) {}

  onAdminLogin() {
    if (!this.email || !this.password) {
      this.errorMessage.set('Vui lòng nhập đầy đủ Email và Mật khẩu Quản trị viên!');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.auth.loginAdmin(this.email.trim(), this.password.trim()).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err?.error?.error || 'Tài khoản hoặc Mật khẩu Quản trị viên không chính xác!');
      }
    });
  }
}
