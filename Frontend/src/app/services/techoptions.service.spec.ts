import { TestBed } from '@angular/core/testing';

import { TechoptionsService } from './techoptions.service';

describe('TechoptionsService', () => {
  let service: TechoptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TechoptionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
