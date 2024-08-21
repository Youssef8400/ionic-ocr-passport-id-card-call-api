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

  constructor(private sanitizer: DomSanitizer, private api: ApiService) {}

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
        alert('Aucune donnée d\'image reçue. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Error taking picture', error);
      alert('Erreur lors de la prise de la photo. Veuillez vérifier les autorisations de la caméra.');
    }
  }

  processImage(imageDataUrl: string) {
    this.api.getDocumentData(imageDataUrl).subscribe(
      (result: any) => {
        console.log('Document data received:', result);

        // Assignation des valeurs retournées aux propriétés
        this.documentType = result['documentType'] || '';
        this.countryCode = result['countryCode'] || '';
        this.firstName = result['firstName'] || '';
        this.lastName = result['lastName'] || '';
        this.documentNumber = result['documentNumber'] || '';
        this.sex = result['sex'] || '';
        this.birthDate = result['birthDate'] || '';
        this.expireDate = result['expireDate'] || '';
      },
      (error: HttpErrorResponse) => {
        console.error('Error processing image data:', error);

        // Afficher les détails de l'erreur
        let errorMessage = 'Une erreur est survenue lors du traitement de l\'image.';

        if (error.error instanceof ErrorEvent) {
          // Erreur côté client ou réseau
          console.error('Client-side error:', error.error.message);
          errorMessage = 'Une erreur est survenue lors de la communication avec le serveur. Veuillez réessayer.';
        } else {
          // Erreur côté serveur
          console.error(`Server returned code: ${error.status}, error message is: ${error.message}`);
          errorMessage = `Erreur serveur: ${error.status}. Veuillez vérifier que le serveur est accessible et que l'URL est correcte.`;
        }

        alert(errorMessage);
        // Réinitialiser les propriétés en cas d'erreur
        this.resetForm();
      }
    );
  }

  private resetForm() {
    this.documentType = '';
    this.countryCode = '';
    this.firstName = '';
    this.lastName = '';
    this.documentNumber = '';
    this.sex = '';
    this.birthDate = '';
    this.expireDate = '';
    this.photo = undefined; // Optionnel: Réinitialiser l'image
  }
}
