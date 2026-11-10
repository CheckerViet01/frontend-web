import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-mssv-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fantasy-modal-backdrop" *ngIf="auth.requiresMssv()">
      <div class="scifi-modal-card">
        <div class="modal-laser-top"></div>

        <!-- Shield Icon Header -->
        <div class="modal-header">
          <div class="cyber-shield-box">
            <span class="shield-gem">🛡️</span>
            <div class="shield-pulse"></div>
          </div>
          <span class="portal-badge font-scifi">FPT UNIVERSITY • IDENTITY VERIFICATION</span>
          <h2 class="modal-title font-scifi text-shimmer-cyan">KÍCH HOẠT DANH TÍNH</h2>
          <p class="modal-desc font-sub">
            Chào mừng bạn <strong>{{ auth.currentUser()?.fullName }}</strong>! 
            Để kích hoạt tài khoản và mở khóa kho đề thi, vui lòng nhập <strong>Mã Số Sinh Viên (MSSV)</strong> gồm 2 chữ cái đầu và 6 chữ số.
          </p>
        </div>

        <!-- Form Body -->
        <div class="modal-body">
          <div class="form-group">
            <label class="input-label font-scifi">
              <i class="fa-solid fa-id-card text-cyan"></i> MÃ SỐ SINH VIÊN (MSSV):
            </label>
            <div class="input-wrap">
              <input 
                type="text" 
                [(ngModel)]="mssvInput" 
                placeholder="VD: HE171199, HS112233..." 
                class="scifi-input text-uppercase font-mono"
                (keyup.enter)="submitMssv()"
                maxlength="8"
                autofocus
              />
              <span class="input-badge font-scifi">FPTU</span>
            </div>
            <span class="field-hint font-sub">Định dạng chuẩn: 2 chữ cái đầu + 6 số (Ví dụ: HE171199, HS112233)</span>
          </div>

          <div class="error-msg font-mono" *ngIf="errorMessage()">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <span>{{ errorMessage() }}</span>
          </div>

          <div class="modal-actions">
            <button class="btn-crystal-gold w-full font-scifi" [disabled]="loading()" (click)="submitMssv()">
              <span *ngIf="!loading()"><i class="fa-solid fa-bolt"></i> XÁC NHẬN & KÍCH HOẠT</span>
              <span *ngIf="loading()"><i class="fa-solid fa-spinner fa-spin"></i> ĐANG KÍCH HOẠT...</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .scifi-modal-card {
      width: 100%;
      max-width: 480px;
      padding: 36px 30px;
      text-align: center;
      background: rgba(7, 12, 24, 0.97);
      border: 1.5px solid rgba(229, 169, 60, 0.45);
      clip-path: polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px);
      box-shadow: 0 25px 70px -15px rgba(0, 0, 0, 0.95), 0 0 35px rgba(229, 169, 60, 0.25);
      position: relative;
      animation: portalWarpOpen 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .modal-laser-top {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, transparent, #fbbf24 40%, #00f0ff 60%, transparent);
      box-shadow: 0 0 12px #fbbf24;
    }
    .cyber-shield-box {
      position: relative;
      width: 62px;
      height: 62px;
      margin: 0 auto 14px;
      clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
      background: rgba(229, 169, 60, 0.15);
      border: 1.5px solid #fbbf24;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.8rem;
      box-shadow: 0 0 18px rgba(229, 169, 60, 0.4);
    }
    .shield-pulse {
      position: absolute;
      inset: -6px;
      border-radius: 50%;
      border: 1px dashed rgba(229, 169, 60, 0.5);
      animation: spinSlow 10s linear infinite;
    }
    .portal-badge {
      font-size: 0.72rem;
      letter-spacing: 0.14em;
      color: #fbbf24;
      font-weight: 800;
    }
    .modal-title {
      font-size: 1.6rem;
      font-weight: 900;
      margin: 6px 0 10px;
      letter-spacing: 0.08em;
    }
    .modal-desc {
      font-size: 0.88rem;
      color: #c5d3e8;
      line-height: 1.55;
      margin-bottom: 22px;
    }
    .modal-desc strong {
      color: #00f0ff;
    }

    .modal-body {
      display: flex;
      flex-direction: column;
      gap: 16px;
      text-align: left;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .input-label {
      font-size: 0.76rem;
      font-weight: 800;
      color: #c5d3e8;
      letter-spacing: 0.06em;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .input-wrap {
      position: relative;
      display: flex;
      align-items: center;
    }
    .scifi-input {
      width: 100%;
      background: #050814;
      border: 1.5px solid rgba(229, 169, 60, 0.4);
      clip-path: polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px);
      padding: 12px 14px;
      color: #fbbf24;
      font-size: 1.15rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      outline: none;
      transition: all 0.2s ease;
    }
    .scifi-input:focus {
      border-color: #fbbf24;
      box-shadow: 0 0 18px rgba(229, 169, 60, 0.5);
    }
    .scifi-input::placeholder {
      color: #556980;
      font-size: 0.95rem;
    }
    .input-badge {
      position: absolute;
      right: 14px;
      font-size: 0.72rem;
      font-weight: 900;
      color: #fbbf24;
      background: rgba(229, 169, 60, 0.15);
      border: 1px solid rgba(229, 169, 60, 0.4);
      padding: 3px 8px;
      border-radius: 4px;
      letter-spacing: 0.08em;
    }
    .field-hint {
      font-size: 0.72rem;
      color: #788a9e;
      margin-top: 2px;
    }
    .error-msg {
      padding: 10px 14px;
      background: rgba(244, 63, 94, 0.15);
      border: 1px solid rgba(244, 63, 94, 0.4);
      color: #fb7185;
      font-size: 0.8rem;
      display: flex;
      align-items: center;
      gap: 8px;
      clip-path: polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px);
    }
    .w-full {
      width: 100%;
    }
    .text-uppercase {
      text-transform: uppercase;
    }
    .modal-actions {
      margin-top: 10px;
    }
  `]
})
export class MssvModalComponent {
  mssvInput = '';
  loading = signal(false);
  errorMessage = signal('');

  constructor(public auth: AuthService) {}

  submitMssv() {
    this.errorMessage.set('');
    const raw = this.mssvInput.trim().toUpperCase();

    const mssvRegex = /^[A-Z]{2}\d{6}$/;
    if (!mssvRegex.test(raw)) {
      this.errorMessage.set('MSSV không đúng định dạng FPT (2 chữ cái đầu + 6 số, VD: HE171199, HS112233).');
      return;
    }

    this.loading.set(true);
    this.auth.updateMssv(raw).subscribe({
      next: (user) => {
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err?.error?.message || 'Lỗi kết nối máy chủ.');
      }
    });
  }
}
