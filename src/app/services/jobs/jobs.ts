import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  FetchJobsResponse,
  JobResponse,
  SaveJobInfo,
  SaveJobResponse,
} from '../../types/jobs.types';
import { ErrorHandlerService } from '../../utils/error.handler.util';

@Injectable({
  providedIn: 'root',
})
export class Jobs {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService,
  ) {}

  getTeaserJobs(query: string = '', page: number = 1): Observable<JobResponse> {
    const params = new URLSearchParams();
    if (query.trim()) params.append('query', query.trim());
    params.append('page', page.toString());

    const url = params.toString()
      ? `${this.apiUrl}/api/jobs/teaser-jobs?${params.toString()}`
      : this.apiUrl;

    return this.http
      .get<JobResponse>(url)
      .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }

  getJobs(query: string = '', page: number = 1): Observable<JobResponse> {
    const params = new URLSearchParams();
    if (query.trim()) params.append('query', query.trim());
    params.append('page', page.toString());

    const url = params.toString() ? `${this.apiUrl}/api/jobs?${params.toString()}` : this.apiUrl;

    return this.http
      .get<JobResponse>(url)
      .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }

  saveAppliedJob(jobInfo: SaveJobInfo): Observable<SaveJobResponse> {
    return this.http
      .post<SaveJobResponse>(`${this.apiUrl}/api/jobs/save-job`, jobInfo)
      .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }

  fetchSavedJobs(): Observable<FetchJobsResponse> {
    return this.http
      .get<FetchJobsResponse>(`${this.apiUrl}/api/jobs/fetch-jobs`)
      .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }
}
