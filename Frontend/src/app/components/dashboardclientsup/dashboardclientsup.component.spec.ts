import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardclientsupComponent } from './dashboardclientsup.component';

describe('DashboardclientsupComponent', () => {
  let component: DashboardclientsupComponent;
  let fixture: ComponentFixture<DashboardclientsupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardclientsupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardclientsupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
