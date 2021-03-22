import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute, ResolveEnd, RouteConfigLoadEnd } from '@angular/router';

import { Pedido, Estado } from '../../models/pedido';
import { Parametro } from '../../models/parametro';

import { PouchDBServices } from '../../services/pouch-db.services';
import { AutenticaService } from '../../services/autentica.service';
import { PedidoService } from '../../services/pedido.service';
import { ParametroServices } from '../../services/parametro.services';
import { MensajeResponse } from 'src/app/models/mensajeResponse';

declare var $: any;

@Component({
      selector: 'navbarbackoffice',
      templateUrl: './navbarbackoffice.component.html',
      styleUrls: ['./navbarbackoffice.component.css']
})
export class NavbarbackofficeComponent implements OnInit {


      public pedido: Pedido;
      public carritoCantItems: number;
      public carritoImporteTotal: number;
      public carritoMoneda: string;

      public mostrarBotonesPedido: boolean = false;

      public mostrarMenuProductos: boolean = true;
      public mostrarMenuFacturacion: boolean = true;

      public cliente: string;
      public leyenda: string;

      private _idUserDB: string = 'USER_01';
      private _idPedidoDB: string = 'PEDIDO_01';

      constructor(

            private _pedidoServices: PedidoService,
            private _autenticaService: AutenticaService,
            private _parametroServices: ParametroServices,
            private _pouchDBServices: PouchDBServices,
            private _route: ActivatedRoute,
            private _router: Router,
            private _zone: NgZone
      ) {
            this._router.events.subscribe(val => {
                  if (val instanceof ResolveEnd) {
                        this.mostrarBotonesPedido = val.url.includes('/pedido/');
                  }
            })
      }

      colapsarMenu($event: any) {
            $event.preventDefault();
            $('.navbar-collapse').collapse('hide');
            return false;
      }

      ngOnInit() {
            this.carritoCantItems = 0;
            this.carritoImporteTotal = 0;
            this.carritoMoneda = '';
            this._pouchDBServices.cambios();
            this._pouchDBServices.getChangeListener().subscribe(data => {
                  this._zone.run(() => {
                        console.log('this._zone.run()');
                        this.actualizarInfoCarrito();
                  });
            });

            this.inicializarControles();

      }

      async inicializarControles() {
            await this.obtenerParamsMostrarProducto()
                  .then(result => {
                        if (result) this.mostrarMenuProductos = (result == 'SI');
                        return this.obtenerParamsMostrarFacturacion();
                  })
                  .then(result => {                        
                        if (result) this.mostrarMenuFacturacion = (result == 'SI');
                  })
                  .catch(err => {
                        console.log(err);
                  });
      }

      obtenerParamsMostrarProducto() {
            return new Promise((resolve, reject) => {
                  this._parametroServices.getParametroValor('MOSTRAR_PRODUCTOS').subscribe(
                        (response: Parametro) => {
                              if (response) {
                                    resolve(response.Valor);
                              } else {
                                    resolve("SI");
                              }
                        },
                        error => { reject(<any>error); }
                  );
            });
      }
      obtenerParamsMostrarFacturacion() {
            return new Promise((resolve, reject) => {
                  this._parametroServices.getParametroValor('MOSTRAR_FACTURACION').subscribe(
                        (response: Parametro) => {
                              console.log('response', response);
                              if (response) {
                                    resolve(response.Valor);
                              } else {
                                    resolve("SI");
                              }
                        },
                        error => { reject(<any>error); }
                  );
            });
      }

      actualizarInfoCarrito() {
            this._pouchDBServices.get(this._idPedidoDB)
                  .then(doc => {
                        if (doc) {
                              this.pedido = doc;
                              this.carritoCantItems = this.pedido.CantidadItems;
                              this.carritoImporteTotal = this.pedido.Total;
                              this.carritoMoneda = this.pedido.Moneda

                              this.cliente = this.pedido.Cliente.Nombre + ' ' + this.pedido.Cliente.Apellido + ' - ' + this.pedido.Cliente.NombreFantasia;
                              this.leyenda = 'Nro: ' + this.pedido.Numero.toString() + ' - ' + this.pedido.Estado.Descripcion;
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

      pedidoSolicitado() {
            return this.pedido != null && this.pedido.Estado != null && this.pedido.Estado.Id == 2;    //SOLICITADO
      }
      pedidoEnProceso() {
            return this.pedido != null && this.pedido.Estado != null && (this.pedido.Estado.Id == 3 || this.pedido.Estado.Id == 8);  // EN_PROCESO o PROVEEDOR
      }



      finalizarProceso(
            $event: any
      ) {
            $event.preventDefault();
            var itemsValidos: boolean = true;
            this.pedido.Items.forEach(item => {
                  if (!item.Confirmado && !item.SinStock) {
                        itemsValidos = false;
                        localStorage.setItem("notificaError", 'Todos los items del pedido deben estar Confirmados ó Sin Stock');
                        this._router.navigate(['/notifica/error/PEDIDO_FINALIZA_ARMADO_ERROR']);
                  }
            });
            if (itemsValidos) {
                  this._pedidoServices.avanzarPedido(this.pedido).subscribe(
                        (response: MensajeResponse) => {
                              if (response) {
                                    console.log('avanzarPedido->response', response);
                                    if (response.Estado == 1) {
                                          localStorage.removeItem("leyendaPedido");
                                          this._router.navigate(['/notifica/success/PEDIDO_FINALIZA_ARMADO']);
                                    } else {
                                          localStorage.setItem("notificaError", response.Mensaje);
                                          this._router.navigate(['/notifica/error/PEDIDO_FINALIZA_ERROR']);
                                    }
                              }
                        },
                        error => { console.log(<any>error); }
                  );
            }
      }


      irAlCarrito(event: any) {
            event.preventDefault();
      }

}
