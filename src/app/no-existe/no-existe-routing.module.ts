import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NoExistePage } from './no-existe.page';

const routes: Routes = [
  {
    path: '',
    component: NoExistePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NoExistePageRoutingModule {}
