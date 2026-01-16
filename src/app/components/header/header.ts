import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Auth, UserInfo } from '../../services/auth/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header {
  private auth = inject(Auth);
  private router = inject(Router);

  currentUser = signal<UserInfo | null>(null);
  isAuthenticated = computed(() => this.auth.isAuthenticated() && this.currentUser() !== null);

  isMenuOpen = signal(false);
  isDropdownOpen = signal(false);

  constructor() {
    this.loadUser();
  }

  loadUser() {
    if (this.auth.isAuthenticated()) {
      const user = this.auth.getUserInfo();
      this.currentUser.set(user);
    } else {
      this.currentUser.set(null);
    }
  }

  toggleMenu() {
    this.isMenuOpen.update((v) => !v);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  toggleDropdown() {
    this.isDropdownOpen.update((v) => !v);
  }

  goHome() {
    this.router.navigate(['']);
    this.closeMenu();
  }

  getStarted() {
    this.router.navigate(['/signup']);
    this.closeMenu();
  }

  login() {
    this.router.navigate(['/login']);
    this.closeMenu();
  }

  logout() {
    this.auth.logout();
    this.currentUser.set(null);
    this.isDropdownOpen.set(false);
    this.closeMenu();
  }

  getInitials(): string {
    const user = this.currentUser();
    if (!user?.fullname) return 'U';

    const names = user.fullname.trim().split(/\s+/);
    const first = names[0]?.charAt(0) || '';
    const last = names.length > 1 ? names[names.length - 1].charAt(0) : '';
    return (first + last).toUpperCase();
  }

  closeDropdownIfOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-avatar-container')) {
      this.isDropdownOpen.set(false);
    }
  }
}
