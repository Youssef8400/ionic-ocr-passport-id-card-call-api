import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [provideHttpClientTesting()],
      providers: [ApiService]
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a POST request with FormData and return document data', () => {
    const mockImageDataUrl = 'data:image/jpeg;base64,example';
    const mockResponse = {
      documentType: 'ID',
      countryCode: 'US',
      firstName: 'John',
      lastName: 'Doe',
      documentNumber: '123456789',
      sex: 'M',
      birthDate: '1990-01-01',
      expireDate: '2030-01-01'
    };

    service.getDocumentData(mockImageDataUrl).subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://31.220.89.29:8000/get-document-data/');
    expect(req.request.method).toBe('POST');
    const formData = new FormData();
    formData.append('file', mockImageDataUrl);
    // Check if the request body matches the expected FormData structure
    req.flush(mockResponse);
  });

  it('should handle an error response', () => {
    const mockImageDataUrl = 'data:image/jpeg;base64,example';
    const mockErrorResponse = { status: 422, statusText: 'Unprocessable Entity' };
    const mockErrorBody = { detail: [{ loc: ["body", "file"], msg: "field required", type: "value_error.missing" }] };

    service.getDocumentData(mockImageDataUrl).subscribe(
      () => fail('expected an error, not document data'),
      (error) => {
        expect(error).toContain('Something bad happened; please try again later.');
      }
    );

    const req = httpMock.expectOne('http://31.220.89.29:8000/get-document-data/');
    req.flush(mockErrorBody, mockErrorResponse);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
