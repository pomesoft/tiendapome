import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'node_modules/angular-notifier';

import { Estado, Pedido, PedidoList } from '../../models/pedido';
import { Cliente } from '../../models/cliente';
import { Parametro } from '../../models/parametro';

import { PedidoService } from '../../services/pedido.service';
import { ClienteService } from '../../services/cliente.service';
import { PouchDBServices } from '../../services/pouch-db.services';
import { ParametroServices } from '../../services/parametro.services';

declare var $: any;

@Component({
      selector: 'app-pedidoslist',
      templateUrl: './pedidoslist.component.html',
      styleUrls: ['./pedidoslist.component.css']
})
export class PedidoslistComponent implements OnInit {

      public titulo: string = 'Bandeja de pedidos';

      public Estados: Array<Estado>;
      public Clientes: Array<Cliente>;
      public Pedidos: Array<Pedido>;

      public clienteSeleccionado: number;
      public fechaDesde: any;
      public fechaHasta: any;

      public textoConfirmaCancelar: string;


      public textoReenvioProveedor: string;
      public mostrarReenviarPedidoProveedor: boolean = false;
      public reenviandoAProveedor: boolean = false;

      public finalizandoPedido: boolean = false;
      public mostrarFinalizarPedido: boolean = false;

      public textoLiberarStock: string;
      public mostrarLiberarStockPedido: boolean = false;
      public liberandoStock: boolean = false;

      public mensajeUsuario_OK: boolean = false;
      public textoMensajeUsuario: string = '';
      public textoBotonMensajeUsuario: string = 'Aceptar';

      public mostrarPanelFiltros: boolean = true;
      public cargando: boolean = false;

      private _idPedidoDB: string = 'PEDIDO_01'; //id pedido del pouchDB / indexedDB

      public numeroPagina: number = 1;
      public totalFilas: number;

      private pedidoProcesar: Pedido;

      constructor(
            private _pedidoService: PedidoService,
            private _clienteService: ClienteService,
            private _parametroServices: ParametroServices,
            private _pouchDBServices: PouchDBServices,
            private _notifier: NotifierService,
            private _router: Router
      ) {
            this.clienteSeleccionado = -1;
            this.fechaDesde = '';
            this.fechaHasta = '';
      }

      ngOnInit() {
            this.inicializarControles();
      }

      async inicializarControles() {
            await this.getEstados()
                  .then(result => {
                        if (result) this.Estados = <Array<Estado>>result;
                        return this.obtenerParamsVentaMayorista();
                  })
                  .then(result => {

                        let paramsVentaMayorista: string = localStorage.getItem('paramsVentaMayorista') != null ? localStorage.getItem('paramsVentaMayorista') : 'NO';

                        this.mostrarReenviarPedidoProveedor = (paramsVentaMayorista == 'NO');
                        this.mostrarFinalizarPedido = (paramsVentaMayorista == 'NO');

                        this.mostrarLiberarStockPedido = (paramsVentaMayorista == 'SI');

                        return this.getClientes();
                  })
                  .then(result => {
                        if (result) this.cargarClientes(result);
                        this.getPedidos(this.numeroPagina);
                  })
                  .catch(err => {
                        this.showNotification('error', 'Ocurrió un error al cargar la página.');
                        console.log(err);
                  });

      }

      getEstados() {
            return new Promise((resolve, reject) => {
                  this._pedidoService.getEstados().subscribe(
                        response => { resolve(response); },
                        error => { reject(<any>error); }
                  );
            });
      }
      obtenerParamsVentaMayorista() {
            return new Promise<void>((resolve, reject) => {
                  //if (localStorage.getItem('paramsVentaMayorista') == null) {
                  this._parametroServices.getParametroValor('VENTA_MAYORISTA').subscribe(
                        (response: Parametro) => {
                              if (response) {
                                    localStorage.setItem('paramsVentaMayorista', response.Valor);
                              } else {
                                    localStorage.removeItem('paramsVentaMayorista');
                              }
                              resolve();
                        },
                        error => { reject(<any>error); }
                  );
                  // } else {
                  //       resolve();
                  // }
            });
      }
      getClientes() {
            return new Promise((resolve, reject) => {
                  this._clienteService.getClientes().subscribe(
                        response => { resolve(response); },
                        error => { reject(<any>error); }
                  );
            });
      }
      getPedidos(pagina: number) {
            return new Promise<void>((resolve, reject) => {

                  this._pedidoService
                        .getPedidosListPaginado(
                              this.selectedOptions(),
                              this.clienteSeleccionado,
                              this.fechaDesde,
                              this.fechaHasta,
                              pagina,
                              20
                        ).subscribe(
                              (response: PedidoList) => {
                                    if (response) {
                                          this.numeroPagina = pagina;
                                          this.totalFilas = response.TotalFilas;
                                          this.Pedidos = response.Pedidos;
                                          resolve();
                                    }
                              },
                              error => { reject(<any>error); }
                        );
            });
      }

