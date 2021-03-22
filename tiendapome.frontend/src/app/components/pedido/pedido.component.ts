import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Pedido, PedidoItem, Estado, PedidoItemProducto } from '../../models/pedido';
import { Parametro } from '../../models/parametro';
import { Cliente } from '../../models/cliente';

import { PouchDBServices } from '../../services/pouch-db.services';
import { PedidoService } from '../../services/pedido.service';
import { AutenticaService } from '../../services/autentica.service';
import { Producto, ProductoStock } from 'src/app/models/producto';

declare var $: any;

@Component({
      selector: 'pedido',
      templateUrl: './pedido.component.html',
      styleUrls: ['./pedido.component.css'],
      providers: [PouchDBServices, PedidoService]
})
export class PedidoComponent implements OnInit {

      public pedido: Pedido = new Pedido();
      public itemElimina: PedidoItem;

      public clienteLogin: Cliente;

      public _IdCliente: number;
      public _IdPedido: number;                 //id del pedido del backend
      private _idPedidoDB: string = 'PEDIDO_01'; //id pedido del pouchDB / indexedDB

      public filasPorPagina: number;
      public paginaActual: number;
      public paginaFinal: number;
      public cargandoProductos: boolean = true;

      private entidadElimina: string;

      public mensajeError: string = '';
      public tipoAlerta: string = '';
      public itemAlerta: number = -1;

      public procesando: boolean = false;

      public ESTADO_ITEM_CONFIRTMADO: number = 1;
      public ESTADO_ITEM_SIN_STOCK: number = 2;

      public verificarStock: boolean = false;

      public productIdAlertaModalMedida: number = -1;
      public verTodasLasMedidas: boolean = true;

      numbers: number[] = [];

      constructor(
            private _pedidoServices: PedidoService,
            private _pouchDBServices: PouchDBServices,
            private _router: Router,
            private _route: ActivatedRoute,
            private _autenticaServices: AutenticaService
      ) {
            this.filasPorPagina = 9;
            this.paginaActual = 1;
            this.entidadElimina = null;

            for (let index = 0; index < 10000; index++) {
                  this.numbers.push(index);
            }
      }

      ngOnInit() {
            this._route.params.subscribe((params: Params) => {
                  this._IdPedido = +params.idPedido;
                  this._IdCliente = +params.idCliente;
                  this.inicializarControles();
            });
      }

      async inicializarControles() {
            await this.obtenerPedido(this.paginaActual)
                  .then((response: Pedido) => {
                        if (response) {
                              this.clienteLogin = this._autenticaServices.getClienteLoguin();

                              this.pedido = response;
                              //console.log('pedido', this.pedido);

                              // si el pedido esta EN_PROCESO no se verifica el stock
                              if (localStorage.getItem("verificarStock") != null && this.pedido.Estado.Id < 3) {
                                    this.verificarStock = localStorage.getItem("verificarStock") == 'SI';
                              }
                              //solo para los pedidos que estan en Solicitados se muestran todas las medidas, para el resto de los estado se muestra boton ocultar/mostrar
                              this.verTodasLasMedidas = this.pedido.Estado.Id === 1;

                              this.registrarPedido_pouchDB();
                        }
                  })
                  .catch(err => {
                        this.showAlert('warning', 0, 'Ocurrió un error al cargar la página.');
                        console.log(err);
                  });
      }


      obtenerPedido(pagina: number) {
            return new Promise((resolve, reject) => {
                  if (this._IdCliente != -1) {
                        this._pedidoServices.getPedidoClienteIngresado(this._IdCliente, -1, -1).subscribe(
                              (response: Pedido) => {
                                    this.cargandoProductos = false;
                                    this.paginaFinal = (response.CantidadItems / this.filasPorPagina);
                                    response.Items.forEach(item => {
                                          this.pedido.Items.push(item);
                                    });

                                    resolve(response);
                              },
                              error => {
                                    this.cargandoProductos = false;
                                    reject(error);
                              }
                        );
                  } else {
                        this._pedidoServices.getPedidoObtener(this._IdPedido, -1, -1).subscribe(
                              (response: Pedido) => {
                                    this.cargandoProductos = false;
                                    this.paginaFinal = (response.CantidadItems / this.filasPorPagina);
                                    response.Items.forEach(item => {
                                          this.pedido.Items.push(item);
                                    });
                                    resolve(response);
                              },
                              error => {
                                    this.cargandoProductos = false;
                                    reject(error);
                              }
                        );
                  }
            });
      }

      onScroll() {
            // if ((this.paginaActual < this.paginaFinal) && !this.cargandoProductos) {
            //       this.cargandoProductos = true;
            //       this.paginaActual++;
            //       this.obtenerPedido(this.paginaActual);
            //       console.log('paginaActual', this.paginaActual);
            // }
      }

