import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/servicios/database.service';

@Component({
  selector: 'app-asignatura',
  templateUrl: './asignatura.page.html',
  styleUrls: ['./asignatura.page.scss'],
})
export class AsignaturaPage implements OnInit {
  asignaturas: any[] = [];

  constructor(private databaseservice: DatabaseService) {}

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

  editarAsignatura(asignatura: any) {
    console.log('Editar asignatura:', asignatura);
    // Lógica para editar la asignatura
  }

  eliminarAsignatura(asignatura: any) {
    console.log('Eliminar asignatura:', asignatura);
    // Lógica para eliminar la asignatura
  }

  agregarAsignatura() {
    console.log('Agregar nueva asignatura');
    // Lógica para agregar una nueva asignatura
  }
}