      pageChange(pagina: number) {
            this.getPedidos(pagina);
      }

      cargarClientes(result: any) {
            let clientesResult = <Array<Cliente>>result;

            this.Clientes = new Array<Cliente>();
            var cli: Cliente = new Cliente();
            cli.Id = -1;
            cli.Email = 'Cliente';
            cli.Nombre = '';
            cli.Apellido = '';
            this.Clientes.push(cli);
            clientesResult.forEach(cli => {
                  this.Clientes.push(cli);
            });
      }

      selectedOptions() {
            let values: Array<number> = this.Estados.filter(opt => opt.Chequed).map(opt => opt.Id);
            let valuesReturn: string = '';
            values.forEach(item => {
                  valuesReturn += item.toString() + ',';
            });
            return valuesReturn;
      }

      aplicarFiltros(
            $event: any
      ) {
            $event.preventDefault();
            this.cargando = true;
            this.getPedidos(this.numeroPagina)
                  .then(result => {
                        this.cargando = false;
                  })
                  .catch(err => {
                        this.cargando = false;
                        this.showNotification('error', 'Ocurrió un error al cargar la página.');
                        console.log(err);
                  });
      }

      editarItem(
            $event: any,
            item: Pedido
      ) {
            $event.preventDefault();
            this._router.navigate(['/pedido/' + item.Id + '/-1']);
      }

      procesarPedido(
            $event: any,
            item: Pedido
      ) {
            $event.preventDefault();
            //EN_PROCESO
            let estado: Estado = new Estado();
            estado.Id = 3;
            item.Estado = estado;
            this._pedidoService.savePedido(item).subscribe(
                  response => {
                        if (response) {
                              console.log('response -> ', response);
                              this.registrarPedido_pouchDB(item);
                              this._router.navigate(['/pedido/' + item.Id + '/-1']);
                        }
                  },
                  error => { console.log(<any>error); }
            );
      }


      confirmarCancelacion(
            $event: any,
            item: Pedido
      ) {
            $event.preventDefault();
            this.pedidoProcesar = item;
            this.textoConfirmaCancelar = '¿Desea cancelar el pedido ' + this.pedidoProcesar.Numero + ' de ' + this.pedidoProcesar.Cliente.Email + '?'
            $('#modalConfirmaCancelar').modal('show');
      }

      cancelarPedido(
            $event: any
      ) {
            $event.preventDefault();
            debugger;
            this._pedidoService.cancelarPedido(this.pedidoProcesar.Id).subscribe(
                  response => {
                        $('#modalConfirmaCancelar').modal('hide');
                        this.aplicarFiltros($event);
                  },
                  error => { console.log(<any>error); }
            );
      }

      confirmarReenvioAlProveedor(
            $event: any,
            item: Pedido
      ) {
            $event.preventDefault();
            this.pedidoProcesar = item;
            this.textoReenvioProveedor = '¿Desea reenviar al proveedor el pedido ' + this.pedidoProcesar.Numero + ' de ' + this.pedidoProcesar.Cliente.Email + '?'
            $('#modalConfirmaProveedor').modal('show');
      }

      reenviarAlProveedor(
            $event: any
      ) {
            $event.preventDefault();

            this.reenviandoAProveedor = true;

            //8 - PROVEEDOR
            let estado: Estado = new Estado();
            estado.Id = 8;
            this.pedidoProcesar.Estado = estado;

            this._pedidoService.savePedidoProveedor(this.pedidoProcesar).subscribe(
                  response => {

                        this.mensajeUsuario_OK = true;
                        this.textoMensajeUsuario = 'El pedido ' + this.pedidoProcesar.Numero + ' de ' + this.pedidoProcesar.Cliente.Email + ' se reenvió al proveedor correctamente.';
                        $('#modalMensajes').modal('show');

                        $('#modalConfirmaProveedor').modal('hide');
                        this.reenviandoAProveedor = false;
                        this.aplicarFiltros($event);
                  },
                  error => {
                        this.mensajeUsuario_OK = true;
                        $('#modalConfirmaProveedor').modal('hide');
                        this.reenviandoAProveedor = false;

                        this.textoMensajeUsuario = 'Ocurrió un error al reenviar el pedido.';
                        $('#modalMensajes').modal('show');
                        console.log(<any>error);
                  }
            );
      }

      confirmarFinalizarPedido(
            $event: any,
            item: Pedido
      ) {
            $event.preventDefault();
            this.pedidoProcesar = item;
            $('#modalConfirmaFinalizar').modal('show');
      }

