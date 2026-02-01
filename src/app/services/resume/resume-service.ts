import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ErrorHandlerService } from '../../utils/error.handler.util';
import { HttpClient } from '@angular/common/http';
import {
  GetResumeResponse,
  GetResumesResponse,
  Resume,
  TailorResumeInfo,
  TailorResumeResponse,
  UpdateResumeResponse,
} from '../../types/resume.types';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResumeService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService,
  ) {}

  getResumesByUserId(): Observable<GetResumesResponse> {
    return this.http
      .get<GetResumesResponse>(`${environment.apiUrl}/api/resumes/get-resumes`)
      .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }

  getResumeByUserAndResumeId(resumeId: string): Observable<GetResumeResponse> {
    return this.http
      .get<GetResumeResponse>(`${this.apiUrl}/api/resumes/get-resume/${resumeId}`)
      .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }

  updateResumeByUserAndResumeId(
    resumeId: string,
    resumeInfo: Resume,
  ): Observable<UpdateResumeResponse> {
    return this.http
      .put<UpdateResumeResponse>(`${this.apiUrl}/api/resumes/update-resume/${resumeId}`, resumeInfo)
      .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }

  tailorResume(tailorResumeInfo: TailorResumeInfo): Observable<TailorResumeResponse> {
    return this.http
      .post<TailorResumeResponse>(`${this.apiUrl}/api/resumes/tailor-resume`, tailorResumeInfo)
      .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }
}
