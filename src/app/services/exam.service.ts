import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService, User } from './auth.service';

export interface Subject {
  id: number;
  code: string;
  name: string;
  category: string;
  description?: string;
  icon?: string;
}

export interface Exam {
  id: number;
  title: string; // Mã đề thi
  subjectId: number;
  subjectCode: string;
  subjectName: string;
  subjectCategory: string;
  examType: 'PE' | 'FE' | 'QUIZ' | 'PT' | 'MIDTERM' | string;
  semester: string;
  durationMinutes?: number;
  totalMarks?: number;
  difficulty?: string;
  description?: string;
  content?: string;
  solution?: string;
  fileUrl?: string;
  imageUrl?: string;
  imageUrls?: string[]; // Danh sách tất cả ảnh đề thi
  zipUrl?: string;
  zipUrls?: string[]; // Danh sách tất cả file zip given code
  viewsCount: number;
  downloadsCount: number;
  likesCount: number;
  authorId: number;
  authorName: string;
  authorAvatar?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Comment {
  id: number;
  examId: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  userMssv?: string;
  userRole?: string;
  content: string;
  imageIndex?: number | null; // Gắn bình luận cho ảnh cụ thể
  createdAt: string;
}

export interface DashboardStats {
  totalExams: number;
  totalUsers: number;
  totalViews: number;
  totalDownloads: number;
  totalLikes: number;
  examsByType: { [key: string]: number };
  examsBySubject: { [key: string]: number };
}

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private readonly BASE_URL = 'http://localhost:8081/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getExams(filters?: { examType?: string; subjectId?: number; semester?: string; search?: string }): Observable<Exam[]> {
    let params = new HttpParams();
    if (filters?.examType && filters.examType !== 'ALL') params = params.set('examType', filters.examType);
    if (filters?.subjectId) params = params.set('subjectId', filters.subjectId.toString());
    if (filters?.semester && filters.semester !== 'ALL') params = params.set('semester', filters.semester);
    if (filters?.search) params = params.set('search', filters.search);

    return this.http.get<Exam[]>(`${this.BASE_URL}/exams`, { params });
  }

  getSemesters(): Observable<string[]> {
    return this.http.get<string[]>(`${this.BASE_URL}/exams/semesters`);
  }

  getExamById(id: number): Observable<Exam> {
    return this.http.get<Exam>(`${this.BASE_URL}/exams/${id}`);
  }

  createExam(examData: {
    examCode?: string;
    title?: string;
    subjectCode?: string;
    subjectId?: number;
    examType: string;
    semester: string;
    imageUrl?: string;
    imageUrls?: string[];
    zipUrl?: string;
    zipUrls?: string[];
    solution?: string;
  }): Observable<Exam> {
    return this.http.post<Exam>(`${this.BASE_URL}/exams`, examData, {
      headers: this.authService.getAuthHeaders()
    });
  }

  updateExam(id: number, examData: Partial<Exam> & { examCode?: string; subjectCode?: string; imageUrls?: string[]; zipUrls?: string[] }): Observable<Exam> {
    return this.http.put<Exam>(`${this.BASE_URL}/exams/${id}`, examData, {
      headers: this.authService.getAuthHeaders()
    });
  }

  deleteExam(id: number): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/exams/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  uploadImage(file: File): Observable<{ url: string; fileName: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string; fileName: string }>(`${this.BASE_URL}/upload/image`, formData);
  }

  uploadMultipleImages(files: File[]): Observable<{ uploaded: { url: string; fileName: string; originalName: string }[]; count: number }> {
    const formData = new FormData();
    files.forEach(f => formData.append('files', f));
    return this.http.post<{ uploaded: { url: string; fileName: string; originalName: string }[]; count: number }>(`${this.BASE_URL}/upload/images`, formData);
  }

  uploadZip(file: File): Observable<{ url: string; fileName: string; size: number }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string; fileName: string; size: number }>(`${this.BASE_URL}/upload/zip`, formData);
  }

  uploadMultipleZips(files: File[]): Observable<{ uploaded: { url: string; fileName: string; originalName: string }[]; count: number }> {
    const formData = new FormData();
    files.forEach(f => formData.append('files', f));
    return this.http.post<{ uploaded: { url: string; fileName: string; originalName: string }[]; count: number }>(`${this.BASE_URL}/upload/zips`, formData);
  }

  downloadExam(id: number): Observable<any> {
    return this.http.post(`${this.BASE_URL}/exams/${id}/download`, {});
  }

  likeExam(id: number): Observable<{ likes: number }> {
    return this.http.post<{ likes: number }>(`${this.BASE_URL}/exams/${id}/like`, {});
  }

  getComments(examId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.BASE_URL}/exams/${examId}/comments`);
  }

  addComment(examId: number, content: string, imageIndex?: number | null): Observable<Comment> {
    return this.http.post<Comment>(`${this.BASE_URL}/exams/${examId}/comments`, { content, imageIndex }, {
      headers: this.authService.getAuthHeaders()
    });
  }

  deleteComment(commentId: number): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/exams/comments/${commentId}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${this.BASE_URL}/subjects`);
  }

  // Admin APIs
  getAdminUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.BASE_URL}/admin/users`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  updateAdminUser(id: number, data: { fullName?: string; mssv?: string; role?: string; status?: string }): Observable<User> {
    return this.http.put<User>(`${this.BASE_URL}/admin/users/${id}`, data, {
      headers: this.authService.getAuthHeaders()
    });
  }

  deleteAdminUser(id: number): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/admin/users/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getAdminStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.BASE_URL}/admin/stats`, {
      headers: this.authService.getAuthHeaders()
    });
  }
}
