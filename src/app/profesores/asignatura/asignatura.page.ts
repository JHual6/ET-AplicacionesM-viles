import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/servicios/api.service';
import { DatabaseService } from 'src/app/servicios/database.service';

@Component({
  selector: 'app-asignatura',
  templateUrl: './asignatura.page.html',
  styleUrls: ['./asignatura.page.scss']
})
export class AsignaturaPage implements OnInit {
  qrCodeData: string | null = null;
  idAsignatura: string | null = null;
  idProfesor: string | null = null;
  asignatura: any;
  porcentajeAsistencia: number = 0; 
  fechaClase: string = '';
  codigoQrClase: string = ''; 
  estudiantes: any[] = []; 

  constructor(private apiService: ApiService, private route: ActivatedRoute, private databaseservice: DatabaseService) {}

  ngOnInit() {
    this.idAsignatura = this.route.snapshot.paramMap.get('id'); 
    this.idProfesor = this.route.snapshot.queryParamMap.get('idProfesor'); 
    console.log('ID Asignatura:', this.idAsignatura);
    console.log('ID Profesor:', this.idProfesor);

    if (this.idAsignatura && this.idProfesor) {
      this.cargarDatosAsignatura(this.idAsignatura, this.idProfesor); 
      this.obtenerEstudiantesAsignatura();
    } else {
      console.error('No se proporcionó el ID de la asignatura o del profesor.');
    }
  }

  // Método para cargar los datos de la asignatura y calcular la asistencia
  cargarDatosAsignatura(idAsignatura: string, idProfesor: string) {
    this.databaseservice.getAsignaturaClasesAsistencia(idProfesor, idAsignatura).subscribe({
      next: (asistenciaData: any[]) => {
        const totalAsistencias = asistenciaData.length;
        const asistenciasPresentes = asistenciaData.filter(a => a.asistencia === 1).length;
        this.porcentajeAsistencia = (asistenciasPresentes / totalAsistencias) * 100;
        this.asignatura = {
          nombre_asignatura: asistenciaData[0].nombre_asignatura || 'Asignatura Desconocida', // Valor del nombre de la asignatura
          color_asignatura: asistenciaData[0].color_asignatura || '#FFFFFF', // Color de la asignatura (default blanco)
          color_seccion_asignatura: asistenciaData[0].color_seccion_asignatura || '#000000', // Color de la sección (default negro)
          seccion_asignatura: this.porcentajeAsistencia.toFixed(2), // Asistencia en porcentaje
        };

        const nombreAsignatura = this.asignatura.nombre_asignatura;
        const colorAsignatura = this.asignatura.color_asignatura;
        const colorSeccionAsignatura = this.asignatura.color_seccion_asignatura;

        console.log('Nombre Asignatura:', nombreAsignatura);
        console.log('Color Asignatura:', colorAsignatura);
        console.log('Color Sección Asignatura:', colorSeccionAsignatura);

        console.log('Asignatura cargada:', this.asignatura);
      },
      error: (error) => {
        console.error('Error al cargar los datos de asistencia:', error);
      }
    });
  }

  // Generar el código QR
  async generateQrCode() {
    if (!this.fechaClase) {
      alert('Por favor, ingresa una fecha válida.');
      return;
    }
    this.codigoQrClase = await this.apiService.generateQrCode(this.fechaClase);
    this.insertarClase();
  }

  // Función para insertar los datos en el servidor
  insertarClase() {
    const data = {
      id_asignatura: this.idAsignatura,
      fecha_clase: this.fechaClase,
      codigoqr_clase: this.codigoQrClase,
    };
    this.databaseservice.insertarClase(data).subscribe(
      (response: any) => {
        console.log(response);
        this.insertarAsistenciaAutomatica(response.id);
      },
      (error) => {
        console.error('Error al insertar la clase:', error);
      }
    );
  }

  // Función para insertar la asistencia automática para cada estudiante
  insertarAsistenciaAutomatica(idClase: number) {
    if (this.estudiantes.length > 0) {
      const fechaAsistencia = this.fechaClase;
      this.estudiantes.forEach(estudiante => {
        if (estudiante.id_estudiante) {
          this.databaseservice.insertAsistenciaautomatica(idClase, estudiante.id_estudiante, fechaAsistencia).subscribe(
            response => {
              console.log('Asistencia insertada para estudiante:', estudiante.id_estudiante);
            },
            error => {
              console.error('Error al insertar asistencia para el estudiante:', estudiante.id_estudiante, error);
            }
          );
        } else {
          console.error('El estudiante no tiene un ID válido:', estudiante);
        }
      });
    }
  }

  getTextColor(color: string): string {
    const r = parseInt(color.slice(0, 2), 16);
    const g = parseInt(color.slice(2, 4), 16);
    const b = parseInt(color.slice(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128 ? '#ffffff' : '#000000';
  }

  obtenerEstudiantesAsignatura() {
    if (this.idAsignatura) {
      this.databaseservice.getEstudiantesAsignatura(Number(this.idAsignatura)).subscribe({
        next: (data: any[]) => {
          this.estudiantes = data;
        },
        error: (error) => {
          console.error('Error al obtener estudiantes:', error);
        }
      });
    }
  }
}
