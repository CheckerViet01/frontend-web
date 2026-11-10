import { Component, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fantasy-modal-backdrop" (click)="close.emit()">
      <div class="scifi-modal-card" (click)="$event.stopPropagation()">
        <!-- Laser Accent Top -->
        <div class="modal-laser-strip"></div>

        <!-- Close Button -->
        <button class="close-btn" (click)="close.emit()" title="Đóng cửa sổ">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <!-- Header -->
        <div class="modal-header">
          <div class="scifi-badge-orb">
            <span class="header-gem">⬡</span>
            <div class="orb-pulse-ring"></div>
          </div>
          <span class="portal-badge font-scifi">HOCDETHIFPT • STUDENT VAULT</span>
          <h2 class="modal-title font-scifi text-shimmer-cyan">CỔNG SINH VIÊN</h2>
          <p class="modal-desc font-sub">
            Đăng nhập để tra cứu toàn bộ đề thi, tải file Given Code (.ZIP) và trao đổi giải thuật.
          </p>

          <!-- Toggle Tabs: Đăng Nhập / Đăng Ký -->
          <div class="auth-tabs font-scifi">
            <button 
              type="button" 
              class="tab-btn" 
              [class.active]="tab === 'login'" 
              (click)="switchTab('login')"
            >
              <i class="fa-solid fa-bolt"></i> ĐĂNG NHẬP
            </button>
            <button 
              type="button" 
              class="tab-btn" 
              [class.active]="tab === 'register'" 
              (click)="switchTab('register')"
            >
              <i class="fa-solid fa-user-plus"></i> ĐĂNG KÝ
            </button>
          </div>
        </div>

        <!-- ============================================== -->
        <!-- TAB 1: FORM ĐĂNG NHẬP TRUYỀN THỐNG            -->
        <!-- ============================================== -->
        <form *ngIf="tab === 'login'" (ngSubmit)="onLoginSubmit()" class="auth-form">
          <div class="form-group">
            <label class="input-label font-scifi">
              <i class="fa-solid fa-user text-cyan"></i> EMAIL HOẶC MSSV:
            </label>
            <div class="input-wrap">
              <input 
                type="text" 
                [(ngModel)]="loginIdentifier" 
                name="loginIdentifier"
                placeholder="VD: yourname@fpt.edu.vn hoặc HE171199" 
                class="scifi-input font-sub" 
                required
                autofocus
              />
            </div>
          </div>

          <div class="form-group">
            <label class="input-label font-scifi">
              <i class="fa-solid fa-lock text-cyan"></i> MẬT KHẨU:
            </label>
            <div class="input-wrap">
              <input 
                [type]="showLoginPass ? 'text' : 'password'" 
                [(ngModel)]="loginPassword" 
                name="loginPassword"
                placeholder="Nhập mật khẩu tài khoản" 
                class="scifi-input font-sub" 
                required
              />
              <button type="button" class="eye-toggle" (click)="showLoginPass = !showLoginPass">
                <i [class]="showLoginPass ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
              </button>
            </div>
          </div>

          <div class="error-msg font-mono" *ngIf="errorMessage()">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <span>{{ errorMessage() }}</span>
          </div>

          <button type="submit" class="btn-scifi-cyan w-full font-scifi" [disabled]="loading()">
            <span *ngIf="!loading()"><i class="fa-solid fa-arrow-right-to-bracket"></i> ĐĂNG NHẬP HỆ THỐNG</span>
            <span *ngIf="loading()"><i class="fa-solid fa-spinner fa-spin"></i> ĐANG XÁC THỰC...</span>
          </button>

          <div class="switch-row font-sub">
            <span>Chưa có tài khoản sinh viên?</span>
            <a href="javascript:void(0)" (click)="switchTab('register')" class="switch-link font-scifi">
              Tạo tài khoản mới <i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        </form>

        <!-- ============================================== -->
        <!-- TAB 2: FORM ĐĂNG KÝ TÀI KHOẢN MỚI             -->
        <!-- ============================================== -->
        <form *ngIf="tab === 'register'" (ngSubmit)="onRegisterSubmit()" class="auth-form">
          <div class="form-group">
            <label class="input-label font-scifi">
              <i class="fa-solid fa-signature text-cyan"></i> HỌ VÀ TÊN:
            </label>
            <input 
              type="text" 
              [(ngModel)]="regFullName" 
              name="regFullName"
              placeholder="VD: Nguyễn Văn Hoàng" 
              class="scifi-input font-sub" 
              required
              autofocus
            />
          </div>

          <div class="form-group">
            <label class="input-label font-scifi">
              <i class="fa-solid fa-envelope text-cyan"></i> ĐỊA CHỈ EMAIL:
            </label>
            <input 
              type="email" 
              [(ngModel)]="regEmail" 
              name="regEmail"
              placeholder="VD: hoangnv@fpt.edu.vn hoặc your_email@gmail.com" 
              class="scifi-input font-sub" 
              required
            />
          </div>

          <div class="form-group">
            <label class="input-label font-scifi">
              <i class="fa-solid fa-id-card text-gold"></i> MÃ SỐ SINH VIÊN (MSSV):
            </label>
            <div class="input-wrap">
              <input 
                type="text" 
                [(ngModel)]="regMssv" 
                name="regMssv"
                placeholder="VD: HE171199, HS112233..." 
                class="scifi-input text-uppercase font-mono"
                maxlength="8"
                required
              />
              <span class="input-badge font-scifi">FPTU</span>
            </div>
            <span class="field-hint font-sub">Định dạng: 2 chữ cái đầu + 6 số (Ví dụ: HE171199, HS112233)</span>
          </div>

          <div class="form-row-2">
            <div class="form-group">
              <label class="input-label font-scifi">
                <i class="fa-solid fa-lock text-cyan"></i> MẬT KHẨU:
              </label>
              <div class="input-wrap">
                <input 
                  [type]="showRegPass ? 'text' : 'password'" 
                  [(ngModel)]="regPassword" 
                  name="regPassword"
                  placeholder="≥ 6 ký tự" 
                  class="scifi-input font-sub" 
                  required
                />
                <button type="button" class="eye-toggle" (click)="showRegPass = !showRegPass">
                  <i [class]="showRegPass ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label class="input-label font-scifi">
                <i class="fa-solid fa-shield-halved text-cyan"></i> XÁC NHẬN:
              </label>
              <input 
                type="password" 
                [(ngModel)]="regConfirmPassword" 
                name="regConfirmPassword"
                placeholder="Nhập lại MK" 
                class="scifi-input font-sub" 
                required
              />
            </div>
          </div>

          <div class="error-msg font-mono" *ngIf="errorMessage()">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <span>{{ errorMessage() }}</span>
          </div>

          <button type="submit" class="btn-crystal-gold w-full font-scifi" [disabled]="loading()">
            <span *ngIf="!loading()"><i class="fa-solid fa-user-check"></i> XÁC NHẬN TẠO TÀI KHOẢN</span>
            <span *ngIf="loading()"><i class="fa-solid fa-spinner fa-spin"></i> ĐANG XỬ LÝ...</span>
          </button>

          <div class="switch-row font-sub">
            <span>Đã có tài khoản sinh viên?</span>
            <a href="javascript:void(0)" (click)="switchTab('login')" class="switch-link font-scifi">
              Đăng nhập ngay <i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .scifi-modal-card {
      width: 100%;
      max-width: 480px;
      padding: 36px 32px;
      position: relative;
      background: rgba(7, 12, 24, 0.97);
      border: 1.5px solid rgba(0, 240, 255, 0.45);
      clip-path: polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px);
      box-shadow: 0 25px 70px -15px rgba(0, 0, 0, 0.95), 0 0 40px rgba(0, 240, 255, 0.25);
      animation: portalWarpOpen 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .modal-laser-strip {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, transparent, #00f0ff 40%, #e5a93c 60%, transparent);
      box-shadow: 0 0 12px #00f0ff;
    }
    .close-btn {
      position: absolute;
      top: 18px;
      right: 18px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #c5d3e8;
      width: 32px;
      height: 32px;
      clip-path: polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    .close-btn:hover {
      background: #f43f5e;
      border-color: #f43f5e;
      color: #ffffff;
      transform: scale(1.08);
    }

    .modal-header {
      text-align: center;
      margin-bottom: 22px;
    }
    .scifi-badge-orb {
      position: relative;
      width: 56px;
      height: 56px;
      margin: 0 auto 12px;
      clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
      background: rgba(0, 240, 255, 0.12);
      border: 1.5px solid #00f0ff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 18px rgba(0, 240, 255, 0.4);
    }
    .header-gem {
      font-size: 1.6rem;
      color: #00f0ff;
      filter: drop-shadow(0 0 8px #00f0ff);
    }
    .orb-pulse-ring {
      position: absolute;
      inset: -6px;
      border-radius: 50%;
      border: 1px dashed rgba(0, 240, 255, 0.5);
      animation: spinSlow 10s linear infinite;
    }
    .portal-badge {
      font-size: 0.72rem;
      letter-spacing: 0.14em;
      color: #00f0ff;
      font-weight: 800;
    }
    .modal-title {
      font-size: 1.6rem;
      font-weight: 900;
      margin: 6px 0 8px;
      letter-spacing: 0.08em;
    }
    .modal-desc {
      font-size: 0.88rem;
      color: #c5d3e8;
      line-height: 1.5;
      margin-bottom: 18px;
    }

    .auth-tabs {
      display: flex;
      background: #050812;
      border: 1px solid rgba(0, 240, 255, 0.3);
      padding: 4px;
      gap: 6px;
      clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);
    }
    .tab-btn {
      flex: 1;
      padding: 10px 16px;
      background: transparent;
      border: none;
      color: #788a9e;
      font-size: 0.82rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      clip-path: polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px);
    }
    .tab-btn.active {
      background: #00f0ff;
      color: #04060c;
      box-shadow: 0 0 16px rgba(0, 240, 255, 0.6);
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .form-row-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 5px;
      text-align: left;
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
      border: 1.5px solid rgba(0, 240, 255, 0.35);
      clip-path: polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px);
      padding: 10px 14px;
      color: #ffffff;
      font-size: 0.94rem;
      font-weight: 600;
      outline: none;
      transition: all 0.2s ease;
    }
    .scifi-input:focus {
      border-color: #00f0ff;
      box-shadow: 0 0 16px rgba(0, 240, 255, 0.4);
    }
    .scifi-input::placeholder {
      color: #556980;
    }
    .eye-toggle {
      position: absolute;
      right: 12px;
      background: none;
      border: none;
      color: #00f0ff;
      cursor: pointer;
      font-size: 0.9rem;
    }
    .input-badge {
      position: absolute;
      right: 12px;
      font-size: 0.72rem;
      font-weight: 900;
      color: #00f0ff;
      background: rgba(0, 240, 255, 0.15);
      border: 1px solid rgba(0, 240, 255, 0.4);
      padding: 2px 7px;
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
    .switch-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-size: 0.82rem;
      color: #788a9e;
      margin-top: 6px;
    }
    .switch-link {
      color: #00f0ff;
      font-weight: 800;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      letter-spacing: 0.04em;
    }
    .switch-link:hover {
      text-decoration: underline;
      text-shadow: 0 0 10px rgba(0, 240, 255, 0.6);
    }
    .text-uppercase {
      text-transform: uppercase;
    }
  `]
})
export class LoginModalComponent {
  @Output() close = new EventEmitter<void>();

  tab: 'login' | 'register' = 'login';
  loading = signal(false);
  errorMessage = signal('');

  // Login inputs
  loginIdentifier = '';
  loginPassword = '';
  showLoginPass = false;

  // Register inputs
  regFullName = '';
  regEmail = '';
  regMssv = '';
  regPassword = '';
  regConfirmPassword = '';
  showRegPass = false;

  constructor(private auth: AuthService) {}

  switchTab(t: 'login' | 'register') {
    this.tab = t;
    this.errorMessage.set('');
  }

  onLoginSubmit() {
    this.errorMessage.set('');
    if (!this.loginIdentifier.trim() || !this.loginPassword) {
      this.errorMessage.set('Vui lòng nhập Email/MSSV và mật khẩu.');
      return;
    }

    this.loading.set(true);
    this.auth.login(this.loginIdentifier.trim(), this.loginPassword).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res && (res.token || res.user)) {
          this.close.emit();
        } else {
          this.errorMessage.set(res?.message || 'Đăng nhập thất bại.');
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err?.error?.message || 'Lỗi kết nối máy chủ.');
      }
    });
  }

  onRegisterSubmit() {
    this.errorMessage.set('');

    if (!this.regFullName.trim() || !this.regEmail.trim() || !this.regMssv.trim() || !this.regPassword) {
      this.errorMessage.set('Vui lòng điền đầy đủ tất cả các trường.');
      return;
    }

    // MSSV Validation
    const mssvRegex = /^[A-Za-z]{2}\d{6}$/;
    if (!mssvRegex.test(this.regMssv.trim())) {
      this.errorMessage.set('MSSV không đúng định dạng FPT (2 chữ cái đầu + 6 số, VD: HE171199).');
      return;
    }

    if (this.regPassword.length < 6) {
      this.errorMessage.set('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    if (this.regPassword !== this.regConfirmPassword) {
      this.errorMessage.set('Mật khẩu xác nhận không khớp.');
      return;
    }

    this.loading.set(true);
    this.auth.register({
      fullName: this.regFullName.trim(),
      email: this.regEmail.trim(),
      mssv: this.regMssv.trim().toUpperCase(),
      password: this.regPassword
    }).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res && (res.token || res.user)) {
          this.close.emit();
        } else {
          this.errorMessage.set(res?.message || 'Đăng ký thất bại.');
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err?.error?.message || 'Lỗi kết nối máy chủ.');
      }
    });
  }
}
