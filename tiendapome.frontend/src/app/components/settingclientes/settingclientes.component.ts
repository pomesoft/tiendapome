import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'node_modules/angular-notifier';
import { PaginationInstance } from 'node_modules/ngx-pagination/dist/ngx-pagination';

import { ClienteService } from '../../services/cliente.service';
import { ListapreciosServices } from '../../services/listaprecios.services';

import { Cliente, ClienteLista, Provincia, Rol, SituacionIVA } from '../../models/cliente';
import { ListaPrecio, ListaPrecioCliente } from '../../models/listaPrecio';

declare var $: any;


@Component({
      selector: 'app-settingclientes',
      templateUrl: './settingclientes.component.html',
      styleUrls: ['./settingclientes.component.css']
})
export class SettingclientesComponent implements OnInit {

      public titulo: string = "Clientes";
      public Clientes: Array<Cliente>;
      public clienteSeleccionado: Cliente;

      public Roles: Array<Rol>;
      public Provincias: Array<Provincia>;
      public SituacionesIVA: Array<SituacionIVA>;

      public listaPreciosProducto: Array<ListaPrecio>;
      public listaPreciosCliente: Array<ListaPrecioCliente>;
      public clienteLista: ClienteLista;

      private entidadElimina: string = '';
      public textoConfirmaEliminacion: string = '';

      public modoBusqueda: boolean = false;
      public mostrarCodigo: boolean = false;

      public page: number = 1;
      public textoFiltro: string = '';

      constructor(
            private _clientesServices: ClienteService,
            private _listaPreciosServices: ListapreciosServices,
            private _notifier: NotifierService
      ) {

      }

      ngOnInit() {
            this.getProvincias();
      }


      getProvincias() {
            this._clientesServices.getProvincias().subscribe(
                  response => {
                        if (response) {
                              this.Provincias = response;
                        }
                        this.getSituacionesIVA();
                  },
                  error => {
                        console.log(<any>error);
                  }
            );
      }

      getSituacionesIVA() {
            this._clientesServices.getSituacionesIVA().subscribe(
                  response => {
                        if (response) {
                              this.SituacionesIVA = response;
                        }
                        this.getRoles();
                  },
                  error => {
                        console.log(<any>error);
                  }
            );
      }

      getRoles() {
            this._clientesServices.getRoles().subscribe(
                  response => {
                        if (response) {
                              this.Roles = response;
                        }
                        this.getListaPreciosProducto();
                  },
                  error => {
                        console.log(<any>error);
                  }
            );
      }

      getListaPreciosProducto() {
            this._listaPreciosServices.getListaPreciosVigentes().subscribe(
                  response => {
                        if (response) {
                              this.listaPreciosProducto = response;
                        }
                        if (this.modoBusqueda)
                              this.busquedaGetClientes();
                        else
                              this.getClientes();

                  },
                  error => {
                        console.log(<any>error);
                  }
            );
      }

      getClientes() {
            this.modoBusqueda = false;
            this._clientesServices.getClientes().subscribe(
                  response => {
                        if (response) {
                              this.Clientes = response;
                              if (this.Clientes.length > 0 && !this.clienteSeleccionado)
                                    this.getCliente(this.Clientes[0].Id);
                        }
                  },
                  error => {
                        this.showNotification('error', 'No se pudo obtener los clientes correctamente.');
                        console.log(<any>error);
                  }
            );
      }

      busquedaClientes(
            $event: any
      ) {
            $event.preventDefault();
            if (this.textoFiltro.trim().length == 0) {
                  this.getClientes();

            } else {
                  this.modoBusqueda = true;
                  this.busquedaGetClientes();
            }

      }

      busquedaGetClientes() {
            this._clientesServices.searchClientes(this.textoFiltro).subscribe(
                  response => {
                        if (response) {
                              this.Clientes = response;
                              if (this.Clientes.length > 0 && !this.clienteSeleccionado)
                                    this.getCliente(this.Clientes[0].Id);
                        }
                  },
                  error => {
                        this.showNotification('error', 'No se pudo obtener los clientes correctamente.');
                        console.log(<any>error);
                  }
            );
      }

