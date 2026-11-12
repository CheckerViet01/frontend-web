import { Component, OnInit, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExamService, Exam, Subject, Comment } from '../../services/exam.service';
import { AuthService } from '../../services/auth.service';
import { ExamCardComponent } from '../../components/exam-card/exam-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ExamCardComponent],
  template: `
    <div class="home-container">
      <!-- ============================================== -->
      <!-- HERO BANNER: KHO ĐỀ THI ĐẠI HỌC FPT            -->
      <!-- ============================================== -->
      <header class="hero-section">
        <div class="hero-ambient-nebula"></div>
        
        <!-- Telemetry Status Beacon -->
        <div class="hero-telemetry-badge font-sub">
          <span class="beacon-pulse"></span>
          <span>HocDeThiFPT • Hệ Thống Đề Thi Đại Học FPT 2026</span>
        </div>

        <!-- Grand Sci-Fi Title -->
        <h1 class="hero-title font-scifi">
          <span class="title-scifi-white">THƯ VIỆN ĐỀ THI</span>
          <span class="text-shimmer-cyan"> FPT UNIVERSITY</span>
        </h1>
        
        <p class="hero-sub font-sub">
          Kho lưu trữ chuẩn format Đại học FPT: Đề Thực hành (<span class="scifi-tag pe-tag">PE</span>), 
          Cuối kỳ (<span class="scifi-tag fe-tag">FE</span>), 
          Trắc nghiệm (<span class="scifi-tag quiz-tag">Quiz</span>), 
          <span class="scifi-tag pt-tag">Progress Test (PT)</span> và 
          Giữa kỳ (<span class="scifi-tag mid-tag">Midterm</span>) kèm ảnh chụp đề thi thực tế, file Given Code (.ZIP) và lời giải chi tiết.
        </p>

        <!-- Sci-Fi Action Buttons Row (Like "BUY NOW" & "WATCH TRAILER" in 99designs) -->
        <div class="hero-cta-group">
          <button class="btn-scifi-cyan font-scifi" (click)="scrollToGrid()">
            <i class="fa-solid fa-layer-group"></i>
            <span>KHÁM PHÁ KHO ĐỀ</span>
          </button>
          <button class="btn-scifi-outline font-scifi" (click)="selectedType = 'PE'; applyFilters(); scrollToGrid()">
            <i class="fa-solid fa-bolt-lightning"></i>
            <span>ĐỀ THỰC HÀNH PE ▷</span>
          </button>
        </div>

        <!-- Cyber Search Console -->
        <div class="search-box-wrap">
          <div class="search-box">
            <i class="fa-solid fa-magnifying-glass search-icon"></i>
            <input 
              type="text" 
              [(ngModel)]="searchKeyword" 
              (input)="applyFilters()" 
              placeholder="Tìm kiếm mã đề, môn học (PRO192, CSD201, DBI202, PRF192...)" 
              class="search-input font-sub"
            />
            <button class="clear-btn" *ngIf="searchKeyword" (click)="searchKeyword = ''; applyFilters()">
              <i class="fa-solid fa-xmark"></i>
            </button>
            <div class="search-kbd-hint font-scifi">TÌM KIẾM</div>
          </div>

          <!-- Quick Subject Filter Chips (Dynamic from Subjects Database) -->
          <div class="quick-subject-tags" *ngIf="subjects().length > 0">
            <span class="tag-label font-sub"><i class="fa-solid fa-bolt text-cyan"></i> Môn phổ biến:</span>
            <button 
              *ngFor="let sub of subjects().slice(0, 7)" 
              class="sub-pill-btn font-scifi"
              [class.active]="searchKeyword === sub.code"
              (click)="filterByQuickSubject(sub.code)"
            >
              {{ sub.code }}
            </button>
          </div>
        </div>

        <!-- Live Telemetry KPI Bar (From 99designs HUD layout) -->
        <div class="telemetry-kpi-bar">
          <div class="kpi-card">
            <div class="kpi-icon-box cyan-glow">
              <i class="fa-solid fa-layer-group"></i>
            </div>
            <div class="kpi-data">
              <div class="kpi-num font-scifi text-cyan">{{ exams().length }}</div>
              <div class="kpi-label font-sub">Đề Thi Lưu Trữ</div>
            </div>
          </div>

          <div class="kpi-divider"></div>

          <div class="kpi-card">
            <div class="kpi-icon-box gold-glow">
              <i class="fa-solid fa-graduation-cap"></i>
            </div>
            <div class="kpi-data">
              <div class="kpi-num font-scifi text-gold">{{ subjects().length }}</div>
              <div class="kpi-label font-sub">Môn Học FPT</div>
            </div>
          </div>

          <div class="kpi-divider"></div>

          <div class="kpi-card">
            <div class="kpi-icon-box purple-glow">
              <i class="fa-solid fa-eye"></i>
            </div>
            <div class="kpi-data">
              <div class="kpi-num font-scifi text-purple">{{ totalViews() }}</div>
              <div class="kpi-label font-sub">Lượt Tra Cứu</div>
            </div>
          </div>

          <div class="kpi-divider"></div>

          <div class="kpi-card">
            <div class="kpi-icon-box emerald-glow">
              <i class="fa-solid fa-cloud-arrow-down"></i>
            </div>
            <div class="kpi-data">
              <div class="kpi-num font-scifi text-emerald">{{ totalDownloads() }}</div>
              <div class="kpi-label font-sub">Lượt Tải Given</div>
            </div>
          </div>
        </div>
      </header>

      <!-- ============================================== -->
      <!-- SLANTED PARALLELOGRAM RIBBON (Like 99designs)  -->
      <!-- ============================================== -->
      <section class="category-tabs-wrap" id="category-tabs">
        <div class="tabs-container">
          <button 
            *ngFor="let tab of examTabs" 
            class="slanted-tab-btn font-scifi" 
            [attr.data-id]="tab.id"
            [class.active]="selectedType === tab.id"
            (click)="selectExamType(tab.id)"
          >
            <span class="tab-inner">
              <span class="tab-icon">{{ tab.icon }}</span>
              <span class="tab-label">{{ tab.label }}</span>
              <span class="tab-count font-mono" *ngIf="getTypeCount(tab.id) > 0">{{ getTypeCount(tab.id) }}</span>
            </span>
          </button>
        </div>
      </section>

      <!-- ============================================== -->
      <!-- FILTERS BAR (Dynamic Subjects & Semesters)     -->
      <!-- ============================================== -->
      <section class="filters-bar">
        <div class="filter-controls-group">
          <!-- Subject Select Dropdown -->
          <div class="select-wrap">
            <i class="fa-solid fa-book-bookmark select-icon"></i>
            <select [(ngModel)]="selectedSubjectId" (change)="applyFilters()" class="scifi-select font-sub">
              <option [ngValue]="null">Tất cả môn học ({{ subjects().length }} môn)</option>
              <option *ngFor="let sub of subjects()" [ngValue]="sub.id">
                {{ sub.code }} - {{ sub.name }}
              </option>
            </select>
            <i class="fa-solid fa-chevron-down select-chevron"></i>
          </div>

          <!-- Semester Select Dropdown -->
          <div class="select-wrap">
            <i class="fa-regular fa-calendar-days select-icon"></i>
            <select [(ngModel)]="selectedSemester" (change)="applyFilters()" class="scifi-select font-sub">
              <option value="ALL">Tất cả học kỳ</option>
              <option *ngFor="let sem of semesters()" [value]="sem">
                {{ sem }}
              </option>
            </select>
            <i class="fa-solid fa-chevron-down select-chevron"></i>
          </div>
        </div>

        <!-- Filter Status & Reset -->
        <div class="filter-results-status">
          <div class="results-chip font-scifi">
            <span class="chip-dot"></span>
            <span>TÌM THẤY <strong class="text-cyan">{{ exams().length }}</strong> ĐỀ THI</span>
          </div>
          <button 
            class="btn-reset-filter font-scifi" 
            *ngIf="selectedType !== 'ALL' || selectedSubjectId !== null || selectedSemester !== 'ALL' || searchKeyword" 
            (click)="resetFilters()"
          >
            <i class="fa-solid fa-arrow-rotate-left"></i>
            <span>ĐẶT LẠI</span>
          </button>
        </div>
      </section>

      <!-- ============================================== -->
      <!-- SECTION TECH HEADER WITH ANGLED CIRCUIT NOTCH -->
      <!-- ============================================== -->
      <div class="section-tech-header">
        <h2 class="section-tech-title font-scifi">
          <span class="tech-slash">//</span>
          <span>DANH SÁCH ĐỀ THI ĐẠI HỌC FPT</span>
        </h2>
      </div>

      <!-- ============================================== -->
      <!-- EXAM CARDS GRID SECTION                        -->
      <!-- ============================================== -->
      <main class="exams-grid-section">
        <!-- Loading State -->
        <div class="loading-state" *ngIf="loading()">
          <div class="quantum-spinner"></div>
          <p class="font-scifi text-cyan">ĐANG TẢI DỮ LIỆU TỪ HỆ THỐNG HOCDETHIFPT...</p>
        </div>

        <!-- Empty State -->
        <div class="empty-state" *ngIf="!loading() && exams().length === 0">
          <div class="empty-icon-box">
            <i class="fa-solid fa-box-open"></i>
          </div>
          <h3 class="font-scifi text-gradient-gold">KHÔNG TÌM THẤY ĐỀ THI PHÙ HỢP</h3>
          <p>Hệ thống không tìm thấy đề thi theo bộ lọc đã chọn. Hãy thử tìm bằng từ khóa khác hoặc xóa bộ lọc.</p>
          <button class="btn-scifi-gold font-scifi" (click)="resetFilters()">
            <i class="fa-solid fa-arrow-rotate-left"></i>
            <span>XEM TOÀN BỘ KHO ĐỀ</span>
          </button>
        </div>

        <!-- Cards Grid -->
        <div class="exams-grid" *ngIf="!loading() && exams().length > 0">
          <app-exam-card 
            *ngFor="let exam of exams()" 
            [exam]="exam" 
            (select)="openExamDetail($event)"
          ></app-exam-card>
        </div>
      </main>

      <!-- ============================================================== -->
      <!-- EXAM DETAIL HUD MODAL (SPLIT-SCREEN THEATER & MULTI-IMAGE HUB) -->
      <!-- ============================================================== -->
      <div class="fantasy-modal-backdrop" *ngIf="selectedExam()" (click)="closeDetail()">
        <div 
          class="detail-theater-modal" 
          [class.has-gallery]="examImages.length > 0"
          (click)="$event.stopPropagation()"
        >
          <div class="modal-laser-top"></div>

          <ng-container *ngIf="selectedExam() as exam">
            <!-- COMPACT TOP HUD BAR -->
            <div class="hud-modal-topbar">
              <div class="topbar-left">
                <span class="badge-exam font-scifi" [ngClass]="'badge-' + exam.examType.toLowerCase()">{{ exam.examType }}</span>
                <span class="subject-badge font-scifi">{{ exam.subjectCode }}</span>
                <h3 class="exam-title-badge font-scifi">[{{ exam.title }}]</h3>
                <span class="semester-pill font-mono">{{ exam.semester }}</span>
              </div>

              <div class="topbar-actions">
                <!-- Nút Tải Given Zip -->
                <button class="btn-topbar-zip font-scifi" *ngIf="examZips.length > 0" (click)="downloadFirstZip(exam)">
                  <i class="fa-solid fa-file-zipper"></i>
                  <span>TẢI GIVEN (.ZIP)</span>
                  <span class="zip-cnt-tag font-mono">{{ examZips.length }}</span>
                </button>

                <!-- Nút Yêu thích -->
                <button class="btn-topbar-like font-mono" [class.liked]="isLiked" (click)="toggleLike(exam)">
                  <i class="fa-solid fa-heart"></i>
                  <span>{{ exam.likesCount }}</span>
                </button>

                <!-- Nút Chuyển đổi Split-View nếu có ảnh -->
                <button 
                  class="btn-toggle-split font-scifi" 
                  *ngIf="examImages.length > 0"
                  (click)="toggleSplitView()" 
                  title="Chuyển đổi giữa chế độ chia đôi màn hình và chỉ xem ảnh"
                >
                  <i [class]="isSplitView ? 'fa-solid fa-table-columns text-cyan' : 'fa-solid fa-expand text-gold'"></i>
                  <span>{{ isSplitView ? 'CHIA ĐÔI' : 'CHỈ XEM ẢNH' }}</span>
                </button>

                <!-- Nút Đóng -->
                <button class="modal-close-btn" (click)="closeDetail()" title="Đóng cửa sổ">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>

            <!-- ============================================================== -->
            <!-- TRƯỜNG HỢP 1: ĐỀ THI CÓ ẢNH (CHẾ ĐỘ SPLIT-VIEW DUYỆT 50 ẢNH)    -->
            <!-- ============================================================== -->
            <div class="reader-split-body" *ngIf="examImages.length > 0" [class.full-image-mode]="!isSplitView">
              
              <!-- CỘT TRÁI: KHUNG XEM ẢNH ĐỀ THI -->
              <div class="image-stage-column">
                
                <!-- STICKY CONTROLS BAR (Trên đỉnh ảnh) -->
                <div class="image-hud-nav">
                  <div class="hud-nav-pages">
                    <button class="btn-hud-nav font-scifi" [disabled]="currentImageIndex === 0" (click)="prevImage()" title="Trang trước (Phím ←)">
                      <i class="fa-solid fa-chevron-left"></i>
                      <span>TRƯỚC</span>
                    </button>

                    <!-- Chọn trang trực tiếp (1 đến 50) -->
                    <div class="page-selector-box font-mono">
                      <span>Trang</span>
                      <select [ngModel]="currentImageIndex" (ngModelChange)="goToImage($event)" class="page-dropdown font-mono">
                        <option *ngFor="let img of examImages; let i = index" [value]="i">
                          {{ i + 1 }} / {{ examImages.length }}
                        </option>
                      </select>
                    </div>

                    <button class="btn-hud-nav font-scifi" [disabled]="currentImageIndex === examImages.length - 1" (click)="nextImage()" title="Trang kế tiếp (Phím →)">
                      <span>SAU</span>
                      <i class="fa-solid fa-chevron-right"></i>
                    </button>
                  </div>

                  <!-- Zoom & View Raw Link -->
                  <div class="hud-zoom-group font-mono">
                    <button class="btn-zoom" (click)="zoomOut()" title="Thu nhỏ (-25%)"><i class="fa-solid fa-magnifying-glass-minus"></i></button>
                    <span class="zoom-value">{{ (zoomLevel * 100) | number:'1.0-0' }}%</span>
                    <button class="btn-zoom" (click)="zoomIn()" title="Phóng to (+25%)"><i class="fa-solid fa-magnifying-glass-plus"></i></button>
                    <button class="btn-zoom" (click)="resetZoom()" title="Vừa khung 100%"><i class="fa-solid fa-arrows-rotate"></i></button>
                    <a [href]="examImages[currentImageIndex]" target="_blank" class="btn-raw-img font-scifi">
                      <i class="fa-solid fa-up-right-from-square"></i> ẢNH GỐC
                    </a>
                  </div>
                </div>

                <!-- MAIN IMAGE VIEWPORT (Vừa khung, sắc nét, không bị che chữ) -->
                <div class="image-viewport-box">
                  <div class="image-zoom-canvas" [style.transform]="'scale(' + zoomLevel + ')'">
                    <img 
                      [src]="examImages[currentImageIndex]" 
                      class="exam-paper-img image-switch-anim" 
                      alt="Đề thi trang {{ currentImageIndex + 1 }}" 
                    />
                  </div>
                </div>

                <!-- DẢI THUMBNAIL SỐ TRANG DƯỚI ĐÁY (Xem lần lượt 50 ảnh cực tiện) -->
                <div class="page-filmstrip-bar" *ngIf="examImages.length > 1">
                  <div class="filmstrip-scroll">
                    <button 
                      *ngFor="let img of examImages; let idx = index" 
                      class="filmstrip-btn font-mono"
                      [class.active]="currentImageIndex === idx"
                      (click)="goToImage(idx)"
                    >
                      <span class="page-number-tag">P.{{ idx + 1 }}</span>
                      <img [src]="img" class="filmstrip-thumb" alt="Trang {{ idx + 1 }}" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- CỘT PHẢI: TRỢ THỦ HỌC TẬP (Vừa xem ảnh vừa xem đáp án & bình luận cho trang đó) -->
              <div class="assistant-side-panel" *ngIf="isSplitView">
                <div class="assistant-nav-tabs font-scifi">
                  <button [class.active]="sideTab === 'solution'" (click)="sideTab = 'solution'">
                    <i class="fa-solid fa-code"></i>
                    <span>ĐÁP ÁN</span>
                  </button>
                  <button [class.active]="sideTab === 'pageComments'" (click)="sideTab = 'pageComments'">
                    <i class="fa-solid fa-comment-dots text-cyan"></i>
                    <span>HỎI ĐÁP TRANG {{ currentImageIndex + 1 }} ({{ getPageComments().length }})</span>
                  </button>
                  <button [class.active]="sideTab === 'allComments'" (click)="sideTab = 'allComments'">
                    <i class="fa-solid fa-comments"></i>
                    <span>TẤT CẢ ({{ comments().length }})</span>
                  </button>
                  <button [class.active]="sideTab === 'zips'" (click)="sideTab = 'zips'" *ngIf="examZips.length > 0">
                    <i class="fa-solid fa-file-zipper text-emerald"></i>
                    <span>GIVEN .ZIP ({{ examZips.length }})</span>
                  </button>
                </div>

                <!-- Tab 1: Đáp Án / Lời Giải -->
                <div class="assistant-pane-content" *ngIf="sideTab === 'solution'">
                  <div class="solution-terminal-box" *ngIf="exam.solution">
                    <div class="terminal-bar font-mono">
                      <div class="terminal-dots">
                        <span class="dot-red"></span>
                        <span class="dot-yellow"></span>
                        <span class="dot-green"></span>
                      </div>
                      <span class="terminal-title">DAP_AN_CHI_TIET.MD</span>
                      <button class="btn-copy-code font-scifi" (click)="copySolution(exam.solution)">
                        <i class="fa-regular fa-copy"></i> SAO CHÉP
                      </button>
                    </div>
                    <div class="terminal-content" [innerHTML]="formatMarkdown(exam.solution)"></div>
                  </div>
                  <div *ngIf="!exam.solution" class="empty-note font-scifi">
                    <i class="fa-solid fa-code text-cyan text-3xl mb-2"></i>
                    <p>Chưa có đáp án chính thức cho đề thi này. Hãy cùng trao đổi giải thuật ở tab Hỏi Đáp nhé!</p>
                  </div>
                </div>

                <!-- Tab 2: Thảo Luận Cho Trang Hiện Tại (Trang {{ currentImageIndex + 1 }}) -->
                <div class="assistant-pane-content" *ngIf="sideTab === 'pageComments'">
                  <!-- Ô nhập bình luận gắn trang -->
                  <div class="comment-input-box" *ngIf="auth.isLoggedIn(); else loginPromptPage">
                    <div class="comment-tag-badge font-mono">
                      <i class="fa-solid fa-tag text-cyan"></i> Đang bình luận cho: <strong>Trang {{ currentImageIndex + 1 }}</strong>
                    </div>
                    <textarea 
                      [(ngModel)]="newCommentText" 
                      rows="2" 
                      placeholder="Hỏi đáp giải thuật, thắc mắc đề bài ở Trang {{ currentImageIndex + 1 }}..." 
                      class="comment-textarea"
                    ></textarea>
                    <div class="comment-btn-row">
                      <button class="btn-scifi-cyan btn-sm font-scifi" [disabled]="!newCommentText.trim()" (click)="submitCommentForPage(exam.id)">
                        <i class="fa-solid fa-paper-plane"></i> GỬI CHO TRANG {{ currentImageIndex + 1 }}
                      </button>
                    </div>
                  </div>
                  <ng-template #loginPromptPage>
                    <div class="login-prompt font-scifi">
                      <i class="fa-solid fa-lock text-gold"></i>
                      <span>ĐĂNG NHẬP ĐỂ THAM GIA HỎI ĐÁP CHO TRANG {{ currentImageIndex + 1 }}.</span>
                    </div>
                  </ng-template>

                  <!-- Danh sách bình luận riêng trang này -->
                  <div class="comments-list">
                    <div class="comment-item" *ngFor="let c of getPageComments()">
                      <img [src]="c.userAvatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + c.userName" class="comment-avatar">
                      <div class="comment-body">
                        <div class="comment-user-row">
                          <span class="comment-name font-sub">{{ c.userName }}</span>
                          <span class="comment-mssv font-mono" *ngIf="c.userMssv">{{ c.userMssv }}</span>
                          <span class="comment-page-badge font-mono">Trang {{ currentImageIndex + 1 }}</span>
                          <span class="comment-date font-mono">{{ c.createdAt | date:'HH:mm dd/MM' }}</span>
                        </div>
                        <div class="comment-text">{{ c.content }}</div>
                      </div>
                    </div>
                    <div *ngIf="getPageComments().length === 0" class="empty-note font-sub">
                      Chưa có trao đổi nào cho Trang {{ currentImageIndex + 1 }}. Hãy là người đầu tiên đặt câu hỏi!
                    </div>
                  </div>
                </div>

                <!-- Tab 3: Tất Cả Thảo Luận Toàn Bộ Đề -->
                <div class="assistant-pane-content" *ngIf="sideTab === 'allComments'">
                  <div class="comment-input-box" *ngIf="auth.isLoggedIn(); else loginPromptAll">
                    <textarea 
                      [(ngModel)]="newCommentText" 
                      rows="2" 
                      placeholder="Viết nhận xét, thảo luận chung cho cả bài thi..." 
                      class="comment-textarea"
                    ></textarea>
                    <div class="comment-btn-row">
                      <button class="btn-scifi-cyan btn-sm font-scifi" [disabled]="!newCommentText.trim()" (click)="submitGeneralComment(exam.id)">
                        <i class="fa-solid fa-paper-plane"></i> GỬI BÌNH LUẬN CHUNG
                      </button>
                    </div>
                  </div>
                  <ng-template #loginPromptAll>
                    <div class="login-prompt font-scifi">
                      <i class="fa-solid fa-lock text-gold"></i>
                      <span>ĐĂNG NHẬP ĐỂ THAM GIA THẢO LUẬN.</span>
                    </div>
                  </ng-template>

                  <div class="comments-list">
                    <div class="comment-item" *ngFor="let c of comments()">
                      <img [src]="c.userAvatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + c.userName" class="comment-avatar">
                      <div class="comment-body">
                        <div class="comment-user-row">
                          <span class="comment-name font-sub">{{ c.userName }}</span>
                          <span class="comment-mssv font-mono" *ngIf="c.userMssv">{{ c.userMssv }}</span>
                          <span class="comment-page-badge font-mono" *ngIf="c.imageIndex !== null && c.imageIndex !== undefined">
                            Trang {{ c.imageIndex + 1 }}
                          </span>
                          <span class="comment-date font-mono">{{ c.createdAt | date:'HH:mm dd/MM' }}</span>
                        </div>
                        <div class="comment-text">{{ c.content }}</div>
                      </div>
                    </div>
                    <div *ngIf="comments().length === 0" class="empty-note font-sub">
                      Chưa có bình luận nào cho đề thi này.
                    </div>
                  </div>
                </div>

                <!-- Tab 4: Danh Sách File Given .ZIP -->
                <div class="assistant-pane-content" *ngIf="sideTab === 'zips'">
                  <div class="zip-download-cards-stack">
                    <div class="zip-card-tile" *ngFor="let z of examZips; let zIdx = index">
                      <div class="zip-tile-left">
                        <i class="fa-solid fa-file-zipper text-emerald text-2xl"></i>
                        <div class="zip-tile-info">
                          <div class="zip-tile-name font-mono">{{ getZipFilename(z) }}</div>
                          <div class="zip-tile-desc font-sub">Gói mã nguồn Given Code #{{ zIdx + 1 }}</div>
                        </div>
                      </div>
                      <a [href]="z" target="_blank" class="btn-scifi-gold btn-sm">
                        <i class="fa-solid fa-download"></i> TẢI VỀ
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ============================================================== -->
            <!-- TRƯỜNG HỢP 2: ĐỀ THI KHÔNG CÓ ẢNH (CHỈ CÓ FILE ZIP HOẶC ĐÁP ÁN) -->
            <!-- ============================================================== -->
            <div class="standard-modal-body" *ngIf="examImages.length === 0">
              <div class="standard-content-tabs font-scifi">
                <button [class.active]="detailTab === 'zip'" (click)="detailTab = 'zip'" *ngIf="examZips.length > 0">
                  <i class="fa-solid fa-file-zipper text-emerald"></i>
                  <span>FILE GIVEN .ZIP ({{ examZips.length }})</span>
                </button>
                <button [class.active]="detailTab === 'solution'" (click)="detailTab = 'solution'">
                  <i class="fa-solid fa-code"></i>
                  <span>ĐÁP ÁN & LỜI GIẢI</span>
                </button>
                <button [class.active]="detailTab === 'comments'" (click)="detailTab = 'comments'">
                  <i class="fa-solid fa-comments"></i>
                  <span>THẢO LUẬN ({{ comments().length }})</span>
                </button>
              </div>

              <!-- Tab Given Code -->
              <div class="tab-pane-content" *ngIf="detailTab === 'zip' && examZips.length > 0">
                <div class="zip-download-card" *ngFor="let z of examZips; let zIdx = index">
                  <div class="zip-card-icon-box">
                    <i class="fa-solid fa-file-zipper text-emerald"></i>
                  </div>
                  <h3 class="font-scifi text-gradient-gold">{{ getZipFilename(z) }}</h3>
                  <p class="font-sub">Gói mã nguồn khởi tạo (Given Code), project template hoặc file đề thi nén.</p>
                  <a [href]="z" target="_blank" class="btn-scifi-gold btn-lg font-scifi">
                    <i class="fa-solid fa-cloud-arrow-down"></i> TẢI FILE .ZIP VỀ MÁY
                  </a>
                </div>
              </div>

              <!-- Tab Đáp Án -->
              <div class="tab-pane-content" *ngIf="detailTab === 'solution'">
                <div class="solution-terminal-box" *ngIf="exam.solution">
                  <div class="terminal-bar font-mono">
                    <div class="terminal-dots">
                      <span class="dot-red"></span>
                      <span class="dot-yellow"></span>
                      <span class="dot-green"></span>
                    </div>
                    <span class="terminal-title">BAREM_CHAM_VA_DAP_AN.MD</span>
                    <button class="btn-copy-code font-scifi" (click)="copySolution(exam.solution)">
                      <i class="fa-regular fa-copy"></i> SAO CHÉP
                    </button>
                  </div>
                  <div class="terminal-content" [innerHTML]="formatMarkdown(exam.solution)"></div>
                </div>
                <div *ngIf="!exam.solution" class="empty-note font-sub">
                  <i class="fa-solid fa-code text-cyan text-3xl mb-2"></i>
                  <p>Chưa có lời giải chính thức cho đề thi này. Hãy cùng trao đổi giải thuật ở tab Thảo Luận nhé!</p>
                </div>
              </div>

              <!-- Tab Thảo Luận Chung -->
              <div class="tab-pane-content" *ngIf="detailTab === 'comments'">
                <div class="comment-input-box" *ngIf="auth.isLoggedIn(); else loginToCommentStd">
                  <textarea 
                    [(ngModel)]="newCommentText" 
                    rows="2" 
                    placeholder="Viết nhận xét, hỏi đáp giải thuật hoặc chia sẻ kinh nghiệm làm bài..." 
                    class="comment-textarea"
                  ></textarea>
                  <div class="comment-btn-row">
                    <button class="btn-scifi-cyan btn-sm font-scifi" [disabled]="!newCommentText.trim()" (click)="submitGeneralComment(exam.id)">
                      <i class="fa-solid fa-paper-plane"></i> GỬI BÌNH LUẬN
                    </button>
                  </div>
                </div>
                <ng-template #loginToCommentStd>
                  <div class="login-prompt font-scifi">
                    <i class="fa-solid fa-lock text-gold"></i>
                    <span>BẠN CẦN ĐĂNG NHẬP ĐỂ GỬI THẢO LUẬN.</span>
                  </div>
                </ng-template>

                <div class="comments-list">
                  <div class="comment-item" *ngFor="let c of comments()">
                    <img [src]="c.userAvatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + c.userName" class="comment-avatar">
                    <div class="comment-body">
                      <div class="comment-user-row">
                        <span class="comment-name font-sub">{{ c.userName }}</span>
                        <span class="comment-mssv font-mono" *ngIf="c.userMssv">{{ c.userMssv }}</span>
                        <span class="comment-date font-mono">{{ c.createdAt | date:'HH:mm dd/MM/yyyy' }}</span>
                      </div>
                      <div class="comment-text">{{ c.content }}</div>
                    </div>
                  </div>
                  <div *ngIf="comments().length === 0" class="empty-note font-sub">
                    Chưa có thảo luận nào. Hãy là sinh viên đầu tiên mở bát nhé!
                  </div>
                </div>
              </div>
            </div>
          </ng-container>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 1440px;
      margin: 0 auto;
      padding: 24px 28px 80px;
    }

    /* ============================================== */
    /* HERO SECTION: DEEP COSMIC SCI-FI               */
    /* ============================================== */
    .hero-section {
      text-align: center;
      padding: 55px 20px 30px;
      position: relative;
    }
    .hero-ambient-nebula {
      position: absolute;
      top: -30px;
      left: 50%;
      transform: translateX(-50%);
      width: 900px;
      height: 440px;
      background: radial-gradient(ellipse, rgba(0, 240, 255, 0.16) 0%, rgba(229, 169, 60, 0.12) 40%, transparent 70%);
      filter: blur(90px);
      pointer-events: none;
      z-index: 0;
      animation: heroNebulaDrift 14s ease-in-out infinite alternate;
    }
    @keyframes heroNebulaDrift {
      0% { transform: translateX(-50%) scale(0.95); opacity: 0.8; }
      100% { transform: translateX(-50%) scale(1.08); opacity: 1; }
    }

    .hero-telemetry-badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 7px 20px;
      background: rgba(0, 240, 255, 0.08);
      border: 1px solid rgba(0, 240, 255, 0.35);
      clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);
      color: #00f0ff;
      font-size: 0.82rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      margin-bottom: 24px;
      position: relative;
      z-index: 1;
      box-shadow: 0 0 16px rgba(0, 240, 255, 0.2);
    }
    .beacon-pulse {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #00f0ff;
      box-shadow: 0 0 8px #00f0ff;
      animation: beaconPulse 2s infinite;
    }

    .hero-title {
      font-size: 3.15rem;
      font-weight: 700;
      line-height: 1.18;
      margin-bottom: 18px;
      position: relative;
      z-index: 1;
      letter-spacing: 0.03em;
    }
    .title-scifi-white {
      color: #ffffff;
      text-shadow: 0 0 20px rgba(255, 255, 255, 0.35), 0 0 40px rgba(0, 240, 255, 0.25);
    }

    .hero-sub {
      max-width: 860px;
      margin: 0 auto 32px;
      font-size: 1.02rem;
      color: #d6e2f0;
      line-height: 1.75;
      position: relative;
      z-index: 1;
      font-weight: 500;
    }
    .scifi-tag {
      display: inline-block;
      padding: 2px 8px;
      font-family: var(--font-scifi);
      font-weight: 700;
      font-size: 0.84rem;
      letter-spacing: 0.03em;
      clip-path: polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px);
    }
    .pe-tag { color: #00f0ff; background: rgba(0, 240, 255, 0.14); border: 1px solid rgba(0, 240, 255, 0.45); }
    .fe-tag { color: #fbbf24; background: rgba(229, 169, 60, 0.14); border: 1px solid rgba(229, 169, 60, 0.45); }
    .quiz-tag { color: #34d399; background: rgba(16, 185, 129, 0.14); border: 1px solid rgba(16, 185, 129, 0.45); }
    .pt-tag { color: #c084fc; background: rgba(168, 85, 247, 0.14); border: 1px solid rgba(168, 85, 247, 0.45); }
    .mid-tag { color: #fb7185; background: rgba(244, 63, 94, 0.14); border: 1px solid rgba(244, 63, 94, 0.45); }

    /* CTA Group */
    .hero-cta-group {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      margin-bottom: 36px;
      position: relative;
      z-index: 1;
    }

    /* Search Box */
    .search-box-wrap {
      max-width: 780px;
      margin: 0 auto 36px;
      position: relative;
      z-index: 1;
    }
    .search-box {
      display: flex;
      align-items: center;
      padding: 12px 22px;
      background: rgba(8, 14, 28, 0.92);
      border: 1.5px solid rgba(0, 240, 255, 0.45);
      clip-path: polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px);
      box-shadow: 0 16px 40px -10px rgba(0, 0, 0, 0.9), 0 0 25px rgba(0, 240, 255, 0.18);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .search-box:focus-within {
      border-color: #00f0ff;
      box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.95), 0 0 35px rgba(0, 240, 255, 0.4);
      transform: translateY(-2px);
    }
    .search-icon {
      color: #00f0ff;
      font-size: 1.25rem;
      margin-right: 16px;
      filter: drop-shadow(0 0 8px #00f0ff);
    }
    .search-input {
      flex: 1;
      background: transparent;
      border: none;
      color: #ffffff;
      font-size: 1.05rem;
      font-weight: 600;
      outline: none;
      letter-spacing: 0.02em;
    }
    .search-input::placeholder {
      color: #708399;
      font-weight: 400;
    }
    .clear-btn {
      background: rgba(255, 255, 255, 0.1);
      border: none;
      color: #708399;
      cursor: pointer;
      font-size: 0.95rem;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    .clear-btn:hover {
      background: #f43f5e;
      color: #ffffff;
    }
    .search-kbd-hint {
      font-size: 0.74rem;
      color: #04060c;
      background: #00f0ff;
      padding: 4px 12px;
      clip-path: polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px);
      margin-left: 10px;
      font-weight: 700;
      letter-spacing: 0.04em;
    }

    .quick-subject-tags {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 16px;
    }
    .tag-label {
      font-size: 0.84rem;
      color: #9fb2c9;
      font-weight: 600;
      letter-spacing: 0.01em;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .sub-pill-btn {
      background: rgba(10, 17, 34, 0.85);
      border: 1px solid rgba(0, 240, 255, 0.28);
      color: #e2e8f0;
      padding: 5px 14px;
      clip-path: polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px);
      font-size: 0.82rem;
      font-weight: 700;
      cursor: pointer;
      letter-spacing: 0.03em;
      transition: all 0.2s ease;
    }
    .sub-pill-btn:hover, .sub-pill-btn.active {
      background: #00f0ff;
      border-color: #00f0ff;
      color: #04060c;
      box-shadow: 0 0 18px rgba(0, 240, 255, 0.65);
      transform: translateY(-1px);
    }

    /* Live Telemetry KPI Bar */
    .telemetry-kpi-bar {
      display: flex;
      align-items: center;
      justify-content: space-around;
      flex-wrap: wrap;
      padding: 20px 24px;
      margin-top: 36px;
      background: rgba(8, 14, 28, 0.90);
      border: 1px solid rgba(0, 240, 255, 0.25);
      clip-path: polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px);
      box-shadow: 0 16px 45px -8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 240, 255, 0.06);
    }
    .kpi-card {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 6px 12px;
    }
    .kpi-icon-box {
      width: 48px;
      height: 48px;
      clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.35rem;
    }
    .cyan-glow {
      background: rgba(0, 240, 255, 0.12);
      color: #00f0ff;
      border: 1px solid rgba(0, 240, 255, 0.4);
      box-shadow: 0 0 16px rgba(0, 240, 255, 0.3);
    }
    .gold-glow {
      background: rgba(229, 169, 60, 0.14);
      color: #fbbf24;
      border: 1px solid rgba(229, 169, 60, 0.4);
      box-shadow: 0 0 16px rgba(229, 169, 60, 0.3);
    }
    .purple-glow {
      background: rgba(168, 85, 247, 0.14);
      color: #c084fc;
      border: 1px solid rgba(168, 85, 247, 0.4);
      box-shadow: 0 0 16px rgba(168, 85, 247, 0.3);
    }
    .emerald-glow {
      background: rgba(16, 185, 129, 0.14);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.4);
      box-shadow: 0 0 16px rgba(16, 185, 129, 0.3);
    }
    .kpi-data {
      text-align: left;
    }
    .kpi-num {
      font-size: 1.75rem;
      font-weight: 700;
      line-height: 1.1;
      letter-spacing: 0.02em;
    }
    .text-cyan { color: #00f0ff; }
    .text-gold { color: #fbbf24; }
    .text-purple { color: #c084fc; }
    .text-emerald { color: #34d399; }
    .kpi-label {
      font-size: 0.84rem;
      color: #a8bad0;
      font-weight: 600;
      letter-spacing: 0.01em;
      margin-top: 2px;
    }
    .kpi-divider {
      width: 1px;
      height: 40px;
      background: rgba(255, 255, 255, 0.12);
    }

    /* ============================================== */
    /* SLANTED PARALLELOGRAM RIBBON (Like 99designs)  */
    /* ============================================== */
    .category-tabs-wrap {
      margin: 36px 0 24px;
    }
    .tabs-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 10px;
    }
    .slanted-tab-btn {
      transform: skewX(-14deg);
      background: rgba(9, 15, 29, 0.90);
      border: 1.5px solid rgba(0, 240, 255, 0.3);
      color: #e2e8f0;
      padding: 11px 24px;
      cursor: pointer;
      font-weight: 700;
      font-size: 0.88rem;
      letter-spacing: 0.03em;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.6);
    }
    .tab-inner {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transform: skewX(14deg);
    }
    .slanted-tab-btn:hover {
      border-color: #00f0ff;
      color: #ffffff;
      box-shadow: 0 0 20px rgba(0, 240, 255, 0.4);
      transform: skewX(-14deg) translateY(-2px);
    }
    .slanted-tab-btn.active {
      background: #00f0ff !important;
      border-color: #00f0ff !important;
      color: #04060c !important;
      box-shadow: 0 0 28px rgba(0, 240, 255, 0.85), 0 4px 15px rgba(0, 0, 0, 0.8);
    }
    .slanted-tab-btn.active .tab-count {
      background: #04060c;
      color: #00f0ff;
    }
    .tab-count {
      font-size: 0.74rem;
      background: rgba(0, 240, 255, 0.15);
      color: #00f0ff;
      padding: 2px 7px;
      border-radius: 4px;
      font-weight: 700;
    }

    /* Filters Bar */
    .filters-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
      padding: 16px 24px;
      margin-bottom: 30px;
      background: rgba(8, 14, 28, 0.90);
      border: 1px solid rgba(0, 240, 255, 0.25);
      clip-path: polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
    }
    .filter-controls-group {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 14px;
    }
    .select-wrap {
      position: relative;
      display: flex;
      align-items: center;
    }
    .select-icon {
      position: absolute;
      left: 14px;
      color: #00f0ff;
      font-size: 0.9rem;
      pointer-events: none;
    }
    .select-chevron {
      position: absolute;
      right: 14px;
      color: #708399;
      font-size: 0.8rem;
      pointer-events: none;
    }
    .scifi-select {
      background: #070b16;
      border: 1px solid rgba(0, 240, 255, 0.35);
      color: #ffffff;
      padding: 10px 38px 10px 40px;
      clip-path: polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px);
      font-size: 0.92rem;
      font-weight: 600;
      cursor: pointer;
      outline: none;
      appearance: none;
      transition: all 0.2s ease;
    }
    .scifi-select:focus, .scifi-select:hover {
      border-color: #00f0ff;
      box-shadow: 0 0 16px rgba(0, 240, 255, 0.3);
    }
    .scifi-select option {
      background: #070b16;
      color: #ffffff;
    }
    .filter-results-status {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-left: auto;
    }
    .results-chip {
      font-size: 0.86rem;
      color: #e2e8f0;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 6px;
      letter-spacing: 0.03em;
    }
    .chip-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #00f0ff;
      box-shadow: 0 0 8px #00f0ff;
    }
    .btn-reset-filter {
      background: rgba(244, 63, 94, 0.15);
      border: 1px solid rgba(244, 63, 94, 0.4);
      color: #fb7185;
      padding: 7px 14px;
      clip-path: polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px);
      font-size: 0.8rem;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      letter-spacing: 0.03em;
      transition: all 0.2s;
    }
    .btn-reset-filter:hover {
      background: #f43f5e;
      color: #ffffff;
      box-shadow: 0 0 12px rgba(244, 63, 94, 0.5);
    }

    /* Section Tech Header */
    .section-tech-header {
      margin: 10px 0 24px;
    }
    .tech-slash {
      color: #00f0ff;
      font-weight: 700;
      margin-right: 4px;
    }

    /* Exams Grid */
    .exams-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
      gap: 24px;
    }
    .loading-state {
      text-align: center;
      padding: 60px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
    .quantum-spinner {
      width: 48px;
      height: 48px;
      border: 3px solid rgba(0, 240, 255, 0.15);
      border-top-color: #00f0ff;
      border-right-color: #e5a93c;
      border-radius: 50%;
      animation: spinSlow 1s linear infinite;
    }
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;
    }
    .empty-icon-box {
      font-size: 3rem;
      color: #fbbf24;
      filter: drop-shadow(0 0 16px rgba(229, 169, 60, 0.4));
    }

    /* ============================================================== */
    /* THEATER HUD MODAL (SPACESHIP COCKPIT OBSERVATION VIEWER)       */
    /* ============================================================== */
    .detail-theater-modal {
      width: 96vw;
      max-width: 1540px;
      height: 94vh;
      display: flex;
      flex-direction: column;
      padding: 0;
      position: relative;
      overflow: hidden;
      background: rgba(7, 11, 23, 0.96);
      border: 1.5px solid rgba(0, 240, 255, 0.45);
      clip-path: polygon(18px 0, 100% 0, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0 100%, 0 18px);
      box-shadow: 0 30px 90px -15px rgba(0, 0, 0, 0.95), 0 0 45px rgba(0, 240, 255, 0.25);
      animation: portalWarpOpen 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      transform-origin: center center;
    }
    .modal-laser-top {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, transparent, #00f0ff 30%, #e5a93c 70%, transparent);
      box-shadow: 0 0 14px #00f0ff;
      z-index: 20;
    }

    /* Topbar */
    .hud-modal-topbar {
      height: 56px;
      padding: 0 20px;
      background: rgba(8, 14, 28, 0.98);
      border-bottom: 1px solid rgba(0, 240, 255, 0.25);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      flex-shrink: 0;
      z-index: 10;
    }
    .topbar-left {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }
    .subject-badge {
      font-size: 0.82rem;
      font-weight: 700;
      color: #00f0ff;
      background: rgba(0, 240, 255, 0.12);
      padding: 4px 10px;
      clip-path: polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px);
      border: 1px solid rgba(0, 240, 255, 0.4);
    }
    .exam-title-badge {
      font-size: 1.15rem;
      font-weight: 700;
      color: #ffffff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 380px;
      letter-spacing: 0.02em;
    }
    .semester-pill {
      font-size: 0.8rem;
      color: #a5b8d0;
      font-weight: 600;
    }

    .topbar-actions {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }
    .btn-topbar-zip {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.45);
      color: #34d399;
      padding: 6px 14px;
      clip-path: polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px);
      font-size: 0.82rem;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 7px;
      letter-spacing: 0.02em;
      transition: all 0.2s;
    }
    .btn-topbar-zip:hover {
      background: #10b981;
      color: #04060c;
      box-shadow: 0 0 16px rgba(16, 185, 129, 0.6);
    }
    .zip-cnt-tag {
      font-size: 0.72rem;
      background: rgba(0, 0, 0, 0.4);
      padding: 1px 6px;
      border-radius: 4px;
    }
    .btn-topbar-like {
      background: rgba(244, 63, 94, 0.15);
      border: 1px solid rgba(244, 63, 94, 0.45);
      color: #fb7185;
      padding: 6px 12px;
      clip-path: polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px);
      font-size: 0.82rem;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }
    .btn-topbar-like:hover, .btn-topbar-like.liked {
      background: #f43f5e;
      color: #ffffff;
      box-shadow: 0 0 14px rgba(244, 63, 94, 0.6);
    }
    .btn-toggle-split {
      background: rgba(0, 240, 255, 0.12);
      border: 1px solid rgba(0, 240, 255, 0.4);
      color: #00f0ff;
      padding: 6px 12px;
      clip-path: polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px);
      font-size: 0.82rem;
      font-weight: 700;
      letter-spacing: 0.02em;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 7px;
      transition: all 0.2s;
    }
    .btn-toggle-split:hover {
      background: #00f0ff;
      color: #04060c;
      box-shadow: 0 0 16px rgba(0, 240, 255, 0.6);
    }
    .modal-close-btn {
      width: 32px;
      height: 32px;
      clip-path: polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px);
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #c5d3e8;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      transition: all 0.2s;
    }
    .modal-close-btn:hover {
      background: #f43f5e;
      border-color: #f43f5e;
      color: #fff;
    }

    /* Dual Pane Architecture */
    .reader-split-body {
      flex: 1;
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      min-height: 0;
      height: calc(100% - 56px);
      position: relative;
    }
    .reader-split-body.full-image-mode {
      grid-template-columns: 1fr;
    }

    /* CỘT TRÁI: KHUNG XEM ẢNH */
    .image-stage-column {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
      background: #03050c;
      border-right: 1px solid rgba(0, 240, 255, 0.2);
      position: relative;
    }

    .image-hud-nav {
      height: 48px;
      padding: 0 16px;
      background: rgba(8, 14, 28, 0.96);
      border-bottom: 1px solid rgba(0, 240, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-shrink: 0;
      z-index: 5;
    }
    .hud-nav-pages {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .btn-hud-nav {
      background: rgba(0, 240, 255, 0.12);
      border: 1px solid rgba(0, 240, 255, 0.4);
      color: #00f0ff;
      padding: 6px 12px;
      clip-path: polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px);
      font-size: 0.82rem;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      letter-spacing: 0.02em;
      transition: all 0.2s;
    }
    .btn-hud-nav:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
    .btn-hud-nav:not(:disabled):hover {
      background: #00f0ff;
      color: #04060c;
    }
    .page-selector-box {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.8rem;
      color: #c5d3e8;
    }
    .page-dropdown {
      background: #070b16;
      border: 1px solid rgba(0, 240, 255, 0.4);
      color: #00f0ff;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 700;
      cursor: pointer;
      outline: none;
    }

    .hud-zoom-group {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .btn-zoom {
      width: 28px;
      height: 28px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #c5d3e8;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 0.8rem;
      transition: all 0.2s;
    }
    .btn-zoom:hover {
      background: rgba(0, 240, 255, 0.25);
      border-color: #00f0ff;
      color: #00f0ff;
    }
    .zoom-value {
      font-size: 0.8rem;
      color: #a5b8d0;
      min-width: 44px;
      text-align: center;
      font-weight: 600;
    }
    .btn-raw-img {
      background: rgba(229, 169, 60, 0.15);
      border: 1px solid rgba(229, 169, 60, 0.45);
      color: #fbbf24;
      padding: 5px 12px;
      clip-path: polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px);
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.02em;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      transition: all 0.2s;
    }
    .btn-raw-img:hover {
      background: #fbbf24;
      color: #04060c;
    }

    /* VIEWPORT KHUNG ẢNH (Không bị che chữ, cuộn mượt mà) */
    .image-viewport-box {
      flex: 1;
      min-height: 0;
      overflow: auto;
      padding: 18px;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      background: #020409;
      position: relative;
    }
    .image-zoom-canvas {
      transition: transform 0.2s ease-out;
      transform-origin: top center;
      display: flex;
      justify-content: center;
      max-width: 100%;
    }
    .exam-paper-img {
      max-width: 100%;
      height: auto;
      display: block;
      box-shadow: 0 16px 45px rgba(0, 0, 0, 0.95), 0 0 20px rgba(0, 240, 255, 0.12);
      border-radius: 6px;
      background: #fff;
    }

    /* DẢI THUMBNAIL PHÍA DƯỚI (Xem 50 ảnh cực tiện) */
    .page-filmstrip-bar {
      height: 72px;
      background: rgba(7, 12, 24, 0.98);
      border-top: 1px solid rgba(0, 240, 255, 0.2);
      padding: 6px 12px;
      flex-shrink: 0;
      z-index: 5;
    }
    .filmstrip-scroll {
      display: flex;
      align-items: center;
      gap: 10px;
      overflow-x: auto;
      height: 100%;
      padding-bottom: 2px;
    }
    .filmstrip-btn {
      flex-shrink: 0;
      width: 60px;
      height: 56px;
      background: #060a14;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 6px;
      overflow: hidden;
      cursor: pointer;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0;
      transition: all 0.2s;
    }
    .filmstrip-btn:hover {
      border-color: #00f0ff;
      transform: translateY(-2px);
    }
    .filmstrip-btn.active {
      border: 2px solid #00f0ff;
      box-shadow: 0 0 14px rgba(0, 240, 255, 0.6);
    }
    .page-number-tag {
      position: absolute;
      top: 2px;
      left: 2px;
      background: #00f0ff;
      color: #04060c;
      font-size: 0.66rem;
      font-weight: 700;
      padding: 0 5px;
      border-radius: 2px;
      z-index: 2;
    }
    .filmstrip-thumb {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* CỘT PHẢI: TRỢ THỦ HỌC TẬP */
    .assistant-side-panel {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
      background: rgba(9, 15, 29, 0.95);
      border-left: 1px solid rgba(0, 240, 255, 0.2);
    }
    .assistant-nav-tabs {
      display: flex;
      gap: 6px;
      padding: 10px 14px;
      background: rgba(6, 10, 22, 0.98);
      border-bottom: 1px solid rgba(0, 240, 255, 0.2);
      overflow-x: auto;
      flex-shrink: 0;
    }
    .assistant-nav-tabs button {
      background: transparent;
      border: 1px solid transparent;
      color: #a5b8d0;
      padding: 6px 12px;
      clip-path: polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px);
      font-size: 0.82rem;
      font-weight: 700;
      letter-spacing: 0.02em;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
      transition: all 0.2s;
    }
    .assistant-nav-tabs button:hover {
      color: #ffffff;
      border-color: rgba(0, 240, 255, 0.3);
    }
    .assistant-nav-tabs button.active {
      background: #00f0ff;
      color: #04060c;
      box-shadow: 0 0 14px rgba(0, 240, 255, 0.5);
    }
    .assistant-pane-content {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      padding: 18px;
    }

    /* Comment Box with Tag Badge */
    .comment-tag-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      background: rgba(0, 240, 255, 0.12);
      border: 1px solid rgba(0, 240, 255, 0.35);
      border-radius: 4px;
      color: #00f0ff;
      font-size: 0.76rem;
      margin-bottom: 10px;
    }
    .comment-page-badge {
      font-size: 0.68rem;
      color: #fbbf24;
      background: rgba(229, 169, 60, 0.15);
      border: 1px solid rgba(229, 169, 60, 0.4);
      padding: 1px 6px;
      border-radius: 4px;
      font-weight: 700;
    }

    /* Solution Terminal Box */
    .solution-terminal-box {
      border: 1px solid rgba(0, 240, 255, 0.3);
      clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);
      background: #04060e;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
      overflow: hidden;
    }
    .terminal-bar {
      background: #090e1c;
      border-bottom: 1px solid rgba(0, 240, 255, 0.2);
      padding: 10px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.76rem;
      color: #788a9e;
    }
    .terminal-dots {
      display: flex;
      gap: 6px;
    }
    .terminal-dots span {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
    .dot-red { background: #f43f5e; }
    .dot-yellow { background: #fbbf24; }
    .dot-green { background: #10b981; }
    .btn-copy-code {
      background: rgba(0, 240, 255, 0.15);
      border: 1px solid rgba(0, 240, 255, 0.4);
      color: #00f0ff;
      padding: 4px 10px;
      clip-path: polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px);
      cursor: pointer;
      font-size: 0.78rem;
      font-weight: 700;
      transition: all 0.2s;
    }
    .btn-copy-code:hover {
      background: #00f0ff;
      color: #04060c;
    }
    .terminal-content {
      padding: 18px;
      color: #c5d3e8;
      font-family: var(--font-mono);
      font-size: 0.88rem;
      line-height: 1.6;
      overflow-x: auto;
    }

    /* Zip Tiles Stack in Assistant Panel */
    .zip-download-cards-stack {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .zip-card-tile {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 18px;
      clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);
      background: rgba(7, 12, 24, 0.9);
      border: 1px solid rgba(0, 240, 255, 0.25);
    }
    .zip-tile-left {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }
    .zip-tile-info {
      min-width: 0;
    }
    .zip-tile-name {
      font-size: 0.84rem;
      color: #ffffff;
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 200px;
    }
    .zip-tile-desc {
      font-size: 0.74rem;
      color: #788a9e;
    }

    /* Comments Components */
    .comment-input-box {
      margin-bottom: 20px;
    }
    .comment-textarea {
      width: 100%;
      background: rgba(7, 12, 24, 0.9);
      border: 1.5px solid rgba(0, 240, 255, 0.35);
      border-radius: 8px;
      padding: 10px 14px;
      color: #ffffff;
      font-family: var(--font-main);
      font-size: 0.9rem;
      resize: vertical;
      outline: none;
      transition: border-color 0.2s;
    }
    .comment-textarea:focus {
      border-color: #00f0ff;
      box-shadow: 0 0 12px rgba(0, 240, 255, 0.3);
    }
    .comment-btn-row {
      display: flex;
      justify-content: flex-end;
      margin-top: 8px;
    }
    .login-prompt {
      padding: 12px 16px;
      text-align: center;
      color: #fbbf24;
      background: rgba(229, 169, 60, 0.12);
      border: 1px solid rgba(229, 169, 60, 0.35);
      border-radius: 8px;
      font-size: 0.82rem;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      font-weight: 700;
      letter-spacing: 0.05em;
    }
    .comments-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .comment-item {
      display: flex;
      gap: 12px;
      padding: 12px 14px;
      clip-path: polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px);
      background: rgba(7, 12, 24, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .comment-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      object-fit: cover;
      border: 1.5px solid #00f0ff;
      flex-shrink: 0;
    }
    .comment-body {
      flex: 1;
      min-width: 0;
    }
    .comment-user-row {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 7px;
      margin-bottom: 4px;
    }
    .comment-name {
      font-size: 0.84rem;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: 0.02em;
    }
    .comment-mssv {
      font-size: 0.7rem;
      color: #00f0ff;
      background: rgba(0, 240, 255, 0.15);
      padding: 1px 6px;
      border-radius: 4px;
      font-weight: 700;
    }
    .comment-date {
      font-size: 0.76rem;
      color: #9fb2c9;
      margin-left: auto;
    }
    .comment-text {
      font-size: 0.9rem;
      color: #dce6f5;
      line-height: 1.6;
      word-break: break-word;
    }
    .empty-note {
      text-align: center;
      padding: 30px 16px;
      color: #9fb2c9;
      font-size: 0.9rem;
    }
    .btn-sm {
      padding: 7px 14px;
      font-size: 0.76rem;
    }
    .btn-lg {
      padding: 12px 24px;
      font-size: 0.9rem;
    }

    /* STANDARD MODAL (CHO ĐỀ KHÔNG CÓ ẢNH) */
    .standard-modal-body {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      padding: 24px 30px;
      background: rgba(7, 11, 23, 0.96);
    }
    .standard-content-tabs {
      display: flex;
      gap: 10px;
      border-bottom: 1px solid rgba(0, 240, 255, 0.2);
      padding-bottom: 12px;
      margin-bottom: 24px;
    }
    .standard-content-tabs button {
      background: transparent;
      border: 1px solid transparent;
      color: #a5b8d0;
      padding: 8px 18px;
      clip-path: polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px);
      font-size: 0.9rem;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      letter-spacing: 0.02em;
      transition: all 0.2s;
    }
    .standard-content-tabs button:hover {
      color: #ffffff;
      border-color: rgba(0, 240, 255, 0.3);
    }
    .standard-content-tabs button.active {
      background: #00f0ff;
      color: #04060c;
      box-shadow: 0 0 16px rgba(0, 240, 255, 0.5);
    }
    .zip-download-card {
      text-align: center;
      padding: 40px 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;
      margin-bottom: 16px;
      background: rgba(9, 15, 29, 0.9);
      border: 1px solid rgba(0, 240, 255, 0.3);
      clip-path: polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px);
    }
    .zip-card-icon-box {
      font-size: 3.5rem;
    }

    @media (max-width: 900px) {
      .reader-split-body {
        grid-template-columns: 1fr;
        overflow-y: auto;
      }
      .image-stage-column {
        height: 60vh;
      }
      .assistant-side-panel {
        height: 60vh;
      }
      .hud-modal-topbar {
        padding: 0 12px;
      }
      .exam-title-badge {
        max-width: 160px;
      }
      .hero-title {
        font-size: 2.2rem;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  exams = signal<Exam[]>([]);
  subjects = signal<Subject[]>([]);
  semesters = signal<string[]>([]);
  loading = signal(false);

  selectedType: string = 'ALL';
  selectedSubjectId: number | null = null;
  selectedSemester: string = 'ALL';
  searchKeyword: string = '';

  // 5 Exam Types (PE, FE, Quiz, PT, Midterm)
  examTabs = [
    { id: 'ALL', label: 'TẤT CẢ ĐỀ THI', icon: '⬡' },
    { id: 'PE', label: 'THỰC HÀNH (PE)', icon: '⚡' },
    { id: 'FE', label: 'CUỐI KỲ (FE)', icon: '🔥' },
    { id: 'QUIZ', label: 'TRẮC NGHIỆM (QUIZ)', icon: '🎯' },
    { id: 'PT', label: 'PROGRESS TEST (PT)', icon: '📊' },
    { id: 'MIDTERM', label: 'GIỮA KỲ (MIDTERM)', icon: '⭐' }
  ];

  selectedExam = signal<Exam | null>(null);
  detailTab: 'image' | 'zip' | 'solution' | 'comments' = 'image';

  // Multi-Image Split-View Viewer Properties
  examImages: string[] = [];
  examZips: string[] = [];
  currentImageIndex: number = 0;
  zoomLevel: number = 1.0;
  isSplitView: boolean = true;
  sideTab: 'solution' | 'pageComments' | 'allComments' | 'zips' = 'solution';

  comments = signal<Comment[]>([]);
  newCommentText = '';
  isLiked = false;

  totalViews = computed(() => {
    return this.exams().reduce((sum, e) => sum + (e.viewsCount || 0), 0);
  });

  totalDownloads = computed(() => {
    return this.exams().reduce((sum, e) => sum + (e.downloadsCount || 0), 0);
  });

  constructor(public auth: AuthService, private examService: ExamService) {}

  ngOnInit() {
    this.loadData();
  }

  scrollToGrid() {
    const el = document.getElementById('category-tabs');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Keyboard Navigation: ← Previous, → Next
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.selectedExam() || this.examImages.length === 0) return;
    if (['input', 'textarea'].includes((event.target as HTMLElement).tagName.toLowerCase())) return;

    if (event.key === 'ArrowLeft') {
      this.prevImage();
    } else if (event.key === 'ArrowRight') {
      this.nextImage();
    }
  }

  loadData() {
    this.loading.set(true);
    this.examService.getExams().subscribe({
      next: (exams) => {
        this.exams.set(exams);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });

    this.examService.getSubjects().subscribe(sub => this.subjects.set(sub));
    this.examService.getSemesters().subscribe(sem => this.semesters.set(sem));
  }

  applyFilters() {
    const filters = {
      examType: this.selectedType !== 'ALL' ? this.selectedType : undefined,
      subjectId: this.selectedSubjectId || undefined,
      semester: this.selectedSemester !== 'ALL' ? this.selectedSemester : undefined,
      search: this.searchKeyword.trim() || undefined
    };

    this.loading.set(true);
    this.examService.getExams(filters).subscribe({
      next: (exams) => {
        this.exams.set(exams);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  selectExamType(typeId: string) {
    this.selectedType = typeId;
    this.applyFilters();
  }

  filterByQuickSubject(code: string) {
    if (this.searchKeyword === code) {
      this.searchKeyword = '';
    } else {
      this.searchKeyword = code;
    }
    this.applyFilters();
  }

  getTypeCount(typeId: string): number {
    if (typeId === 'ALL') return this.exams().length;
    return this.exams().filter(e => e.examType.toUpperCase().includes(typeId)).length;
  }

  resetFilters() {
    this.selectedType = 'ALL';
    this.selectedSubjectId = null;
    this.selectedSemester = 'ALL';
    this.searchKeyword = '';
    this.applyFilters();
  }

  openExamDetail(exam: Exam) {
    this.selectedExam.set(exam);
    this.isLiked = false;

    // Parse all images
    let imgs: string[] = [];
    if (exam.imageUrls && exam.imageUrls.length > 0) {
      imgs = [...exam.imageUrls];
    } else if (exam.imageUrl) {
      imgs = exam.imageUrl.split(',').map(s => s.trim()).filter(s => s.length > 0);
    }
    this.examImages = imgs;
    this.currentImageIndex = 0;
    this.zoomLevel = 1.0;
    this.isSplitView = true;

    // Parse all zips
    let zips: string[] = [];
    if (exam.zipUrls && exam.zipUrls.length > 0) {
      zips = [...exam.zipUrls];
    } else if (exam.zipUrl) {
      zips = exam.zipUrl.split(',').map(s => s.trim()).filter(s => s.length > 0);
    }
    this.examZips = zips;

    if (imgs.length > 0) {
      this.detailTab = 'image';
      this.sideTab = 'solution';
    } else if (zips.length > 0) {
      this.detailTab = 'zip';
    } else {
      this.detailTab = 'solution';
    }

    this.loadComments(exam.id);
  }

  closeDetail() {
    this.selectedExam.set(null);
  }

  // Multi-image navigation
  prevImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
      this.zoomLevel = 1.0;
    }
  }

  nextImage() {
    if (this.currentImageIndex < this.examImages.length - 1) {
      this.currentImageIndex++;
      this.zoomLevel = 1.0;
    }
  }

  goToImage(index: number) {
    const idx = Number(index);
    if (idx >= 0 && idx < this.examImages.length) {
      this.currentImageIndex = idx;
      this.zoomLevel = 1.0;
    }
  }

  zoomIn() {
    if (this.zoomLevel < 3.0) {
      this.zoomLevel = Math.round((this.zoomLevel + 0.25) * 100) / 100;
    }
  }

  zoomOut() {
    if (this.zoomLevel > 0.5) {
      this.zoomLevel = Math.round((this.zoomLevel - 0.25) * 100) / 100;
    }
  }

  resetZoom() {
    this.zoomLevel = 1.0;
  }

  toggleSplitView() {
    this.isSplitView = !this.isSplitView;
  }

  getPageComments(): Comment[] {
    return this.comments().filter(c => c.imageIndex === this.currentImageIndex);
  }

  loadComments(examId: number) {
    this.examService.getComments(examId).subscribe(comments => this.comments.set(comments));
  }

  submitCommentForPage(examId: number) {
    if (!this.newCommentText.trim()) return;
    this.examService.addComment(examId, this.newCommentText.trim(), this.currentImageIndex).subscribe({
      next: (c) => {
        this.comments.update(list => [c, ...list]);
        this.newCommentText = '';
      }
    });
  }

  submitGeneralComment(examId: number) {
    if (!this.newCommentText.trim()) return;
    this.examService.addComment(examId, this.newCommentText.trim(), null).subscribe({
      next: (c) => {
        this.comments.update(list => [c, ...list]);
        this.newCommentText = '';
      }
    });
  }

  downloadFirstZip(exam: Exam) {
    if (this.examZips.length > 0) {
      this.examService.downloadExam(exam.id).subscribe();
      exam.downloadsCount++;
      window.open(this.examZips[0], '_blank');
    }
  }

  getZipFilename(url: string): string {
    if (!url) return 'File_Given.zip';
    const lastSlash = url.lastIndexOf('/');
    return lastSlash >= 0 ? url.substring(lastSlash + 1) : url;
  }

  toggleLike(exam: Exam) {
    if (this.isLiked) return;
    this.examService.likeExam(exam.id).subscribe({
      next: (res) => {
        exam.likesCount = res.likes;
        this.isLiked = true;
      }
    });
  }

  copySolution(content?: string) {
    if (!content) return;
    navigator.clipboard.writeText(content);
    alert('Đã sao chép đáp án / lời giải vào clipboard!');
  }

  formatMarkdown(content?: string): string {
    if (!content) return '';
    return content
      .replace(/### (.*)/g, '<h4 class="font-scifi text-amber-300 font-bold mt-4 mb-2">$1</h4>')
      .replace(/## (.*)/g, '<h3 class="font-scifi text-cyan font-bold text-lg mt-5 mb-2">$1</h3>')
      .replace(/```([a-z]*)\n([\s\S]*?)```/g, '<pre class="bg-black border border-cyan-800 p-3 rounded my-2 overflow-x-auto text-cyan font-mono text-sm shadow-inner"><code>$2</code></pre>')
      .replace(/`([^`]+)`/g, '<code class="bg-slate-900 text-yellow-300 px-1.5 py-0.5 rounded font-mono text-xs">$1</code>')
      .replace(/\n/g, '<br/>');
  }
}