      guardar(
            $event: any,
            item: PedidoItem
      ) {
            $event.preventDefault();
            this.procesando = true;

            item.ItemProductos.forEach(itemProd => {
                  item.Producto.ProductoStock.forEach(prodStock => {
                        if (prodStock.Id === itemProd.IdProductoStock)
                              prodStock.CantidadPedido = itemProd.Cantidad;
                  });
            });

            if (this.pedidoEnProceso()) {
                  //si el pedido esta en proceso al grabar se confirma el item
                  item.EstadoItem = this.ESTADO_ITEM_CONFIRTMADO;
            }

            this._pedidoServices.savePedidoItem(item).subscribe(
                  response => {
                        this.procesando = false;
                        if (response) {
                              this.showAlert('success', item.Id, 'El ítem del pedido se actualizó correctamente.');
                              this.inicializarControles();
                        }
                  },
                  error => {
                        this.procesando = false;
                        this.showAlert('danger', item.Id, 'Ocurrió un error al actualizar el ítem del pedido.');
                        console.log(<any>error);
                  }
            );
      }

      confirmarEliminacionItem(
            $event: any,
            item: PedidoItem
      ) {
            $event.preventDefault();
            this.entidadElimina = 'PEDIDO_ITEM';
            this.itemElimina = item;
            $('#modalConfirmaEliminacion').modal('show');
      }

      eliminar(
            $event: any
      ) {
            $event.preventDefault();
            $('#modalConfirmaEliminacion').modal('hide');

            if (this.itemElimina) {
                  this._pedidoServices.deletePedidoItem(this.itemElimina.Id).subscribe(
                        response => {
                              if (response) {
                                    this.showAlert('warning', this.itemElimina.Id, 'El producto se eliminó correctamente.');
                                    this.inicializarControles();
                                    this.itemElimina = null;
                              }
                        },
                        error => { console.log(<any>error); }
                  );
            }
      }

      cancelarEliminar(
            $event: any
      ) {
            $event.preventDefault();
            this.itemElimina = null;
            $('#modalConfirmaEliminacion').modal('hide');
      }

      sumaCantidad(
            event: any,
            item: PedidoItem) {
            event.preventDefault();
            if (this.verificarStock) {
                  if (item.Cantidad < item.Producto.Stock) {
                        item.Cantidad++;
                        this.itemModificado(item);
                        this.showAlert('warning', item.Id, 'Guardar cambios...');
                  } else {
                        this.showAlert('warning', item.Id, 'Stock dicponible: ' + item.Producto.Stock.toString());
                  }
            } else {
                  item.Cantidad++;
                  this.itemModificado(item);
                  this.showAlert('warning', item.Id, 'Guardar cambios...');
            }
      }

      restaCantidad(
            event: any,
            item: PedidoItem) {
            event.preventDefault();
            if (item.Cantidad > 1) item.Cantidad--;
            this.itemModificado(item);
            this.showAlert('warning', item.Id, 'Guardar cambios...');
      }

      cantidadChanged(
            event: any,
            item: PedidoItem
      ) {
            event.preventDefault();
            if (this.verificarStock) {
                  if (item.Cantidad < item.Producto.Stock) {
                        this.itemModificado(item);
                        if (item.Cantidad == null || item.Cantidad == 0)
                              item.Cantidad = 1;
                        this.showAlert('warning', item.Id, 'Guardar cambios...');
                  } else {
                        item.Cantidad = item.Producto.Stock;
                        this.showAlert('warning', item.Id, 'Stock dicponible: ' + item.Producto.Stock.toString());
                  }
            } else {
                  this.itemModificado(item);
                  if (item.Cantidad == null || item.Cantidad == 0)
                        item.Cantidad = 1;
                  this.showAlert('warning', item.Id, 'Guardar cambios...');
            }
      }

      mostrarCantidadPorMedida(
            itemProd: PedidoItemProducto,
            prod: Producto
      ): boolean {

            let mostrar: boolean = true;
            if (this.pedidoIngresado() && itemProd.Cantidad === 0) {
                  prod.ProductoStock.forEach(item => {
                        if (item.Medida.Id === itemProd.Medida.Id) {
                              mostrar = item.StockDisponible > 0;
                        }
                  });
            }
            return mostrar;
      }

      sumaCantidadPorMedida(
            event: any,
            itemMedida: PedidoItemProducto,
            item: PedidoItem
      ) {
            event.preventDefault();

            if (this.verificarStock) {
                  let prodStock: ProductoStock = item.Producto.ProductoStock.filter(item => item.Id === itemMedida.IdProductoStock)[0];
                  if (itemMedida.Cantidad < prodStock.StockDisponible) {
                        itemMedida.Cantidad++;
                        this.itemModificado(item);
                        this.showAlert('warning', item.Id, 'Guardar cambios...');
                  } else {
                        this.showAlertModalMedidas('warning', itemMedida.Id, 'Stock disponible: ' + prodStock.StockDisponible.toString());
                  }
            } else {
                  itemMedida.Cantidad++;
            }

      }

      restaCantidadMedida(
            event: any,
            itemMedida: PedidoItemProducto
      ) {
            event.preventDefault();
            if (itemMedida.Cantidad > 0)
                  itemMedida.Cantidad--;
      }

