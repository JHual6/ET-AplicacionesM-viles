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
  nombreEstudiante: string | null = null;
  asignatura: any = {};
  porcentajeAsistencia: number = 0;
  idClase: number | null = null;
  id_clases: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private alertController: AlertController,
    private apiService: ApiService,
    private barcodeScanner: BarcodeScanner,
    private databaseService: DatabaseService
  ) {}

  ngOnInit() {
    this.idAsignatura = Number(this.route.snapshot.paramMap.get('id_asignatura'));
    this.nombreEstudiante = this.route.snapshot.paramMap.get('id_estudiante');

    if (this.idAsignatura && this.nombreEstudiante) {
      this.cargarDatosAsignatura(this.idAsignatura, this.nombreEstudiante);
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
            id_estudiante: asignaturaData.id_estudiante,
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

  calcularPorcentaje(asistencias: number, totalAsistencias: number): number {
    return totalAsistencias > 0 ? (asistencias / totalAsistencias) * 100 : 0;
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

  async escanearQR() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
      });

      if (image?.dataUrl) {
        const decodedData = await this.decodeQrFromImage(image.dataUrl);
        if (decodedData) {
          this.qrCodeData = decodedData;
          this.verificarQR();
        } else {
          console.error('No se pudo decodificar el QR escaneado.');
        }
      }
    } catch (error) {
      console.error('Error al escanear el QR:', error);
      this.showErrorAlert('No se pudo abrir la cámara.');
    }
  }

  async decodeQrFromImage(imageDataUrl: string): Promise<string | null> {
    try {
      const response = await this.apiService.readQrCode(imageDataUrl).toPromise();
      return response[0]?.symbol[0]?.data || null;
    } catch (error) {
      console.error('Error al decodificar QR desde imagen:', error);
      return null;
    }
  }

  async verificarQR() {
    const fechaClase = new Date().toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD
  
    const codigoQrClase = await this.obtenerCodigoQrClase();
    if (!codigoQrClase) {
      console.error('No se pudo obtener el código QR de la clase.');
      return;
    }
  
    console.log('Código QR obtenido de la clase:', codigoQrClase);
    console.log('Código QR escaneado:', this.qrCodeData);
  
    // Si el QR obtenido es una URL, extraemos el texto de la URL
    const textoCodigoQrClase = new URL(codigoQrClase).searchParams.get('data'); // Extraemos el texto desde el parámetro 'data'
  
    // Compara el texto obtenido de la URL con el texto escaneado
    if (this.qrCodeData === textoCodigoQrClase && this.id_clases) {
      console.log('¡Los códigos QR coinciden!');
      if (this.idAsignatura && this.nombreEstudiante) {
        this.actualizarAsistencia(this.id_clases, fechaClase, this.asignatura.id_estudiante);
      }
    } else {
      console.error('Los códigos QR no coinciden.');
    }
  }
  
 
  async obtenerCodigoQrClase(): Promise<string | null> {
    const fechaClase = new Date().toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD
  
    if (this.idAsignatura) {
      try {
        const url = `https://app-8d6ef5f9-d10f-4820-80a4-175e4ea1fb5c.cleverapps.io/clases/codigoQR?id_asignatura=${this.idAsignatura}&fecha_clase=${fechaClase}`;
        
        const response = await fetch(url); // Hacemos la solicitud GET a la API
        const data = await response.json(); // Convertimos la respuesta a JSON
  
        if (Array.isArray(data) && data.length > 0) {
          const qrData = data[0];
          this.id_clases = qrData?.id_clase || null;
          return qrData?.codigoqr_clase || null; // Retornamos el código QR si existe, o null si no
        } else {
          console.error('No se encontraron datos para el código QR.');
          return null;
        }
      } catch (error) {
        console.error('Error al obtener el código QR de la clase:', error);
        return null;
      }
    } else {
      console.error('No se proporcionó un idAsignatura.');
      return null;
    }
  }

  compararQRConBaseDeDatos(qrUrl: string, fechaClase: string) {
    this.apiService.readQrCode(qrUrl).subscribe({
      next: (response) => {
        const decodedData = response[0]?.symbol[0]?.data || null;

        if (decodedData && this.qrCodeData === decodedData && this.id_clases) {
          console.log('¡Los códigos QR son iguales!');
          this.actualizarAsistencia(this.id_clases, fechaClase, this.asignatura.id_estudiante);
        } else {
          console.error('Los códigos QR son diferentes.');
        }
      },
      error: (error) => {
        console.error('Error al decodificar el QR desde la URL:', error);
      },
    });
  }

  actualizarAsistencia(idClase: number, fechaAsistencia: string, idEstudiante: number) {
    if (idClase && idEstudiante) {
      this.databaseService.actualizarAsistencia(idClase, fechaAsistencia, idEstudiante).subscribe({
        next: () => console.log('Asistencia actualizada exitosamente.'),
        error: (error) => console.error('Error al actualizar la asistencia:', error),
      });
    }
  }

  async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
