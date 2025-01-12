import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenEditarComponent } from './screen-editar.component';

describe('ScreenEditarComponent', () => {
  let component: ScreenEditarComponent;
  let fixture: ComponentFixture<ScreenEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreenEditarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScreenEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