      finalizarPedido(
            $event: any
      ) {
            $event.preventDefault();

            this.finalizandoPedido = true;

            //4	FINALIZADO
            let estado: Estado = new Estado();
            estado.Id = 4;
            this.pedidoProcesar.Estado = estado;

            this._pedidoService.savePedido(this.pedidoProcesar).subscribe(
                  response => {

                        this.mensajeUsuario_OK = true;
                        this.textoMensajeUsuario = 'El pedido ' + this.pedidoProcesar.Numero + ' de ' + this.pedidoProcesar.Cliente.Email + ' se finalizó correctamente.';
                        $('#modalMensajes').modal('show');

                        $('#modalConfirmaFinalizar').modal('hide');
                        this.finalizandoPedido = false;
                        this.aplicarFiltros($event);
                  },
                  error => {
                        this.mensajeUsuario_OK = true;

                        $('#modalConfirmaFinalizar').modal('hide');
                        this.finalizandoPedido = false;

                        this.textoMensajeUsuario = 'Ocurrió un error al finalizar el pedido.';
                        $('#modalMensajes').modal('show');
                        console.log(<any>error);
                  }
            );
      }


      confirmarLiberarStock(
            $event: any,
            item: Pedido
      ) {
            $event.preventDefault();
            this.pedidoProcesar = item;
            this.textoLiberarStock = '¿Desea liberar el Stock del pedido ' + this.pedidoProcesar.Numero + ' de ' + this.pedidoProcesar.Cliente.Email + '?'
            $('#modalConfirmaLiberarStock').modal('show');
      }

      liberarStock(
            $event: any
      ) {
            $event.preventDefault();

            this.liberandoStock = true;

            this._pedidoService.liberarStockPedido(this.pedidoProcesar.Id).subscribe(
                  response => {

                        this.mensajeUsuario_OK = true;
                        this.textoMensajeUsuario = 'El pedido ' + this.pedidoProcesar.Numero + ' de ' + this.pedidoProcesar.Cliente.Email + ' liberó el stock correctamente.';
                        $('#modalMensajes').modal('show');

                        $('#modalConfirmaLiberarStock').modal('hide');
                        this.liberandoStock = false;
                        this.aplicarFiltros($event);

                  },
                  error => {
                        this.mensajeUsuario_OK = true;

                        $('#modalConfirmaLiberarStock').modal('hide');
                        this.liberandoStock = false;

                        this.textoMensajeUsuario = 'Ocurrió un error al finalizar el pedido.';
                        $('#modalMensajes').modal('show');
                        console.log(<any>error);
                  }
            );
      }

      exportarListadoEtiquetas(
            event: any,
            item: Pedido
      ) {
            event.preventDefault();
            item.ExsportoEtiquetasCSV = true;
            this._pedidoService.exportListadoEtiquetas(item.Id);
      }

      cobrarComisionApp(
            item: Pedido
      ) {
            return item.Cliente.ComisionApp != null && item.Cliente.ComisionApp > 0 && item.IdPedidoMinorista > 0;
      }


      registrarPedido_pouchDB(pedido: Pedido) {
            this._pouchDBServices.get(this._idPedidoDB)
                  .then(doc => {
                        if (doc) {
                              console.log('_pouchDBServices.update -> ', pedido);
                              pedido._id = this._idPedidoDB;
                              this._pouchDBServices.update(pedido);
                        } else {
                              console.log('_pouchDBServices.put -> ', pedido);
                              this._pouchDBServices.put(this._idPedidoDB, pedido);
                        }
                  });
      }

      mostrarOcultarFiltros(
            $event: any
      ) {
            $event.preventDefault();
            this.mostrarPanelFiltros = !this.mostrarPanelFiltros;
      }


      enviarWhatsApp(
            $event: any,
            cliente: Cliente
      ) {

            $event.preventDefault();

            if(cliente && cliente.Celular){
                  let urlDesktop = 'https://web.whatsapp.com/';
                  let urlMobile = 'https://api.whatsapp.com/';
      
                  let mensaje = 'send?phone=549' + cliente.Celular + '&text=%20';
                  //let mensaje = 'send?phone=5493624098916&text=%20';
      
                  if (this.isMobile()) {
                        window.open(urlMobile + mensaje, '_blank')
                  } else {
                        window.open(urlDesktop + mensaje, '_blank')
                  }
            }
      }

      isMobile() {
            if (sessionStorage.desktop)
                  return false;
            else if (localStorage.mobile)
                  return true;
            var mobile = ['iphone', 'ipad', 'android', 'blackberry', 'nokia', 'opera mini', 'windows mobile', 'windows phone', 'iemobile'];
            for (var i in mobile)
                  if (navigator.userAgent.toLowerCase().indexOf(mobile[i].toLowerCase()) > 0) return true;
            return false;
      }


      public showNotification(type: string, message: string): void {
            this._notifier.notify(type, message);
      }
      public hideOldestNotification(): void {
            this._notifier.hideOldest();
      }



}