      listarSoloSinLista(
            $event: any
      ) {
            $event.preventDefault();
            this._clientesServices.getClientesSinListasPrecio().subscribe(
                  response => {
                        if (response) {
                              this.Clientes = response;
                              if (this.Clientes.length > 0 && !this.clienteSeleccionado)
                                    this.getCliente(this.Clientes[0].Id);
                        }
                  },
                  error => {
                        this.showNotification('error', 'No se pudo obtener los clientes correctamente.');
                        console.log(<any>error);
                  }
            );
      }

      agregarItem(
            $event: any
      ) {
            $event.preventDefault();
            this.clienteSeleccionado = new Cliente();
      }

      editarItem(
            $event: any,
            item: Cliente
      ) {
            $event.preventDefault();
            this.mostrarCodigo = false;
            this.getCliente(item.Id);
      }
      getCliente(idCliente: number) {
            this._clientesServices.getCliente(idCliente).subscribe(
                  response => {
                        if (response) {
                              this.clienteSeleccionado = response;
                              
                        }
                  },
                  error => {
                        this.showNotification('error', 'No se pudo obtener el cliente seleccionado.');
                        console.log(<any>error);
                  }
            );
      }

      guardar(
            $event: any
      ) {

            $event.preventDefault();
            if (this.clienteSeleccionado) {

                  let provincia: Provincia = new Provincia();
                  provincia.Id = this.clienteSeleccionado.IdProvincia;
                  this.clienteSeleccionado.Provincia = provincia;

                  let situacioniva: SituacionIVA = new SituacionIVA();
                  situacioniva.Id = this.clienteSeleccionado.IdSituacionIVA;
                  this.clienteSeleccionado.SituacionIVA = situacioniva;

                  this._clientesServices.saveCliente(this.clienteSeleccionado).subscribe(
                        response => {
                              this.showNotification('success', 'El cliente se actualizó correctamente.');
                              this.clienteSeleccionado = response;

                              if (this.modoBusqueda)
                                    this.busquedaGetClientes();
                              else
                                    this.getClientes();

                        },
                        error => {
                              this.showNotification('error', <any>error.error.Message);
                              console.log(<any>error);
                        }
                  );
            }
      }

      confirmarEliminacion(
            $event: any,
            item: Cliente
      ) {
            $event.preventDefault();
            this.clienteSeleccionado = item;
            this.entidadElimina = 'CLIENTE';
            this.textoConfirmaEliminacion = '¿Desea eliminar el cliente ' + this.clienteSeleccionado.Email + '?';
            $('#modalConfirmaEliminacion').modal('show');
      }

      eliminar(
            $event: any
      ) {
            $event.preventDefault();
            $('#modalConfirmaEliminacion').modal('hide');
            console.log(this.entidadElimina);
            switch (this.entidadElimina) {
                  case 'CLIENTE': {
                        this.eliminarCliente();
                        break;
                  }
                  case 'LISTA_PRECIO': {
                        this.eliminarClienteLista();
                        break;
                  }
            }

      }
      eliminarCliente() {
            if (this.clienteSeleccionado) {
                  this._clientesServices.deleteCliente(this.clienteSeleccionado.Id).subscribe(
                        response => {
                              if (response) {
                                    this.showNotification('error', 'El cliente se eliminó correctamente.');
                                    this.clienteSeleccionado = null;
                                    if (this.modoBusqueda)
                                          this.busquedaGetClientes();
                                    else
                                          this.getClientes();
                              }
                        },
                        error => {
                              this.showNotification('error', 'El cliente no se pudo eliminar.');
                              console.log(<any>error);
                        }
                  );
            }
      }

