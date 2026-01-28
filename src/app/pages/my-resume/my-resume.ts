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

interface ResumeListItem {
  id: string;
  title: string;
  originalFileName: string;
  parsedName?: string;
  createdAt: string;
}

interface GetResumeResponse {
  messsage: string;
  resumes: ResumeListItem[];
}

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
          // Refresh list
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
    this.http.get<GetResumeResponse>(`${environment.apiUrl}/api/resumes/get-resumes`).subscribe({
      next: (response) => {
        this.resumes = response.resumes;
        this.isLoadingResumes = false;
      },
      error: () => {
        this.isLoadingResumes = false;
        // You can show error toast/notification here
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
}
