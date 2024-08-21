import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ApiService } from '../services/api.service'; // Import du service API
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public photo: SafeResourceUrl | undefined;  // Pour stocker la photo capturée
  public documentType: string = '';
  public countryCode: string = '';
  public firstName: string = '';
  public lastName: string = '';
  public documentNumber: string = '';
  public sex: string = '';
  public birthDate: string = '';
  public expireDate: string = '';

  constructor(private sanitizer: DomSanitizer, private apiService: ApiService) {}

  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 100,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });

      if (image && image.dataUrl) {
        this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image.dataUrl);
        this.processImage(image.dataUrl);  // Appel de la méthode pour traiter l'image
      } else {
        console.error('No image data returned');
      }
    } catch (error) {
      console.error('Error taking picture', error);
    }
  }

  processImage(imageDataUrl: string) {
    this.apiService.getDocumentData(imageDataUrl).subscribe(
      (data) => {
        console.log('Document data: ', data);
        // Assignez les valeurs des données retournées aux propriétés de la classe
        this.documentType = data['documentType'] || '';
        this.countryCode = data['countryCode'] || '';
        this.firstName = data['firstName'] || '';
        this.lastName = data['lastName'] || '';
        this.documentNumber = data['documentNumber'] || '';
        this.sex = data['sex'] || '';
        this.birthDate = data['birthDate'] || '';
        this.expireDate = data['expireDate'] || '';
      },
      (error) => {
        console.error('Error processing image data:', error);

        // Gestion des erreurs HTTP
        if (error instanceof HttpErrorResponse) {
          console.error(`Server returned code: ${error.status}, error message is: ${error.message}`);
          if (error.error) {
            console.error('Server error response:', JSON.stringify(error.error));
          }
        } else {
          console.error('An unknown error occurred:', error);
        }
      }
    );
  }
}
