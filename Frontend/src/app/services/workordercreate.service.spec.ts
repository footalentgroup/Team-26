import { TestBed } from '@angular/core/testing';

import { WorkordercreateService } from './workordercreate.service';

describe('WorkordercreateService', () => {
  let service: WorkordercreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkordercreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
