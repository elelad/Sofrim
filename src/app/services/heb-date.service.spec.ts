import { TestBed } from '@angular/core/testing';

import { HebDateService } from './heb-date.service';

describe('HebDateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HebDateService = TestBed.get(HebDateService);
    expect(service).toBeTruthy();
  });
});
