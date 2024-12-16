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

   // Agregar asignatura
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
                this.alertController.create({
                  header: 'Éxito',
                  message: 'Asignatura agregada correctamente',
                  buttons: ['OK']
                }).then(alert => alert.present());
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
  eliminarAsignatura(asignatura: any) {
    console.log('Eliminar asignatura:', asignatura);
  }
}