import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Resume } from '../../../types/resume.types';
import { ResumeService } from '../../../services/resume/resume-service';

@Component({
  selector: 'app-resume-edit',
  templateUrl: './edit-resume.html',
  styleUrls: ['./edit-resume.css'],
  imports: [ReactiveFormsModule],
})
export class EditResume implements OnInit {
  resumeForm!: FormGroup;
  resumeId: string = '';
  isSaving: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private resumeService: ResumeService,
  ) {}

  ngOnInit(): void {
    console.log();
    this.initializeForm();

    // Get resume ID from route params
    this.route.queryParams.subscribe((params) => {
      this.resumeId = params['id'];
      if (this.resumeId) {
        this.loadResume(this.resumeId);
      }
    });
  }

  initializeForm(): void {
    this.resumeForm = this.fb.group({
      title: ['', Validators.required],
      personalInfo: this.fb.group({
        fullName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: [''],
        location: [''],
        linkedin: [''],
        github: [''],
        portfolio: [''],
      }),
      professionalSummary: [''],
      experience: this.fb.array([]),
      education: this.fb.array([]),
      skills: [''], // Will store as comma-separated string
    });
  }

  loadResume(id: string): void {
    this.resumeService.getResumeByUserAndResumeId(id).subscribe({
      next: (response) => {
        this.prefillForm(response.resume);
      },
      error: (error) => {
        console.log(error.message);
      },
    });
  }

  prefillForm(resume: Resume): void {
    // Fill basic info
    this.resumeForm.patchValue({
      title: resume.title,
      professionalSummary: resume.extractedContent.professionalSummary || '',
    });

    // Fill personal info
    this.resumeForm.get('personalInfo')?.patchValue({
      fullName: resume.extractedContent.personalInfo.fullName || '',
      email: resume.extractedContent.personalInfo.email || '',
      phone: resume.extractedContent.personalInfo.phone || '',
      location: resume.extractedContent.personalInfo.location || '',
      linkedin: resume.extractedContent.personalInfo.linkedin || '',
      github: resume.extractedContent.personalInfo.github || '',
      portfolio: resume.extractedContent.personalInfo.portfolio || '',
    });

    // Fill experience
    resume.extractedContent.experience.forEach((exp) => {
      this.experience.push(this.createExperienceGroup(exp));
    });

    // Fill education
    resume.extractedContent.education.forEach((edu) => {
      this.education.push(this.createEducationGroup(edu));
    });

    // Fill skills (convert array to comma-separated string)
    const skillsString = resume.extractedContent.skills.join(', ');
    this.resumeForm.patchValue({
      skills: skillsString,
    });
  }

  // Experience FormArray helpers
  get experience(): FormArray {
    return this.resumeForm.get('experience') as FormArray;
  }

  createExperienceGroup(exp?: any): FormGroup {
    const group = this.fb.group({
      position: [exp?.position || ''],
      company: [exp?.company || ''],
      location: [exp?.location || ''],
      startDate: [exp?.startDate || ''],
      endDate: [exp?.endDate || ''],
      description: this.fb.array([]),
    });

    // Add descriptions
    if (exp?.description && Array.isArray(exp.description)) {
      const descArray = group.get('description') as FormArray;
      exp.description.forEach((desc: string) => {
        descArray.push(this.fb.control(desc));
      });
    }

    return group;
  }

  addExperience(): void {
    this.experience.push(this.createExperienceGroup());
  }

  removeExperience(index: number): void {
    this.experience.removeAt(index);
  }

  getDescriptionControls(expIndex: number): any[] {
    const exp = this.experience.at(expIndex) as FormGroup;
    const descArray = exp.get('description') as FormArray;
    return descArray.controls;
  }

  addDescriptionAtIndex(expIndex: number): void {
    const exp = this.experience.at(expIndex) as FormGroup;
    const descArray = exp.get('description') as FormArray;
    descArray.push(this.fb.control(''));
  }

  removeDescriptionAtIndex(expIndex: number, descIndex: number): void {
    const exp = this.experience.at(expIndex) as FormGroup;
    const descArray = exp.get('description') as FormArray;
    descArray.removeAt(descIndex);
  }

  // Education FormArray helpers
  get education(): FormArray {
    return this.resumeForm.get('education') as FormArray;
  }

  createEducationGroup(edu?: any): FormGroup {
    return this.fb.group({
      degree: [edu?.degree || ''],
      field: [edu?.field || ''],
      institution: [edu?.institution || ''],
      location: [edu?.location || ''],
      startYear: [edu?.startYear || ''],
      endYear: [edu?.endYear || ''],
      description: [edu?.description || ''],
    });
  }

  addEducation(): void {
    this.education.push(this.createEducationGroup());
  }

  removeEducation(index: number): void {
    this.education.removeAt(index);
  }

  onSubmit(): void {
    if (this.resumeForm.invalid) {
      this.resumeForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;

    const formValue = this.resumeForm.value;

    const skillsArray = formValue.skills
      .split(',')
      .map((skill: string) => skill.trim())
      .filter((skill: string) => skill.length > 0);

    const updatedResume = {
      title: formValue.title,
      extractedContent: {
        personalInfo: formValue.personalInfo,
        professionalSummary: formValue.professionalSummary,
        experience: formValue.experience,
        education: formValue.education,
        skills: skillsArray,
        certifications: [],
        projects: [],
        languages: [],
      },
    };

    console.log('Updated Resume:', updatedResume);

    this.resumeService.updateResumeByUserAndResumeId(this.resumeId, updatedResume).subscribe({
      next: (response) => {
        console.log(response.message);
        this.router.navigate(['/generate-resume']);
      },
      error: (error) => {
        console.error('Error updating resume:', error);
        this.isSaving = false;
      },
    });
  }

  onCancel(): void {
    if (confirm('Are you sure you want to discard your changes?')) {
      this.router.navigate(['generate-resume']);
    }
  }
}
