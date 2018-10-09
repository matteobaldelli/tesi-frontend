import { TestBed } from '@angular/core/testing';

import { HDataService } from './h-data.service';

describe('HDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HDataService = TestBed.get(HDataService);
    expect(service).toBeTruthy();
  });
});
