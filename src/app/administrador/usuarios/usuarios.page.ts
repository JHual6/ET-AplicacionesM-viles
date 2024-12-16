import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../servicios/storage.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-usuarios',
  templateUrl: 'usuarios.page.html',
  styleUrls: ['usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {
  usuarios: { nombre: string; contrasena: string; rol: string }[] = [];

  constructor(
    private storageService: StorageService,
    private alertController: AlertController
  ) {}
  // Cuando se cargue la página se muestren todos los usuarios
  async ngOnInit() {
    this.usuarios = await this.storageService.getUsuarios();
  }
  // Función para agregar un usuario
  async agregarUsuario() {
    const alert = await this.alertController.create({
      header: 'Agregar Usuario',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre del usuario'
        },
        {
          name: 'contrasena',
          type: 'password',
          placeholder: 'Contraseña'
        },
        {
          name: 'rol',
          type: 'text',
          placeholder: 'Rol'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Agregar',
          handler: async (data) => {
            await this.storageService.addUsuario(data.nombre, data.contrasena, data.rol);
            this.usuarios = await this.storageService.getUsuarios(); 
          }
        }
      ]
    });
    await alert.present();
  }
  // Función para editar un usuario
  async editarUsuario(usuario: any) {
    const alert = await this.alertController.create({
      header: 'Editar Usuario',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          value: usuario.nombre,
          placeholder: 'Nombre del usuario'
        },
        {
          name: 'contrasena',
          type: 'password',
          value: usuario.contrasena,
          placeholder: 'Contraseña'
        },
        {
          name: 'rol',
          type: 'text',
          value: usuario.rol,
          placeholder: 'Rol'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: async (data) => {
            await this.storageService.updateUsuario(usuario.nombre, data.nombre, data.contrasena, data.rol);
            this.usuarios = await this.storageService.getUsuarios(); 
          }
        }
      ]
    });
    await alert.present();
  }
  // Función para eliminar un usuario
  async eliminarUsuario(usuario: any) {
    const alert = await this.alertController.create({
      header: 'Eliminar Usuario',
      message: `¿Estás seguro de que quieres eliminar a ${usuario.nombre}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: async () => {
            await this.storageService.deleteUsuario(usuario.nombre);
            this.usuarios = await this.storageService.getUsuarios(); 
          }
        }
      ]
    });
    await alert.present();
  }
}
