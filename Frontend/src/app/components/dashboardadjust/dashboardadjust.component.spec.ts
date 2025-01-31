import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardadjustComponent } from './dashboardadjust.component';

describe('DashboardadjustComponent', () => {
  let component: DashboardadjustComponent;
  let fixture: ComponentFixture<DashboardadjustComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardadjustComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardadjustComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
