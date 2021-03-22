import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute, Params, ResolveEnd } from '@angular/router';

import { Pedido } from '../../models/pedido';
import { Parametro } from '../../models/parametro';
import { MensajeResponse } from '../../models/mensajeResponse';

import { PouchDBServices } from '../../services/pouch-db.services';
import { AutenticaService } from '../../services/autentica.service';
import { PedidoService } from '../../services/pedido.service';



@Component({
      selector: 'navbarcarrito',
      templateUrl: './navbarcarrito.component.html',
      styleUrls: ['./navbarcarrito.component.css'],
      providers: [PouchDBServices]
})
export class NavbarcarritoComponent implements OnInit {

      public pedido: Pedido
      public carritoCantItems: number;
      public carritoImporteTotal: number;
      public carritoMoneda: string;
      public idClientePedido: number;
      public nombreCliente: string = '';

      public mostrarBotonesCarrito: boolean = false;
      public textoSubcategoriaCarrito: string = '';

      public mostrarBotonesPedido: boolean = false;
      public mostrarBotonFinalizar: boolean = false;
      public finalizando: boolean = false;


      public soloLecturaPedido: boolean = false;

      private _idUserDB: string = 'USER_01';
      private _idPedidoDB: string = 'PEDIDO_01';

      public leyenda: string;

      constructor(
            private _pedidoServices: PedidoService,
            private _autenticaService: AutenticaService,
            private _pouchDBServices: PouchDBServices,
            private _zone: NgZone,
            private _route: ActivatedRoute,
            private _router: Router
      ) {
            this._router.events.subscribe(val => {
                  if (val instanceof ResolveEnd) {
                        this.mostrarBotonesPedido = val.url.includes('/pedido/') || val.url.includes('/verpedido/');
                        this.soloLecturaPedido = val.url.includes('/verpedido/');

                        this.mostrarBotonesCarrito = val.url.includes('/productos/');
                        if (this.mostrarBotonesCarrito) {
                              this.textoSubcategoriaCarrito = localStorage.getItem("subcatergoriaCarrito");
                        }
                        this.leyenda = localStorage.getItem("leyendaPedido");
                  }
            });
      }

      ngOnInit() {
            this.carritoCantItems = 0;
            this.carritoImporteTotal = 0;
            this.carritoMoneda = '';

            this._pouchDBServices.cambios();
            this._pouchDBServices.getChangeListener().subscribe(data => {
                  this._zone.run(() => {
                        this.actualizarInfoCarrito();
                  });
            });
            this.actualizarInfoCarrito();

      }

      actualizarInfoCarrito() {
            this._pouchDBServices.get(this._idPedidoDB)
                  .then(doc => {
                        if (doc) {
                              this.pedido = doc;
                              this.carritoCantItems = this.pedido.CantidadItems;
                              this.carritoImporteTotal = this.pedido.Total;
                              this.carritoMoneda = this.pedido.Moneda
                              this.idClientePedido = this.pedido.Cliente.Id;
                              this.nombreCliente = this.pedido.Cliente.Nombre;

                              if (this.soloLecturaPedido)
                                    this.mostrarBotonFinalizar = false;
                              else
                                    this.mostrarBotonFinalizar = this.pedido.CompraMinima == -1 || this.pedido.CompraMinima <= this.pedido.Total;
                        }
                  });
      }

      cerrarSesion($event: any) {
            $event.preventDefault();
            var userLogin = {
                  _id: this._idUserDB,
                  clienteLogin: null
            };
            this._pouchDBServices.update(userLogin);
            this._autenticaService.logout().subscribe(
                  response => { this._router.navigate(['/carrito']); },
                  error => { 
                        this._router.navigate(['/carrito']);
                        console.log(<any>error); 
                  }
            );
      }

      irAlCarrito($event: any) {
            $event.preventDefault();
            this._router.navigate(['/pedido/-1/' + this.idClientePedido]);
      }

      finalizar(
            $event: any
      ) {
            $event.preventDefault();
            this.finalizando = true;
            var itemsValidos: boolean = true;
            this.pedido.Items.forEach(item => {
                  if (item.Cantidad == 0) {
                        itemsValidos = false;
                        localStorage.setItem("notificaError", 'Por favor verificá las cantidades');
                        this._router.navigate(['/notifica/error/PEDIDO_FINALIZA_ERROR']);
                  }
            });
            if (itemsValidos) {
                  this._pedidoServices.avanzarPedido(this.pedido).subscribe(
                        (response: MensajeResponse) => {
                              if (response) {
                                    this.finalizando = false;
                                    console.log('avanzarPedido->response', response);
                                    if (response.Estado == 1) {
                                          this._router.navigate(['/notifica/success/PEDIDO_FINALIZA_OK']);
                                          localStorage.removeItem("leyendaPedido");
                                    } else {
                                          localStorage.setItem("notificaError", response.Mensaje);
                                          this._router.navigate(['/notifica/error/PEDIDO_FINALIZA_ERROR']);
                                    }
                              }
                        },
                        error => {
                              this.finalizando = false;
                              localStorage.setItem("notificaError", <any>error.error.message);
                              this._router.navigate(['/notifica/error/PEDIDO_FINALIZA_ERROR']);
                              console.log(<any>error);
                        }
                  );
            }

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
