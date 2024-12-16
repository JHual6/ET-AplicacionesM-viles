import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AutenticacionGuard } from './autenticacion.guard'; 
import { AutenticacionService } from '../servicios/autenticacion.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('AutenticacionGuard', () => {
  let guard: AutenticacionGuard;
  let authService: jasmine.SpyObj<AutenticacionService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceMock = jasmine.createSpyObj('AutenticacionService', ['getLogueado']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AutenticacionGuard,
        { provide: AutenticacionService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    guard = TestBed.inject(AutenticacionGuard);
    authService = TestBed.inject(AutenticacionService) as jasmine.SpyObj<AutenticacionService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('Debería crearse', () => {
    expect(guard).toBeTruthy();
  });

  it('Debería habilitar las rutas si el usuario se loguea', () => {
    authService.getLogueado.and.returnValue(true); 
    expect(guard.canActivate()).toBeTrue();
  });

  it('Debería redirigir si el usuario no es logueado', () => {
    authService.getLogueado.and.returnValue(false); 
    guard.canActivate();
    expect(router.navigate).toHaveBeenCalledWith(['ingreso']);
  });
});
