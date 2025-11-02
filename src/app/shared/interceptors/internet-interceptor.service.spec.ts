import { TestBed } from '@angular/core/testing';

import { InternetInterceptorService } from './internet-interceptor';

describe('InternetInterceptorService', () => {
  let service: InternetInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InternetInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
