import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-google-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="callback-container">
      <div class="callback-card glass-panel crystal-glow">
        <div class="spinner-wrap" *ngIf="loading()">
          <div class="google-spinner"></div>
          <h2 class="callback-title font-fantasy text-gradient-gold">Đang Xác Thực Với Google...</h2>
          <p class="callback-desc">
            Vui lòng chờ trong giây lát. Hệ thống đang nhận diện tài khoản Google và đồng bộ dữ liệu vào HocDeThiFPT.
          </p>
        </div>

        <div class="error-wrap" *ngIf="errorMessage()">
          <div class="error-icon">⚠️</div>
          <h2 class="error-title">Xác Thực Thất Bại</h2>
          <p class="error-desc">{{ errorMessage() }}</p>
          <button class="btn-retry" (click)="router.navigate(['/'])">
            Quay Lại Trang Chủ
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .callback-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background: transparent;
    }
    .callback-card {
      width: 100%;
      max-width: 480px;
      padding: 44px 32px;
      text-align: center;
      border: 1px solid rgba(229, 192, 123, 0.4);
      border-radius: 20px;
      background: rgba(8, 14, 34, 0.96);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 240, 255, 0.2);
    }
    .google-spinner {
      width: 50px;
      height: 50px;
      margin: 0 auto 24px;
      border: 4px solid rgba(0, 240, 255, 0.15);
      border-top-color: #00f0ff;
      border-right-color: #e5c07b;
      border-radius: 50%;
      animation: spin 0.9s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .callback-title {
      font-size: 1.45rem;
      font-weight: 700;
      margin-bottom: 12px;
    }
    .callback-desc {
      font-size: 0.9rem;
      color: #94a3b8;
      line-height: 1.5;
    }
    .error-wrap {
      margin-top: 10px;
    }
    .error-icon {
      font-size: 3rem;
      margin-bottom: 12px;
    }
    .error-title {
      font-size: 1.3rem;
      color: #ef4444;
      margin-bottom: 8px;
    }
    .error-desc {
      font-size: 0.88rem;
      color: #cbd5e1;
      margin-bottom: 24px;
    }
    .btn-retry {
      background: rgba(229, 192, 123, 0.2);
      border: 1px solid #e5c07b;
      color: #fef08a;
      padding: 10px 24px;
      border-radius: 8px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-retry:hover {
      background: #e5c07b;
      color: #050713;
    }
  `]
})
export class GoogleCallbackComponent implements OnInit {
  loading = signal(true);
  errorMessage = signal('');

  constructor(
    public router: Router,
    private http: HttpClient,
    private auth: AuthService
  ) {}

  ngOnInit() {
    if (typeof window === 'undefined') return;

    // 1. Check for errors in query params or hash
    const urlParams = new URLSearchParams(window.location.search);
    const hash = window.location.hash.substring(1);
    const hashParams = new URLSearchParams(hash);

    const error = urlParams.get('error') || hashParams.get('error');
    if (error) {
      this.loading.set(false);
      this.errorMessage.set('Google từ chối xác thực hoặc bạn đã hủy đăng nhập: ' + error);
      return;
    }

    // 2. Extract access_token or id_token returned from Google
    const accessToken = hashParams.get('access_token');
    const idToken = hashParams.get('id_token');

    if (accessToken) {
      // Call Google UserInfo API directly to get verified identity
      const headers = new HttpHeaders({ Authorization: `Bearer ${accessToken}` });
      this.http.get<any>('https://www.googleapis.com/oauth2/v3/userinfo', { headers }).subscribe({
        next: (userInfo) => {
          this.syncWithBackend(userInfo.email, userInfo.name, userInfo.picture, idToken || undefined);
        },
        error: (err) => {
          // Fallback: if userinfo fails, try id_token directly
          if (idToken) {
            this.syncWithBackend('', '', '', idToken);
          } else {
            this.loading.set(false);
            this.errorMessage.set('Không thể lấy thông tin từ Google API: ' + (err?.message || 'Lỗi mạng'));
          }
        }
      });
    } else if (idToken) {
      this.syncWithBackend('', '', '', idToken);
    } else {
      // Check query params for auth code if server code exchange is used
      const code = urlParams.get('code');
      if (code) {
        this.loading.set(false);
        this.errorMessage.set('Google trả về mã ủy quyền (code). Vui lòng sử dụng Implicit flow hoặc cấu hình Client Secret.');
      } else {
        this.loading.set(false);
        this.errorMessage.set('Không nhận được token từ Google. Vui lòng thử lại.');
      }
    }
  }

  private syncWithBackend(email: string, fullName: string, avatarUrl?: string, idToken?: string) {
    this.auth.loginWithGoogleReal(email, fullName, avatarUrl, idToken).subscribe({
      next: (res) => {
        this.loading.set(false);
        // Navigate back to home page
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err?.error?.error || 'Đồng bộ tài khoản với hệ thống thất bại.');
      }
    });
  }
}
