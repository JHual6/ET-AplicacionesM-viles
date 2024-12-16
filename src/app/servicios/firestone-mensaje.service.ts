import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoneMensajeService {
  private currentMessageSource = new BehaviorSubject<any>(null); 
  currentMessage = this.currentMessageSource.asObservable(); 
  
  constructor(private afMessaging: AngularFireMessaging) {}

  requestPermission(): void {
    this.afMessaging.requestToken.subscribe(
      (token: string | null) => {
        if (token) {
          console.log('Token recibido:', token);
        } else {
          console.warn('El usuario no otorgó permiso para recibir notificaciones.');
          alert('Por favor, habilita las notificaciones en la configuración de tu dispositivo.');
        }
      },
      (error: any) => {
        console.error('Error al obtener el token:', error);
      }
    );
  }  

  receiveMessage(): void {
    this.afMessaging.messages.subscribe((message: any) => {
      console.log('Mensaje recibido:', message);
      this.currentMessageSource.next(message); 
    });
  }
}
