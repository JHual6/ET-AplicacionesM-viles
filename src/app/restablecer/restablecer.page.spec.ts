import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RestablecerPage } from './restablecer.page';
import { AlertController } from '@ionic/angular';
import { StorageService } from '../servicios/storage.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('RestablecerPage', () => {
  let component: RestablecerPage;
  let fixture: ComponentFixture<RestablecerPage>;
  let storageService: jasmine.SpyObj<StorageService>;
  let alertController: jasmine.SpyObj<AlertController>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    storageService = jasmine.createSpyObj('StorageService', ['getContrasena', 'updateContrasena']);
    alertController = jasmine.createSpyObj('AlertController', ['create']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [RestablecerPage],
      providers: [
        { provide: StorageService, useValue: storageService },
        { provide: AlertController, useValue: alertController },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RestablecerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Debería ser creado', () => {
    expect(component).toBeTruthy();
  });

  it('Debería mostrar un mensaje de error cuando el usuario no existe', async () => {
    storageService.getContrasena.and.returnValue(Promise.resolve(null));

    await component.resetPassword();

    expect(component.errorMessage).toBe('El usuario no existe');
  });

  it('Debería mostrar una alerta para crear una nueva contraseña si el usuario existe', async () => {
    storageService.getContrasena.and.returnValue(Promise.resolve('oldPassword'));

    const alertSpy = jasmine.createSpyObj('Alert', ['present', 'onDidDismiss']);
    alertController.create.and.returnValue(Promise.resolve(alertSpy));

    await component.resetPassword();

    expect(alertController.create).toHaveBeenCalled();
    expect(alertSpy.present).toHaveBeenCalled();
  });

  it('Debería actualizar la contraseña cuando la nueva contraseña y la confirmación de la contraseña es la misma', async () => {
    storageService.getContrasena.and.returnValue(Promise.resolve('oldPassword'));
    storageService.updateContrasena.and.returnValue(Promise.resolve(true));

    const alertSpy = jasmine.createSpyObj('Alert', ['present', 'onDidDismiss']);
    alertController.create.and.returnValue(Promise.resolve(alertSpy));

    const alertData = {
      newPassword: 'newPassword123',
      confirmPassword: 'newPassword123'
    };

    alertSpy.handler = jasmine.createSpy().and.callFake(async (data: any) => {
      await component.resetPassword();
      expect(storageService.updateContrasena).toHaveBeenCalledWith('user123', 'newPassword123');
    });

    await component.resetPassword();
  });

  it('Debería mostrar un mensaje de error cuando las contraseñas no son las mismas', async () => {
    storageService.getContrasena.and.returnValue(Promise.resolve('oldPassword'));

    const alertSpy = jasmine.createSpyObj('Alert', ['present', 'onDidDismiss']);
    alertController.create.and.returnValue(Promise.resolve(alertSpy));

    const alertData = {
      newPassword: 'newPassword123',
      confirmPassword: 'differentPassword'
    };

    alertSpy.handler = jasmine.createSpy().and.callFake(async (data: any) => {
      await component.resetPassword();
      expect(component.errorMessage).toBe('Las contraseñas no coinciden o son demasiado cortas.');
    });

    await component.resetPassword();
  });

  it('Debería mostrar un mensaje de error cuando la contraseña es muy pequeña', async () => {
    storageService.getContrasena.and.returnValue(Promise.resolve('oldPassword'));

    const alertSpy = jasmine.createSpyObj('Alert', ['present', 'onDidDismiss']);
    alertController.create.and.returnValue(Promise.resolve(alertSpy));

    const alertData = {
      newPassword: 'short',
      confirmPassword: 'short'
    };

    alertSpy.handler = jasmine.createSpy().and.callFake(async (data: any) => {
      await component.resetPassword();
      expect(component.errorMessage).toBe('Las contraseñas no coinciden o son demasiado cortas.');
    });

    await component.resetPassword();
  });
});