      agregarItemListaCliente(
            $event: any
      ) {
            $event.preventDefault();

            this.clienteLista = new ClienteLista();
            console.log('*** agregarItemListaCliente() => ');
            console.log(this.clienteSeleccionado);
            this.clienteLista.IdCliente = this.clienteSeleccionado.Id;
            this.clienteLista.ListaPrecio = new ListaPrecio();
            this.clienteLista.ListaPrecioCliente = new ListaPrecioCliente();

            this.listaPreciosCliente = [];
            $('#modalListaCliente').modal('show');

      }
      editarItemListaCliente(
            $event: any,
            item: ClienteLista
      ) {
            $event.preventDefault();
            console.log(item);
            this.clienteLista = item;
            this.listaPreciosProducto = new Array<ListaPrecio>()
            this.listaPreciosProducto.push(this.clienteLista.ListaPrecio);
            this._listaPreciosServices.getListaPreciosClienteVigentes(this.clienteLista.ListaPrecio.Id).subscribe(
                  response => {
                        if (response) this.listaPreciosCliente = response;
                  },
                  error => {
                        console.log(<any>error);
                  }
            );
            $('#modalListaCliente').modal('show');
      }

      onChangeListaProducto(
            $event: any
      ) {
            this.listaPreciosCliente = [];
            this._listaPreciosServices.getItemLitaPrecio(+$event.target.value).subscribe(
                  response => {
                        if (response) {
                              this.clienteLista.ListaPrecio = response;
                              this._listaPreciosServices.getListaPreciosClienteVigentes(this.clienteLista.ListaPrecio.Id).subscribe(
                                    response => {
                                          if (response) this.listaPreciosCliente = response;
                                    },
                                    error => {
                                          console.log(<any>error);
                                    }
                              );
                        }
                  },
                  error => {
                        console.log(<any>error);
                  }
            );

      }
      onChangeListaCliente(
            $event: any
      ) {
            this._listaPreciosServices.getItemLitaPrecioCliente(+$event.target.value).subscribe(
                  response => {
                        if (response) this.clienteLista.ListaPrecioCliente = response;
                  },
                  error => {
                        console.log(<any>error);
                  }
            );
      }
      guardarListaCliente(
            $event: any
      ) {
            $event.preventDefault();
            $('#modalListaCliente').modal('hide');

            if (this.clienteLista.ListaPrecio != null && this.clienteLista.ListaPrecioCliente != null) {
                  this._clientesServices.saveClienteLista(this.clienteLista).subscribe(
                        response => {
                              this.showNotification('success', 'La lista de precios para el cliente se actualizó correctamente.');
                              this.getCliente(this.clienteLista.IdCliente);
                              this.clienteLista = new ClienteLista();
                        },
                        error => {
                              this.showNotification('error', <any>error.error.Message);
                              console.log(<any>error);
                        }
                  );
            }
      }
      confirmarEliminacionListaCliente(
            $event: any,
            item: ClienteLista
      ) {
            $event.preventDefault();
            this.clienteLista = item;
            this.entidadElimina = 'LISTA_PRECIO';
            this.textoConfirmaEliminacion = '¿Desea eliminar la lista de precio ' + this.clienteLista.ListaPrecio.Codigo + ' al cliente?';
            $('#modalConfirmaEliminacion').modal('show');
      }

      eliminarClienteLista() {
            if (this.clienteLista) {
                  this._clientesServices.deleteClienteLista(this.clienteLista.Id).subscribe(
                        response => {
                              if (response) {
                                    this.showNotification('error', 'La lista asignada al cliente se eliminó correctamente.');
                                    this.clienteLista = null;
                                    this.getCliente(this.clienteSeleccionado.Id);
                              }
                        },
                        error => {
                              this.showNotification('error', 'La lista asignada al cliente no se pudo eliminar.');
                              console.log(<any>error);
                        }
                  );
            }
      }

      dameCodigo(
            $event: any
      ) {
            $event.preventDefault();
            this.mostrarCodigo = !this.mostrarCodigo;
      }

      enviarWhatsApp(
            $event: any
      ) {

            $event.preventDefault();

            if(this.clienteSeleccionado && this.clienteSeleccionado.Celular){
                  let urlDesktop = 'https://web.whatsapp.com/';
                  let urlMobile = 'https://api.whatsapp.com/';
      
                  let mensaje = 'send?phone=549' + this.clienteSeleccionado.Celular + '&text=%20';
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
