import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { StorageService } from '../servicios/storage.service';

@Component({
  selector: 'app-restablecer',
  templateUrl: './restablecer.page.html',
  styleUrls: ['./restablecer.page.scss'],
})
export class RestablecerPage implements OnInit {

  username: string = "";
  errorMessage: string = "";

  constructor(private router: Router, private alertController: AlertController, private storageService: StorageService) { }

  ngOnInit() {}

  // Función para restablecer la contraseña 
  async resetPassword() {
    const password = await this.storageService.getContrasena(this.username);
  
    if (password) {
        const alert = await this.alertController.create({
            header: 'Restablecer contraseña',
            inputs: [
                {
                    name: 'newPassword',
                    type: 'password',
                    placeholder: 'Nueva contraseña',
                    attributes: { minlength: 6 }
                },
                {
                    name: 'confirmPassword',
                    type: 'password',
                    placeholder: 'Confirmar nueva contraseña',
                    attributes: { minlength: 6 }
                }
            ],
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel'
                },
                {
                    text: 'Aceptar',
                    handler: async (data) => {
                        if (data.newPassword === data.confirmPassword && data.newPassword.length >= 6) {
                            const updated = await this.storageService.updateContrasena(this.username, data.newPassword);
                            if (updated) {
                                const successAlert = await this.alertController.create({
                                    header: 'Contraseña actualizada',
                                    message: 'Tu contraseña ha sido cambiada exitosamente.',
                                    buttons: ['OK']
                                });
                                await successAlert.present();
                                await successAlert.onDidDismiss();
                                this.router.navigate(['/']);
                            } else {
                                this.errorMessage = 'No se pudo actualizar la contraseña.';
                            }
                        } else {
                            this.errorMessage = 'Las contraseñas no coinciden o son demasiado cortas.';
                        }
                    }
                }
            ]
        });

        await alert.present();
    } else {
        this.errorMessage = "El usuario no existe";
    }
  }

}
