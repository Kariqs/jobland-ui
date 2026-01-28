import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeUpload } from './my-resume';

describe('ResumeGenerator', () => {
  let component: ResumeUpload;
  let fixture: ComponentFixture<ResumeUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumeUpload],
    }).compileComponents();

    fixture = TestBed.createComponent(ResumeUpload);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
