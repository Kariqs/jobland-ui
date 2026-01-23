import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeaserDashboard } from './teaser-dashboard';

describe('TeaserDashboard', () => {
  let component: TeaserDashboard;
  let fixture: ComponentFixture<TeaserDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeaserDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeaserDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
