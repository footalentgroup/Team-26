import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PantallacargaComponent } from './pantallacarga.component';

describe('PantallacargaComponent', () => {
  let component: PantallacargaComponent;
  let fixture: ComponentFixture<PantallacargaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PantallacargaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PantallacargaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
