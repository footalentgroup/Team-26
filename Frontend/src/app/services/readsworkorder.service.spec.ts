import { TestBed } from '@angular/core/testing';

import { ReadsworkorderService } from './readsworkorder.service';

describe('ReadsworkorderService', () => {
  let service: ReadsworkorderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReadsworkorderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
