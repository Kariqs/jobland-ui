import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumePreview } from './resume-preview';

describe('ResumePreview', () => {
  let component: ResumePreview;
  let fixture: ComponentFixture<ResumePreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumePreview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumePreview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
