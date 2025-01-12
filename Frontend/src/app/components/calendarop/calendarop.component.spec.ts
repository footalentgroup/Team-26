import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendaropComponent } from './calendarop.component';

describe('CalendaropComponent', () => {
  let component: CalendaropComponent;
  let fixture: ComponentFixture<CalendaropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendaropComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CalendaropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
