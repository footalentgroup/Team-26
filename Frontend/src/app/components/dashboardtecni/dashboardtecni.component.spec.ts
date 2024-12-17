import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardtecniComponent } from './dashboardtecni.component';

describe('DashboardtecniComponent', () => {
  let component: DashboardtecniComponent;
  let fixture: ComponentFixture<DashboardtecniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardtecniComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardtecniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
