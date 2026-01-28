import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Resume } from '../../../types/resume.types';
import { ResumeService } from '../../../services/resume/resume-service';

@Component({
  selector: 'app-resume-preview',
  templateUrl: './resume-preview.html',
  styleUrls: ['./resume-preview.css'],
})
export class ResumePreviewComponent implements OnInit {
  @ViewChild('resumeContent') resumeContent!: ElementRef;

  resume: Resume | null = null;
  resumeId: string = '';
  isLoading: boolean = false;
  isGeneratingPDF: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private resumeService: ResumeService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.resumeId = params['id'];
      if (this.resumeId) {
        this.loadResume(this.resumeId);
      }
    });
  }

  loadResume(id: string): void {
    this.isLoading = true;

    this.resumeService.getResumeByUserAndResumeId(id).subscribe({
      next: (response) => {
        this.resume = response.resume;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading resume:', error);
        this.isLoading = false;
      },
    });
  }

  async downloadPDF(): Promise<void> {
    if (!this.resume) return;

    this.isGeneratingPDF = true;
  }

  onEdit(): void {
    this.router.navigate(['edit-resume'], { queryParams: { id: this.resumeId } });
  }

  onBack(): void {
    this.router.navigate(['/generate-resume']);
  }
}
