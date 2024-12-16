import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';
import { Storage } from '@ionic/storage-angular';
import { of } from 'rxjs';

class MockStorage {
  private storage = new Map<string, any>();

  create() {
    return Promise.resolve();
  }

  get(key: string) {
    return Promise.resolve(this.storage.get(key) || null);
  }

  set(key: string, value: any) {
    this.storage.set(key, value);
    return Promise.resolve();
  }
}

describe('StorageService', () => {
  let service: StorageService;
  let mockStorage: MockStorage;

  beforeEach(() => {
    mockStorage = new MockStorage();

    TestBed.configureTestingModule({
      providers: [
        StorageService,
        { provide: Storage, useValue: mockStorage },
      ],
    });

    service = TestBed.inject(StorageService);
  });

  it('Debe ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('Debe retornar null si el usuario no existe al obtener la contraseña', async () => {
    const contrasena = await service.getContrasena('usuarioInexistente');
    expect(contrasena).toBeNull();
  });

  it('Debe retornar null si el usuario no existe al obtener el rol', async () => {
    const rol = await service.getRol('usuarioInexistente');
    expect(rol).toBeNull();
  });

  it('Debe retornar false al intentar eliminar un usuario que no existe', async () => {
    const deleted = await service.deleteUsuario('usuarioInexistente');
    expect(deleted).toBe(false);
  });
});
