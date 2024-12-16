import { TestBed } from '@angular/core/testing';
import { AutenticacionService } from './autenticacion.service';
import { StorageService } from './storage.service';
import { of } from 'rxjs';

describe('AutenticacionService', () => {
  let servicio: AutenticacionService;
  let mockStorageService: jasmine.SpyObj<StorageService>;

  beforeEach(() => {
    mockStorageService = jasmine.createSpyObj('StorageService', ['getRol']);

    TestBed.configureTestingModule({
      providers: [
        AutenticacionService,
        { provide: StorageService, useValue: mockStorageService },
      ],
    });

    servicio = TestBed.inject(AutenticacionService);
  });

  it('Debe ser creado', () => {
    expect(servicio).toBeTruthy();
  });

  it('Debe retornar false si el usuario no está logueado', () => {
    expect(servicio.getLogueado()).toBeFalse();
  });

  it('Debe retornar true si el usuario está logueado', async () => {
    mockStorageService.getRol.and.returnValue(Promise.resolve('admin'));
    
    await servicio.iniciarSesion('usuarioPrueba');
    expect(servicio.getLogueado()).toBeTrue();
  });

  it('Debe retornar el rol del usuario logueado', async () => {
    mockStorageService.getRol.and.returnValue(Promise.resolve('admin'));
    
    await servicio.iniciarSesion('usuarioPrueba');
    expect(servicio.getRolUsuario()).toBe('admin');
  });

  it('Debe retornar null como rol si no se encuentra rol para el usuario', async () => {
    mockStorageService.getRol.and.returnValue(Promise.resolve(null));
    
    const resultado = await servicio.iniciarSesion('usuarioPrueba');
    expect(resultado).toBeFalse();
    expect(servicio.getRolUsuario()).toBeNull();
  });

  it('Debe cerrar sesión correctamente', () => {
    servicio.iniciarSesion('usuarioPrueba');
    
    servicio.cerrarSesion();
    
    expect(servicio.getLogueado()).toBeFalse();
    expect(servicio.getRolUsuario()).toBeNull();
  });
});
