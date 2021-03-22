import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Parametro } from '../../models/parametro';
import { Pedido } from 'src/app/models/pedido';

import { ParametroServices } from '../../services/parametro.services';
import { PouchDBServices } from '../../services/pouch-db.services';


@Component({
      selector: 'app-notifica',
      templateUrl: './notifica.component.html',
      styleUrls: ['./notifica.component.css']
})
export class NotificaComponent implements OnInit {

      public tipoError: string = 'success';
      public claveMensaje: string = '';
      public mensaje: string = '';

      private _idPedidoDB: string = 'PEDIDO_01';
      private pedido: Pedido;

      constructor(
            private _parametroServices: ParametroServices,
            private _pouchDBServices: PouchDBServices,
            private _route: ActivatedRoute,
            private _router: Router
      ) {

      }

      ngOnInit() {
            this._route.params.subscribe((params: Params) => {
                  this.tipoError = params.tipo;
                  this.claveMensaje = params.clave;
                  
                  if (this.claveMensaje === 'PEDIDO_FINALIZA_ERROR' || this.claveMensaje === 'PEDIDO_FINALIZA_ARMADO_ERROR' ) {
                        this.mensaje = localStorage.getItem("notificaError");
                        this._pouchDBServices.get(this._idPedidoDB)
                              .then(doc => { if (doc) this.pedido = doc; });
                  }
                  else
                        this.obtenerParametro();

            });
      }

      obtenerParametro() {
            return new Promise((resolve, reject) => {
                  this._parametroServices.getParametroValor(this.claveMensaje).subscribe(
                        (response: Parametro) => {
                              if (response) {
                                    this.mensaje = response.Valor;
                                    resolve();
                              }
                        },
                        error => { reject(<any>error); }
                  );
            });
      }

      continuar(event: any) {
            event.preventDefault();

            switch (this.claveMensaje) {
                  case 'PEDIDO_FINALIZA_OK':
                        this._router.navigate(['/menu']);
                        break;
                  case 'PEDIDO_FINALIZA_ERROR':
                        //se le pasa id cliente para que muestre muestre solo datos para clientes, por ej.: p/cliente no debe mostrar ubicacion
                        this._router.navigate(['/pedido/-1/'+ this.pedido.Cliente.Id]);
                        break;
                  case 'PEDIDO_FINALIZA_ARMADO_ERROR':
                        this._router.navigate(['/pedido/'+ this.pedido.Id +'/-1']);
                        break;
                  case 'PEDIDO_FINALIZA_ARMADO':
                        this._router.navigate(['/pedidoslist']);
                        break;
            }

      }

      mostrarAlertSuccess() {
            return this.claveMensaje === 'PEDIDO_FINALIZA_OK' || this.claveMensaje === 'PEDIDO_FINALIZA_ARMADO';
      }

      mostrarAlertWarning() {
            return this.claveMensaje === 'PEDIDO_FINALIZA_ERROR';
      }

}
