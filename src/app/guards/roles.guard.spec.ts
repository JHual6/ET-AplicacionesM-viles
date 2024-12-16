import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RolesGuard } from './roles.guard';
import { AutenticacionService } from '../servicios/autenticacion.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let authService: jasmine.SpyObj<AutenticacionService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceMock = jasmine.createSpyObj('AutenticacionService', ['getLogueado']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate', 'createUrlTree']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        RolesGuard,
        { provide: AutenticacionService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    guard = TestBed.inject(RolesGuard);
    authService = TestBed.inject(AutenticacionService) as jasmine.SpyObj<AutenticacionService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('Debería ser creado', () => {
    expect(guard).toBeTruthy();
  });
});
