import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private baseUrl = 'https://app-8d6ef5f9-d10f-4820-80a4-175e4ea1fb5c.cleverapps.io'; // Cambia esta URL si es necesario

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
  deleteAsignatura(id_asignatura: number) {
    console.log(`Eliminando asignatura con ID: ${id_asignatura}`);
    return this.http.delete<any>(`${this.baseUrl}/deleteAsignatura/${id_asignatura}`);
  }
  deleteClasesAsociadas(id_asignatura: number) {
    console.log(`Eliminando clases asociadas con la asignatura ID: ${id_asignatura}`);
    return this.http.delete<any>(`${this.baseUrl}/deleteClases/${id_asignatura}`);
  }
  getClaseInscripcion(id_asignatura: number) {
    console.log(`Obteniendo ID de la clase de inscripción para la asignatura con ID: ${id_asignatura}`);
    return this.http.get<any>(`${this.baseUrl}/getClaseInscripcion/${id_asignatura}`);
  }
  insertAsistencia(id_clase: number, id_estudiante: number, fecha_asistencia: string) {
    console.log(`Insertando asistencia: Clase ID ${id_clase}, Estudiante ID ${id_estudiante}, Fecha ${fecha_asistencia}`);
    const body = { id_clase, id_estudiante, fecha_asistencia };
    return this.http.post<any>(`${this.baseUrl}/insertAsistencia`, body);
  }
  insertAsistenciaautomatica(id_clase: number, id_estudiante: number, fecha_asistencia: string) {
    return new Observable(observer => {
      this.http.post(`${this.baseUrl}/insertAsistencia/automatica`, { id_clase, id_estudiante, fecha_asistencia })
        .subscribe(
          response => {
            observer.next(response);
            observer.complete();
          },
          error => {
            console.error('Error al insertar la asistencia:', error);
            observer.error(error);
          }
        );
    });
  }
  getEstudiantesAsignatura(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/getEstudiantesAsignatura/${id}`);
  }  
  // Obtener el código QR de la clase según la asignatura y fecha
  getCodigoQRClase(id_asignatura: number, fecha_clase: string): Observable<any> {
    const url = `${this.baseUrl}/clase/codigoqr`;
    const params = new HttpParams()
      .set('id_asignatura', id_asignatura.toString())
      .set('fecha_clase', fecha_clase);

    return this.http.get<any>(url, { params }).pipe(
      catchError(error => {
        console.error('Error al obtener el código QR:', error);
        return throwError('Hubo un error al obtener el código QR. Por favor, inténtelo de nuevo más tarde.');
      })
    );
  }
  registrarAsistencia(
    idClase: number,
    idEstudiante: string,
    fechaAsistencia: string
  ): Observable<any> {
    const payload = {
      id_clase: idClase,
      id_estudiante: idEstudiante,
      fecha_asistencia: fechaAsistencia,
    };

    return this.http.post(`${this.baseUrl}/insertarCorrecta/asistencia`, payload);
  }
  getCodigoQRdeClase(idAsignatura: number, fechaClase: string): Observable<any> {
    const url = `${this.baseUrl}/clases/codigoQR`;
    return this.http.get<any>(url, {
      params: {
        id_asignatura: idAsignatura.toString(),
        fecha_clase: fechaClase,
      },
    });
  }
}