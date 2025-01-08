import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecuperarpasswordComponent } from './recuperarpassword.component';

describe('RecuperarpasswordComponent', () => {
  let component: RecuperarpasswordComponent;
  let fixture: ComponentFixture<RecuperarpasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecuperarpasswordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecuperarpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
