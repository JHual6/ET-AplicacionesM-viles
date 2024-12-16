import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // Agregar un nuevo usuario con nombre, contraseña y rol
  async addUsuario(nombre: string, contrasena: string, rol: string): Promise<void> {
    let usuarios = await this.getUsuarios();

    if (!usuarios) {
      usuarios = [];
    }

    const usuarioExistente = usuarios.find(u => u.nombre === nombre);
    if (!usuarioExistente) {
      usuarios.push({ nombre, contrasena, rol });
      await this._storage?.set('usuarios', usuarios);
    }
  }

  // Obtener lista de usuarios
  async getUsuarios(): Promise<{ nombre: string, contrasena: string, rol: string }[]> {
    const usuarios = await this._storage?.get('usuarios');
    return usuarios || []; 
  }
  
  // Obtener contraseña de un usuario
  async getContrasena(nombre: string): Promise<string | null> {
    const usuarios = await this.getUsuarios();

    if (!usuarios) {
      return null;
    }

    const usuario = usuarios.find(u => u.nombre === nombre);
    return usuario ? usuario.contrasena : null;
  }

  // Obtener el rol de un usuario
  async getRol(nombre: string): Promise<string | null> {
    const usuarios = await this.getUsuarios();

    if (!usuarios) {
      return null;
    }

    const usuario = usuarios.find(u => u.nombre === nombre);
    return usuario ? usuario.rol : null;
  }

  // Reemplazar la contraseña de un usuario existente
  async updateContrasena(nombre: string, nuevaContrasena: string): Promise<boolean> {
    let usuarios = await this.getUsuarios();

    if (!usuarios || usuarios.length === 0) {
      return false;
    }

    const usuarioIndex = usuarios.findIndex(u => u.nombre === nombre);

    if (usuarioIndex !== -1) {
      usuarios[usuarioIndex].contrasena = nuevaContrasena;
      
      await this._storage?.set('usuarios', usuarios);
      
      const usuarioActual = await this._storage?.get('usuarioActual');
      if (usuarioActual && usuarioActual.nombre === nombre) {
        usuarioActual.contrasena = nuevaContrasena;
        await this._storage?.set('usuarioActual', usuarioActual);
      }
      
      const updatedUsuarios = await this._storage?.get('usuarios');
      console.log(updatedUsuarios);
  
      return true;
    }
  
    return false;
  }

  // Modificar usuario existente
  async updateUsuario(nombreActual: string, nuevoNombre: string, nuevaContrasena: string, nuevoRol: string): Promise<boolean> {
    let usuarios = await this.getUsuarios();

    const usuarioIndex = usuarios.findIndex(u => u.nombre === nombreActual);
    if (usuarioIndex !== -1) {
      usuarios[usuarioIndex] = { nombre: nuevoNombre, contrasena: nuevaContrasena, rol: nuevoRol };
      await this._storage?.set('usuarios', usuarios);

      const usuarioActual = await this._storage?.get('usuarioActual');
      if (usuarioActual && usuarioActual.nombre === nombreActual) {
        usuarioActual.nombre = nuevoNombre;
        usuarioActual.contrasena = nuevaContrasena;
        usuarioActual.rol = nuevoRol;
        await this._storage?.set('usuarioActual', usuarioActual);
      }

      return true;
    }
    return false;
  }

  // Eliminar usuario específico
  async deleteUsuario(nombre: string): Promise<boolean> {
    let usuarios = await this.getUsuarios();
    const usuarioIndex = usuarios.findIndex(u => u.nombre === nombre);

    if (usuarioIndex !== -1) {
      usuarios.splice(usuarioIndex, 1);
      await this._storage?.set('usuarios', usuarios);
      return true;
    }
    return false;
  }  
}
  