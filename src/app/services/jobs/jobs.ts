import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Job {
  id: number;
  title: string;
  company: string;
  postedTime: string;
  locationType: 'Remote' | 'Hybrid' | 'Onsite';
  visaStatus: string[];
  source: string;
  applyUrl: string;
  applied: boolean;
}

export interface JobResponse {
  success: boolean;
  count: number;
  jobs: Job[];
}

@Injectable({
  providedIn: 'root',
})
export class Jobs {
  apiUrl = environment.apiUrl;
  constructor(private http: HttpClient, private router: Router) {}

  getJobs(): Observable<JobResponse> {
    return this.http
      .get<JobResponse>(this.apiUrl)
      .pipe(catchError((error) => this.handleError(error)));
  }

  public handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      this.router.navigate(['login']);
    }

    let errorMsg = 'An unknown error occurred!';

    if (error.error) {
      if (error.error.message) {
        errorMsg = error.error.message;
      }
      if (error.error.details) {
        errorMsg += ` - ${error.error.details}`;
      }
    }
    return throwError(() => new Error(errorMsg));
  }
}
