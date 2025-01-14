import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingspinerComponent } from './loadingspiner.component';

describe('LoadingspinerComponent', () => {
  let component: LoadingspinerComponent;
  let fixture: ComponentFixture<LoadingspinerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingspinerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoadingspinerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
