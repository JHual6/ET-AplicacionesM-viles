import { Injectable } from "@angular/core";
import { StorageService } from './storage.service'; 

@Injectable({
    providedIn: 'root'
})
export class AutenticacionService {
    private usuarioLogueado: boolean = false;
    private rolUsuario: string | null = null;

    constructor(private storageService: StorageService) {}

    // Método que entrega si un usuario está logeado
    getLogueado(): boolean {
        return this.usuarioLogueado;
    }

    // Método para obtener el rol del usuario logueado
    getRolUsuario(): string | null {
        return this.rolUsuario;
    }


    // Método para iniciar sesión
    async iniciarSesion(nombreUsuario: string): Promise<boolean> {
        this.usuarioLogueado = true;
        this.rolUsuario = await this.storageService.getRol(nombreUsuario);
        return this.rolUsuario !== null;  // Retorna true si el rol existe, false si no
    }


    // Método para cerrar sesión
    cerrarSesion() {
        this.usuarioLogueado = false;
        this.rolUsuario = null;  
    }
}
