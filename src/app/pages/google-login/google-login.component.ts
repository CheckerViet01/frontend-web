import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-google-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="google-page-bg">
      <div class="google-card">
        <!-- Google Top Progress Bar (Loading State) -->
        <div class="google-progress-bar" *ngIf="loading()">
          <div class="progress-bar-indicator"></div>
        </div>

        <!-- Google Logo -->
        <div class="google-logo-wrap">
          <svg viewBox="0 0 272 92" width="80" height="28">
            <path fill="#EA4335" d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
            <path fill="#FBBC05" d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
            <path fill="#4285F4" d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 8.16 11.18 8.16 7.29 0 11.83-4.51 11.83-12.98v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.93h9.44zm-8.74 21.02c0-7.82-5.21-13.52-11.84-13.52-6.72 0-12.35 5.7-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"/>
            <path fill="#34A853" d="M225 3v65h-9.5V3h9.5z"/>
            <path fill="#EA4335" d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-13.43-8.32l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"/>
            <path fill="#4285F4" d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.68.36 15.46 16.32 0 35.3 0c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.96-6.72-13.86 0-24.7 11.17-24.7 25.27 0 14.11 10.84 25.28 24.7 25.28 8.99 0 14.11-3.61 17.39-6.89 2.69-2.68 4.45-6.55 5.12-11.67H35.29z"/>
          </svg>
        </div>

        <!-- STEP 1: ENTER EMAIL -->
        <div *ngIf="step === 'email'" class="step-view">
          <h1 class="google-heading">Đăng nhập</h1>
          <p class="google-subheading">để tiếp tục tới <strong>HocDeThiFPT</strong></p>

          <form (ngSubmit)="goToPasswordStep()" class="google-form">
            <div class="google-input-group" [class.has-error]="emailError()">
              <input 
                type="text" 
                id="googleEmail"
                [(ngModel)]="email" 
                name="email"
                class="google-input" 
                placeholder=" "
                required
                autofocus
              />
              <label for="googleEmail" class="google-floating-label">Email hoặc số điện thoại</label>
            </div>

            <div class="google-error-msg" *ngIf="emailError()">
              <i class="fa-solid fa-circle-exclamation"></i> {{ emailError() }}
            </div>

            <div class="google-hint">
              Sử dụng tài khoản Google cá nhân hoặc Email sinh viên FPT (ví dụ: <code>student&#64;fpt.edu.vn</code>).
            </div>

            <div class="google-actions">
              <a routerLink="/" class="google-link-btn">Hủy</a>
              <button type="submit" class="google-btn-primary" [disabled]="loading()">
                Tiếp theo
              </button>
            </div>
          </form>
        </div>

        <!-- STEP 2: ENTER PASSWORD -->
        <div *ngIf="step === 'password'" class="step-view">
          <h1 class="google-heading">Chào mừng</h1>
          
          <!-- User Profile Chip -->
          <div class="account-chip" (click)="step = 'email'">
            <div class="chip-avatar">{{ email.charAt(0).toUpperCase() }}</div>
            <span class="chip-email">{{ email }}</span>
            <i class="fa-solid fa-chevron-down chip-arrow"></i>
          </div>

          <form (ngSubmit)="completeGoogleLogin()" class="google-form">
            <div class="google-input-group" [class.has-error]="passwordError()">
              <input 
                [type]="showPassword ? 'text' : 'password'" 
                id="googlePass"
                [(ngModel)]="password" 
                name="password"
                class="google-input" 
                placeholder=" "
                required
                autofocus
              />
              <label for="googlePass" class="google-floating-label">Nhập mật khẩu của bạn</label>
            </div>

            <div class="show-password-row">
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="showPassword" name="showPass">
                <span>Hiện mật khẩu</span>
              </label>
            </div>

            <div class="google-error-msg" *ngIf="passwordError()">
              <i class="fa-solid fa-circle-exclamation"></i> {{ passwordError() }}
            </div>

            <div class="google-actions">
              <button type="button" class="google-link-btn" (click)="step = 'email'">
                Chọn tài khoản khác
              </button>
              <button type="submit" class="google-btn-primary" [disabled]="loading()">
                <span *ngIf="!loading()">Đăng nhập</span>
                <span *ngIf="loading()">Đang kết nối...</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Google Minimalist Footer -->
      <footer class="google-footer">
        <div class="footer-lang">
          <span>Tiếng Việt</span>
          <i class="fa-solid fa-caret-down"></i>
        </div>
        <div class="footer-links">
          <a href="https://support.google.com/accounts" target="_blank">Trợ giúp</a>
          <a href="https://policies.google.com/privacy" target="_blank">Bảo mật</a>
          <a href="https://policies.google.com/terms" target="_blank">Điều khoản</a>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .google-page-bg {
      min-height: 100vh;
      background: #f0f4f9;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px 16px;
      font-family: 'Roboto', 'Plus Jakarta Sans', -apple-system, sans-serif;
      color: #1f1f1f;
    }
    .google-card {
      width: 100%;
      max-width: 448px;
      background: #ffffff;
      border-radius: 28px;
      padding: 40px 36px 36px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
      position: relative;
      overflow: hidden;
      border: 1px solid #e0e2ec;
    }
    .google-progress-bar {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: #e8f0fe;
      overflow: hidden;
    }
    .progress-bar-indicator {
      width: 50%;
      height: 100%;
      background: #0b57d0;
      position: absolute;
      animation: indeterminate 1.2s infinite ease-in-out;
    }
    @keyframes indeterminate {
      0% { left: -50%; width: 50%; }
      50% { left: 25%; width: 60%; }
      100% { left: 100%; width: 40%; }
    }
    .google-logo-wrap {
      margin-bottom: 24px;
    }
    .google-heading {
      font-size: 1.55rem;
      font-weight: 500;
      color: #1f1f1f;
      margin: 0 0 8px;
      letter-spacing: -0.2px;
    }
    .google-subheading {
      font-size: 0.95rem;
      color: #444746;
      margin-bottom: 32px;
      line-height: 1.4;
    }
    .google-subheading strong {
      color: #0b57d0;
    }
    .account-chip {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 6px 14px 6px 8px;
      border: 1px solid #c4c7c5;
      border-radius: 20px;
      margin-bottom: 28px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .account-chip:hover {
      background: #f8fafd;
      border-color: #0b57d0;
    }
    .chip-avatar {
      width: 28px;
      height: 28px;
      background: #0b57d0;
      color: #ffffff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
      font-weight: 600;
    }
    .chip-email {
      font-size: 0.9rem;
      color: #1f1f1f;
    }
    .chip-arrow {
      font-size: 0.75rem;
      color: #444746;
    }
    .google-input-group {
      position: relative;
      margin-bottom: 12px;
    }
    .google-input {
      width: 100%;
      height: 56px;
      padding: 16px 16px 0;
      border: 1px solid #747775;
      border-radius: 8px;
      font-size: 1rem;
      color: #1f1f1f;
      outline: none;
      background: transparent;
      transition: border-color 0.2s;
      box-sizing: border-box;
    }
    .google-input:focus {
      border: 2px solid #0b57d0;
      padding-top: 15px;
      padding-left: 15px;
    }
    .google-floating-label {
      position: absolute;
      top: 18px;
      left: 16px;
      color: #444746;
      font-size: 1rem;
      pointer-events: none;
      transition: all 0.2s ease;
      background: #ffffff;
      padding: 0 4px;
    }
    .google-input:focus ~ .google-floating-label,
    .google-input:not(:placeholder-shown) ~ .google-floating-label {
      top: -8px;
      left: 12px;
      font-size: 0.75rem;
      color: #0b57d0;
      font-weight: 500;
    }
    .has-error .google-input {
      border-color: #ba1a1a !important;
    }
    .has-error .google-floating-label {
      color: #ba1a1a !important;
    }
    .google-error-msg {
      font-size: 0.82rem;
      color: #ba1a1a;
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 16px;
    }
    .google-hint {
      font-size: 0.82rem;
      color: #444746;
      line-height: 1.45;
      margin-bottom: 32px;
    }
    .google-hint code {
      color: #0b57d0;
      font-weight: 600;
    }
    .show-password-row {
      margin-bottom: 28px;
    }
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.88rem;
      color: #1f1f1f;
      cursor: pointer;
    }
    .google-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 24px;
    }
    .google-link-btn {
      color: #0b57d0;
      font-size: 0.9rem;
      font-weight: 500;
      text-decoration: none;
      background: none;
      border: none;
      cursor: pointer;
      padding: 10px 14px;
      border-radius: 20px;
      transition: background 0.2s;
    }
    .google-link-btn:hover {
      background: #e8f0fe;
    }
    .google-btn-primary {
      background: #0b57d0;
      color: #ffffff;
      border: none;
      border-radius: 20px;
      padding: 10px 24px;
      font-size: 0.92rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 1px 3px rgba(0,0,0,0.12);
    }
    .google-btn-primary:hover:not(:disabled) {
      background: #0842a0;
      box-shadow: 0 2px 6px rgba(11,87,208,0.3);
    }
    .google-btn-primary:disabled {
      background: #1f1f1f1f;
      color: #1f1f1f61;
      cursor: not-allowed;
    }
    .google-footer {
      width: 100%;
      max-width: 448px;
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      font-size: 0.78rem;
      color: #444746;
      padding: 0 12px;
    }
    .footer-lang {
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
    }
    .footer-links {
      display: flex;
      gap: 24px;
    }
    .footer-links a {
      color: #444746;
      text-decoration: none;
    }
    .footer-links a:hover {
      text-decoration: underline;
    }
  `]
})
export class GoogleLoginComponent {
  step: 'email' | 'password' = 'email';
  email = '';
  password = '';
  showPassword = false;
  loading = signal(false);
  emailError = signal('');
  passwordError = signal('');

  constructor(private auth: AuthService, private router: Router) {}

  goToPasswordStep() {
    this.emailError.set('');
    if (!this.email || !this.email.trim()) {
      this.emailError.set('Nhập một địa chỉ email hoặc số điện thoại');
      return;
    }
    const cleanEmail = this.email.trim().toLowerCase();
    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      this.emailError.set('Địa chỉ email không hợp lệ (Ví dụ: sinhvien@fpt.edu.vn)');
      return;
    }
    this.email = cleanEmail;
    this.step = 'password';
  }

  completeGoogleLogin() {
    this.passwordError.set('');
    if (!this.password || !this.password.trim()) {
      this.passwordError.set('Vui lòng nhập mật khẩu tài khoản Google của bạn');
      return;
    }

    this.loading.set(true);
    const fullName = this.email.split('@')[0].toUpperCase();

    this.auth.authenticateGoogle(this.email, fullName).subscribe({
      next: (res: any) => {
        this.loading.set(false);
        // Successful Google login: redirect back to home page
        this.router.navigate(['/']);
      },
      error: (err: any) => {
        this.loading.set(false);
        this.passwordError.set(err?.error?.error || 'Đăng nhập Google thất bại. Vui lòng thử lại.');
      }
    });
  }
}