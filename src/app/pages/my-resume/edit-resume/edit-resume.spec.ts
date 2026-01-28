import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditResume } from './edit-resume';

describe('EditResume', () => {
  let component: EditResume;
  let fixture: ComponentFixture<EditResume>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditResume]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditResume);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
