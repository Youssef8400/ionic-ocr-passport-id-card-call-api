import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

const apiUrl = "http://31.220.89.29:8000/get-document-data/";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message || error.error.message);
    // Handle the error response and return a user-friendly error message
    return throwError('An error occurred; please try again later.');
  }

  getDocumentData(imageDataUrl: string): Observable<any> {
    const blob = this.dataURLToBlob(imageDataUrl);
    const formData = new FormData();
    formData.append('file', blob, 'image.jpg'); // 'file' is the expected field name

    return this.http.post(apiUrl, formData).pipe(
      catchError(this.handleError)
    );
  }

  private dataURLToBlob(dataURL: string): Blob {
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  }
}
