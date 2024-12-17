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
  
            // Insertar asignatura en la base de datos
            this.databaseservice.insertAsignatura(nuevaAsignatura).subscribe(
              (response) => {
                console.log(response.message);
  
                // Insertar clase vinculada
                const nuevaClase = {
                  id_asignatura: response.id_asignatura, // ID de la asignatura recién creada
                  fecha_clase: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
                  codigoqr_clase: 'Clase de inscripción', // Código QR predeterminado
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
  

  // Editar asignatura con alerta
  async agregarEstudiantes(asignatura: any) {
    console.log('Editar asignatura:', asignatura);
  }
  // Eliminar asignatura
  eliminarAsignatura(id_asignatura: number) {
    console.log(`ID recibido para eliminar: ${id_asignatura}`);
  
    // Primero, elimina las clases asociadas
    this.databaseservice.deleteClasesAsociadas(id_asignatura).subscribe(
      () => {
        console.log('Clases asociadas eliminadas con éxito.');
  
        // Luego, elimina la asignatura
        this.databaseservice.deleteAsignatura(id_asignatura).subscribe(
          (response) => {
            console.log(response.message);
            this.cargarAsignaturas(); // Actualizar vista
          },
          (error) => {
            console.error('Error al eliminar la asignatura', error);
          }
        );
      },
      (error) => {
        console.error('Error al eliminar las clases asociadas', error);
      }
    );
  }
  
  
  
}