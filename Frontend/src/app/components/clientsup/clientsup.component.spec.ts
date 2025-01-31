import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsupComponent } from './clientsup.component';

describe('ClientsupComponent', () => {
  let component: ClientsupComponent;
  let fixture: ComponentFixture<ClientsupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientsupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientsupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
