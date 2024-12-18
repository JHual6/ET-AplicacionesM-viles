import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../servicios/storage.service';
import { AlertController } from '@ionic/angular';
import { DatabaseService } from 'src/app/servicios/database.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: 'usuarios.page.html',
  styleUrls: ['usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {
  usuarios: { nombre: string; contrasena: string; rol: string }[] = [];

  constructor(
    private storageService: StorageService,
    private alertController: AlertController,
    private databaseService: DatabaseService
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
          placeholder: 'Nombre del usuario',
        },
        {
          name: 'contrasena',
          type: 'password',
          placeholder: 'Contraseña',
        },
        {
          name: 'rol',
          type: 'text',
          placeholder: 'Rol (profesor/estudiante)',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Agregar',
          handler: async (data) => {
            try {
              if (!data.nombre || !data.contrasena || !data.rol) {
                const emptyFieldAlert = await this.alertController.create({
                  header: 'Error',
                  message: 'Todos los campos son obligatorios.',
                  buttons: ['OK'],
                });
                await emptyFieldAlert.present();
                return false;
              }
  
              if (data.rol.toLowerCase() === 'profesor') {
                this.databaseService.insertarProfesor(data.nombre, data.contrasena).subscribe(
                  async (response) => {
                    console.log('Profesor agregado:', response);
                    await this.storageService.addUsuario(data.nombre, data.contrasena, data.rol.toLowerCase());
                    this.usuarios = await this.storageService.getUsuarios();
  
                    const successAlert = await this.alertController.create({
                      header: 'Éxito',
                      message: `Profesor ${data.nombre} agregado correctamente.`,
                      buttons: ['OK'],
                    });
                    await successAlert.present();
                  },
                  async (error) => {
                    console.error('Error al agregar profesor:', error);
                    const errorAlert = await this.alertController.create({
                      header: 'Error',
                      message: 'Ocurrió un error al agregar el profesor.',
                      buttons: ['OK'],
                    });
                    await errorAlert.present();
                  }
                );
              } else if (data.rol.toLowerCase() === 'estudiante') {
                this.databaseService.insertarEstudiante(data.nombre, data.contrasena).subscribe(
                  async (response) => {
                    console.log('Estudiante agregado:', response);
                    await this.storageService.addUsuario(data.nombre, data.contrasena, data.rol.toLowerCase());
                    this.usuarios = await this.storageService.getUsuarios();
  
                    const successAlert = await this.alertController.create({
                      header: 'Éxito',
                      message: `Estudiante ${data.nombre} agregado correctamente.`,
                      buttons: ['OK'],
                    });
                    await successAlert.present();
                  },
                  async (error) => {
                    console.error('Error al agregar estudiante:', error);
                    const errorAlert = await this.alertController.create({
                      header: 'Error',
                      message: 'Ocurrió un error al agregar el estudiante.',
                      buttons: ['OK'],
                    });
                    await errorAlert.present();
                  }
                );
              } else {
                const invalidRoleAlert = await this.alertController.create({
                  header: 'Error',
                  message: 'Rol no válido. Use "profesor" o "estudiante".',
                  buttons: ['OK'],
                });
                await invalidRoleAlert.present();
                return false; 
              }
  
              return true; 
            } catch (error) {
              console.error('Error al agregar usuario:', error);
  
              const errorAlert = await this.alertController.create({
                header: 'Error',
                message: 'Ocurrió un error al agregar el usuario. Intente nuevamente.',
                buttons: ['OK'],
              });
              await errorAlert.present();
              return false; 
            }
          },
        },
      ],
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
