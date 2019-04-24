import { inject, TestBed } from '@angular/core/testing';

import { NotImplementedService } from './not-implemented.service';

describe('NotImplementedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotImplementedService],
    });
  });

  it(
    'should be created',
    inject([NotImplementedService], (service: NotImplementedService) => {
      expect(service).toBeTruthy();
    }),
  );
});
