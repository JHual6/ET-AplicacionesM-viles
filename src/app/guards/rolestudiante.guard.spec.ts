import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { rolestudianteGuard } from './rolestudiante.guard';
import { AutenticacionService } from '../servicios/autenticacion.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('RolestudianteGuard', () => {
  let guard: rolestudianteGuard;
  let authService: jasmine.SpyObj<AutenticacionService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceMock = jasmine.createSpyObj('AutenticacionService', ['getLogueado']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate', 'createUrlTree']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        rolestudianteGuard,
        { provide: AutenticacionService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    guard = TestBed.inject(rolestudianteGuard);
    authService = TestBed.inject(AutenticacionService) as jasmine.SpyObj<AutenticacionService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('Debería ser creado', () => {
    expect(guard).toBeTruthy();
  });
});
