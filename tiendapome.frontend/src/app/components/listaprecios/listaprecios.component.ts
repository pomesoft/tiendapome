import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'node_modules/angular-notifier';

import { ListaPrecio, ListaPrecioCliente } from '../../models/listaPrecio';

import { ListapreciosServices } from '../../services/listaprecios.services';

declare var $: any;


@Component({
      selector: 'listaprecios',
      templateUrl: './listaprecios.component.html',
      styleUrls: ['./listaprecios.component.css'],
      providers: [ListapreciosServices]
})
export class ListapreciosComponent implements OnInit {

      public listaPrecio: Array<ListaPrecio>;
      public listaSeleccionada: ListaPrecio = null;
      public listaPrecioCliente: Array<ListaPrecioCliente>;
      public listaClienteSeleccionada: ListaPrecioCliente = null;
      public mensajeOK: string;

      private entidadElimina: string = '';

      constructor(
            private _listaPrecioServices: ListapreciosServices,
            private _notifier: NotifierService
      ) {
            this.mensajeOK = '';
      }

      ngOnInit() {
            this.getListaPrecios();
      }

      getListaPrecios() {
            this._listaPrecioServices.getListaPrecios().subscribe(
                  response => {
                        if (response) {
                              this.listaPrecio = response;
                              if (this.listaPrecio.length > 0 && this.listaSeleccionada == null) {
                                    this.listaSeleccionada = this.listaPrecio[0];
                                    this.getListaPreciosCliente();
                              }
                        }
                  },
                  error => {
                        console.log("ERROR::");
                        console.log(<any>error);
                  }
            );
      }

      agregarItem(
            $event: any
      ) {
            $event.preventDefault();
            let lp: ListaPrecio = new ListaPrecio();
            //new ListaPrecio(-1, '', 0, '', true)
            lp.Id = -1;
            this.listaSeleccionada = lp;
            this.listaClienteSeleccionada = null;
            this.listaPrecioCliente = [];
      }

      editarItem(
            $event: any,
            item: ListaPrecio
      ) {
            $event.preventDefault();
            this.listaSeleccionada = item;
            this.listaClienteSeleccionada = null;
            this.getListaPreciosCliente();
      }

      guardar(
            $event: any
      ) {

            $event.preventDefault();

            if (!this.listaSeleccionada.Codigo) {
                  this.showNotification('warning', "Por favor completá Código.");

            } else {
                  this._listaPrecioServices.saveListaPrecio(this.listaSeleccionada).subscribe(
                        response => {
                              this.listaSeleccionada = response;
                              this.showNotification('success', 'La lista de precio se actualizó correctamente.');
                              this.getListaPrecios();
                        },
                        error => {
                              this.showNotification('error', <any>error.error.Message);
                              console.log(<any>error);
                        }
                  );
            }
      }

      confirmarEliminacionListaPrecio(
            $event: any,
            item: ListaPrecio
      ) {
            $event.preventDefault();
            this.listaSeleccionada = item;
            this.entidadElimina = 'LISTA_PRECIO_PRODUCTO';
            $('#modalConfirmaEliminacion').modal('show');
      }


      getListaPreciosCliente() {
            if (this.listaSeleccionada) {
                  this._listaPrecioServices.getListaPreciosCliente(this.listaSeleccionada.Id).subscribe(
                        response => {
                              if (response) {
                                    this.listaPrecioCliente = response;
                                    if (this.listaPrecioCliente.length > 0)
                                          this.listaClienteSeleccionada = this.listaPrecioCliente[0];
                              }
                        },
                        error => {
                              console.log("ERROR::");
                              console.log(<any>error);
                        }
                  );
            }
      }
      editarListaCliente(
            $event: any,
            item: ListaPrecioCliente
      ) {
            $event.preventDefault();
            this.listaClienteSeleccionada = item;
      }
      agregarItemCliente(
            $event: any
      ) {
            $event.preventDefault();
            let lpc: ListaPrecioCliente = new ListaPrecioCliente();
            lpc.Id = -1;
            lpc.ListaPrecio = this.listaSeleccionada;
            this.listaClienteSeleccionada = lpc;
      }

      guardarListaCliente(
            $event: any
      ) {
            $event.preventDefault();

            if (!this.listaClienteSeleccionada.Codigo || !this.listaClienteSeleccionada.Precio) {
                  this.showNotification('warning', "Por favor, completá Código y Precio.");
                  
            } else {
                  this._listaPrecioServices.saveListaPrecioCliente(this.listaClienteSeleccionada).subscribe(
                        response => {
                              this.showNotification('success', 'La lista de precio se actualizó correctamente.');
                              this.getListaPreciosCliente();
                        },
                        error => {
                              console.log("ERROR::");
                              console.log(<any>error);
                        }
                  );
            }
      }

      confirmarEliminacionListaPrecioCliente(
            $event: any,
            item: ListaPrecioCliente
      ) {
            $event.preventDefault();
            this.listaClienteSeleccionada = item;
            this.entidadElimina = 'LISTA_PRECIO_CLIENTE';
            $('#modalConfirmaEliminacion').modal('show');
      }

      eliminar(
            $event: any
      ) {
            $event.preventDefault();
            $('#modalConfirmaEliminacion').modal('hide');

            if (this.entidadElimina == 'LISTA_PRECIO_PRODUCTO') {
                  this._listaPrecioServices.deleteListaPrecio(this.listaSeleccionada.Id).subscribe(
                        response => {
                              if (response) {
                                    this.showNotification('error', 'La lista de precio se eliminó correctamente.');
                                    this.listaSeleccionada = null;
                                    this.getListaPrecios();
                              }
                        },
                        error => {
                              this.showNotification('warning', 'No se puede eliminar la lista de precio.');
                              console.log(<any>error);
                        }
                  );
            }

            if (this.entidadElimina == 'LISTA_PRECIO_CLIENTE') {
                  this._listaPrecioServices.deleteListaPrecioCliente(this.listaClienteSeleccionada.Id).subscribe(
                        response => {
                              if (response) {
                                    this.showNotification('error', 'La lista de precio se eliminó correctamente.');
                                    this.listaClienteSeleccionada = null;
                                    this.getListaPreciosCliente()
                              }
                        },
                        error => {
                              this.showNotification('warning', 'No se puede eliminar la lista de precio de cliente.');
                              console.log(<any>error);
                        }
                  );
            }
      }

      public showNotification(type: string, message: string): void {
            this._notifier.notify(type, message);
      }
      public hideOldestNotification(): void {
            this._notifier.hideOldest();
      }

}
