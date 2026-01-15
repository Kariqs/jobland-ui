import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

interface ProfessionOption {
  value: string;
  label: string;
}

interface ExperienceLevel {
  value: string;
  label: string;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.html',
  styleUrls: ['./signup.css'],
  imports: [ReactiveFormsModule],
})
export class Signup implements OnInit {
  signupForm!: FormGroup;
  currentStep: number = 1;
  totalSteps: number = 3;
  selectedPlan: string = 'free';
  isLoading: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  professions: ProfessionOption[] = [
    { value: 'software-engineer', label: 'Software Engineer' },
    { value: 'data-scientist', label: 'Data Scientist' },
    { value: 'product-manager', label: 'Product Manager' },
    { value: 'designer', label: 'Designer (UI/UX)' },
    { value: 'marketing', label: 'Marketing Specialist' },
    { value: 'sales', label: 'Sales Professional' },
    { value: 'business-analyst', label: 'Business Analyst' },
    { value: 'project-manager', label: 'Project Manager' },
    { value: 'devops', label: 'DevOps Engineer' },
    { value: 'qa-engineer', label: 'QA Engineer' },
    { value: 'content-writer', label: 'Content Writer' },
    { value: 'accountant', label: 'Accountant' },
    { value: 'hr-specialist', label: 'HR Specialist' },
    { value: 'customer-support', label: 'Customer Support' },
    { value: 'other', label: 'Other' },
  ];

  experienceLevels: ExperienceLevel[] = [
    { value: 'entry', label: 'Entry Level (0-2 years)' },
    { value: 'mid', label: 'Mid Level (3-5 years)' },
    { value: 'senior', label: 'Senior (6-10 years)' },
    { value: 'lead', label: 'Lead/Principal (10+ years)' },
  ];

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['plan']) {
        this.selectedPlan = params['plan'];
      }
    });

    this.initializeForm();
  }

  initializeForm(): void {
    this.signupForm = this.fb.group({
      //Basic Info
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],

      //Professional Info
      profession: ['', Validators.required],
      otherProfession: [''],
      experienceLevel: ['', Validators.required],
      currentLocation: ['', Validators.required],
      skills: [''],

      //Job Preferences
      desiredLocations: [''],
      salaryExpectation: [''],
      needsVisaSponsorship: [false],
      remoteWork: ['any'],
      jobType: ['full-time'],

      // Terms
      agreeToTerms: [false, Validators.requiredTrue],
    });
    
    this.signupForm.get('profession')?.valueChanges.subscribe((value) => {
      const otherProfessionControl = this.signupForm.get('otherProfession');
      if (value === 'other') {
        otherProfessionControl?.setValidators([Validators.required]);
      } else {
        otherProfessionControl?.clearValidators();
      }
      otherProfessionControl?.updateValueAndValidity();
    });
  }

  get f() {
    return this.signupForm.controls;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  isProfessionOther(): boolean {
    return this.f['profession'].value === 'other';
  }

  nextStep(): void {
    if (this.currentStep === 1) {
      if (
        this.f['fullName'].invalid ||
        this.f['email'].invalid ||
        this.f['password'].invalid ||
        this.f['confirmPassword'].invalid
      ) {
        this.markStepFieldsAsTouched(1);
        return;
      }
      if (this.f['password'].value !== this.f['confirmPassword'].value) {
        return;
      }
    }

    if (this.currentStep === 2) {
      if (
        this.f['profession'].invalid ||
        this.f['experienceLevel'].invalid ||
        this.f['currentLocation'].invalid ||
        (this.isProfessionOther() && this.f['otherProfession'].invalid)
      ) {
        this.markStepFieldsAsTouched(2);
        return;
      }
    }

    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  markStepFieldsAsTouched(step: number): void {
    if (step === 1) {
      this.f['fullName'].markAsTouched();
      this.f['email'].markAsTouched();
      this.f['password'].markAsTouched();
      this.f['confirmPassword'].markAsTouched();
    } else if (step === 2) {
      this.f['profession'].markAsTouched();
      this.f['experienceLevel'].markAsTouched();
      this.f['currentLocation'].markAsTouched();
      if (this.isProfessionOther()) {
        this.f['otherProfession'].markAsTouched();
      }
    }
  }

  passwordsMatch(): boolean {
    return this.f['password'].value === this.f['confirmPassword'].value;
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      Object.keys(this.signupForm.controls).forEach((key) => {
        this.signupForm.controls[key].markAsTouched();
      });
      return;
    }

    this.isLoading = true;

    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', this.signupForm.value);
      this.isLoading = false;

      // Navigate to dashboard or onboarding
      this.router.navigate(['/dashboard']);
    }, 2000);
  }

}
