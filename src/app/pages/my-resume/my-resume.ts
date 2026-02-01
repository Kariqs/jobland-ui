import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { GetResumesResponse, ResumeListItem } from '../../types/resume.types';
import { ResumeService } from '../../services/resume/resume-service';

@Component({
  selector: 'app-resume-upload',
  templateUrl: './my-resume.html',
  styleUrls: ['./my-resume.css'],
  imports: [FormsModule, ReactiveFormsModule],
})
export class ResumeUpload implements OnInit {
  uploadForm: FormGroup;
  isUploading = false;
  uploadSuccess = false;
  uploadError: string | null = null;

  resumes: ResumeListItem[] = [];
  isLoadingResumes = true;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private resumeService: ResumeService,
  ) {
    this.uploadForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      resume: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadUserResumes();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadForm.patchValue({ resume: input.files[0] });
      this.uploadForm.get('resume')?.updateValueAndValidity();
    }
  }

  onSubmit(): void {
    if (this.uploadForm.invalid) {
      this.uploadForm.markAllAsTouched();
      return;
    }

    this.isUploading = true;
    this.uploadSuccess = false;
    this.uploadError = null;

    const formData = new FormData();
    formData.append('title', this.uploadForm.get('title')!.value);
    formData.append('resume', this.uploadForm.get('resume')!.value);

    this.http
      .post<{
        message: string;
        resume: ResumeListItem;
      }>(`${environment.apiUrl}/api/resumes/upload-resume`, formData)
      .subscribe({
        next: (response) => {
          this.isUploading = false;
          this.uploadSuccess = true;
          this.uploadForm.reset();
          this.loadUserResumes();
          setTimeout(() => (this.uploadSuccess = false), 5000);
        },
        error: (err) => {
          this.isUploading = false;
          this.uploadError = err.error?.error || 'Failed to upload resume. Please try again.';
        },
      });
  }

  loadUserResumes(): void {
    this.isLoadingResumes = true;
    this.resumeService.getResumesByUserId().subscribe({
      next: (response) => {
        this.resumes = response.resumes;
        this.isLoadingResumes = false;
      },
      error: () => {
        this.isLoadingResumes = false;
      },
    });
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  editResume(resumeId: string) {
    this.router.navigate(['edit-resume'], { queryParams: { id: resumeId } });
  }

  previewResume(resumeId: string) {
    this.router.navigate(['preview-resume'], { queryParams: { id: resumeId } });
  }

  tailorResume(resumeId: string, resumeTitle: string) {
    this.router.navigate(['tailor-resume'], { queryParams: { id: resumeId, title: resumeTitle } });
  }

  deleteResume(resumeId: string, resumeTitle: string) {
    const confirmed = confirm(
      `Are you sure you want to delete "${resumeTitle}"?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) return;

    this.resumeService.deleteResume(resumeId).subscribe({
      next: (response) => {
        this.resumes = this.resumes.filter((r) => r._id !== resumeId);
        this.isLoadingResumes = false;
      },
      error: (err) => {
        this.isLoadingResumes = false;
        alert(err.error?.error || 'Failed to delete resume');
        console.error('Delete error:', err);
      },
    });
  }
}
