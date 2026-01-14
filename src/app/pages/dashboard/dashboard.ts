import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Job, Jobs, JobResponse } from '../../services/jobs/jobs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  jobs: Job[] = [];  // current page only
  isLoading = false;
  hasError = false;

  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  hasMore = true;

  searchQuery = '';
  selectedLocation = 'All Locations';
  selectedVisaType = 'All Visa Types';
  selectedSource = 'All Sources';

  totalJobs = 0;
  remotePositions = 0;
  postedToday = 0;

  // Accumulated filter options across all pages
  private seenLocations = new Set<string>(['All Locations']);
  private seenSources = new Set<string>(['All Sources']);
  private seenVisaTypes = new Set<string>(['All Visa Types']);

  private readonly STORAGE_KEY = 'job-portal-applied-jobs';

  constructor(private jobsService: Jobs) {}

  ngOnInit() {
    this.fetchJobs();
  }

  fetchJobs(page: number = this.currentPage) {
    this.isLoading = true;
    this.hasError = false;

    this.jobsService.getJobs(this.searchQuery, page).subscribe({
      next: (response: JobResponse) => {
        if (response?.success && response.jobs?.length) {
          this.jobs = response.jobs.map(job => ({ ...job, applied: false }));

          // Update accumulated filter options
          this.jobs.forEach(job => {
            this.seenLocations.add(job.locationType);
            this.seenSources.add(job.source);
            job.visaStatus.forEach(v => this.seenVisaTypes.add(v));
          });

          this.hasMore = response.jobs.length === this.pageSize;
          this.totalPages = this.hasMore ? this.currentPage + 10 : this.currentPage;

          this.updateStats();
          this.applyFilters();
        } else {
          this.jobs = [];
          this.resetStats();
        }
        this.isLoading = false;
      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
      }
    });

    this.loadAppliedStatus();
  }

  goToPage(page: number) {
    if (page < 1 || (!this.hasMore && page > this.currentPage)) return;
    this.currentPage = page;
    this.fetchJobs(page);
  }

  previousPage() {
    if (this.currentPage > 1) this.goToPage(this.currentPage - 1);
  }

  nextPage() {
    if (this.hasMore) this.goToPage(this.currentPage + 1);
  }

  onSearchSubmit() {
    this.currentPage = 1;
    this.fetchJobs(1);
  }

  applyFilters() {
    let filtered = [...this.jobs];

    if (this.selectedLocation !== 'All Locations') {
      filtered = filtered.filter(j => j.locationType === this.selectedLocation);
    }

    if (this.selectedVisaType !== 'All Visa Types') {
      filtered = filtered.filter(j => j.visaStatus.includes(this.selectedVisaType));
    }

    if (this.selectedSource !== 'All Sources') {
      filtered = filtered.filter(j => j.source === this.selectedSource);
    }

    this.jobs = filtered.sort((a, b) =>
      new Date(b.postedTime).getTime() - new Date(a.postedTime).getTime()
    );

    this.totalJobs = this.jobs.length;
    this.remotePositions = this.jobs.filter(j => j.locationType === 'Remote').length;
  }

  updateStats() {
    const today = new Date().toDateString();
    this.postedToday = this.jobs.filter(job =>
      new Date(job.postedTime).toDateString() === today
    ).length;
    this.totalJobs = this.jobs.length;
    this.remotePositions = this.jobs.filter(j => j.locationType === 'Remote').length;
  }

  resetStats() {
    this.totalJobs = 0;
    this.remotePositions = 0;
    this.postedToday = 0;
  }

  onFilterChange() {
    this.applyFilters();
  }

  private loadAppliedStatus() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        const map: { [id: string]: boolean } = JSON.parse(saved);
        this.jobs.forEach(job => {
          if (map[job.id] !== undefined) job.applied = map[job.id];
        });
      } catch {}
    }
  }

  toggleApplied(job: Job): void {
    job.applied = !job.applied;
    this.saveAppliedStatus();
  }

  private saveAppliedStatus() {
    const map: { [id: string]: boolean } = {};
    this.jobs.forEach(job => map[job.id] = job.applied);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(map));
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
    return Array.from(this.seenLocations).sort();
  }

  get uniqueSources(): string[] {
    return Array.from(this.seenSources).sort();
  }

  get uniqueVisaTypes(): string[] {
    return Array.from(this.seenVisaTypes).sort();
  }

  getSourceIconClass(source: string): string {
    const map: Record<string, string> = {
      LinkedIn: 'fab fa-linkedin text-[#0A66C2]',
      Indeed: 'fas fa-search text-[#085FF7]',
      Dice: 'fas fa-code text-[#FF6B00]',
      Glassdoor: 'fas fa-door-open text-[#8FC63F]',
      SmartRecruiters: 'fas fa-briefcase text-blue-600',
      SimplyHired: 'fas fa-search text-green-600',
      Talent: 'fas fa-briefcase text-indigo-600'
    };
    return map[source] || 'fas fa-briefcase text-gray-600';
  }

  getLocationStyles(type: string): { bg: string; text: string; icon: string } {
    const styles = {
      Remote:   { bg: 'bg-green-50',  text: 'text-green-700', icon: 'fas fa-globe' },
      Hybrid:   { bg: 'bg-purple-50', text: 'text-purple-700', icon: 'fas fa-house-user' },
      Onsite:   { bg: 'bg-orange-50', text: 'text-orange-700', icon: 'fas fa-map-marker-alt' },
      Unknown:  { bg: 'bg-gray-50',   text: 'text-gray-700', icon: 'fas fa-question' }
    };
    return styles[type as keyof typeof styles] || { bg: '', text: '', icon: 'fas fa-question' };
  }
}