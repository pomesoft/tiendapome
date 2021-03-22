import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AutenticaService } from '../services/autentica.service';

@Injectable({
      providedIn: 'root'
})
export class AutorizadoGuard implements CanActivate {

      constructor(
            private _autenticaService: AutenticaService, 
            private router: Router
      ) { 

      }

      canActivate() {
            if (this._autenticaService.clienteAutenticado()) {
                  return true;
            } else {
                  console.log('no lo encuentra como autenticado');
                  this.router.navigate(['/login']);
                  return false;
            }
      }

}
