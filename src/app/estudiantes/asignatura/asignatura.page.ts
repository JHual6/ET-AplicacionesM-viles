import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/servicios/api.service';
import { DatabaseService } from '../../servicios/database.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { AlertController } from '@ionic/angular';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';

@Component({
  selector: 'app-asignatura',
  templateUrl: './asignatura.page.html',
  styleUrls: ['./asignatura.page.scss']
})
export class AsignaturaPage implements OnInit {
  qrCodeData: string | null = null;
  idAsignatura: number | null = null;
  nombre_estudiante: string | null = null; // ID del estudiante
  asignatura: any = {}; 
  porcentajeAsistencia: number = 0; // Porcentaje de asistencia

  constructor(private route: ActivatedRoute, private alertController: AlertController, private apiService: ApiService, private barcodeScanner: BarcodeScanner, private databaseService: DatabaseService) {}

  ngOnInit() {
    this.idAsignatura = Number(this.route.snapshot.paramMap.get('id_asignatura'));
    this.nombre_estudiante = this.route.snapshot.paramMap.get('id_estudiante'); // Obtiene el ID del estudiante desde la ruta

    console.log('ID Asignatura:', this.idAsignatura);
    console.log('ID Estudiante:', this.nombre_estudiante);

    if (this.idAsignatura && this.nombre_estudiante) {
      this.cargarDatosAsignatura(this.idAsignatura, this.nombre_estudiante); // Cargar datos específicos para el estudiante
    } else {
      console.error('Faltan parámetros de la asignatura o del estudiante.');
    }
  }

  cargarDatosAsignatura(idAsignatura: number, idEstudiante: string) {
    this.databaseService.getAsignaturaDetalle(idAsignatura, idEstudiante).subscribe({
      next: (data: any[]) => {
        // Verifica si hay datos en el array
        if (data.length > 0) {
          const asignaturaData = data[0]; // Obtiene la primera asignatura del array
  
          const totalAsistencias = asignaturaData.count_total_asistencias;
          const asistenciasPresentes = asignaturaData.count_asistencias;
  
          console.log(asignaturaData);
  
          this.porcentajeAsistencia = totalAsistencias > 0
            ? (asistenciasPresentes / totalAsistencias) * 100
            : 0;
  
          this.asignatura = {
            nombre_asignatura: asignaturaData.nombre_asignatura,
            color_asignatura: asignaturaData.color_asignatura,
            color_seccion_asignatura: asignaturaData.color_seccion_asignatura,
            seccion_asignatura: asignaturaData.seccion_asignatura,
          };
  
          console.log('Datos de asignatura cargados:', this.asignatura);
        } else {
          console.error('No se encontraron asignaturas para el estudiante.');
        }
      },
      error: (error) => {
        console.error('Error al cargar datos de la asignatura:', error);
      },
    });
  }
 

  async escanearQR() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl, 
      });
  
      if (image && image.dataUrl) {
        const base64Image = image.dataUrl;
        console.log('Imagen capturada:', base64Image);
      }
  
    } catch (error) {
      console.error('Error abriendo la cámara:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo abrir la cámara.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  getTextColor(color: string | undefined): string {
    if (!color || color.length < 6) {
      return '#000000'; // Color predeterminado
    }
  
    const r = parseInt(color.slice(0, 2), 16);
    const g = parseInt(color.slice(2, 4), 16);
    const b = parseInt(color.slice(4, 6), 16);
  
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
    return brightness < 128 ? '#ffffff' : '#000000';
  }
  
}
