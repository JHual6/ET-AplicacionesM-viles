import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private baseUrl = 'https://app-4f43c21f-d289-4bc7-b067-5a5679944ef4.cleverapps.io'; // Cambia esta URL si es necesario

  constructor(private http: HttpClient) {}

  // Obtener todas las asignaturas
  getAsignaturas(): Observable<any> {
    return this.http.get(`${this.baseUrl}/asignaturas`);
  }
  // Obtener las asignaturas por los estudiantes
  getAsignaturasPorEstudiante(usuario: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/asignaturas/estudiante/${usuario}`);
  }

  // Obtener asignatura por id de asignatura y nombre de usuario
  getAsignaturaDetalle(idAsignatura: number, usuarioEstudiante: string): Observable<any> {
    const url = `${this.baseUrl}/asignatura/${idAsignatura}/${usuarioEstudiante}`;
    return this.http.get<any[]>(url);
  }

  // Obtener todas las clases
  getClases(): Observable<any> {
    return this.http.get(`${this.baseUrl}/clases`);
  }

  // Clases por asignatura
  getClasesByAsignatura(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/clases/asignatura/${id}`);
  }

  // Obtener asignaturas por profesor
  getAsignaturasByProfesor(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/asignaturas/profesor/${id}`);
  }

  // Obtener asignaturas por usuario del profesor
  getAsignaturasByUsuarioProfesor(usuario: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/asignaturas/profesor/usuario/${usuario}`);
  }

  // Obtener estudiantes
  getEstudiantes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/estudiantes`);
  }

  // Obtener profesores
  getProfesores(): Observable<any> {
    return this.http.get(`${this.baseUrl}/profesores`);
  }

  // Obtener detalle de asistencia por estudiante y clase
  getAsistenciaByEstudianteClase(idEstudiante: string, idClase: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/asistencia/${idEstudiante}/${idClase}`);
  }

  // Obtener detalle de asistencia por estudiante
  getAsistenciaByEstudiante(usuario: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/asistencia/estudiante/${usuario}`);
  }

  // Obtener profesor por usuario
  getProfesorByUsuario(usuario: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/profesores/usuario/${usuario}`);
  }

  // Obtener estudiante por usuario
  getEstudianteByUsuario(usuario: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/estudiantes/usuario/${usuario}`);
  }

  // Obtener asignatura por ID
  getAsignaturaById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/asignatura/${id}`);
  }

  // Obtener asignaturas, clases y asistencias
  getAsignaturaClasesAsistencia(idProfesor: string, idAsignatura: string): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/asignatura-clases-asistencia?idProfesor=${idProfesor}&idAsignatura=${idAsignatura}`
    );
  }
  // Insertar una clase en el servidor
  insertarClase(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/insertClase`, data);
  }
  // Obtener estudiantes por ID de asignatura
  getEstudiantesPorAsignatura(idAsignatura: number): Observable<any> {
    const url = `${this.baseUrl}/asignaturas/${idAsignatura}/estudiantes`;
    return this.http.get<any>(url);
  }
  // Insertar una nueva asistencia en el servidor
  insertarAsistencia(data: {
    id_clase: number;
    id_estudiante: number;
    asistencia: boolean;
    fecha_asistencia: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/insert/asistencia`, data);
  }
  // Obtener clases por fecha
  getClasesPorFecha(fecha: string): Observable<any> {
    const url = `${this.baseUrl}/clases/fecha/${fecha}`;
    return this.http.get<any>(url);
  }  
  // Método para insertar una asignatura
  insertAsignatura(asignatura: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/insertAsignatura`, asignatura);
  }
}

