import { TestBed } from '@angular/core/testing';

import { AutenticacionRutasService } from './autenticacion-rutas.service';

describe('AutenticacionRutasService', () => {
  let service: AutenticacionRutasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutenticacionRutasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
