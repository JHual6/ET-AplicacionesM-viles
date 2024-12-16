// Importaciones necesarias
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Camera, CameraResultType } from '@capacitor/camera';
import { ApiService } from '../servicios/api.service';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { StorageService } from '../servicios/storage.service';
import { AutenticacionService } from '../servicios/autenticacion.service';
import { DatabaseService } from '../servicios/database.service';
import { FirestoneMensajeService } from '../servicios/firestone-mensaje.service';


// Tipo para las asignaturas
type Asignatura = {
  usuario_estudiante: string;
  id_asignatura: number;
  nombre_asignatura: string;
  color_asignatura: string;
  color_seccion_asignatura: string;
  siglas_asignatura: string;
  seccion_asignatura: number;
  modalidad_asignatura: string;
  count_asistencias: number;
  count_total_asistencias: number;
  porcentaje_asistencia: number;
};

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  asignaturasE: Asignatura[] = []; // Asignaturas de estudiantes
  username: string = "";
  rol: string = "";
  fondoClase: string = 'fondo';
  asignaturaE: any = null; // Asignatura seleccionada por estudiantes
  isLoading: boolean = true;
  asignaturasP: any[] = []; // Asignaturas de profesores
  asignaturaP: any = null;  // Asignatura seleccionada por profesores

  constructor(
    private route: ActivatedRoute,
    private alertController: AlertController,
    private apiService: ApiService,
    private barcodeScanner: BarcodeScanner,
    private storageService: StorageService,
    private authService: AutenticacionService,
    private router: Router,
    private databaseService: DatabaseService,
    private firestoneMensajeService: FirestoneMensajeService
  ) {}

  // Función para inicializar la página
  ngOnInit() {
    
    this.firestoneMensajeService.requestPermission();
    this.firestoneMensajeService.receiveMessage();

    this.route.queryParams.subscribe(params => {
      if (params['username']) {
        this.username = params['username'];
        this.obtenerRol(this.username).then(() => {
          if (this.rol === 'profesor') {
            this.getAsignaturasByUsuario();
          } else if (this.rol === 'estudiante') {
            this.cargarAsignaturasPorEstudiante();
          } else {
            console.error('Rol no reconocido:', this.rol);
          }
        });
      }
    });
  }

  // Obtener el rol del usuario
  async obtenerRol(username: string) {
    try {
      const rol = await this.storageService.getRol(username);
      if (rol) {
        this.rol = rol;
        this.setFondoClase();
      } else {
        console.error('Rol no encontrado para el usuario:', username);
      }
    } catch (error) {
      console.error('Error obteniendo el rol:', error);
    }
  }

  // Cambiar el fondo dependiendo del rol
  setFondoClase() {
    switch (this.rol) {
      case 'estudiante':
        this.fondoClase = 'fondo fondo-estudiante';
        break;
      case 'profesor':
        this.fondoClase = 'fondo fondo-profesor';
        break;
      case 'administrador':
        this.fondoClase = 'fondo fondo-administrador';
        break;
      default:
        this.fondoClase = 'fondo';
    }
  }

  // Cargar asignaturas para estudiantes
  cargarAsignaturasPorEstudiante() {
    this.databaseService.getAsignaturasPorEstudiante(this.username).subscribe({
      next: (data: Asignatura[]) => {
        this.asignaturasE = data.map((asignatura: Asignatura) => ({
          ...asignatura,
          color_asignatura: `#${asignatura.color_asignatura}`,
          color_seccion_asignatura: `#${asignatura.color_seccion_asignatura}`,
        }));
        console.log('Asignaturas (Estudiantes):', this.asignaturasE);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar asignaturas:', err);
        this.isLoading = false;
      },
    });
  }

  // Cargar asignaturas para profesores
  getAsignaturasByUsuario() {
    this.databaseService.getAsignaturasByUsuarioProfesor(this.username).subscribe(
      (data) => {
        console.log('Asignaturas (Profesores):', data);
        this.asignaturasP = data;
      },
      (error) => {
        console.error('Error al obtener asignaturas:', error);
      }
    );
  }
  // Redirigir a la página de asignaturas como estudiante
  irEstudianteAsignatura(id_asignatura: number, usuario_estudiante: string){
    const userRole = this.authService.getRolUsuario();
    console.log('Rol de usuario:', userRole);

    if (userRole === 'estudiante') {
      this.router.navigate([`/asignatura/${id_asignatura}/${usuario_estudiante}`]);
    } else {
      console.error('No tienes permisos para acceder a esta asignatura.');
      this.router.navigate(['/acceso-denegado']);
    }
  }

  // Ver asignatura como profesor
  verAsignatura(idAsignatura: number, idProfesor: string) {
    const userRole = this.authService.getRolUsuario();
    console.log('Rol de usuario:', userRole);

    if (userRole === 'profesor') {
      this.router.navigate([`/asignatura/${idAsignatura}`], {
        queryParams: { idProfesor: idProfesor }
      });
    } else {
      console.error('No tienes permisos para acceder a esta asignatura.');
      this.router.navigate(['/acceso-denegado']);
    }
  }

  // Obtener el color del texto basado en el fondo
  getTextColor(color: string): string {
    const r = parseInt(color.slice(0, 2), 16);
    const g = parseInt(color.slice(2, 4), 16);
    const b = parseInt(color.slice(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128 ? '#ffffff' : '#000000';
  }

  // Ir a la página de usuarios para el administrador
  async paginaUsuarios() {
    const userRole = this.authService.getRolUsuario();
    console.log('Rol de usuario en paginaUsuarios:', userRole);

    if (userRole === 'administrador') {
      this.router.navigate(['/usuarios']);
    } else {
      console.error('No tienes permisos de administrador');
      this.router.navigate(['/acceso-denegado']);
    }
  }
  // Ir a la página de asignaturas para el administrador
  async paginaAsignaturas() {
    const userRole = this.authService.getRolUsuario();
    console.log('Rol de usuario en paginaUsuarios:', userRole);

    if (userRole === 'administrador') {
      this.router.navigate(['/asignatura']);
    } else {
      console.error('No tienes permisos de administrador');
      this.router.navigate(['/acceso-denegado']);
    }
  }
}
