import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import * as XLSX from 'xlsx';
import { Jobs } from '../../services/jobs/jobs';

export interface SaveJobInfo {
  title: string;
  company: string;
  locationType: 'Remote' | 'Hybrid' | 'Onsite' | 'Unknown';
  source: string;
}

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './applications.html',
})
export class Applications implements OnInit {
  appliedJobs: SaveJobInfo[] = [];
  filteredJobs: SaveJobInfo[] = [];
  isLoading = false;

  searchQuery = '';
  selectedLocationType = '';

  jobsService = inject(Jobs);

  get remoteJobsCount(): number {
    return this.appliedJobs.filter((job) => job.locationType === 'Remote').length;
  }

  get hybridJobsCount(): number {
    return this.appliedJobs.filter((job) => job.locationType === 'Hybrid').length;
  }

  get onsiteJobsCount(): number {
    return this.appliedJobs.filter((job) => job.locationType === 'Onsite').length;
  }

  ngOnInit() {
    this.loadAppliedJobs();
  }

  loadAppliedJobs() {
    this.isLoading = true;
    this.jobsService.fetchSavedJobs().subscribe({
      next: (response) => {
        this.appliedJobs = response.jobs;
        this.filteredJobs = [...this.appliedJobs];
        this.isLoading = false;
      },
      error: (error) => {
        console.log(error.message);
        this.isLoading = false;
      },
    });
  }

  filterJobs() {
    this.filteredJobs = this.appliedJobs.filter((job) => {
      const matchesSearch =
        !this.searchQuery ||
        job.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesLocation =
        !this.selectedLocationType || job.locationType === this.selectedLocationType;

      return matchesSearch && matchesLocation;
    });
  }

  removeApplication(job: SaveJobInfo) {
    if (
      confirm(`Are you sure you want to remove your application to ${job.title} at ${job.company}?`)
    ) {
      // TODO: Call API to remove application
      this.appliedJobs = this.appliedJobs.filter((j) => j !== job);
      this.filterJobs();
    }
  }

  exportToExcel() {
    if (this.appliedJobs.length === 0) {
      return;
    }

    // Prepare data for Excel
    const exportData = this.appliedJobs.map((job, index) => ({
      '#': index + 1,
      'Job Title': job.title,
      Company: job.company,
      'Location Type': job.locationType,
      Source: job.source,
    }));

    // Create worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    ws['!cols'] = [
      { wch: 5 }, // #
      { wch: 40 }, // Job Title
      { wch: 25 }, // Company
      { wch: 15 }, // Location Type
      { wch: 20 }, // Source
    ];

    // Create workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Applied Jobs');

    // Generate filename with current date
    const date = new Date().toISOString().split('T')[0];
    const filename = `applied-jobs-${date}.xlsx`;

    // Save file
    XLSX.writeFile(wb, filename);
  }

  getLocationStyles(locationType: string) {
    switch (locationType) {
      case 'Remote':
        return {
          bg: 'bg-green-100',
          text: 'text-green-700',
          icon: 'fas fa-home',
        };
      case 'Hybrid':
        return {
          bg: 'bg-purple-100',
          text: 'text-purple-700',
          icon: 'fas fa-building',
        };
      case 'Onsite':
        return {
          bg: 'bg-orange-100',
          text: 'text-orange-700',
          icon: 'fas fa-map-marker-alt',
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-700',
          icon: 'fas fa-question-circle',
        };
    }
  }

  getSourceIconClass(source: string): string {
    const sourceLower = source.toLowerCase();
    if (sourceLower.includes('linkedin')) {
      return 'fab fa-linkedin text-blue-600';
    } else if (sourceLower.includes('indeed')) {
      return 'fas fa-briefcase text-blue-700';
    } else if (sourceLower.includes('glassdoor')) {
      return 'fas fa-door-open text-green-600';
    } else if (sourceLower.includes('monster')) {
      return 'fas fa-monster text-purple-600';
    } else if (sourceLower.includes('dice')) {
      return 'fas fa-dice text-red-600';
    } else if (sourceLower.includes('ziprecruiter')) {
      return 'fas fa-zip text-green-600';
    } else if (sourceLower.includes('angel')) {
      return 'fas fa-angel text-indigo-600';
    } else if (sourceLower.includes('github')) {
      return 'fab fa-github text-gray-800';
    } else if (sourceLower.includes('stack overflow') || sourceLower.includes('stackoverflow')) {
      return 'fab fa-stack-overflow text-orange-600';
    } else if (sourceLower.includes('twitter') || sourceLower.includes('x.com')) {
      return 'fab fa-twitter text-blue-400';
    } else {
      return 'fas fa-globe text-gray-600';
    }
  }
}
