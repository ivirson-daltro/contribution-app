import { TestBed } from '@angular/core/testing';

import { Members } from './members.service';

describe('Members', () => {
  let service: Members;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Members);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
