import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarsupComponent } from './navbarsup.component';

describe('NavbarsupComponent', () => {
  let component: NavbarsupComponent;
  let fixture: ComponentFixture<NavbarsupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarsupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavbarsupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
