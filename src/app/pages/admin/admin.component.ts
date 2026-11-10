import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { ExamService, Exam, Subject, DashboardStats } from '../../services/exam.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-page-container">
      <!-- Admin Top Dedicated Bar -->
      <header class="admin-top-nav">
        <div class="admin-brand-group">
          <div class="scifi-emblem-box">
            <span class="scifi-shard-icon">⬡</span>
            <div class="emblem-core-glow"></div>
          </div>
          <div class="brand-text-block">
            <div class="brand-title font-scifi">HOCDETHIFPT</div>
            <div class="brand-telemetry font-scifi">
              <span class="beacon-dot"></span>
              <span class="telemetry-text">ADMIN VAULT • WORKSPACE</span>
            </div>
          </div>
        </div>
        
        <div class="admin-user-group" *ngIf="auth.currentUser() as admin">
          <div class="admin-avatar-pill">
            <div class="admin-avatar-wrap" [class.master-border]="admin.isMasterAdmin">
              <img [src]="admin.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + admin.email" class="admin-nav-avatar" alt="Avatar">
            </div>
            <div class="admin-nav-details">
              <span class="admin-nav-name font-sub">{{ admin.fullName }}</span>
              <span class="admin-nav-role font-scifi" [ngClass]="admin.isMasterAdmin ? 'badge-master' : 'badge-sub'">
                {{ admin.isMasterAdmin ? '👑 MASTER ADMIN' : '🛡️ QUẢN TRỊ VIÊN' }}
              </span>
            </div>
          </div>
          <button class="btn-admin-logout font-scifi" (click)="logoutAdmin()" title="Đăng xuất khỏi cổng quản trị">
            <i class="fa-solid fa-arrow-right-from-bracket"></i>
            <span>ĐĂNG XUẤT</span>
          </button>
        </div>
      </header>

      <!-- Admin Command Banner -->
      <div class="admin-header-card">
        <div class="card-left-hatches"></div>
        <div class="header-left">
          <div class="telemetry-badge font-scifi">
            <span class="beacon-pulse"></span>
            <span>HỆ THỐNG ĐIỀU HÀNH TỐI CAO • ROOT COMMAND</span>
          </div>
          <h1 class="header-title font-scifi">
            <span class="title-scifi-white">HỘI ĐỒNG QUẢN TRỊ</span>
            <span class="text-shimmer-cyan"> • HOCDETHIFPT</span>
          </h1>
          <p class="header-sub font-sub">
            Toàn quyền kiểm soát tài khoản người dùng, phân quyền quản trị viên cấp dưới và xuất bản kho đề thi PE, FE, Quiz, PT, Midterm.
          </p>
        </div>

        <!-- High-Tech Slanted Tabs Ribbon -->
        <div class="admin-tabs-ribbon">
          <button class="slanted-admin-tab font-scifi" [class.active]="activeTab === 'users'" (click)="activeTab = 'users'">
            <span class="tab-inner">
              <i class="fa-solid fa-users-gear"></i>
              <span>NGƯỜI DÙNG</span>
              <span class="tab-count font-mono">{{ users().length }}</span>
            </span>
          </button>

          <!-- TAB THÊM QUẢN TRỊ VIÊN - CHỈ MASTER ADMIN MỚI ĐƯỢC THẤY -->
          <button *ngIf="auth.isMasterAdmin()" class="slanted-admin-tab tab-gold font-scifi" [class.active]="activeTab === 'subadmins'" (click)="activeTab = 'subadmins'">
            <span class="tab-inner">
              <i class="fa-solid fa-crown"></i>
              <span>THÊM QUẢN TRỊ VIÊN</span>
            </span>
          </button>

          <button class="slanted-admin-tab font-scifi" [class.active]="activeTab === 'exams'" (click)="activeTab = 'exams'">
            <span class="tab-inner">
              <i class="fa-solid fa-file-pen"></i>
              <span>QUẢN LÝ ĐỀ THI</span>
              <span class="tab-count font-mono">{{ exams().length }}</span>
            </span>
          </button>

          <button class="slanted-admin-tab font-scifi" [class.active]="activeTab === 'stats'" (click)="activeTab = 'stats'">
            <span class="tab-inner">
              <i class="fa-solid fa-chart-pie"></i>
              <span>THỐNG KÊ</span>
            </span>
          </button>
        </div>
      </div>

      <!-- Access Denied Guard if not Admin -->
      <div class="access-denied-box" *ngIf="!auth.isAdmin()">
        <div class="denied-icon">🔒</div>
        <h2 class="font-scifi title-scifi-white">Truy Cập Bị Từ Chối</h2>
        <p class="font-sub">Chỉ tài khoản mang vai trò <strong class="text-cyan">ROLE_ADMIN</strong> mới có quyền truy cập trang quản trị này.</p>
        <button class="btn-scifi-gold font-scifi mt-4" (click)="router.navigate(['/admin-portal'])">
          <i class="fa-solid fa-shield-halved"></i> ĐẾN CỔNG ĐĂNG NHẬP QUẢN TRỊ
        </button>
      </div>

      <div *ngIf="auth.isAdmin()">
        <!-- ============================================== -->
        <!-- TAB 1: USER MANAGEMENT                        -->
        <!-- ============================================== -->
        <section class="tab-content" *ngIf="activeTab === 'users'">
          <div class="section-title-row">
            <div>
              <h2 class="section-tech-title font-scifi">
                <i class="fa-solid fa-users text-cyan"></i>
                <span>DANH SÁCH NGƯỜI DÙNG & PHÂN QUYỀN</span>
              </h2>
              <p class="section-desc font-sub">
                Xem toàn bộ thông tin chi tiết: Email, Mã số sinh viên (MSSV), Vai trò và Trạng thái tài khoản.
              </p>
            </div>
          </div>

          <div class="scifi-table-wrapper">
            <table class="scifi-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>HỌ & TÊN</th>
                  <th>EMAIL</th>
                  <th>MÃ SỐ SINH VIÊN (MSSV)</th>
                  <th>VAI TRÒ (ROLE)</th>
                  <th>TRẠNG THÁI</th>
                  <th>HÀNH ĐỘNG</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let u of users()">
                  <td class="font-mono text-muted">#{{ u.id }}</td>
                  <td>
                    <div class="user-cell">
                      <img [src]="u.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + u.email" class="tbl-avatar" alt="Avatar">
                      <span class="user-cell-name font-sub">{{ u.fullName }}</span>
                    </div>
                  </td>
                  <td>
                    <span class="email-text font-mono">{{ u.email }}</span>
                  </td>
                  <td>
                    <span class="mssv-badge font-mono" [class.no-mssv]="!u.mssv">
                      {{ u.mssv || 'CHƯA CẬP NHẬT' }}
                    </span>
                  </td>
                  <td>
                    <span class="role-pill font-scifi" [class.pill-master]="u.isMasterAdmin" [class.pill-admin]="u.role === 'ROLE_ADMIN' && !u.isMasterAdmin" [class.pill-user]="u.role === 'ROLE_USER'">
                      {{ u.isMasterAdmin ? '👑 MASTER ADMIN' : (u.role === 'ROLE_ADMIN' ? '🛡️ ADMIN' : '🎓 USER') }}
                    </span>
                  </td>
                  <td>
                    <span class="status-cell font-mono">
                      <span class="status-dot" [class.active]="u.status === 'ACTIVE'"></span>
                      {{ u.status }}
                    </span>
                  </td>
                  <td>
                    <div class="action-btn-group">
                      <button class="btn-action-edit font-scifi" (click)="openEditUser(u)" title="Sửa thông tin">
                        <i class="fa-solid fa-pen-to-square"></i>
                        <span>SỬA</span>
                      </button>
                      <button class="btn-action-del font-scifi" *ngIf="!u.isMasterAdmin" (click)="deleteUser(u)" title="Xóa người dùng">
                        <i class="fa-solid fa-trash-can"></i>
                        <span>XÓA</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- ============================================== -->
        <!-- TAB 2: THÊM QUẢN TRỊ VIÊN (CHỈ MASTER ADMIN)   -->
        <!-- ============================================== -->
        <section class="tab-content" *ngIf="activeTab === 'subadmins' && auth.isMasterAdmin()">
          <div class="section-title-row">
            <div>
              <h2 class="section-tech-title font-scifi">
                <i class="fa-solid fa-crown text-gold"></i>
                <span>PHÂN QUYỀN & THÊM QUẢN TRỊ VIÊN HỆ THỐNG</span>
              </h2>
              <p class="section-desc font-sub">
                Đặc quyền tối cao chỉ dành cho tài khoản <strong class="text-gold">admin@fpt.edu.vn</strong> (Master Admin). Các quản trị viên được tạo tại đây sẽ có tài khoản và mật khẩu để đăng nhập trực tiếp.
              </p>
            </div>
          </div>

          <!-- Create Sub-Admin Form Card -->
          <div class="scifi-form-card gold-border">
            <h3 class="form-card-title font-scifi text-gradient-gold">
              <i class="fa-solid fa-user-shield"></i> KHỞI TẠO TÀI KHOẢN QUẢN TRỊ VIÊN MỚI
            </h3>

            <div class="admin-create-grid">
              <div class="form-group">
                <label class="form-label font-scifi"><i class="fa-solid fa-signature text-gold"></i> HỌ VÀ TÊN:</label>
                <input 
                  type="text" 
                  [(ngModel)]="newAdminForm.fullName" 
                  placeholder="VD: Thầy Hoàng GV FPT" 
                  class="scifi-input font-sub" 
                />
              </div>

              <div class="form-group">
                <label class="form-label font-scifi"><i class="fa-solid fa-envelope text-gold"></i> TÀI KHOẢN / EMAIL ĐĂNG NHẬP:</label>
                <input 
                  type="text" 
                  [(ngModel)]="newAdminForm.email" 
                  placeholder="VD: admin_hoang@fpt.edu.vn hoặc admin_hoang" 
                  class="scifi-input font-sub" 
                />
              </div>

              <div class="form-group">
                <label class="form-label font-scifi"><i class="fa-solid fa-lock text-gold"></i> MẬT KHẨU KHỞI TẠO:</label>
                <input 
                  type="text" 
                  [(ngModel)]="newAdminForm.password" 
                  placeholder="VD: AdminPass2026!" 
                  class="scifi-input font-sub" 
                />
              </div>
            </div>

            <div class="form-submit-row">
              <div class="error-msg-inline font-mono" *ngIf="subAdminError()">
                <i class="fa-solid fa-triangle-exclamation"></i> {{ subAdminError() }}
              </div>
              <div class="success-msg-inline font-mono" *ngIf="subAdminSuccess()">
                <i class="fa-solid fa-circle-check"></i> {{ subAdminSuccess() }}
              </div>
              <button class="btn-scifi-gold font-scifi" [disabled]="subAdminLoading()" (click)="createSubAdmin()">
                <span *ngIf="!subAdminLoading()"><i class="fa-solid fa-user-plus"></i> TẠO QUẢN TRỊ VIÊN MỚI</span>
                <span *ngIf="subAdminLoading()"><i class="fa-solid fa-spinner fa-spin"></i> ĐANG TẠO...</span>
              </button>
            </div>
          </div>

          <!-- Sub-Admins List Table -->
          <div class="scifi-table-wrapper mt-6">
            <h4 class="sub-table-title font-scifi">
              <i class="fa-solid fa-shield-halved text-gold"></i> BAN QUẢN TRỊ ĐANG HOẠT ĐỘNG ({{ getAdminList().length }})
            </h4>
            <table class="scifi-table">
              <thead>
                <tr>
                  <th>CẤP BẬC</th>
                  <th>HỌ & TÊN</th>
                  <th>TÀI KHOẢN / EMAIL</th>
                  <th>TRẠNG THÁI</th>
                  <th>HÀNH ĐỘNG</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let a of getAdminList()">
                  <td>
                    <span class="role-pill font-scifi" [class.pill-master]="a.isMasterAdmin" [class.pill-admin]="!a.isMasterAdmin">
                      {{ a.isMasterAdmin ? '👑 MASTER ADMIN' : '🛡️ SUB-ADMIN' }}
                    </span>
                  </td>
                  <td><span class="user-cell-name font-sub">{{ a.fullName }}</span></td>
                  <td><span class="email-text font-mono">{{ a.email }}</span></td>
                  <td>
                    <span class="status-cell font-mono">
                      <span class="status-dot active"></span>
                      {{ a.status }}
                    </span>
                  </td>
                  <td>
                    <button class="btn-action-del font-scifi" *ngIf="!a.isMasterAdmin" (click)="deleteUser(a)">
                      <i class="fa-solid fa-trash-can"></i> XÓA QUYỀN
                    </button>
                    <span *ngIf="a.isMasterAdmin" class="tag-root-admin font-scifi">TÀI KHOẢN GỐC</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- ============================================== -->
        <!-- TAB 3: EXAM MANAGEMENT                       -->
        <!-- ============================================== -->
        <section class="tab-content" *ngIf="activeTab === 'exams'">
          <div class="section-title-row">
            <div>
              <h2 class="section-tech-title font-scifi">
                <i class="fa-solid fa-file-lines text-cyan"></i>
                <span>QUẢN LÝ KHO ĐỀ THI FPT</span>
              </h2>
              <p class="section-desc font-sub">
                Đăng tải đề thi mới (hỗ trợ upload không giới hạn số lượng ảnh đề thi + nhiều file zip given code).
              </p>
            </div>
            <button class="btn-scifi-cyan font-scifi" (click)="openCreateExam()">
              <i class="fa-solid fa-cloud-arrow-up"></i> ĐĂNG TẢI ĐỀ THI MỚI
            </button>
          </div>

          <div class="scifi-table-wrapper">
            <table class="scifi-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>MÃ ĐỀ THI</th>
                  <th>MÔN HỌC</th>
                  <th>LOẠI ĐỀ</th>
                  <th>HỌC KỲ</th>
                  <th>ẢNH ĐỀ (SỐ LƯỢNG)</th>
                  <th>FILE .ZIP GIVEN</th>
                  <th>LƯỢT XEM/TẢI</th>
                  <th>HÀNH ĐỘNG</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let ex of exams()">
                  <td class="font-mono text-muted">#{{ ex.id }}</td>
                  <td>
                    <strong class="exam-title-text font-scifi">{{ ex.title }}</strong>
                  </td>
                  <td>
                    <span class="subject-pill font-scifi">{{ ex.subjectCode }}</span>
                  </td>
                  <td>
                    <span class="badge-exam font-scifi" [ngClass]="'badge-' + ex.examType.toLowerCase()">{{ ex.examType }}</span>
                  </td>
                  <td class="font-sub">{{ ex.semester }}</td>
                  <td>
                    <span *ngIf="getExamImageCount(ex) > 0" class="media-indicator text-cyan font-mono">
                      <i class="fa-solid fa-images"></i> {{ getExamImageCount(ex) }} ảnh
                    </span>
                    <span *ngIf="getExamImageCount(ex) === 0" class="media-indicator text-muted font-mono">Trống</span>
                  </td>
                  <td>
                    <span *ngIf="getExamZipCount(ex) > 0" class="media-indicator text-emerald font-mono">
                      <i class="fa-solid fa-file-zipper"></i> {{ getExamZipCount(ex) }} file
                    </span>
                    <span *ngIf="getExamZipCount(ex) === 0" class="media-indicator text-muted font-mono">Trống</span>
                  </td>
                  <td>
                    <span class="stats-mini font-mono">👁️ {{ ex.viewsCount }} | 📥 {{ ex.downloadsCount }}</span>
                  </td>
                  <td>
                    <div class="action-btn-group">
                      <button class="btn-action-edit font-scifi" (click)="openEditExam(ex)">
                        <i class="fa-solid fa-pen-to-square"></i> SỬA
                      </button>
                      <button class="btn-action-del font-scifi" (click)="deleteExam(ex)">
                        <i class="fa-solid fa-trash-can"></i> XÓA
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- ============================================== -->
        <!-- TAB 4: STATS OVERVIEW                         -->
        <!-- ============================================== -->
        <section class="tab-content" *ngIf="activeTab === 'stats'">
          <div class="section-title-row">
            <h2 class="section-tech-title font-scifi">
              <i class="fa-solid fa-chart-line text-cyan"></i>
              <span>BẢNG THỐNG KÊ HOẠT ĐỘNG TOÀN HỆ THỐNG</span>
            </h2>
          </div>

          <div class="stats-cards-grid" *ngIf="stats() as s">
            <div class="scifi-stat-card cyan-glow">
              <div class="stat-top-row">
                <div class="stat-icon-wrap cyan"><i class="fa-solid fa-layer-group"></i></div>
                <span class="stat-tag font-scifi">TOTAL EXAMS</span>
              </div>
              <div class="stat-val font-scifi text-cyan">{{ s.totalExams }}</div>
              <div class="stat-lbl font-sub">Tổng Số Đề Thi Đã Đăng</div>
            </div>

            <div class="scifi-stat-card purple-glow">
              <div class="stat-top-row">
                <div class="stat-icon-wrap purple"><i class="fa-solid fa-users"></i></div>
                <span class="stat-tag font-scifi">MEMBERS</span>
              </div>
              <div class="stat-val font-scifi text-purple">{{ s.totalUsers }}</div>
              <div class="stat-lbl font-sub">Người Dùng & Quản Trị Viên</div>
            </div>

            <div class="scifi-stat-card gold-glow">
              <div class="stat-top-row">
                <div class="stat-icon-wrap gold"><i class="fa-solid fa-eye"></i></div>
                <span class="stat-tag font-scifi">VIEWS</span>
              </div>
              <div class="stat-val font-scifi text-gold">{{ s.totalViews | number }}</div>
              <div class="stat-lbl font-sub">Tổng Lượt Xem Đề Thi</div>
            </div>

            <div class="scifi-stat-card emerald-glow">
              <div class="stat-top-row">
                <div class="stat-icon-wrap emerald"><i class="fa-solid fa-cloud-arrow-down"></i></div>
                <span class="stat-tag font-scifi">DOWNLOADS</span>
              </div>
              <div class="stat-val font-scifi text-emerald">{{ s.totalDownloads | number }}</div>
              <div class="stat-lbl font-sub">Tổng Lượt Tải Given .ZIP</div>
            </div>
          </div>
        </section>
      </div>

      <!-- ============================================== -->
      <!-- EDIT USER MODAL                                -->
      <!-- ============================================== -->
      <div class="fantasy-modal-backdrop" *ngIf="editingUser" (click)="editingUser = null">
        <div class="scifi-admin-modal" (click)="$event.stopPropagation()">
          <div class="modal-header-bar">
            <h2 class="modal-title font-scifi text-shimmer-cyan">
              <i class="fa-solid fa-user-pen"></i> CHỈNH SỬA THÔNG TIN NGƯỜI DÙNG
            </h2>
            <button class="modal-close-btn" (click)="editingUser = null"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <p class="modal-sub font-sub">Cập nhật họ tên, MSSV, vai trò hoặc trạng thái tài khoản.</p>

          <div class="modal-form-grid">
            <div class="form-group">
              <label class="form-label font-scifi">EMAIL:</label>
              <input type="text" [value]="editingUser.email" disabled class="scifi-input disabled font-mono" />
            </div>

            <div class="form-group">
              <label class="form-label font-scifi">HỌ VÀ TÊN:</label>
              <input type="text" [(ngModel)]="editUserForm.fullName" class="scifi-input font-sub" />
            </div>

            <div class="form-group">
              <label class="form-label font-scifi">MÃ SỐ SINH VIÊN (MSSV):</label>
              <input type="text" [(ngModel)]="editUserForm.mssv" placeholder="VD: HE171199" class="scifi-input uppercase font-mono" />
            </div>

            <div class="form-group">
              <label class="form-label font-scifi">VAI TRÒ (ROLE):</label>
              <select [(ngModel)]="editUserForm.role" class="scifi-input font-scifi">
                <option value="ROLE_USER">ROLE_USER (Sinh viên)</option>
                <option value="ROLE_ADMIN">ROLE_ADMIN (Quản trị viên)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label font-scifi">TRẠNG THÁI:</label>
              <select [(ngModel)]="editUserForm.status" class="scifi-input font-scifi">
                <option value="ACTIVE">ACTIVE (Hoạt động)</option>
                <option value="BANNED">BANNED (Khóa tài khoản)</option>
              </select>
            </div>
          </div>

          <div class="modal-footer-btns">
            <button class="btn-scifi-outline font-scifi" (click)="editingUser = null">HỦY BỎ</button>
            <button class="btn-scifi-cyan font-scifi" (click)="saveUserEdit()">LƯU THAY ĐỔI</button>
          </div>
        </div>
      </div>

      <!-- ============================================== -->
      <!-- CREATE / EDIT EXAM MODAL                       -->
      <!-- ============================================== -->
      <div class="fantasy-modal-backdrop" *ngIf="showExamModal" (click)="showExamModal = false">
        <div class="scifi-admin-modal modal-wide" (click)="$event.stopPropagation()">
          <div class="modal-header-bar">
            <h2 class="modal-title font-scifi text-shimmer-cyan">
              <i class="fa-solid fa-file-circle-plus"></i> {{ isEditingExam ? 'CHỈNH SỬA ĐỀ THI' : 'ĐĂNG TẢI ĐỀ THI MỚI' }}
            </h2>
            <button class="modal-close-btn" (click)="showExamModal = false"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <p class="modal-sub font-sub">Điền mã đề thi, môn học, upload không giới hạn ảnh đề thi và nhiều file given code.</p>

          <div class="exam-form-grid">
            <!-- Mã Đề Thi -->
            <div class="form-group full-width">
              <label class="form-label font-scifi"><i class="fa-solid fa-heading text-cyan"></i> MÃ ĐỀ THI (TIÊU ĐỀ):</label>
              <input 
                type="text" 
                [(ngModel)]="examForm.examCode" 
                placeholder="VD: PRF191_PE_SP26_De01 hoặc CSD201_FE_FA25..." 
                class="scifi-input font-scifi" 
                required 
              />
            </div>

            <!-- Môn Học (Tự nhập tay mã môn) -->
            <div class="form-group">
              <label class="form-label font-scifi"><i class="fa-solid fa-graduation-cap text-cyan"></i> MÔN HỌC (TỰ NHẬP MÃ MÔN):</label>
              <input 
                type="text" 
                [(ngModel)]="examForm.subjectCode" 
                placeholder="VD: PRF191, PRO192, CSD201..." 
                class="scifi-input uppercase font-mono" 
                required 
              />
            </div>

            <!-- Loại Đề Thi (PE, FE, Quiz, PT, Midterm) -->
            <div class="form-group">
              <label class="form-label font-scifi"><i class="fa-solid fa-layer-group text-cyan"></i> LOẠI ĐỀ THI:</label>
              <select [(ngModel)]="examForm.examType" class="scifi-input font-sub">
                <option value="PE">Đề Thi Thực Hành (PE)</option>
                <option value="FE">Đề Thi Cuối Kỳ (FE)</option>
                <option value="QUIZ">Đề Thi Quiz</option>
                <option value="PT">Progress Test (PT)</option>
                <option value="MIDTERM">Đề Thi Giữa Kỳ (Midterm)</option>
              </select>
            </div>

            <!-- Học Kỳ -->
            <div class="form-group">
              <label class="form-label font-scifi"><i class="fa-regular fa-calendar-days text-cyan"></i> HỌC KỲ:</label>
              <input 
                type="text" 
                [(ngModel)]="examForm.semester" 
                placeholder="Spring 2026" 
                class="scifi-input font-sub" 
              />
            </div>

            <!-- Trạng Thái -->
            <div class="form-group">
              <label class="form-label font-scifi"><i class="fa-solid fa-shield text-cyan"></i> TRẠNG THÁI:</label>
              <select [(ngModel)]="examForm.status" class="scifi-input font-sub">
                <option value="PUBLISHED">PUBLISHED (Công khai cho sinh viên)</option>
                <option value="DRAFT">DRAFT (Bản nháp)</option>
              </select>
            </div>

            <!-- ============================================== -->
            <!-- UPLOAD 1: ẢNH ĐỀ THI (KHÔNG GIỚI HẠN SỐ LƯỢNG) -->
            <!-- ============================================== -->
            <div class="form-group full-width upload-section">
              <div class="upload-header-row">
                <label class="upload-title font-scifi">
                  <i class="fa-solid fa-images text-cyan"></i> UPLOAD ẢNH ĐỀ THI (KHÔNG GIỚI HẠN SỐ LƯỢNG):
                </label>
                <span class="upload-count-tag font-mono" *ngIf="uploadedImageUrls.length > 0">
                  <i class="fa-solid fa-camera"></i> Đã chọn {{ uploadedImageUrls.length }} ảnh
                </span>
              </div>

              <!-- Upload Dropzone -->
              <div class="upload-dropzone">
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  (change)="onMultipleImagesSelected($event)" 
                  id="examImagesInput" 
                  class="hidden-file-input" 
                />
                <label for="examImagesInput" class="upload-btn-label">
                  <i class="fa-solid fa-cloud-arrow-up text-3xl text-cyan"></i>
                  <span class="font-scifi">BẤM VÀO ĐÂY ĐỂ CHỌN ẢNH ĐỀ THI (HỖ TRỢ KHÔNG GIỚI HẠN SỐ LƯỢNG)</span>
                  <span class="upload-hint font-sub">Hỗ trợ PNG, JPG, WebP. Có thể chọn 5, 20, 50 ảnh cùng lúc hoặc thêm từng đợt</span>
                </label>
              </div>

              <!-- Trạng thái đang tải lên -->
              <div class="uploading-banner font-mono" *ngIf="isUploadingImages()">
                <i class="fa-solid fa-spinner fa-spin text-cyan"></i> Đang tải lên ảnh đề thi vào hệ thống...
              </div>

              <!-- Grid hiển thị danh sách ảnh đã chọn -->
              <div class="uploaded-images-container" *ngIf="uploadedImageUrls.length > 0">
                <div class="uploaded-bar">
                  <span class="font-mono text-cyan text-sm">
                    <i class="fa-solid fa-layer-group"></i> Danh sách ảnh đã nạp ({{ uploadedImageUrls.length }} ảnh):
                  </span>
                  <button type="button" class="btn-clear-all font-scifi" (click)="uploadedImageUrls = []">
                    <i class="fa-solid fa-trash-can"></i> XÓA TẤT CẢ
                  </button>
                </div>

                <div class="images-thumbs-grid">
                  <div class="thumb-card" *ngFor="let url of uploadedImageUrls; let idx = index">
                    <span class="thumb-idx-badge font-mono">#{{ idx + 1 }}</span>
                    <img [src]="url" class="thumb-image" alt="Ảnh #{{ idx + 1 }}" />
                    <div class="thumb-actions-bar">
                      <a [href]="url" target="_blank" class="thumb-zoom-btn" title="Mở ảnh gốc">
                        <i class="fa-solid fa-up-right-from-square"></i>
                      </a>
                      <button type="button" class="thumb-delete-btn" (click)="removeImage(idx)" title="Xóa ảnh này">
                        <i class="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ============================================== -->
            <!-- UPLOAD 2: FILE GIVEN .ZIP (NHIỀU FILE CÙNG LÚC)-->
            <!-- ============================================== -->
            <div class="form-group full-width upload-section">
              <div class="upload-header-row">
                <label class="upload-title font-scifi">
                  <i class="fa-solid fa-file-zipper text-emerald"></i> UPLOAD FILE GIVEN .ZIP (NHIỀU FILE CÙNG LÚC):
                </label>
                <span class="upload-count-tag font-mono text-emerald" *ngIf="uploadedZipFiles.length > 0">
                  <i class="fa-solid fa-box-archive"></i> Đã nạp {{ uploadedZipFiles.length }} file
                </span>
              </div>

              <div class="upload-dropzone dropzone-emerald">
                <input 
                  type="file" 
                  multiple 
                  accept=".zip,.rar,.7z,.pdf,.docx,.txt" 
                  (change)="onMultipleZipsSelected($event)" 
                  id="examZipsInput" 
                  class="hidden-file-input" 
                />
                <label for="examZipsInput" class="upload-btn-label">
                  <i class="fa-solid fa-file-shield text-3xl text-emerald"></i>
                  <span class="font-scifi">BẤM VÀO ĐÂY ĐỂ TẢI LÊN NHIỀU FILE GIVEN CODE (.ZIP, .RAR, .PDF)</span>
                  <span class="upload-hint font-sub">Dành cho đề thi PE có source code khung, NetBeans/VSCode template hoặc tài liệu PDF kèm theo</span>
                </label>
              </div>

              <!-- Trạng thái đang tải lên -->
              <div class="uploading-banner font-mono text-emerald" *ngIf="isUploadingZips()">
                <i class="fa-solid fa-spinner fa-spin"></i> Đang tải lên file Given Code...
              </div>

              <!-- Danh sách file zip đã upload -->
              <div class="uploaded-zips-list" *ngIf="uploadedZipFiles.length > 0">
                <div class="uploaded-bar">
                  <span class="font-mono text-emerald text-sm">
                    <i class="fa-solid fa-folder-tree"></i> Danh sách file Given đính kèm ({{ uploadedZipFiles.length }} file):
                  </span>
                  <button type="button" class="btn-clear-all font-scifi" (click)="uploadedZipFiles = []">
                    <i class="fa-solid fa-trash-can"></i> XÓA TẤT CẢ
                  </button>
                </div>

                <div class="zip-items-stack">
                  <div class="zip-file-pill" *ngFor="let z of uploadedZipFiles; let zIdx = index">
                    <div class="zip-info">
                      <i class="fa-solid fa-file-zipper text-emerald"></i>
                      <span class="zip-name">{{ z.name }}</span>
                    </div>
                    <div class="zip-actions">
                      <a [href]="z.url" target="_blank" class="zip-download-test font-mono">Tải thử</a>
                      <button type="button" class="btn-remove-media font-scifi" (click)="removeZip(zIdx)" title="Xóa file này">
                        <i class="fa-solid fa-xmark"></i> Xóa
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Đáp Án & Lời Giải Chi Tiết -->
            <div class="form-group full-width">
              <label class="form-label font-scifi"><i class="fa-solid fa-code text-cyan"></i> ĐÁP ÁN & LỜI GIẢI CHI TIẾT (CODE, MARKDOWN):</label>
              <textarea 
                [(ngModel)]="examForm.solution" 
                rows="6" 
                placeholder="Nhập mã code giải chi tiết, barem điểm hoặc hướng dẫn giải từng câu..." 
                class="scifi-input font-mono"
              ></textarea>
            </div>
          </div>

          <div class="modal-footer-btns">
            <button class="btn-scifi-outline font-scifi" (click)="showExamModal = false">HỦY BỎ</button>
            <button class="btn-scifi-cyan font-scifi" [disabled]="savingExam()" (click)="saveExam()">
              <span *ngIf="!savingExam()">
                <i class="fa-solid fa-sparkles"></i> {{ isEditingExam ? 'CẬP NHẬT ĐỀ THI' : 'XUẤT BẢN ĐỀ THI MỚI' }}
              </span>
              <span *ngIf="savingExam()"><i class="fa-solid fa-spinner fa-spin"></i> ĐANG LƯU...</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-page-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 30px 24px 70px;
      position: relative;
      z-index: 2;
    }

    /* ========================================================= */
    /* ADMIN TOP DEDICATED NAV BAR                               */
    /* ========================================================= */
    .admin-top-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 28px;
      margin-bottom: 24px;
      background: rgba(6, 11, 24, 0.96);
      border: 1px solid rgba(0, 240, 255, 0.3);
      clip-path: polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px);
      box-shadow: 0 12px 35px rgba(0, 0, 0, 0.8), 0 0 24px rgba(0, 240, 255, 0.08);
      position: relative;
    }

    .admin-brand-group {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .scifi-emblem-box {
      width: 40px;
      height: 40px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 240, 255, 0.08);
      border: 1px solid rgba(0, 240, 255, 0.5);
      clip-path: polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px);
      box-shadow: 0 0 16px rgba(0, 240, 255, 0.3);
    }

    .scifi-shard-icon {
      font-size: 1.5rem;
      color: #00f0ff;
      text-shadow: 0 0 12px #00f0ff;
    }

    .brand-text-block {
      display: flex;
      flex-direction: column;
    }

    .brand-title {
      font-size: 1.25rem;
      font-weight: 900;
      letter-spacing: 0.1em;
      color: #ffffff;
      text-shadow: 0 0 14px rgba(0, 240, 255, 0.5);
      line-height: 1.1;
    }

    .brand-telemetry {
      font-size: 0.65rem;
      letter-spacing: 0.14em;
      color: #00f0ff;
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 3px;
    }

    .beacon-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #00f0ff;
      box-shadow: 0 0 8px #00f0ff;
    }

    .admin-user-group {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .admin-avatar-pill {
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(10, 18, 38, 0.9);
      border: 1px solid rgba(0, 240, 255, 0.35);
      padding: 6px 16px 6px 8px;
      clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);
    }

    .admin-avatar-wrap {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 1.5px solid #00f0ff;
      padding: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .admin-avatar-wrap.master-border {
      border-color: #fbbf24;
      box-shadow: 0 0 12px rgba(251, 191, 36, 0.5);
    }

    .admin-nav-avatar {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }

    .admin-nav-details {
      display: flex;
      flex-direction: column;
      line-height: 1.25;
    }

    .admin-nav-name {
      font-size: 0.95rem;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: 0.03em;
    }

    .admin-nav-role {
      font-size: 0.68rem;
      font-weight: 800;
      letter-spacing: 0.08em;
    }

    .badge-master {
      color: #fbbf24;
      text-shadow: 0 0 10px rgba(251, 191, 36, 0.6);
    }

    .badge-sub {
      color: #00f0ff;
      text-shadow: 0 0 10px rgba(0, 240, 255, 0.6);
    }

    .btn-admin-logout {
      background: rgba(244, 63, 94, 0.15);
      border: 1.5px solid rgba(244, 63, 94, 0.5);
      color: #fb7185;
      padding: 9px 18px;
      clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);
      font-size: 0.78rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .btn-admin-logout:hover {
      background: #f43f5e;
      color: #ffffff;
      border-color: #f43f5e;
      box-shadow: 0 0 18px rgba(244, 63, 94, 0.7);
      transform: translateY(-1px);
    }

    /* ========================================================= */
    /* ADMIN COMMAND HEADER & SLANTED TABS                       */
    /* ========================================================= */
    .admin-header-card {
      padding: 34px 32px 28px;
      margin-bottom: 30px;
      background: rgba(7, 13, 28, 0.94);
      border: 1px solid rgba(0, 240, 255, 0.28);
      clip-path: polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px);
      box-shadow: 0 16px 45px rgba(0, 0, 0, 0.8), 0 0 25px rgba(0, 240, 255, 0.06);
      position: relative;
      overflow: hidden;
    }

    .admin-header-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, #00f0ff 0%, #38bdf8 30%, transparent 80%);
    }

    .card-left-hatches {
      position: absolute;
      top: 24px;
      left: 12px;
      width: 8px;
      height: 50px;
      background-image: repeating-linear-gradient(
        -45deg,
        rgba(0, 240, 255, 0.5),
        rgba(0, 240, 255, 0.5) 2px,
        transparent 2px,
        transparent 5px
      );
    }

    .telemetry-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 4px 14px;
      background: rgba(0, 240, 255, 0.1);
      border: 1px solid rgba(0, 240, 255, 0.35);
      clip-path: polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px);
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.14em;
      color: #00f0ff;
      margin-bottom: 12px;
    }

    .beacon-pulse {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #00f0ff;
      box-shadow: 0 0 10px #00f0ff;
      animation: pulseBeacon 2s infinite;
    }

    .header-title {
      font-size: 2.2rem;
      font-weight: 900;
      letter-spacing: 0.05em;
      margin-bottom: 10px;
      line-height: 1.2;
    }

    .title-scifi-white {
      color: #ffffff;
      text-shadow: 0 0 20px rgba(255, 255, 255, 0.4);
    }

    .header-sub {
      color: #c5d3e8;
      font-size: 1.05rem;
      max-width: 850px;
      line-height: 1.6;
    }

    /* Slanted Parallelogram Tabs */
    .admin-tabs-ribbon {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 26px;
      padding-top: 22px;
      border-top: 1px solid rgba(255, 255, 255, 0.09);
    }

    .slanted-admin-tab {
      background: rgba(10, 17, 34, 0.9);
      border: 1px solid rgba(0, 240, 255, 0.28);
      color: #c5d3e8;
      padding: 11px 22px;
      transform: skewX(-14deg);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .slanted-admin-tab .tab-inner {
      transform: skewX(14deg);
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.84rem;
      font-weight: 800;
      letter-spacing: 0.08em;
    }

    .slanted-admin-tab .tab-count {
      background: rgba(0, 240, 255, 0.2);
      color: #00f0ff;
      padding: 1px 7px;
      border-radius: 4px;
      font-size: 0.76rem;
    }

    .slanted-admin-tab:hover {
      background: rgba(0, 240, 255, 0.16);
      border-color: #00f0ff;
      color: #ffffff;
      transform: skewX(-14deg) translateY(-2px);
      box-shadow: 0 0 16px rgba(0, 240, 255, 0.35);
    }

    .slanted-admin-tab.active {
      background: #00f0ff;
      border-color: #00f0ff;
      color: #04060c;
      transform: skewX(-14deg) translateY(-2px);
      box-shadow: 0 0 25px rgba(0, 240, 255, 0.7);
    }

    .slanted-admin-tab.active .tab-count {
      background: #04060c;
      color: #00f0ff;
    }

    .slanted-admin-tab.tab-gold {
      border-color: rgba(229, 169, 60, 0.45);
      color: #fbbf24;
    }

    .slanted-admin-tab.tab-gold:hover {
      border-color: #fbbf24;
      box-shadow: 0 0 18px rgba(229, 169, 60, 0.45);
    }

    .slanted-admin-tab.tab-gold.active {
      background: linear-gradient(135deg, #fbbf24, #e5a93c);
      border-color: #fbbf24;
      color: #04060c;
      box-shadow: 0 0 25px rgba(229, 169, 60, 0.75);
    }

    /* ========================================================= */
    /* SCIFI DATA TABLES                                         */
    /* ========================================================= */
    .tab-content {
      animation: tabFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes tabFadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .section-title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 22px;
    }

    .section-desc {
      color: #c5d3e8;
      font-size: 0.95rem;
      margin-top: -14px;
    }

    .scifi-table-wrapper {
      background: rgba(6, 11, 24, 0.96);
      border: 1px solid rgba(0, 240, 255, 0.28);
      clip-path: polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px);
      padding: 16px 20px 20px;
      overflow-x: auto;
      position: relative;
      box-shadow: 0 16px 45px rgba(0, 0, 0, 0.75);
    }

    .scifi-table-wrapper::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, #00f0ff 0%, #38bdf8 30%, transparent 80%);
    }

    .scifi-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.9rem;
    }

    .scifi-table th {
      padding: 14px 16px;
      color: #00f0ff;
      font-weight: 800;
      letter-spacing: 0.08em;
      border-bottom: 2px solid rgba(0, 240, 255, 0.35);
      background: rgba(0, 240, 255, 0.05);
      white-space: nowrap;
    }

    .scifi-table td {
      padding: 15px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.07);
      color: #c5d3e8;
      vertical-align: middle;
    }

    .scifi-table tbody tr {
      transition: background 0.2s ease;
    }

    .scifi-table tbody tr:hover {
      background: rgba(0, 240, 255, 0.07);
    }

    .user-cell {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .tbl-avatar {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      border: 1px solid #00f0ff;
      object-fit: cover;
    }

    .user-cell-name {
      font-weight: 700;
      color: #ffffff;
      font-size: 0.98rem;
    }

    .email-text {
      color: #00f0ff;
      font-size: 0.88rem;
    }

    .mssv-badge {
      font-weight: 800;
      padding: 3px 10px;
      background: rgba(0, 240, 255, 0.14);
      border: 1px solid #00f0ff;
      color: #00f0ff;
      clip-path: polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px);
      font-size: 0.82rem;
      display: inline-block;
    }

    .mssv-badge.no-mssv {
      background: rgba(244, 63, 94, 0.14);
      border-color: rgba(244, 63, 94, 0.5);
      color: #fb7185;
    }

    .role-pill {
      font-size: 0.74rem;
      font-weight: 800;
      padding: 4px 10px;
      letter-spacing: 0.06em;
      clip-path: polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px);
      display: inline-block;
    }

    .pill-master {
      background: rgba(229, 169, 60, 0.22);
      color: #fbbf24;
      border: 1px solid #fbbf24;
      box-shadow: 0 0 10px rgba(229, 169, 60, 0.4);
    }

    .pill-admin {
      background: rgba(168, 85, 247, 0.2);
      color: #c084fc;
      border: 1px solid rgba(168, 85, 247, 0.5);
      box-shadow: 0 0 10px rgba(168, 85, 247, 0.3);
    }

    .pill-user {
      background: rgba(0, 240, 255, 0.12);
      color: #00f0ff;
      border: 1px solid rgba(0, 240, 255, 0.4);
    }

    .status-cell {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 0.84rem;
    }

    .status-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #788a9e;
    }

    .status-dot.active {
      background: #10b981;
      box-shadow: 0 0 8px #10b981;
    }

    .action-btn-group {
      display: flex;
      gap: 8px;
    }

    .btn-action-edit {
      background: rgba(0, 240, 255, 0.12);
      border: 1px solid #00f0ff;
      color: #00f0ff;
      padding: 5px 12px;
      clip-path: polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px);
      font-size: 0.74rem;
      font-weight: 800;
      letter-spacing: 0.06em;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }

    .btn-action-edit:hover {
      background: #00f0ff;
      color: #04060c;
      box-shadow: 0 0 14px rgba(0, 240, 255, 0.6);
    }

    .btn-action-del {
      background: rgba(244, 63, 94, 0.12);
      border: 1px solid #f43f5e;
      color: #fb7185;
      padding: 5px 12px;
      clip-path: polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px);
      font-size: 0.74rem;
      font-weight: 800;
      letter-spacing: 0.06em;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }

    .btn-action-del:hover {
      background: #f43f5e;
      color: #ffffff;
      box-shadow: 0 0 14px rgba(244, 63, 94, 0.7);
    }

    .tag-root-admin {
      color: #fbbf24;
      font-size: 0.74rem;
      font-weight: 800;
      letter-spacing: 0.06em;
      text-shadow: 0 0 8px rgba(251, 191, 36, 0.5);
    }

    .exam-title-text {
      color: #ffffff;
      font-size: 0.92rem;
      letter-spacing: 0.03em;
    }

    .subject-pill {
      background: rgba(0, 240, 255, 0.12);
      border: 1px solid rgba(0, 240, 255, 0.4);
      color: #00f0ff;
      padding: 3px 10px;
      clip-path: polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px);
      font-size: 0.8rem;
      font-weight: 800;
    }

    .media-indicator {
      font-size: 0.82rem;
    }

    .stats-mini {
      color: #c5d3e8;
      font-size: 0.82rem;
    }

    /* ========================================================= */
    /* SCIFI FORMS & CARDS                                       */
    /* ========================================================= */
    .scifi-form-card {
      background: rgba(7, 13, 28, 0.94);
      border: 1px solid rgba(0, 240, 255, 0.28);
      clip-path: polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px);
      padding: 28px 30px;
      margin-bottom: 24px;
      position: relative;
    }

    .scifi-form-card.gold-border {
      border-color: rgba(229, 169, 60, 0.45);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(229, 169, 60, 0.1);
    }

    .scifi-form-card.gold-border::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, #fbbf24, #e5a93c 40%, transparent 80%);
    }

    .form-card-title {
      font-size: 1.25rem;
      font-weight: 800;
      margin-bottom: 20px;
      letter-spacing: 0.05em;
    }

    .admin-create-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 18px;
      margin-bottom: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    .form-label {
      font-size: 0.78rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      color: #c5d3e8;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .scifi-input {
      background: #030612;
      border: 1px solid rgba(0, 240, 255, 0.28);
      color: #ffffff;
      padding: 11px 16px;
      clip-path: polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px);
      font-size: 0.92rem;
      transition: all 0.25s ease;
      width: 100%;
    }

    .scifi-input:focus {
      border-color: #00f0ff;
      outline: none;
      box-shadow: 0 0 18px rgba(0, 240, 255, 0.45);
      background: #050a1b;
    }

    .scifi-input.disabled {
      opacity: 0.55;
      cursor: not-allowed;
      border-color: rgba(255, 255, 255, 0.15);
    }

    .form-submit-row {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 16px;
      flex-wrap: wrap;
    }

    .error-msg-inline {
      color: #fb7185;
      font-size: 0.86rem;
      font-weight: 600;
    }

    .success-msg-inline {
      color: #34d399;
      font-size: 0.86rem;
      font-weight: 600;
    }

    .sub-table-title {
      font-size: 1.05rem;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 16px;
      letter-spacing: 0.05em;
    }

    /* ========================================================= */
    /* STATS OVERVIEW CARDS                                      */
    /* ========================================================= */
    .stats-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 20px;
    }

    .scifi-stat-card {
      background: rgba(7, 13, 28, 0.94);
      border: 1px solid rgba(0, 240, 255, 0.28);
      clip-path: polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px);
      padding: 24px;
      box-shadow: 0 14px 40px rgba(0, 0, 0, 0.7);
      transition: all 0.25s ease;
      position: relative;
    }

    .scifi-stat-card:hover {
      transform: translateY(-3px);
      border-color: #00f0ff;
      box-shadow: 0 18px 45px rgba(0, 0, 0, 0.8), 0 0 25px rgba(0, 240, 255, 0.25);
    }

    .stat-top-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    .stat-icon-wrap {
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);
      font-size: 1.25rem;
    }

    .stat-icon-wrap.cyan {
      background: rgba(0, 240, 255, 0.15);
      border: 1px solid #00f0ff;
      color: #00f0ff;
    }

    .stat-icon-wrap.purple {
      background: rgba(168, 85, 247, 0.15);
      border: 1px solid #c084fc;
      color: #c084fc;
    }

    .stat-icon-wrap.gold {
      background: rgba(229, 169, 60, 0.15);
      border: 1px solid #fbbf24;
      color: #fbbf24;
    }

    .stat-icon-wrap.emerald {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid #34d399;
      color: #34d399;
    }

    .stat-tag {
      font-size: 0.68rem;
      font-weight: 800;
      letter-spacing: 0.12em;
      color: #788a9e;
    }

    .stat-val {
      font-size: 2.6rem;
      font-weight: 900;
      letter-spacing: 0.04em;
      line-height: 1.1;
      margin-bottom: 6px;
    }

    .stat-lbl {
      color: #c5d3e8;
      font-size: 0.95rem;
      font-weight: 600;
    }

    /* ========================================================= */
    /* SCIFI MODALS & UPLOAD SECTION                             */
    /* ========================================================= */
    .scifi-admin-modal {
      background: rgba(6, 11, 24, 0.98);
      border: 1.5px solid rgba(0, 240, 255, 0.4);
      clip-path: polygon(18px 0, 100% 0, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0 100%, 0 18px);
      box-shadow: 0 24px 70px rgba(0, 0, 0, 0.9), 0 0 35px rgba(0, 240, 255, 0.25);
      padding: 32px 34px;
      width: 100%;
      max-width: 620px;
      max-height: 90vh;
      overflow-y: auto;
      animation: portalWarpOpen 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
    }

    .scifi-admin-modal.modal-wide {
      max-width: 880px;
    }

    .modal-header-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 6px;
    }

    .modal-title {
      font-size: 1.35rem;
      font-weight: 900;
      letter-spacing: 0.05em;
    }

    .modal-close-btn {
      background: none;
      border: none;
      color: #788a9e;
      font-size: 1.3rem;
      cursor: pointer;
      transition: color 0.2s;
    }

    .modal-close-btn:hover {
      color: #f43f5e;
    }

    .modal-sub {
      color: #c5d3e8;
      font-size: 0.92rem;
      margin-bottom: 22px;
    }

    .modal-form-grid {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .exam-form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 18px;
    }

    .upload-section {
      background: rgba(4, 8, 20, 0.7);
      border: 1px solid rgba(0, 240, 255, 0.2);
      clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
      padding: 18px;
    }

    .upload-header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
      flex-wrap: wrap;
      gap: 10px;
    }

    .upload-title {
      font-size: 0.84rem;
      font-weight: 800;
      letter-spacing: 0.06em;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .upload-count-tag {
      font-size: 0.78rem;
      color: #00f0ff;
      background: rgba(0, 240, 255, 0.15);
      border: 1px solid rgba(0, 240, 255, 0.4);
      padding: 2px 8px;
      clip-path: polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px);
    }

    .upload-count-tag.text-emerald {
      color: #34d399;
      background: rgba(16, 185, 129, 0.15);
      border-color: rgba(16, 185, 129, 0.4);
    }

    .upload-dropzone {
      border: 1.5px dashed rgba(0, 240, 255, 0.45);
      background: rgba(0, 240, 255, 0.04);
      clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);
      padding: 24px 18px;
      text-align: center;
      transition: all 0.25s ease;
      cursor: pointer;
    }

    .upload-dropzone:hover {
      border-color: #00f0ff;
      background: rgba(0, 240, 255, 0.09);
      box-shadow: 0 0 20px rgba(0, 240, 255, 0.25);
    }

    .upload-dropzone.dropzone-emerald {
      border-color: rgba(16, 185, 129, 0.45);
      background: rgba(16, 185, 129, 0.04);
    }

    .upload-dropzone.dropzone-emerald:hover {
      border-color: #34d399;
      background: rgba(16, 185, 129, 0.09);
      box-shadow: 0 0 20px rgba(16, 185, 129, 0.25);
    }

    .hidden-file-input {
      display: none;
    }

    .upload-btn-label {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }

    .upload-btn-label span {
      font-size: 0.88rem;
      font-weight: 700;
      color: #ffffff;
    }

    .upload-hint {
      font-size: 0.8rem;
      color: #788a9e;
      max-width: 500px;
    }

    .uploading-banner {
      margin-top: 10px;
      padding: 8px 14px;
      background: rgba(0, 240, 255, 0.1);
      border: 1px solid rgba(0, 240, 255, 0.3);
      font-size: 0.84rem;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .uploaded-images-container {
      margin-top: 14px;
    }

    .uploaded-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }

    .btn-clear-all {
      background: rgba(244, 63, 94, 0.15);
      border: 1px solid rgba(244, 63, 94, 0.4);
      color: #fb7185;
      padding: 4px 10px;
      clip-path: polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px);
      font-size: 0.72rem;
      font-weight: 800;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-clear-all:hover {
      background: #f43f5e;
      color: #ffffff;
    }

    .images-thumbs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 10px;
      max-height: 250px;
      overflow-y: auto;
      padding: 6px;
      background: #02040c;
      border: 1px solid rgba(255, 255, 255, 0.08);
      clip-path: polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px);
    }

    .thumb-card {
      position: relative;
      aspect-ratio: 1;
      border: 1px solid rgba(0, 240, 255, 0.3);
      background: #000;
      overflow: hidden;
      clip-path: polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px);
    }

    .thumb-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .thumb-idx-badge {
      position: absolute;
      top: 4px;
      left: 4px;
      background: #00f0ff;
      color: #04060c;
      font-size: 0.65rem;
      font-weight: 900;
      padding: 1px 4px;
      border-radius: 2px;
      z-index: 2;
    }

    .thumb-actions-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(3, 7, 18, 0.92);
      display: flex;
      justify-content: space-between;
      padding: 3px 6px;
      z-index: 2;
    }

    .thumb-zoom-btn {
      color: #00f0ff;
      font-size: 0.75rem;
    }

    .thumb-delete-btn {
      background: none;
      border: none;
      color: #fb7185;
      font-size: 0.8rem;
      cursor: pointer;
    }

    .uploaded-zips-list {
      margin-top: 14px;
    }

    .zip-items-stack {
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-height: 180px;
      overflow-y: auto;
    }

    .zip-file-pill {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.4);
      padding: 8px 14px;
      clip-path: polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px);
    }

    .zip-info {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: var(--font-mono);
      font-size: 0.86rem;
      color: #34d399;
      max-width: 70%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .zip-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .zip-download-test {
      color: #00f0ff;
      text-decoration: underline;
      font-size: 0.78rem;
    }

    .btn-remove-media {
      background: rgba(244, 63, 94, 0.2);
      border: 1px solid rgba(244, 63, 94, 0.4);
      color: #fb7185;
      padding: 3px 8px;
      clip-path: polygon(3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%, 0 3px);
      font-size: 0.74rem;
      cursor: pointer;
    }

    .modal-footer-btns {
      margin-top: 24px;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    .access-denied-box {
      background: rgba(7, 13, 28, 0.94);
      border: 1px solid rgba(244, 63, 94, 0.4);
      clip-path: polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px);
      padding: 60px 30px;
      text-align: center;
      box-shadow: 0 14px 40px rgba(0, 0, 0, 0.8);
    }

    .denied-icon {
      font-size: 3rem;
      margin-bottom: 16px;
    }

    .mt-4 { margin-top: 16px; }
    .mt-6 { margin-top: 24px; }
    .text-cyan { color: #00f0ff; }
    .text-gold { color: #fbbf24; }
    .text-purple { color: #c084fc; }
    .text-emerald { color: #34d399; }
    .text-muted { color: #788a9e; }
  `]
})
export class AdminComponent implements OnInit {
  activeTab: 'users' | 'subadmins' | 'exams' | 'stats' = 'users';

  users = signal<User[]>([]);
  exams = signal<Exam[]>([]);
  subjects = signal<Subject[]>([]);
  stats = signal<DashboardStats | null>(null);

  // Sub-admin creation
  newAdminForm = { fullName: '', email: '', password: '' };
  subAdminLoading = signal(false);
  subAdminError = signal('');
  subAdminSuccess = signal('');

  // User edit modal
  editingUser: User | null = null;
  editUserForm = { fullName: '', mssv: '', role: 'ROLE_USER', status: 'ACTIVE' };

  // Exam create / edit
  showExamModal = false;
  isEditingExam = false;
  editingExamId: number | null = null;
  savingExam = signal(false);

  // Unlimited Multi-File Upload Arrays
  uploadedImageUrls: string[] = [];
  uploadedZipFiles: { name: string; url: string; size?: number }[] = [];
  isUploadingImages = signal(false);
  isUploadingZips = signal(false);

  examForm = {
    examCode: '',
    subjectCode: '',
    examType: 'PE',
    semester: 'Spring 2026',
    imageUrl: '',
    zipUrl: '',
    solution: '',
    status: 'PUBLISHED'
  };

  constructor(
    public auth: AuthService,
    private examService: ExamService,
    public router: Router
  ) {}

  ngOnInit() {
    this.loadAllData();
  }

  loadAllData() {
    this.examService.getAdminUsers().subscribe({
      next: (u) => this.users.set(u),
      error: () => {}
    });

    this.examService.getExams().subscribe({
      next: (e) => this.exams.set(e),
      error: () => {}
    });

    this.examService.getSubjects().subscribe({
      next: (s) => this.subjects.set(s),
      error: () => {}
    });

    this.examService.getAdminStats().subscribe({
      next: (st) => this.stats.set(st),
      error: () => {}
    });
  }

  getAdminList(): User[] {
    return this.users().filter(u => u.role === 'ROLE_ADMIN');
  }

  logoutAdmin() {
    this.auth.logout();
    this.router.navigate(['/admin-portal']);
  }

  // Sub-Admin Creation
  createSubAdmin() {
    if (!this.newAdminForm.email || !this.newAdminForm.password) {
      this.subAdminError.set('Vui lòng nhập Email / Tài khoản và Mật khẩu cho Quản trị viên mới!');
      return;
    }

    this.subAdminLoading.set(true);
    this.subAdminError.set('');
    this.subAdminSuccess.set('');

    this.auth.createSubAdmin(this.newAdminForm).subscribe({
      next: (created) => {
        this.subAdminLoading.set(false);
        this.subAdminSuccess.set(`Đã tạo Quản trị viên "${created.email}" thành công! Mật khẩu: ${this.newAdminForm.password}`);
        this.newAdminForm = { fullName: '', email: '', password: '' };
        this.loadAllData();
      },
      error: (err) => {
        this.subAdminLoading.set(false);
        this.subAdminError.set(err?.error?.error || 'Có lỗi xảy ra khi tạo Quản trị viên!');
      }
    });
  }

  // Multi-Image Upload (Không giới hạn số lượng ảnh)
  onMultipleImagesSelected(event: any) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    this.isUploadingImages.set(true);
    const fileArray = Array.from(files);
    let done = 0;

    fileArray.forEach(file => {
      this.examService.uploadImage(file).subscribe({
        next: (res) => {
          this.uploadedImageUrls.push(res.url);
          done++;
          if (done === fileArray.length) {
            this.isUploadingImages.set(false);
          }
        },
        error: () => {
          done++;
          if (done === fileArray.length) {
            this.isUploadingImages.set(false);
          }
        }
      });
    });
    event.target.value = '';
  }

  removeImage(index: number) {
    this.uploadedImageUrls.splice(index, 1);
  }

  // Multi-Zip Upload (Nhiều file zip Given Code)
  onMultipleZipsSelected(event: any) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    this.isUploadingZips.set(true);
    const fileArray = Array.from(files);
    let done = 0;

    fileArray.forEach(file => {
      this.examService.uploadZip(file).subscribe({
        next: (res) => {
          this.uploadedZipFiles.push({
            name: file.name,
            url: res.url,
            size: res.size
          });
          done++;
          if (done === fileArray.length) {
            this.isUploadingZips.set(false);
          }
        },
        error: () => {
          done++;
          if (done === fileArray.length) {
            this.isUploadingZips.set(false);
          }
        }
      });
    });
    event.target.value = '';
  }

  removeZip(index: number) {
    this.uploadedZipFiles.splice(index, 1);
  }

  getExamImageCount(ex: Exam): number {
    if (ex.imageUrls && ex.imageUrls.length > 0) return ex.imageUrls.length;
    if (ex.imageUrl) return ex.imageUrl.split(',').filter(x => x.trim().length > 0).length;
    return 0;
  }

  getExamZipCount(ex: Exam): number {
    if (ex.zipUrls && ex.zipUrls.length > 0) return ex.zipUrls.length;
    if (ex.zipUrl) return ex.zipUrl.split(',').filter(x => x.trim().length > 0).length;
    return 0;
  }

  // User Actions
  openEditUser(user: User) {
    this.editingUser = user;
    this.editUserForm = {
      fullName: user.fullName,
      mssv: user.mssv || '',
      role: user.role,
      status: user.status
    };
  }

  saveUserEdit() {
    if (!this.editingUser) return;
    this.examService.updateAdminUser(this.editingUser.id, this.editUserForm).subscribe({
      next: (updated) => {
        this.users.update(list => list.map(u => u.id === updated.id ? updated : u));
        this.editingUser = null;
      },
      error: (err) => alert('Lỗi: ' + (err?.error?.error || err.message))
    });
  }

  deleteUser(user: User) {
    if (confirm(`Bạn có chắc chắn muốn xóa tài khoản "${user.email}" khỏi hệ thống không?`)) {
      this.examService.deleteAdminUser(user.id).subscribe({
        next: () => {
          this.users.update(list => list.filter(u => u.id !== user.id));
        },
        error: (err) => alert('Lỗi: ' + (err?.error?.error || err.message))
      });
    }
  }

  // Exam Actions
  openCreateExam() {
    this.isEditingExam = false;
    this.editingExamId = null;
    this.uploadedImageUrls = [];
    this.uploadedZipFiles = [];
    this.examForm = {
      examCode: '',
      subjectCode: '',
      examType: 'PE',
      semester: 'Spring 2026',
      imageUrl: '',
      zipUrl: '',
      solution: '',
      status: 'PUBLISHED'
    };
    this.showExamModal = true;
  }

  openEditExam(exam: Exam) {
    this.isEditingExam = true;
    this.editingExamId = exam.id;

    // Load existing images
    if (exam.imageUrls && exam.imageUrls.length > 0) {
      this.uploadedImageUrls = [...exam.imageUrls];
    } else if (exam.imageUrl) {
      this.uploadedImageUrls = exam.imageUrl.split(',').map(s => s.trim()).filter(s => s.length > 0);
    } else {
      this.uploadedImageUrls = [];
    }

    // Load existing zips
    if (exam.zipUrls && exam.zipUrls.length > 0) {
      this.uploadedZipFiles = exam.zipUrls.map(u => ({
        name: u.substring(u.lastIndexOf('/') + 1),
        url: u
      }));
    } else if (exam.zipUrl) {
      this.uploadedZipFiles = exam.zipUrl.split(',').map(s => s.trim()).filter(s => s.length > 0).map(u => ({
        name: u.substring(u.lastIndexOf('/') + 1),
        url: u
      }));
    } else {
      this.uploadedZipFiles = [];
    }

    this.examForm = {
      examCode: exam.title,
      subjectCode: exam.subjectCode,
      examType: exam.examType,
      semester: exam.semester,
      imageUrl: exam.imageUrl || '',
      zipUrl: exam.zipUrl || '',
      solution: exam.solution || '',
      status: exam.status
    };
    this.showExamModal = true;
  }

  saveExam() {
    if (!this.examForm.examCode || !this.examForm.examCode.trim()) {
      alert('Vui lòng nhập Mã Đề Thi (ví dụ: PRO192_PE_SP25)!');
      return;
    }
    if (!this.examForm.subjectCode || !this.examForm.subjectCode.trim()) {
      alert('Vui lòng nhập Mã Môn Học (ví dụ: PRO192, CSD201)!');
      return;
    }

    this.savingExam.set(true);

    const payload = {
      examCode: this.examForm.examCode.trim(),
      title: this.examForm.examCode.trim(),
      subjectCode: this.examForm.subjectCode.trim().toUpperCase(),
      examType: this.examForm.examType,
      semester: this.examForm.semester,
      imageUrl: this.uploadedImageUrls.join(','),
      imageUrls: this.uploadedImageUrls,
      zipUrl: this.uploadedZipFiles.map(z => z.url).join(','),
      zipUrls: this.uploadedZipFiles.map(z => z.url),
      solution: this.examForm.solution,
      status: this.examForm.status
    };

    if (this.isEditingExam && this.editingExamId) {
      this.examService.updateExam(this.editingExamId, payload).subscribe({
        next: () => {
          this.savingExam.set(false);
          this.showExamModal = false;
          this.loadAllData();
        },
        error: (err) => {
          this.savingExam.set(false);
          alert('Lỗi cập nhật đề thi: ' + (err?.error?.error || err.message));
        }
      });
    } else {
      this.examService.createExam(payload).subscribe({
        next: () => {
          this.savingExam.set(false);
          this.showExamModal = false;
          this.loadAllData();
        },
        error: (err) => {
          this.savingExam.set(false);
          alert('Lỗi tạo đề thi: ' + (err?.error?.error || err.message));
        }
      });
    }
  }

  deleteExam(exam: Exam) {
    if (confirm(`Bạn có chắc muốn xóa đề thi "${exam.title}" không?`)) {
      this.examService.deleteExam(exam.id).subscribe({
        next: () => {
          this.exams.update(list => list.filter(e => e.id !== exam.id));
        },
        error: (err) => alert('Lỗi xóa đề thi: ' + (err?.error?.error || err.message))
      });
    }
  }
}
