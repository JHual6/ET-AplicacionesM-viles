import { TestBed } from '@angular/core/testing';

import { FirestoneMensajeService } from './firestone-mensaje.service';

describe('FirestoneMensajeService', () => {
  let service: FirestoneMensajeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirestoneMensajeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
