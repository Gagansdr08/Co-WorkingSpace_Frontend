import { TestBed } from '@angular/core/testing';

import { CoworkingSpaceService } from './coworking-space.service';

describe('CoworkingSpaceService', () => {
  let service: CoworkingSpaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoworkingSpaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
