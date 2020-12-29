import { TestBed } from '@angular/core/testing';

import { TextsServiceService } from './texts-service.service';

describe('TextsServiceService', () => {
  let service: TextsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TextsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
