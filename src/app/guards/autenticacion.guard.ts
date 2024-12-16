import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { AutenticacionService } from '../servicios/autenticacion.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AutenticacionGuard implements CanActivate {

  constructor(private authService: AutenticacionService, private router: Router){}

  canActivate(): boolean{
    if(this.authService.getLogueado()){
      return true;
    } else {
      this.router.navigate(['ingreso']);
      return false;
    }
  }

}
