import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardsupComponent } from './dashboardsup.component';

describe('DashboardsupComponent', () => {
  let component: DashboardsupComponent;
  let fixture: ComponentFixture<DashboardsupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardsupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardsupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
