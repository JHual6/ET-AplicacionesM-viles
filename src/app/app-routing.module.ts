import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AutenticacionGuard } from './guards/autenticacion.guard';
import { RolesGuard } from './guards/roles.guard';
import { rolprofesorGuard } from './guards/rolprofesor.guard';
import { UsuariosPage } from './administrador/usuarios/usuarios.page';
import { rolestudianteGuard } from './guards/rolestudiante.guard';

const routes: Routes = [
  
  {
    path: '',
    redirectTo: 'ingreso',
    pathMatch: 'full'
  },
  {
    path: 'ingreso',
    loadChildren: () => import('./ingreso/ingreso.module').then( m => m.IngresoPageModule)
  },
  {
    path: 'restablecer',
    loadChildren: () => import('./restablecer/restablecer.module').then( m => m.RestablecerPageModule)
  },
  {
    path: 'inicio',
    loadChildren: () => import('./inicio/inicio.module').then( m => m.InicioPageModule), canActivate: [AutenticacionGuard]
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./administrador/usuarios/usuarios.module').then(m => m.UsuariosPageModule),
    canActivate: [AutenticacionGuard, RolesGuard],
    data: { allowedRoles: ['admin'] }
  },
  {
    path: 'asignatura',
    loadChildren: () => import('./administrador/asignatura/asignatura.module').then( m => m.AsignaturaPageModule),
    canActivate: [AutenticacionGuard, RolesGuard],
    data: { allowedRoles: ['admin'] }
  },
  {
    path: 'asignatura/:id',
    data: { allowedRolesp: ['profesor']},  
    canActivate: [AutenticacionGuard, rolprofesorGuard],
    loadChildren: () => import('./profesores/asignatura/asignatura.module').then( m => m.AsignaturaPageModule)
  },
  {
    path: 'asignatura/:id_asignatura/:id_estudiante',
    data: { allowedRolesp: ['estudiante']},  
    canActivate: [AutenticacionGuard, rolestudianteGuard],
    loadChildren: () => import('./estudiantes/asignatura/asignatura.module').then( m => m.AsignaturaPageModule)
  },
  {
    path: '**',
    loadChildren: () => import('./no-existe/no-existe.module').then( m => m.NoExistePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
