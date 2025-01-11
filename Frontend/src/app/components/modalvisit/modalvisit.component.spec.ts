import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVisitComponent } from './modalvisit.component';

describe('ModalvisitComponent', () => {
  let component: ModalVisitComponent;
  let fixture: ComponentFixture<ModalVisitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalVisitComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