      verificarCantidadPorMedida(
            itemMedida: PedidoItemProducto,
            item: PedidoItem
      ) {
            if (this.verificarStock) {
                  let prodStock: ProductoStock = item.Producto.ProductoStock.filter(item => item.Id === itemMedida.IdProductoStock)[0];
                  if (itemMedida.Cantidad <= prodStock.StockDisponible) {
                        this.itemModificado(item);
                        this.showAlert('warning', item.Id, 'Guardar cambios...');
                  }
                  else {
                        itemMedida.Cantidad = prodStock.Stock;
                        this.showAlertModalMedidas('warning', itemMedida.Id, 'Stock disponible: ' + prodStock.StockDisponible.toString());
                  }
            } else {
                  this.itemModificado(item);
                  this.showAlert('warning', item.Id, 'Guardar cambios...');
            }
      }

      onClickVerTodasLasMedidas(
            event: any
      ) {
            event.preventDefault();
            this.verTodasLasMedidas = !this.verTodasLasMedidas;
      }

      mostrarBotonVerTodasLasMedidas(
            prod: Producto
      ) {
            return prod.ProductoStock.length > 1 && this.pedido.Estado.Id > 1;
      }

      showAlertModalMedidas(
            tipoAlerta: string,
            idProductoStock: number,
            mensaje: string
      ) {
            this.tipoAlerta = tipoAlerta;
            this.mensajeError = mensaje;
            this.productIdAlertaModalMedida = idProductoStock;
            //console.log('productIdAlertaModalMedida', this.productIdAlertaModalMedida);
            $("#alertErrorMedidas_" + idProductoStock.toString())
                  .fadeTo(2000, 500)
                  .slideUp(500, function () {
                        $("#alertErrorMedidas_" + idProductoStock.toString()).slideUp(500);
                        this.mensajeError = '';
                        this.productIdAlertaModalMedida = -1;
                  }
                  );
      }

      obsrvacionesChanged(
            $event: any,
            item: PedidoItem
      ) {
            event.preventDefault();
            this.showAlert('warning', item.Id, 'Guardar cambios...');
      }

      itemModificado(
            item: PedidoItem
      ) {
            item.Modificado = true;
            this.registrarPedido_pouchDB();
      }

      estaComprando() {
            return this._IdCliente != -1;
      }
      estaArmandoPedido() {
            return this._IdPedido != -1;
      }
      pedidoIngresado() {
            return this.pedido.Estado != null && this.pedido.Estado.Id == 1;    //INGRESADO
      }
      pedidoSolicitado() {
            return this.pedido.Estado != null && this.pedido.Estado.Id == 2;    //SOLICITADO
      }
      pedidoEnProceso() {
            if (this.clienteLogin.Rol && this.clienteLogin.Rol.Id != 3)
                  return this.pedido != null && this.pedido.Estado != null && (this.pedido.Estado.Id == 3 || this.pedido.Estado.Id == 8);  // EN_PROCESO o PROVEEDOR
            else
                  return false;
      }
      usuarioAdministrador() {
            if (this.clienteLogin.Rol && this.clienteLogin.Rol.Id != 3)
                  return true;
            else
                  return false;
      }
      esVentaMayorista(): boolean {
            let paramsVentaMayorista: string = localStorage.getItem('paramsVentaMayorista') != null ? localStorage.getItem('paramsVentaMayorista') : 'NO';
            return (paramsVentaMayorista == 'SI');
      }




      registrarEstadoItem(
            $event: any,
            item: PedidoItem,
            estadoItem: number
      ) {
            $event.preventDefault();

            item.EstadoItem = estadoItem;
            this._pedidoServices.savePedidoItemCambioEstado(item).subscribe(
                  (response: PedidoItem) => {
                        if (response) {
                              this.showAlert('success', item.Id, 'El ítem se actualizó correctamente.');
                              
                              let _total: number = 0;

                              this.pedido.Items.forEach(pi => {
                                    if (pi.Id == response.Id) {
                                          pi.Confirmado = response.Confirmado;
                                          pi.Subtotal = response.Subtotal;
                                    }

                                    _total = _total + pi.Subtotal;
                              });

                              this.pedido.Total = _total;

                              this.registrarPedido_pouchDB();
                        }
                  },
                  error => { console.log(<any>error); }
            );


      }

      registrarPedido_pouchDB() {
            this._pouchDBServices.get(this._idPedidoDB)
                  .then(doc => {
                        if (doc) {
                              this.pedido._id = this._idPedidoDB;
                              this._pouchDBServices.update(this.pedido);
                        } else {
                              this._pouchDBServices.put(this._idPedidoDB, this.pedido);
                        }
                  })
                  .catch(err => {
                        console.log(err);
                        this._pouchDBServices.put(this._idPedidoDB, this.pedido);
                  });
      }

      showAlert(
            tipoAlerta: string,
            idItem: number,
            mensaje: string
      ) {

            this.productIdAlertaModalMedida = -1;

            this.tipoAlerta = tipoAlerta;
            this.mensajeError = mensaje;
            this.itemAlerta = idItem;
            $("#alertError_" + idItem.toString())
                  .fadeTo(2000, 500)
                  .slideUp(500, function () {
                        $("#alertError_" + idItem.toString()).slideUp(500);
                        this.mensajeError = '';
                        this.itemAlerta = -1;
                  }
                  );
      }
}
