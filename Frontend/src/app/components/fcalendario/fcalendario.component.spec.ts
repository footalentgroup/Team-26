import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FCalendarioComponent } from './fcalendario.component';

describe('FcalendarioComponent', () => {
  let component: FCalendarioComponent;
  let fixture: ComponentFixture<FCalendarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FCalendarioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FCalendarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
