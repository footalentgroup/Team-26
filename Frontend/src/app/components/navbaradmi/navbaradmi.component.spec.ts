import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbaradmiComponent } from './navbaradmi.component';

describe('NavbaradmiComponent', () => {
  let component: NavbaradmiComponent;
  let fixture: ComponentFixture<NavbaradmiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbaradmiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavbaradmiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
