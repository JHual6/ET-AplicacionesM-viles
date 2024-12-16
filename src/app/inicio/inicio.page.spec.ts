import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { InicioPage } from './inicio.page';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ApiService } from '../servicios/api.service';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { StorageService } from '../servicios/storage.service';
import { AutenticacionService } from '../servicios/autenticacion.service';
import { DatabaseService } from '../servicios/database.service';

// Mock de los servicios
class MockApiService {}
class MockBarcodeScanner {}
class MockStorageService {
  getRol(username: string) {
    return of('estudiante'); 
  }
}
class MockAutenticacionService {
  getRolUsuario() {
    return 'estudiante'; 
  }
}
class MockDatabaseService {
  getAsignaturasPorEstudiante(username: string) {
    return of([
      {
        usuario_estudiante: 'usuario1',
        id_asignatura: 1,
        nombre_asignatura: 'Matemáticas',
        color_asignatura: 'FF5733',
        color_seccion_asignatura: 'C70039',
        siglas_asignatura: 'MAT101',
        seccion_asignatura: 1,
        modalidad_asignatura: 'presencial',
        count_asistencias: 10,
        count_total_asistencias: 15,
        porcentaje_asistencia: 66.67,
      },
    ]);
  }

  getAsignaturasByUsuarioProfesor(username: string) {
    return of([
      {
        id_asignatura: 1,
        nombre_asignatura: 'Física',
        profesor: 'Profesor1',
      },
    ]);
  }
}

describe('InicioPage', () => {
  let component: InicioPage;
  let fixture: ComponentFixture<InicioPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InicioPage],
      imports: [IonicModule.forRoot(), RouterTestingModule],
      providers: [
        { provide: ApiService, useClass: MockApiService },
        { provide: BarcodeScanner, useClass: MockBarcodeScanner },
        { provide: StorageService, useClass: MockStorageService },
        { provide: AutenticacionService, useClass: MockAutenticacionService },
        { provide: DatabaseService, useClass: MockDatabaseService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InicioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Debería ser creado', () => {
    expect(component).toBeTruthy();
  });

  it('Debería cargar las asignaturas de los estudiantes correctamente', () => {
    component.cargarAsignaturasPorEstudiante();
    fixture.detectChanges();
    expect(component.asignaturasE.length).toBeGreaterThan(0);
    expect(component.asignaturasE[0].nombre_asignatura).toBe('Matemáticas');
  });

  it('Debería cargar las asignaturas de los profesores correctamente', () => {
    component.getAsignaturasByUsuario();
    fixture.detectChanges();
    expect(component.asignaturasP.length).toBeGreaterThan(0);
    expect(component.asignaturasP[0].nombre_asignatura).toBe('Física');
  });

  it('Debería redirigirse a la página de asignaturas para los estudiantes si tiene el rol estudiante', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.irEstudianteAsignatura(1, 'usuario1');
    expect(routerSpy).toHaveBeenCalledWith(['/asignatura/1/usuario1']);
  });

  it('Debería redirigirse a la página de acceso denegado si el rol no es de estudiante', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    spyOn(component['authService'], 'getRolUsuario').and.returnValue('profesor');
    component.irEstudianteAsignatura(1, 'usuario1');
    expect(routerSpy).toHaveBeenCalledWith(['/acceso-denegado']);
  });

  it('Deberia ser enviado a la página de acceso denegado si el rol no es de profesor', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    spyOn(component['authService'], 'getRolUsuario').and.returnValue('estudiante');
    component.verAsignatura(1, 'profesor1');
    expect(routerSpy).toHaveBeenCalledWith(['/acceso-denegado']);
  });

  it('Debería ser redirigido a la página de usuarios si el rol es de administrador', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    spyOn(component['authService'], 'getRolUsuario').and.returnValue('administrador');
    component.paginaUsuarios();
    expect(routerSpy).toHaveBeenCalledWith(['/usuarios']);
  });

  it('Deberia ser enviado a la página de acceso denegado si el rol no es de administrador', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    spyOn(component['authService'], 'getRolUsuario').and.returnValue('estudiante');
    component.paginaUsuarios();
    expect(routerSpy).toHaveBeenCalledWith(['/acceso-denegado']);
  });
});
