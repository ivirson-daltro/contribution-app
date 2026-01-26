import { TestBed } from '@angular/core/testing';

import { Contributions } from './contributions';

describe('Contributions', () => {
  let service: Contributions;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Contributions);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
