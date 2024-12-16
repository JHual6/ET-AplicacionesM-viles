import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AsignaturaPageRoutingModule } from './asignatura-routing.module';

import { AsignaturaPage } from './asignatura.page';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatProgressSpinnerModule, 
    AsignaturaPageRoutingModule,
    MatIconModule  
  ],
  declarations: [AsignaturaPage]
})
export class AsignaturaPageModule {}
