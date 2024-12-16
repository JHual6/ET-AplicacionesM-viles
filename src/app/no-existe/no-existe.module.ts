import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NoExistePageRoutingModule } from './no-existe-routing.module';

import { NoExistePage } from './no-existe.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NoExistePageRoutingModule
  ],
  declarations: [NoExistePage]
})
export class NoExistePageModule {}
