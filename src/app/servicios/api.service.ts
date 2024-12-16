import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://api.qrserver.com/v1';

  constructor(private http: HttpClient) {}

  // Enviar imagen en base64 para decodificarla en la API
  readQrCode(imageData: string): Observable<any> {
    const formData = new FormData();
    const blob = this.dataURItoBlob(imageData);
    formData.append('file', blob, 'image.png');

    return this.http.post(`${this.apiUrl}/read-qr-code/`, formData);
  }

  // Generar un código qr por un texto o URL
  generateQrCode(data: string): Promise<string> {
    const url = `${this.apiUrl}/create-qr-code/?data=${encodeURIComponent(data)}&size=200x200`;
    return Promise.resolve(url);
  }

  private dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }
}
