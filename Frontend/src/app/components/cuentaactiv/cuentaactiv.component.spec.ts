import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentaactivComponent } from './cuentaactiv.component';

describe('CuentaactivComponent', () => {
  let component: CuentaactivComponent;
  let fixture: ComponentFixture<CuentaactivComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuentaactivComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CuentaactivComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
