import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormcontactoComponent } from './formcontacto.component';

describe('FormcontactoComponent', () => {
  let component: FormcontactoComponent;
  let fixture: ComponentFixture<FormcontactoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormcontactoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormcontactoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
