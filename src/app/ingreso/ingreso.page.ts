import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../servicios/storage.service';
import { AutenticacionService } from '../servicios/autenticacion.service'; 

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.page.html',
  styleUrls: ['./ingreso.page.scss'],
})
export class IngresoPage implements OnInit {

  username: string = "";
  password: string = "";
  errorMessage: string = "";

  constructor(
    private router: Router,
    private storageService: StorageService,
    private authService: AutenticacionService 
  ) { }
  // Función para hacer el login del usuario
  async login() {
    this.errorMessage = "";

    const usuarios = await this.storageService.getUsuarios();
    const usuarioEncontrado = usuarios?.find(user => user.nombre === this.username);

    if (usuarioEncontrado && usuarioEncontrado.contrasena === this.password) {
        const loginExitoso = await this.authService.iniciarSesion(usuarioEncontrado.nombre);
        
        if (loginExitoso) {
            this.router.navigate(['/inicio'], { queryParams: { username: this.username } });
        } else {
            this.errorMessage = "No se pudo iniciar sesión, por favor intente de nuevo.";
        }
    } else if (!usuarioEncontrado) {
        this.errorMessage = "El usuario no existe";
    } else {
        this.errorMessage = "Contraseña incorrecta";
    }
  }
  // Función para crear los usuarios por defecto (SOLO PARA EJEMPLOS DE USO, MENOS EL ADMIN)
  async ngOnInit() {
    await this.storageService.init();

    const contrasenaJona = await this.storageService.getContrasena('jona');
    if (!contrasenaJona) {
      await this.storageService.addUsuario('jona', 'jona123', 'estudiante');
    }

    const contrasenaProfesor = await this.storageService.getContrasena('profesor');
    if (!contrasenaProfesor) {
      await this.storageService.addUsuario('profesor', 'profesor123', 'profesor');
    }

    const contrasenaAdmin = await this.storageService.getContrasena('admin1');
    if (!contrasenaAdmin) {
      await this.storageService.addUsuario('admin1', 'admin123', 'administrador');
    }
  }
  // async basedatos() {
  //   this.router.navigate(['/basedatos']);
  // }
}
