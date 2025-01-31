import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardinstallationComponent } from './dashboardinstallation.component';

describe('DashboardinstallationComponent', () => {
  let component: DashboardinstallationComponent;
  let fixture: ComponentFixture<DashboardinstallationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardinstallationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardinstallationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
