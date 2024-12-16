import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'; 
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 
      providers: [ApiService],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('Debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('Debería obtener del método GET un código QR', () => {
    const data = 'https://example.com';
    const mockBlob = new Blob([], { type: 'image/png' });

    service.generateQrCode(data).subscribe((response) => {
      expect(response).toBe(mockBlob);
    });

    const req = httpMock.expectOne(`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(data)}&size=200x200`);
    expect(req.request.method).toBe('GET');
    req.flush(mockBlob); 
  });
});
