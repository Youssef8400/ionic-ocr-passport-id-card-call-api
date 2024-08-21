import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://31.220.89.29:8000/get-document-data/';

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client ou réseau
      console.error('An error occurred:', error.error.message);
    } else {
      // Le backend a retourné un code d'erreur
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`
      );
    }
    // Retourne une observable avec un message d'erreur
    return throwError('Something bad happened; please try again later.');
  }
  

  getDocumentData(imageDataUrl: string): Observable<any> {
    // Envoie une requête POST à l'API avec les données de l'image
    return this.http.post<any>(this.apiUrl, { imageData: imageDataUrl })
      .pipe(
        catchError(this.handleError) // Gère les erreurs
      );
  }
}
