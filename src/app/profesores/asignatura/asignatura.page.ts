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
  porcentajeAsistencia: number = 0; // Variable para almacenar el porcentaje de asistencia
  fechaClase: string = ''; // Fecha seleccionada en el input
  codigoQrClase: string = ''; // Código QR generado

  constructor(private apiService: ApiService, private route: ActivatedRoute, private databaseservice: DatabaseService) {}

  ngOnInit() {
    this.idAsignatura = this.route.snapshot.paramMap.get('id'); // Obtiene el ID de la asignatura desde la ruta
    this.idProfesor = this.route.snapshot.queryParamMap.get('idProfesor'); // Obtiene el ID del profesor desde los parámetros de la ruta
    console.log('ID Asignatura:', this.idAsignatura);
    console.log('ID Profesor:', this.idProfesor);

    if (this.idAsignatura && this.idProfesor) {
      this.cargarDatosAsignatura(this.idAsignatura, this.idProfesor); // Llama a la función para cargar los datos de la asignatura
    } else {
      console.error('No se proporcionó el ID de la asignatura o del profesor.');
    }
  }

  // Método para cargar los datos de la asignatura y calcular la asistencia
  cargarDatosAsignatura(idAsignatura: string, idProfesor: string) {
    this.databaseservice.getAsignaturaClasesAsistencia(idProfesor, idAsignatura).subscribe({
      next: (asistenciaData: any[]) => {
        // Filtramos las clases donde la asistencia es 1 (presente)
        const totalAsistencias = asistenciaData.length;
        const asistenciasPresentes = asistenciaData.filter(a => a.asistencia === 1).length;
  
        // Calculamos el porcentaje de asistencia
        this.porcentajeAsistencia = (asistenciasPresentes / totalAsistencias) * 100;
        
        // Ahora vamos a buscar los valores del nombre, color y color de la sección
        // (Este ejemplo asume que los valores provienen de la respuesta de la consulta)
        this.asignatura = {
          nombre_asignatura: asistenciaData[0].nombre_asignatura || 'Asignatura Desconocida', // Valor del nombre de la asignatura
          color_asignatura: asistenciaData[0].color_asignatura || '#FFFFFF', // Color de la asignatura (default blanco)
          color_seccion_asignatura: asistenciaData[0].color_seccion_asignatura || '#000000', // Color de la sección (default negro)
          seccion_asignatura: this.porcentajeAsistencia.toFixed(2), // Asistencia en porcentaje
        };
  
        // Guarda estos valores en las variables respectivas
        const nombreAsignatura = this.asignatura.nombre_asignatura;
        const colorAsignatura = this.asignatura.color_asignatura;
        const colorSeccionAsignatura = this.asignatura.color_seccion_asignatura;
  
        // Imprime los valores en la consola para verificar
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

    // Genera el código QR basado en la fecha
    this.codigoQrClase = await this.apiService.generateQrCode(this.fechaClase);

    // Inserta la clase en el servidor
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
     },
     (error) => {
       console.error('Error al insertar la clase:', error);
     }
   );
  }
  getTextColor(color: string): string {
    // Convertimos el color hexadecimal en valores RGB
    const r = parseInt(color.slice(0, 2), 16);
    const g = parseInt(color.slice(2, 4), 16);
    const b = parseInt(color.slice(4, 6), 16);
  
    // Calculamos el brillo del color
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
    // Si el brillo es bajo, devolvemos blanco; de lo contrario, negro
    return brightness < 128 ? '#ffffff' : '#000000';
  }
}
