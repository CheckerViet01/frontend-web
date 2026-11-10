import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Exam } from '../../services/exam.service';

@Component({
  selector: 'app-exam-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="scifi-exam-card" 
      [attr.data-type]="exam.examType"
      (click)="select.emit(exam)"
    >
      <!-- Top Edge Laser Beam -->
      <div class="laser-top-beam" [ngClass]="'edge-' + exam.examType.toLowerCase()"></div>

      <!-- Technical Diagonal Hatches (Left Edge Marking) -->
      <div class="card-left-hatches"></div>

      <!-- Card Top Header Row -->
      <div class="card-header">
        <div class="subject-tag">
          <span class="subject-code font-scifi">{{ exam.subjectCode }}</span>
          <span class="semester-text font-scifi">{{ exam.semester }}</span>
        </div>

        <!-- Exam Type Pill -->
        <span class="badge-exam font-scifi" [ngClass]="getBadgeClass(exam.examType)">
          <i [class]="getExamIcon(exam.examType)"></i>
          <span>{{ exam.examType }}</span>
        </span>
      </div>

      <!-- Mã Đề Thi (Sci-Fi Typography) -->
      <h3 class="exam-code-title font-scifi" [title]="exam.title">
        <span class="bracket-prefix">[</span>{{ exam.title }}<span class="bracket-suffix">]</span>
      </h3>

      <!-- Capability Badges: Đếm số ảnh, file zip given, đáp án -->
      <div class="media-badges-row">
        <span class="media-pill img-pill font-mono" *ngIf="hasImages()">
          <i class="fa-solid fa-images"></i>
          <span>{{ getImageCount() }} Ảnh Đề</span>
        </span>
        <span class="media-pill zip-pill font-mono" *ngIf="hasZips()">
          <i class="fa-solid fa-file-zipper"></i>
          <span>{{ getZipCount() }} Given .ZIP</span>
        </span>
        <span class="media-pill solution-pill font-mono" *ngIf="exam.solution">
          <i class="fa-solid fa-check-double"></i>
          <span>Có Lời Giải</span>
        </span>
      </div>

      <!-- Card Author & Stats Row -->
      <div class="card-footer">
        <div class="author-meta">
          <div class="author-avatar-wrap">
            <img [src]="exam.authorAvatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + exam.authorName" class="author-avatar" alt="Author">
          </div>
          <span class="author-name font-sub">{{ exam.authorName }}</span>
        </div>

        <div class="stats-counters font-mono">
          <span title="Lượt xem"><i class="fa-regular fa-eye"></i> {{ exam.viewsCount }}</span>
          <span title="Lượt tải"><i class="fa-solid fa-download"></i> {{ exam.downloadsCount }}</span>
          <span title="Lượt thích" class="like-counter"><i class="fa-solid fa-heart"></i> {{ exam.likesCount }}</span>
        </div>
      </div>

      <!-- Chamfered Dedicated Action Button (From Earth From Another Sun design) -->
      <div class="card-action-bar">
        <div class="action-btn-chamfer font-scifi">
          <span>XEM CHI TIẾT & TẢI VỀ</span>
          <i class="fa-solid fa-chevron-right"></i>
        </div>
      </div>

      <!-- Sci-Fi Corner Brackets -->
      <div class="scifi-corner corner-tr"></div>
      <div class="scifi-corner corner-bl"></div>
    </div>
  `,
  styles: [`
    .scifi-exam-card {
      padding: 22px 20px 18px 26px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      height: 100%;
      position: relative;
      background: rgba(9, 15, 29, 0.90);
      border: 1px solid rgba(0, 240, 255, 0.28);
      clip-path: polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px);
      backdrop-filter: blur(24px) saturate(190%);
      -webkit-backdrop-filter: blur(24px) saturate(190%);
      box-shadow: 0 16px 40px -10px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 240, 255, 0.05);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      overflow: hidden;
    }

    /* Tactile Click Bounce */
    .scifi-exam-card:active {
      transform: scale(0.97) translateY(-2px);
      transition: transform 0.12s cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* Prismatic Laser Scanline Sweep on Hover */
    .scifi-exam-card::after {
      content: '';
      position: absolute;
      top: 0;
      left: -130%;
      width: 70%;
      height: 100%;
      background: linear-gradient(
        105deg,
        transparent 20%,
        rgba(255, 255, 255, 0.2) 40%,
        rgba(0, 240, 255, 0.4) 50%,
        rgba(229, 169, 60, 0.3) 60%,
        transparent 80%
      );
      transform: skewX(-20deg);
      transition: all 0.75s ease;
      pointer-events: none;
    }
    .scifi-exam-card:hover::after {
      left: 140%;
    }

    .scifi-exam-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 24px 50px -10px rgba(0, 0, 0, 0.9), 0 0 35px rgba(0, 240, 255, 0.45);
      border-color: #00f0ff;
    }

    /* Left Edge Technical Hatches (Iconic Sci-Fi Markings from 99designs) */
    .card-left-hatches {
      position: absolute;
      top: 24px;
      left: 6px;
      bottom: 24px;
      width: 6px;
      background-image: repeating-linear-gradient(
        -45deg,
        rgba(0, 240, 255, 0.45),
        rgba(0, 240, 255, 0.45) 2px,
        transparent 2px,
        transparent 5px
      );
      pointer-events: none;
      opacity: 0.7;
    }

    /* Laser Top Edge Beam */
    .laser-top-beam {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      opacity: 0.9;
      transition: all 0.3s ease;
    }
    .edge-pe {
      background: linear-gradient(90deg, transparent, #00f0ff, transparent);
      box-shadow: 0 0 12px #00f0ff;
    }
    .edge-fe {
      background: linear-gradient(90deg, transparent, #e5a93c, transparent);
      box-shadow: 0 0 12px #e5a93c;
    }
    .edge-quiz {
      background: linear-gradient(90deg, transparent, #10b981, transparent);
      box-shadow: 0 0 12px #10b981;
    }
    .edge-pt {
      background: linear-gradient(90deg, transparent, #a855f7, transparent);
      box-shadow: 0 0 12px #a855f7;
    }
    .edge-midterm {
      background: linear-gradient(90deg, transparent, #f43f5e, transparent);
      box-shadow: 0 0 12px #f43f5e;
    }
    .scifi-exam-card:hover .laser-top-beam {
      height: 4px;
      opacity: 1;
      filter: brightness(1.3);
    }

    /* Card Header */
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }
    .subject-tag {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .subject-code {
      font-size: 0.82rem;
      font-weight: 800;
      color: #00f0ff;
      background: rgba(0, 240, 255, 0.12);
      padding: 3px 10px;
      clip-path: polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px);
      border: 1px solid rgba(0, 240, 255, 0.4);
      letter-spacing: 0.08em;
    }
    .semester-text {
      font-size: 0.72rem;
      color: #7b8f9e;
      font-weight: 600;
      letter-spacing: 0.05em;
    }

    /* Mã Đề Thi */
    .exam-code-title {
      font-size: 1.15rem;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.45;
      margin: 4px 0 14px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      min-height: 2.9em;
      letter-spacing: 0.04em;
      transition: color 0.2s ease, text-shadow 0.2s ease;
    }
    .bracket-prefix, .bracket-suffix {
      color: #00f0ff;
      margin: 0 2px;
      font-weight: 900;
    }
    .scifi-exam-card:hover .exam-code-title {
      color: #00f0ff;
      text-shadow: 0 0 12px rgba(0, 240, 255, 0.6);
    }

    /* Capability Badges */
    .media-badges-row {
      display: flex;
      flex-wrap: wrap;
      gap: 7px;
      margin-bottom: 16px;
    }
    .media-pill {
      font-size: 0.72rem;
      font-weight: 700;
      padding: 3px 9px;
      clip-path: polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px);
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
    }
    .img-pill {
      background: rgba(0, 240, 255, 0.12);
      border: 1px solid rgba(0, 240, 255, 0.4);
      color: #00f0ff;
    }
    .zip-pill {
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.4);
      color: #34d399;
    }
    .solution-pill {
      background: rgba(229, 169, 60, 0.14);
      border: 1px solid rgba(229, 169, 60, 0.4);
      color: #fbbf24;
    }

    /* Footer Row */
    .card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: auto;
      padding-top: 12px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    .author-meta {
      display: flex;
      align-items: center;
      gap: 9px;
    }
    .author-avatar-wrap {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      overflow: hidden;
      border: 1.5px solid #00f0ff;
      box-shadow: 0 0 8px rgba(0, 240, 255, 0.35);
    }
    .author-avatar {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .author-name {
      font-size: 0.8rem;
      color: #c5d3e8;
      font-weight: 600;
      max-width: 110px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      letter-spacing: 0.04em;
    }
    .stats-counters {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.74rem;
      color: #7b8f9e;
    }
    .stats-counters span {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .like-counter {
      color: #fb7185;
    }

    /* Dedicated Action Button: Chamfered Outline to Solid Cyan */
    .card-action-bar {
      margin-top: 14px;
      padding-top: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .action-btn-chamfer {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 9px 14px;
      clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);
      background: rgba(0, 240, 255, 0.08);
      border: 1.5px solid rgba(0, 240, 255, 0.38);
      color: #00f0ff;
      font-size: 0.8rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .action-btn-chamfer i {
      transition: transform 0.25s ease;
      font-size: 0.75rem;
    }
    .scifi-exam-card:hover .action-btn-chamfer {
      background: #00f0ff;
      border-color: #00f0ff;
      color: #04060c;
      box-shadow: 0 0 24px rgba(0, 240, 255, 0.75);
      transform: translateY(-1px);
    }
    .scifi-exam-card:hover .action-btn-chamfer i {
      transform: translateX(4px);
    }

    /* Sci-Fi Corner Brackets */
    .scifi-corner {
      position: absolute;
      width: 8px;
      height: 8px;
      pointer-events: none;
    }
    .corner-tr {
      top: 6px;
      right: 6px;
      border-top: 2px solid rgba(0, 240, 255, 0.6);
      border-right: 2px solid rgba(0, 240, 255, 0.6);
    }
    .corner-bl {
      bottom: 6px;
      left: 6px;
      border-bottom: 2px solid rgba(0, 240, 255, 0.6);
      border-left: 2px solid rgba(0, 240, 255, 0.6);
    }
  `]
})
export class ExamCardComponent {
  @Input({ required: true }) exam!: Exam;
  @Output() select = new EventEmitter<Exam>();

  getBadgeClass(type: string): string {
    const t = (type || '').toUpperCase();
    if (t === 'PE') return 'badge-pe';
    if (t === 'FE') return 'badge-fe';
    if (t === 'QUIZ') return 'badge-quiz';
    if (t === 'PT') return 'badge-pt';
    if (t === 'MIDTERM') return 'badge-midterm';
    return 'badge-pe';
  }

  getExamIcon(type: string): string {
    const t = (type || '').toUpperCase();
    if (t === 'PE') return 'fa-solid fa-bolt-lightning';
    if (t === 'FE') return 'fa-solid fa-fire';
    if (t === 'QUIZ') return 'fa-solid fa-list-check';
    if (t === 'PT') return 'fa-solid fa-chart-line';
    if (t === 'MIDTERM') return 'fa-solid fa-star';
    return 'fa-solid fa-book';
  }

  hasImages(): boolean {
    if (this.exam.imageUrls && this.exam.imageUrls.length > 0) return true;
    return !!this.exam.imageUrl;
  }

  getImageCount(): number {
    if (this.exam.imageUrls && this.exam.imageUrls.length > 0) {
      return this.exam.imageUrls.length;
    }
    if (this.exam.imageUrl) {
      return this.exam.imageUrl.split(',').filter(x => x.trim().length > 0).length;
    }
    return 0;
  }

  hasZips(): boolean {
    if (this.exam.zipUrls && this.exam.zipUrls.length > 0) return true;
    return !!this.exam.zipUrl;
  }

  getZipCount(): number {
    if (this.exam.zipUrls && this.exam.zipUrls.length > 0) {
      return this.exam.zipUrls.length;
    }
    if (this.exam.zipUrl) {
      return this.exam.zipUrl.split(',').filter(x => x.trim().length > 0).length;
    }
    return 0;
  }
}
