import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TailorResume } from './tailor-resume';

describe('TailorResume', () => {
  let component: TailorResume;
  let fixture: ComponentFixture<TailorResume>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailorResume]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TailorResume);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
