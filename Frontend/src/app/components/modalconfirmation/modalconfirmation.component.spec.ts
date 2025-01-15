import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalconfirmationComponent } from './modalconfirmation.component';

describe('ModalconfirmationComponent', () => {
  let component: ModalconfirmationComponent;
  let fixture: ComponentFixture<ModalconfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalconfirmationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalconfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
