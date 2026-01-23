import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {
  constructor(
    private router: Router,
    private authService: Auth,
  ) {}
  onHowItWorks() {
    this.router.navigate(['features']);
  }

  exploreJobs() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['dashboard']);
    } else {
      this.router.navigate(['jobs']);
    }
  }
}
