import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../../services/auth/auth';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-activation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activate.html',
  styleUrls: ['./activate.css'],
})
export class AccountActivationComponent implements OnInit {
  status: 'loading' | 'success' | 'error' = 'loading';
  errorMessage = '';
  successMessage = '';
  email: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: Auth,
    private toaster: ToastrService
  ) {}

  ngOnInit() {
    this.email = this.route.snapshot.queryParamMap.get('email');
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!this.email) {
      this.toaster.error('Missing email');
      return;
    }

    if (!token) {
      this.toaster.error('Missing activation token');
      return;
    }

    this.activateAccount(this.email, token);
  }

  private activateAccount(email: string, token: string) {
    this.status = 'loading';

    this.authService.activateAccount({ email: email, token: token }).subscribe({
      next: (response) => {
        if (response) {
          this.status = 'success';
          this.successMessage = response.message;
          setTimeout(() => {
            this.router.navigate(['login']);
          }, 3000);
        }
      },
      error: (error) => {
        this.status = 'error';
        this.errorMessage = error.message;
        setTimeout(() => {
          this.router.navigate(['']);
        }, 3000);
      },
    });
  }
}
