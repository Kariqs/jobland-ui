import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Job {
  id: string;
  title: string;
  company: string;
  postedTime: string;
  locationType: 'Remote' | 'Hybrid' | 'Onsite' | 'Unknown';
  visaStatus: string[];
  source: string;
  applyUrl: string;
  applied: boolean;
}

export interface JobResponse {
  success: boolean;
  count: number;
  jobs: Job[];
  hasMore?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class Jobs {
  private apiUrl = environment.apiUrl; // e.g. 'http://localhost:3001/api/jobs'

  constructor(private http: HttpClient, private router: Router) {}

  getJobs(query: string = '', page: number = 1): Observable<JobResponse> {
    const params = new URLSearchParams();
    if (query.trim()) params.append('query', query.trim());
    params.append('page', page.toString());

    const url = params.toString() ? `${this.apiUrl}?${params.toString()}` : this.apiUrl;

    return this.http.get<JobResponse>(url).pipe(catchError((error) => this.handleError(error)));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      this.router.navigate(['/login']);
    }

    let errorMsg = 'An unknown error occurred!';
    if (error.error?.message) {
      errorMsg = error.error.message;
      if (error.error.details) errorMsg += ` - ${error.error.details}`;
    }

    return throwError(() => new Error(errorMsg));
  }
}
