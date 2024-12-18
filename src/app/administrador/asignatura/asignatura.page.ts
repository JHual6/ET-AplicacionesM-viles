import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/servicios/database.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-asignatura',
  templateUrl: './asignatura.page.html',
  styleUrls: ['./asignatura.page.scss'],
})
export class AsignaturaPage implements OnInit {
  asignaturas: any[] = [];

  constructor(
    private databaseservice: DatabaseService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.cargarAsignaturas();
  }

  // Obtener todas las asignaturas de la base de datos
  cargarAsignaturas() {
    this.databaseservice.getAsignaturas().subscribe({
      next: (data) => {
        this.asignaturas = data;
      },
      error: (err) => {
        console.error('Error al obtener asignaturas:', err);
      }
    });
  }

  async agregarAsignatura() {
    const alert = await this.alertController.create({
      header: 'Agregar Asignatura',
      inputs: [
        { name: 'id_profesor', type: 'number', placeholder: 'ID Profesor' },
        { name: 'nombre_asignatura', type: 'text', placeholder: 'Nombre Asignatura' },
        { name: 'siglas_asignatura', type: 'text', placeholder: 'Siglas Asignatura' },
        { name: 'color_asignatura', type: 'text', placeholder: 'Color Asignatura' },
        { name: 'color_seccion_asignatura', type: 'text', placeholder: 'Color Sección' },
        { name: 'seccion_asignatura', type: 'text', placeholder: 'Sección Asignatura' },
        { name: 'modalidad_asignatura', type: 'text', placeholder: 'Modalidad' },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Guardar',
          handler: (data) => {
            const nuevaAsignatura = {
              id_profesor: data.id_profesor,
              nombre_asignatura: data.nombre_asignatura,
              siglas_asignatura: data.siglas_asignatura,
              color_asignatura: data.color_asignatura,
              color_seccion_asignatura: data.color_seccion_asignatura,
              seccion_asignatura: data.seccion_asignatura,
              modalidad_asignatura: data.modalidad_asignatura,
            };
  
            this.databaseservice.insertAsignatura(nuevaAsignatura).subscribe(
              (response) => {
                console.log(response.message);
                const nuevaClase = {
                  id_asignatura: response.id_asignatura, 
                  fecha_clase: new Date().toISOString().split('T')[0], 
                  codigoqr_clase: 'Clase de inscripción', 
                };
  
                this.databaseservice.insertarClase(nuevaClase).subscribe(
                  (res) => {
                    console.log(res.message);
                    this.alertController.create({
                      header: 'Éxito',
                      message: 'Asignatura y clase creadas correctamente',
                      buttons: ['OK'],
                    }).then((alert) => alert.present());
                  },
                  (error) => console.error('Error al insertar la clase', error)
                );
              },
              (error) => console.error('Error al agregar asignatura', error)
            );
          },
        },
      ],
    });
  
    await alert.present();
  }
  
  async agregarEstudiantes(asignatura: any) {
    console.log('Editar asignatura:', asignatura);
  
    const id_asignatura = asignatura.id_asignatura;
    console.log(`ID de la asignatura: ${id_asignatura}`);
  
    this.databaseservice.getClaseInscripcion(id_asignatura).subscribe(
      async (response) => {
        if (response && response.length > 0) {
          const id_clase = response[0].id_clase;
          console.log(`ID de la clase de inscripción obtenida: ${id_clase}`);
          const alert = await this.alertController.create({
            header: 'Ingresar ID del Estudiante',
            inputs: [
              { name: 'id_estudiante', type: 'number', placeholder: 'ID Estudiante' }
            ],
            buttons: [
              {
                text: 'Cancelar',
                role: 'cancel',
              },
              {
                text: 'Guardar',
                handler: (data) => {
                  if (data.id_estudiante) {
                    const fecha_asistencia = new Date().toISOString().slice(0, 10);
  
                    this.databaseservice.insertAsistencia(id_clase, parseInt(data.id_estudiante), fecha_asistencia).subscribe(
                      (response) => {
                        console.log('Asistencia registrada exitosamente:', response.message);
                        this.alertController.create({
                          header: 'Éxito',
                          message: 'Estudiante agregado correctamente.',
                          buttons: ['OK'],
                        }).then((alert) => alert.present());
                      },
                      (error) => {
                        console.error('Error al registrar la asistencia:', error);
                      }
                    );
                  } else {
                    console.warn('ID del estudiante no proporcionado.');
                  }
                }
              }
            ]
          });
  
          await alert.present();
        } else {
          console.warn('No se encontró ninguna clase de inscripción para la asignatura especificada.');
        }
      },
      (error) => {
        console.error('Error al obtener el ID de la clase de inscripción:', error);
      }
    );
  }

  // Eliminar asignatura
  eliminarAsignatura(id_asignatura: number) {
    console.log(`ID recibido para eliminar: ${id_asignatura}`);
  
    this.databaseservice.deleteClasesAsociadas(id_asignatura).subscribe(
      () => {
        console.log('Clases asociadas eliminadas con éxito.');
      },
      (error) => {
        console.error('Error al eliminar las clases asociadas', error);
      }
      
    );
    this.databaseservice.deleteAsignatura(id_asignatura).subscribe(
      (response) => {
        console.log(response.message);
        this.cargarAsignaturas(); 
      },
      (error) => {
        console.error('Error al eliminar la asignatura', error);
      }
    );
  }  
}