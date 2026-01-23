import { Component, inject, OnInit } from '@angular/core';
import { Jobs } from '../../services/jobs/jobs';
import { Auth } from '../../services/auth/auth';
import { Job, JobResponse } from '../../types/jobs.types';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-teaser',
  templateUrl: './teaser-dashboard.html',
  styleUrls: ['./teaser-dashboard.css'],
  imports: [CommonModule],
})
export class JobTeaserComponent implements OnInit {
  jobs: Job[] = [];
  isLoading = false;
  hasError = false;

  totalJobs = 0;
  remotePositions = 0;
  postedToday = 0;

  private readonly STORAGE_KEY = 'job-portal-applied-jobs';

  router = inject(Router);
  jobsService = inject(Jobs);
  authService = inject(Auth);

  ngOnInit(): void {
    this.fetchTeaserJobs();
  }

  fetchTeaserJobs(): void {
    this.isLoading = true;
    this.hasError = false;

    this.jobsService.getTeaserJobs().subscribe({
      next: (response: JobResponse) => {
        let fetchedJobs = response?.success && response.jobs ? response.jobs : [];
        fetchedJobs = fetchedJobs.slice(0, 3);
        this.jobs = fetchedJobs.map((job) => ({
          ...job,
          applied: false,
        }));

        if (this.authService.isAuthenticated()) {
          this.loadAppliedStatus();
        }

        this.updateStats();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Teaser jobs fetch error:', err);
        this.hasError = true;
        this.isLoading = false;
      },
    });
  }

  private loadAppliedStatus(): void {
    if (!this.authService.isAuthenticated()) return;

    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (!saved) return;

    try {
      const map: { [id: string]: boolean } = JSON.parse(saved);
      this.jobs.forEach((job) => {
        if (map[job.id] !== undefined) {
          job.applied = map[job.id];
        }
      });
    } catch (e) {
      console.warn('Failed to parse applied jobs from storage', e);
    }
  }

  toggleApplied(job: Job): void {
    if (!this.authService.isAuthenticated()) {
      // Optional: you can show a toast/snackbar here instead of doing nothing
      // e.g. this.snackBar.open('Sign in to save application status', 'OK', { duration: 4000 });
      return;
    }

    job.applied = !job.applied;
    this.saveAppliedStatus();
  }

  private saveAppliedStatus(): void {
    if (!this.authService.isAuthenticated()) return;

    const map: { [id: string]: boolean } = {};
    this.jobs.forEach((job) => {
      map[job.id] = job.applied;
    });

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(map));
  }

  applyJob(job: Job): void {
    if (job.applyUrl && job.applyUrl !== '#') {
      window.open(job.applyUrl, '_blank', 'noopener,noreferrer');
    }

    if (this.authService.isAuthenticated() && !job.applied) {
      job.applied = true;
      this.saveAppliedStatus();
    }
  }

  updateStats(): void {
    const today = new Date().toDateString();

    this.postedToday = this.jobs.filter(
      (job) => new Date(job.postedTime).toDateString() === today,
    ).length;

    this.totalJobs = this.jobs.length;
    this.remotePositions = this.jobs.filter((j) => j.locationType === 'Remote').length;
  }

  getSourceIconClass(source: string): string {
    const map: Record<string, string> = {
      LinkedIn: 'fab fa-linkedin text-[#0A66C2]',
      Indeed: 'fas fa-search text-[#085FF7]',
      Dice: 'fas fa-code text-[#FF6B00]',
      Glassdoor: 'fas fa-door-open text-[#8FC63F]',
      SmartRecruiters: 'fas fa-briefcase text-blue-600',
      SimplyHired: 'fas fa-search text-green-600',
      Talent: 'fas fa-briefcase text-indigo-600',
    };
    return map[source] || 'fas fa-briefcase text-gray-600';
  }

  getLocationStyles(type: string): { bg: string; text: string; icon: string } {
    const styles = {
      Remote: { bg: 'bg-green-50', text: 'text-green-700', icon: 'fas fa-globe' },
      Hybrid: { bg: 'bg-purple-50', text: 'text-purple-700', icon: 'fas fa-house-user' },
      Onsite: { bg: 'bg-orange-50', text: 'text-orange-700', icon: 'fas fa-map-marker-alt' },
      Unknown: { bg: 'bg-gray-50', text: 'text-gray-700', icon: 'fas fa-question' },
    };

    return (
      styles[type as keyof typeof styles] || {
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        icon: 'fas fa-question',
      }
    );
  }

  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  login() {
    this.router.navigate(['login']);
  }
}
