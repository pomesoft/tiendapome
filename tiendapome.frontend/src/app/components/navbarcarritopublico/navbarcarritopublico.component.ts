import { Component, OnInit } from '@angular/core';
import { Router, ResolveEnd } from '@angular/router';

@Component({
      selector: 'navbarcarritopublico',
      templateUrl: './navbarcarritopublico.component.html',
      styleUrls: ['./navbarcarritopublico.component.css']
})
export class NavbarcarritopublicoComponent implements OnInit {

      public mostrarBotonesCarrito: boolean = false;
      public textoSubcategoriaCarrito: string = '';

      constructor(
            private _router: Router
      ) { 
            this._router.events.subscribe(val => {
                  if (val instanceof ResolveEnd) {
                        this.mostrarBotonesCarrito = val.url.includes('/productos/');
                        if (this.mostrarBotonesCarrito) {
                              this.textoSubcategoriaCarrito = localStorage.getItem("subcatergoriaCarrito");
                        }
                  }
            });
      }

      ngOnInit() {
      }

      volverAtras(
            $event: any
      ) {

            $event.preventDefault();

            debugger;
            let IdTipoCarrito = localStorage.getItem("IdTipoCarrito");
            let IdCatergoriaCarrito = localStorage.getItem("IdCategoriaCarrito");

            if (IdTipoCarrito != null)
                  this._router.navigate(['/menu/' + IdTipoCarrito + '/-1']);
            else if (IdCatergoriaCarrito != null)
                  this._router.navigate(['/menu/-1/' + IdCatergoriaCarrito]);
            else
                  this._router.navigate(['/menu']);

      }

}
