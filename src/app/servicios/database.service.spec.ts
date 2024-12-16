import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'; 
import { DatabaseService } from './database.service';

describe('DatabaseService', () => {
  let service: DatabaseService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 
      providers: [DatabaseService],
    });
    service = TestBed.inject(DatabaseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('Debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('Debería buscar las asignaturas', () => {
    const mockAsignaturas = [{ id: 1, nombre: 'Matemáticas' }, { id: 2, nombre: 'Historia' }];

    service.getAsignaturas().subscribe((asignaturas) => {
      expect(asignaturas).toEqual(mockAsignaturas);
    });

    const req = httpMock.expectOne('http://localhost:4000/asignaturas');
    expect(req.request.method).toBe('GET');
    req.flush(mockAsignaturas); 
  });

  it('Debería buscar las asignaturas por el estudiante', () => {
    const mockAsignaturas = [{ id: 1, nombre: 'Matemáticas' }];

    service.getAsignaturasPorEstudiante('usuario1').subscribe((asignaturas) => {
      expect(asignaturas).toEqual(mockAsignaturas);
    });

    const req = httpMock.expectOne('http://localhost:4000/asignaturas/estudiante/usuario1');
    expect(req.request.method).toBe('GET');
    req.flush(mockAsignaturas);
  });

  it('Debería buscar todas las clases', () => {
    const mockClases = [{ id: 1, nombre: 'Clase 1' }, { id: 2, nombre: 'Clase 2' }];

    service.getClases().subscribe((clases) => {
      expect(clases).toEqual(mockClases);
    });

    const req = httpMock.expectOne('http://localhost:4000/clases');
    expect(req.request.method).toBe('GET');
    req.flush(mockClases); 
  });

  it('Debería buscar las asignaturas por los profesores', () => {
    const mockAsignaturas = [{ id: 1, nombre: 'Física' }];

    service.getAsignaturasByProfesor('profesor1').subscribe((asignaturas) => {
      expect(asignaturas).toEqual(mockAsignaturas);
    });

    const req = httpMock.expectOne('http://localhost:4000/asignaturas/profesor/profesor1');
    expect(req.request.method).toBe('GET');
    req.flush(mockAsignaturas); 
  });

  it('Debería buscar los estudiantes', () => {
    const mockEstudiantes = [{ id: 1, nombre: 'Juan Pérez' }, { id: 2, nombre: 'Ana Gómez' }];

    service.getEstudiantes().subscribe((estudiantes) => {
      expect(estudiantes).toEqual(mockEstudiantes);
    });

    const req = httpMock.expectOne('http://localhost:4000/estudiantes');
    expect(req.request.method).toBe('GET');
    req.flush(mockEstudiantes); 
  });
});
