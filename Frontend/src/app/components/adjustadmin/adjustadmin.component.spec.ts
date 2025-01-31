import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustadminComponent } from './adjustadmin.component';

describe('AdjustadminComponent', () => {
  let component: AdjustadminComponent;
  let fixture: ComponentFixture<AdjustadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdjustadminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdjustadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
