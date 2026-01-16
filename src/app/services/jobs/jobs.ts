import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { JobResponse } from '../../types/jobs.types';
import { ErrorHandlerService } from '../../utils/error.handler.util';

@Injectable({
  providedIn: 'root',
})
export class Jobs {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) {}

  getJobs(query: string = '', page: number = 1): Observable<JobResponse> {
    const params = new URLSearchParams();
    if (query.trim()) params.append('query', query.trim());
    params.append('page', page.toString());

    const url = params.toString() ? `${this.apiUrl}/api/jobs?${params.toString()}` : this.apiUrl;

    return this.http
      .get<JobResponse>(url)
      .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }
}
