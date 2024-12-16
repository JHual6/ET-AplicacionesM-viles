import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AsignaturaPage } from './asignatura.page';
import { ApiService } from 'src/app/servicios/api.service';
import { DatabaseService } from 'src/app/servicios/database.service';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

class MockApiService {
  generateQrCode() {
    return of(new Blob()); 
  }
}

class MockDatabaseService {
  getAsignaturaClasesAsistencia() {
    return of([
      {
        asistencia: 1,
        nombre_asignatura: 'Matemáticas',
        color_asignatura: 'FF5733',
        color_seccion_asignatura: 'C70039',
      },
      {
        asistencia: 0,
        nombre_asignatura: 'Matemáticas',
        color_asignatura: 'FF5733',
        color_seccion_asignatura: 'C70039',
      },
    ]);
  }
}

describe('AsignaturaPage', () => {
  let component: AsignaturaPage;
  let fixture: ComponentFixture<AsignaturaPage>;
  let apiService: ApiService;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AsignaturaPage],
      imports: [IonicModule.forRoot(), FormsModule], 
      providers: [
        { provide: ApiService, useClass: MockApiService },
        { provide: DatabaseService, useClass: MockDatabaseService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: { get: () => '1' },
              queryParamMap: { get: () => '123' },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AsignaturaPage);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
    databaseService = TestBed.inject(DatabaseService);
    fixture.detectChanges();
  });

  it('Debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('Debería cargar los datos de las asignaturas y calcular el porcentaje de asistencia', fakeAsync(() => {
    spyOn(databaseService, 'getAsignaturaClasesAsistencia').and.callThrough();
    component.ngOnInit();
    tick(); 
    fixture.detectChanges();

    expect(databaseService.getAsignaturaClasesAsistencia).toHaveBeenCalled();
    expect(component.asignatura.nombre_asignatura).toBe('Matemáticas');
    expect(component.porcentajeAsistencia).toBe(50);
  }));

  it('Debería crear un código QR', fakeAsync(() => {
    const inputText = { value: 'test data' };
    spyOn(apiService, 'generateQrCode').and.callThrough();
    component.generateQrCode(inputText);
    tick(); 

    expect(apiService.generateQrCode).toHaveBeenCalledWith('test data');
    expect(component.qrCodeData).toBeDefined(); 
  }));
});
