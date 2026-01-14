import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Job, Jobs } from '../../services/jobs/jobs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  totalJobs = 0;
  remotePositions = 0;
  postedToday = 0;
  isLoading = true;
  hasError = false;

  searchQuery = '';
  selectedLocation = 'All Locations';
  selectedVisaType = 'All Visa Types';
  selectedSource = 'All Sources';

  allJobs: Job[] = [];
  filteredJobs: Job[] = [];

  private readonly STORAGE_KEY = 'job-portal-applied-jobs';

  constructor(private jobsService: Jobs) {}

  ngOnInit() {
    this.loadJobs();
  }

  loadJobs() {
    this.isLoading = true;
    this.hasError = false;

    this.jobsService.getJobs().subscribe({
      next: (response) => {
        if (response?.jobs?.length) {
          this.allJobs = response.jobs.map((job) => ({ ...job, applied: false }));
          this.totalJobs = this.allJobs.length;
          this.calculateStats();
          this.applyFilters();
        }
        this.isLoading = false;
      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
      },
    });

    this.loadAppliedStatus();
  }

  applyFilters() {
    let jobs = [...this.allJobs];

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      jobs = jobs.filter(
        (j) => j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q)
      );
    }

    if (this.selectedLocation !== 'All Locations') {
      jobs = jobs.filter((j) => j.locationType === this.selectedLocation);
    }

    if (this.selectedVisaType !== 'All Visa Types') {
      jobs = jobs.filter((j) => j.visaStatus.includes(this.selectedVisaType));
    }

    if (this.selectedSource !== 'All Sources') {
      jobs = jobs.filter((j) => j.source === this.selectedSource);
    }

    this.filteredJobs = jobs;
    this.totalJobs = this.filteredJobs.length;
    this.remotePositions = this.filteredJobs.filter((j) => j.locationType === 'Remote').length;
  }

  calculateStats() {
    const today = new Date().toDateString();
    this.postedToday = this.allJobs.filter((job) => {
      return new Date(job.postedTime).toDateString() === today;
    }).length;
  }

  onFilterChange() {
    this.applyFilters();
  }

  private loadAppliedStatus() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        const appliedMap: { [id: string]: boolean } = JSON.parse(saved);
        this.allJobs.forEach((job) => {
          if (appliedMap[job.id] !== undefined) {
            job.applied = appliedMap[job.id];
          }
        });
      } catch {}
    }
  }

  private saveAppliedStatus() {
    const appliedMap: { [id: string]: boolean } = {};
    this.allJobs.forEach((job) => {
      appliedMap[job.id] = job.applied;
    });
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(appliedMap));
  }

  toggleApplied(job: Job): void {
    job.applied = !job.applied;
    this.saveAppliedStatus();
  }

  applyJob(job: Job): void {
    if (job.applyUrl) {
      window.open(job.applyUrl, '_blank', 'noopener,noreferrer');
    }
    if (!job.applied) {
      job.applied = true;
      this.saveAppliedStatus();
    }
  }

  get uniqueLocations(): string[] {
    const set = new Set(this.allJobs.map((j) => j.locationType));
    return ['All Locations', ...Array.from(set).sort()];
  }

  get uniqueSources(): string[] {
    const set = new Set(this.allJobs.map((j) => j.source));
    return ['All Sources', ...Array.from(set).sort()];
  }

  get uniqueVisaTypes(): string[] {
    const set = new Set<string>();
    this.allJobs.forEach((job) => job.visaStatus.forEach((v) => set.add(v)));
    return ['All Visa Types', ...Array.from(set).sort()];
  }

  getSourceIconClass(source: string): string {
    const map: Record<string, string> = {
      LinkedIn: 'fab fa-linkedin text-[#0A66C2]',
      Indeed: 'fas fa-search text-[#085FF7]',
      Dice: 'fas fa-code text-[#FF6B00]',
      Glassdoor: 'fas fa-door-open text-[#8FC63F]',
      JSearch: 'fas fa-search text-gray-700',
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
    return styles[type as keyof typeof styles] || { bg: '', text: '', icon: 'fas fa-question' };
  }
}
