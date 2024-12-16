import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsuariosPage } from './usuarios.page';
import { StorageService } from '../../servicios/storage.service';
import { AlertController } from '@ionic/angular';
import { of } from 'rxjs';

// Mock de StorageService
class MockStorageService {
  usuarios = [
    { nombre: 'Usuario 1', contrasena: '1234', rol: 'admin' },
    { nombre: 'Usuario 2', contrasena: '5678', rol: 'user' }
  ];

  async getUsuarios() {
    return this.usuarios; // Devuelve directamente el array
  }

  async addUsuario(nombre: string, contrasena: string, rol: string) {
    this.usuarios.push({ nombre, contrasena, rol });
  }

  async updateUsuario(nombre: string, nuevoNombre: string, contrasena: string, rol: string) {
    const usuario = this.usuarios.find(u => u.nombre === nombre);
    if (usuario) {
      usuario.nombre = nuevoNombre;
      usuario.contrasena = contrasena;
      usuario.rol = rol;
    }
  }

  async deleteUsuario(nombre: string) {
    this.usuarios = this.usuarios.filter(u => u.nombre !== nombre);
  }
}

// Mock de AlertController
class MockAlertController {
  create() {
    return {
      present: jasmine.createSpy('present'),
      onDidDismiss: jasmine.createSpy('onDidDismiss').and.returnValue(Promise.resolve())
    };
  }
}

describe('UsuariosPage', () => {
  let component: UsuariosPage;
  let fixture: ComponentFixture<UsuariosPage>;
  let storageService: StorageService;
  let alertController: AlertController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsuariosPage],
      providers: [
        { provide: StorageService, useClass: MockStorageService },
        { provide: AlertController, useClass: MockAlertController }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UsuariosPage);
    component = fixture.componentInstance;
    storageService = TestBed.inject(StorageService);
    alertController = TestBed.inject(AlertController);
    fixture.detectChanges();
  });

  it('Debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('Debería cargar los usuarios al cargarse', async () => {
    await component.ngOnInit();
    expect(component.usuarios.length).toBe(2);
    expect(component.usuarios[0].nombre).toBe('Usuario 1');
  });
});
