import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { IngresoPage } from './ingreso.page';
import { Storage } from '@ionic/storage-angular'; 
import { StorageService } from '../servicios/storage.service'; 
import { Router } from '@angular/router';

describe('IngresoPage', () => {
  let component: IngresoPage;
  let fixture: ComponentFixture<IngresoPage>;
  let storageSpy: jasmine.SpyObj<Storage>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let navControllerSpy: jasmine.SpyObj<NavController>;

  beforeEach(async () => {
    storageSpy = jasmine.createSpyObj('Storage', ['create', 'get', 'set', 'remove']);
    storageServiceSpy = jasmine.createSpyObj('StorageService', ['getUsuarios', 'getContrasena', 'addUsuario', 'init']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    navControllerSpy = jasmine.createSpyObj('NavController', ['navigateForward', 'navigateBack']);

    await TestBed.configureTestingModule({
      declarations: [IngresoPage],
      imports: [IonicModule.forRoot(), FormsModule],
      providers: [
        { provide: Storage, useValue: storageSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: NavController, useValue: navControllerSpy }, 
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IngresoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Debería ser creada', () => {
    expect(component).toBeTruthy();
  });
});
