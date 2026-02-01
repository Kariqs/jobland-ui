import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ResumeService } from '../../../services/resume/resume-service';

@Component({
  selector: 'app-tailor-resume',
  templateUrl: './tailor-resume.html',
  styleUrls: ['./tailor-resume.css'],
  imports: [ReactiveFormsModule],
})
export class TailorResumeComponent implements OnInit {
  tailorForm: FormGroup;
  resumeId: string | null = null;
  targetTitle: string | null = null;
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private resumeService: ResumeService,
  ) {
    this.tailorForm = this.fb.group({
      jobDescription: ['', [Validators.required, Validators.minLength(100)]],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.resumeId = params['id'] || null;
      this.targetTitle = params['title'] ? decodeURIComponent(params['title']) : null;

      if (!this.resumeId) {
        this.errorMessage = 'No resume selected. Please go back and choose a resume.';
        this.tailorForm.disable();
      }

      if (!this.targetTitle?.trim()) {
        this.errorMessage = 'No title provided for the tailored resume.';
        this.tailorForm.disable();
      }
    });
  }

  get jobDescription() {
    return this.tailorForm.get('jobDescription');
  }

  onSubmit(): void {
    if (this.tailorForm.invalid || !this.resumeId || !this.targetTitle?.trim()) {
      this.tailorForm.markAllAsTouched();

      if (!this.targetTitle?.trim()) {
        this.errorMessage = 'Missing title for the tailored resume (should come from query params)';
      }
      return;
    }

    this.isLoading = true;
    this.successMessage = null;
    this.errorMessage = null;

    const tailorResumeInfo = {
      resumeId: this.resumeId,
      resumeTitle: this.targetTitle.trim(),
      jobDescription: this.jobDescription?.value.trim() || '',
    };

    this.resumeService.tailorResume(tailorResumeInfo).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage =
          response.message || `Tailored resume "${this.targetTitle}" created successfully!`;
        setTimeout(
          () => this.router.navigate(['edit-resume'], { queryParams: { id: response.resume.id } }),
          2400,
        );
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage =
          err.error?.error || err.message || 'Failed to create tailored resume. Please try again.';
        console.error('Tailor request failed:', err);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['generate-resume']);
  }
}
