import { Component, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-google-setup-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fantasy-modal-backdrop" (click)="close.emit()">
      <div class="glass-panel setup-modal crystal-glow" (click)="$event.stopPropagation()">
        <!-- Close Button -->
        <button class="close-btn" (click)="close.emit()">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <div class="modal-header">
          <div class="google-badge-orb">
            <svg viewBox="0 0 24 24" width="30" height="30">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
          </div>
          <h2 class="modal-title font-fantasy text-gradient-gold">Đăng Nhập Thật Bằng Google OAuth 2.0</h2>
          <p class="modal-desc">
            Để chuyển trực tiếp sang máy chủ chính thức của <strong>Google (accounts.google.com)</strong>, hệ thống cần <strong>Google Client ID</strong> của bạn từ Google Cloud Console.
          </p>
        </div>

        <div class="setup-steps">
          <div class="step-item">
            <div class="step-num">1</div>
            <div class="step-text">
              Truy cập <a href="https://console.cloud.google.com/apis/credentials" target="_blank" class="step-link">Google Cloud Console - Credentials <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
            </div>
          </div>
          <div class="step-item">
            <div class="step-num">2</div>
            <div class="step-text">
              Bấm <strong>Create Credentials</strong> &rarr; <strong>OAuth client ID</strong> &rarr; Chọn <strong>Web application</strong>.
            </div>
          </div>
          <div class="step-item">
            <div class="step-num">3</div>
            <div class="step-text">
              Thêm URI sau vào phần <strong>Authorized redirect URIs</strong>:<br>
              <code class="code-badge">http://localhost:4200/google-callback</code>
            </div>
          </div>
        </div>

        <!-- Form nhập Client ID -->
        <div class="client-id-form">
          <label class="input-lbl"><i class="fa-solid fa-key"></i> Dán Google Client ID vào đây:</label>
          <input 
            type="text" 
            [(ngModel)]="clientIdInput" 
            placeholder="xxxxxx-xxxxxxxxxxxxxxxx.apps.googleusercontent.com" 
            class="fantasy-input font-mono"
            autofocus
          />
          <div class="error-text" *ngIf="errorMessage()">
            <i class="fa-solid fa-circle-exclamation"></i> {{ errorMessage() }}
          </div>

          <div class="actions-row">
            <button class="btn-crystal-gold w-full" (click)="saveAndLaunch()">
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Lưu & Sang Google (accounts.google.com) Đăng Nhập Ngay</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .setup-modal {
      width: 100%;
      max-width: 580px;
      padding: 38px 32px;
      position: relative;
      background: rgba(8, 14, 34, 0.96);
      border: 1px solid rgba(229, 192, 123, 0.45);
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.85), 0 0 35px rgba(0, 240, 255, 0.2);
    }
    .close-btn {
      position: absolute;
      top: 18px;
      right: 18px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #94a3b8;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .modal-header {
      text-align: center;
      margin-bottom: 22px;
    }
    .google-badge-orb {
      width: 56px;
      height: 56px;
      margin: 0 auto 14px;
      border-radius: 50%;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 25px rgba(0, 240, 255, 0.35);
    }
    .modal-title {
      font-size: 1.38rem;
      font-weight: 700;
      margin-bottom: 8px;
    }
    .modal-desc {
      font-size: 0.88rem;
      color: #94a3b8;
      line-height: 1.45;
    }
    .modal-desc strong {
      color: #38bdf8;
    }
    .setup-steps {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 22px;
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 16px 18px;
      border-radius: 12px;
    }
    .step-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }
    .step-num {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: #e5c07b;
      color: #050713;
      font-weight: 800;
      font-size: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 2px;
    }
    .step-text {
      font-size: 0.84rem;
      color: #cbd5e1;
      line-height: 1.4;
    }
    .step-link {
      color: #38bdf8;
      text-decoration: underline;
      font-weight: 600;
    }
    .code-badge {
      display: inline-block;
      margin-top: 4px;
      padding: 3px 8px;
      background: rgba(0, 240, 255, 0.1);
      border: 1px solid rgba(0, 240, 255, 0.3);
      color: #00f0ff;
      border-radius: 6px;
      font-size: 0.8rem;
      font-family: monospace;
      user-select: all;
    }
    .client-id-form {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .input-lbl {
      font-size: 0.84rem;
      font-weight: 700;
      color: #e5c07b;
    }
    .error-text {
      font-size: 0.8rem;
      color: #ef4444;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .w-full {
      width: 100%;
      justify-content: center;
      padding: 13px;
      gap: 10px;
      font-size: 0.95rem;
      margin-top: 8px;
    }
  `]
})
export class GoogleSetupModalComponent {
  @Output() close = new EventEmitter<void>();
  clientIdInput = '';
  errorMessage = signal('');

  constructor(public auth: AuthService) {
    this.clientIdInput = this.auth.getGoogleClientId();
  }

  saveAndLaunch() {
    if (!this.clientIdInput || !this.clientIdInput.trim()) {
      this.errorMessage.set('Vui lòng nhập Google Client ID của bạn.');
      return;
    }

    const clean = this.clientIdInput.trim();
    if (!clean.includes('.apps.googleusercontent.com')) {
      this.errorMessage.set('Google Client ID thường có dạng xxxxx.apps.googleusercontent.com');
      return;
    }

    this.auth.setGoogleClientId(clean);
    this.close.emit();
    this.auth.redirectToGoogleOAuth();
  }
}
