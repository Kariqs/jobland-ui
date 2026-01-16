import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor(private router: Router) {}

  handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      this.router.navigate(['login']);
    }

    let errorMsg = 'An unknown error occurred!';

    if (error.error?.message) {
      errorMsg = error.error.message;

      if (error.error.details) {
        errorMsg += ` - ${error.error.details}`;
      }
    }

    return throwError(() => new Error(errorMsg));
  }
}
