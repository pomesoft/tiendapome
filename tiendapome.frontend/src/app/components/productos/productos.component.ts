import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { debugOutputAstAsTypeScript } from '@angular/compiler';

import { Producto, ProductoList, ProductoStock } from '../../models/producto';
import { Pedido, PedidoItem, PedidoItemProducto } from '../../models/pedido';
import { Subcategoria, Medida } from '../../models/subcategoria';
import { Parametro } from '../../models/parametro';

import { PouchDBServices } from '../../services/pouch-db.services';
import { ProductoServices } from '../../services/producto.services';
import { PedidoService } from '../../services/pedido.service';
import { MenuServices } from '../../services/menu.services';
import { AutenticaService } from '../../services/autentica.service';
import { ParametroServices } from '../../services/parametro.services';

declare var $: any;

@Component({
      selector: 'productos',
      templateUrl: './productos.component.html',
      styleUrls: ['./productos.component.css'],
      providers: [PouchDBServices, ProductoServices, PedidoService]
})
export class ProductosComponent implements OnInit {

      public productos: Array<Producto>;
      public pedido: Pedido;
      public idClientePedido: number;

      public productoIngresaCantidades: Producto;
      public descripcionProductoModalCantidades: string = '';

      public clienteConListaAsignada: boolean = false;
      public ventaMayorista: boolean = false;
      public verificarStock: boolean = false;
      public mostrasrPreciosSoloRegistrados: boolean = false;

      public conStock: boolean;
      public idSubcategoria: number;
      public subcategoria: Subcategoria;

      public textoBuscar: string = '';

      public filasPorPagina: number;
      public paginaActual: number;
      public paginaFinal: number;
      public cargandoProductos: boolean = true;

      public agregandoAlCarrito: boolean = false;

      public mensajeError: string = '';
      public tipoAlerta: string = '';
      public productIdAlerta: number = -1;
      public productIdAlertaModalMedida: number = -1;


      public subcategoriaEnPromo: number = 101;
      public porcentajeEnPromo: number = 12;

      public toLoad: boolean = false;

      private _idPedidoDB: string = 'PEDIDO_01'; //id pedido del pouchDB / indexedDB

      private nroWhatsApp: string = '';
      constructor(
            private _productosServices: ProductoServices,
            private _pedidoServices: PedidoService,
            private _pouchDBServices: PouchDBServices,
            private _zone: NgZone,
            private _route: ActivatedRoute,
            private _router: Router,
            private _menuServices: MenuServices,
            private _autenticaServices: AutenticaService,
            private _parametroServices: ParametroServices
      ) {
            this.filasPorPagina = 9;
            this.paginaActual = 1;
            this.productos = new Array<Producto>();
            this.idClientePedido = -1;
      }

      ngOnInit() {

            if (window.location.hash.endsWith('jqmlndng1973')) {
                  //console.log('window.location.hash', window.location.hash);
                  localStorage.setItem('subcatergoriaCarrito', '');
                  localStorage.setItem('reqLanding_HashHref', window.location.hash);
            } else {
                  localStorage.removeItem('reqLanding_HashHref')
            }

            this._route.params.subscribe((params: Params) => {
                  this.conStock = params.conStock;
                  this.idSubcategoria = +params.subcategoria;
                  this.textoBuscar = params.textobuscar;
                  this.inicializarControles();
            });
      }

      async inicializarControles() {
            await this._parametroServices.obtenerTodosParametros()
                  .then(result => {
                        return this.obtenerParamsVentaMayorista();
                  })
                  .then(result => {
                        return this.obtenerParamsVerificarStock();
                  })
                  .then(result => {
                        return this.obtenerParamsNroVentasWhatApp();
                  })
                  .then(result => {
                        return this.obtenerPedido();
                  })
                  .then(result => {
                        if (result) {
                              this.pedido = <Pedido>result;
                              return this.registrarPedido_pouchDB();
                        }
                  })
                  .then(result => {
                        return this.obtenerParamsMostrarPreciosSoloRegistrados();
                  })
                  .then(result => {
                        return this.obtenerProductos(this.paginaActual);
                  })
                  .catch(err => {
                        this.showAlert('danger', 0, 'Ocurrió un error al cargar la página.')
                        console.log(err);
                  });
      }

      obtenerParamsVentaMayorista() {
            return new Promise((resolve, reject) => {
                  //if (localStorage.getItem('paramsVentaMayorista') == null) {
                  this._parametroServices.getParametroValor('VENTA_MAYORISTA').subscribe(
                        (response: Parametro) => {
                              if (response) {
                                    localStorage.setItem('paramsVentaMayorista', response.Valor);
                              } else {
                                    localStorage.removeItem('paramsVentaMayorista');
                              }
                              resolve(true);
                        },
                        error => { reject(<any>error); }
                  );
                  // } else {
                  //       resolve(true);
                  // }
            });
      }
      obtenerParamsMostrarPreciosSoloRegistrados() {
            return new Promise((resolve, reject) => {
                  localStorage.removeItem('paramsMostrarPreciosSoloRegistrados');
                  this.mostrasrPreciosSoloRegistrados = false;
                  this._parametroServices.getParametroValor('MOSTRAR_PRECIOS_SOLO_REGISTRADOS').subscribe(
                        (response: Parametro) => {
                              if (response) {
                                    localStorage.setItem("paramsMostrarPreciosSoloRegistrados", response.Valor != null ? response.Valor : 'NO');
                                    this.mostrasrPreciosSoloRegistrados = localStorage.getItem("paramsMostrarPreciosSoloRegistrados") == 'SI';
                              } else {

                              }
                              resolve(true);
                        },
                        error => { reject(<any>error); }
                  );
            });
      }

      obtenerParamsVerificarStock() {
            return new Promise((resolve, reject) => {
                  this.verificarStock = false;
                  localStorage.removeItem("verificarStock");
                  this._parametroServices.getParametroValor('VERIFICAR_STCOK').subscribe(
                        (response: Parametro) => {
                              if (response) {
                                    localStorage.setItem("verificarStock", response.Valor != null ? response.Valor : 'NO');
                                    this.verificarStock = localStorage.getItem("verificarStock") == 'SI';
                              }
                              resolve(true);
                        },
                        error => {
                              console.log(error);
                              resolve(true);
                        }
                  );
            });
      }

      obtenerParamsNroVentasWhatApp() {
            return new Promise((resolve, reject) => {
                  this._parametroServices.getParametroValor('NRO_VENTAS_WHATSAPP')
                        .subscribe(
                              (response: Parametro) => {
                                    if (response) {
                                          this.nroWhatsApp = response.Valor;
                                    } 
                                    resolve(true);
                              },
                              error => { reject(<any>error); }
                        );
            });
      }

      obtenerPedido() {
            return new Promise((resolve, reject) => {
                  let clienteLogin = this._autenticaServices.getClienteLoguin();
                  if (clienteLogin) {
                        this.idClientePedido = clienteLogin.Id;

                        let paramsVentaMayorista: string = localStorage.getItem('paramsVentaMayorista') != null ? localStorage.getItem('paramsVentaMayorista') : 'NO';
                        this.ventaMayorista = (clienteLogin.ListasPrecioAsignada && paramsVentaMayorista == 'SI');

                        this.clienteConListaAsignada = clienteLogin.ListasPrecioAsignada;

                        this._pedidoServices.getPedidoClienteIngresado(this.idClientePedido, -1, -1).subscribe(
                              response => { resolve(response); },
                              error => { reject(error); }
                        );

                  } else {
                        resolve(false);
                  }
            });
      }

      registrarPedido_pouchDB() {
            return new Promise((resolve, reject) => {
                  this._pouchDBServices.get(this._idPedidoDB)
                        .then(doc => {
                              if (doc) {
                                    this.pedido._id = this._idPedidoDB;
                                    this._pouchDBServices.update(this.pedido);
                              }
                              resolve(true);
                        })
                        .catch(err => {
                              if (err.status == 404) {
                                    this._pouchDBServices.put(this._idPedidoDB, this.pedido);
                              } else {
                                    console.log(err);
                              }
                              resolve(true);
                        });
            });
      }


      obtenerSubcategoria() {
            return new Promise((resolve, reject) => {
                  this._menuServices.getItemSubcategoria(this.idSubcategoria).subscribe(
                        response => {
                              this.subcategoria = <Subcategoria>response;
                              resolve(response);

                        },
                        error => { reject(error); }
                  );
            });
      }

      obtenerProductos(pagina: number) {
            return new Promise((resolve, reject) => {
                  let idCliente = -1;
                  if (this.pedido) idCliente = this.pedido.Cliente.Id;

                  this._productosServices.getProductos(this.conStock, this.idSubcategoria, this.textoBuscar, idCliente, pagina, this.filasPorPagina).subscribe(
                        (response: ProductoList) => {
                              this.cargandoProductos = false;
                              this.paginaFinal = (response.TotalFilas / this.filasPorPagina);
                              this.paginaActual = pagina;
                              response.Productos.forEach(item => {
                                    if (idCliente > 0) {
                                          let itemPedido: PedidoItem = this.pedido.Items.find(ip => ip.Producto.Id === item.Id);
                                          if (itemPedido) {
                                                item.ProductoPedido = true;
                                                item.CantidadPedido = itemPedido.Cantidad;
                                          } else {
                                                item.ProductoPedido = false;
                                                item.CantidadPedido = 0;
                                          }
                                    }
                                    this.productos.push(item);
                              });
                              console.log('productos cargados', this.productos);

                              resolve(true);
                        },
                        error => {
                              this.cargandoProductos = false;
                              reject(error);
                        }
                  );
            });
      }

      onScroll() {
            if ((this.paginaActual < this.paginaFinal) && !this.cargandoProductos) {
                  this.cargandoProductos = true;
                  this.paginaActual++;
                  this.obtenerProductos(this.paginaActual);
                  // console.log('this.paginaActual', this.paginaActual);
                  // console.log('this.paginaFinal', this.paginaFinal);
            }
      }


      tieneFoto(prod: Producto) {
            return prod.Foto != null && prod.Foto.length > 0;
      }


      addCarrito(
            $event: any,
            prodSeleccionado: Producto
      ) {
            $event.preventDefault();
            this.agregandoAlCarrito = true;

            var item: PedidoItem = new PedidoItem();
            item.Id = -1;
            item.IdPedido = this.pedido.Id;
            item.Producto = prodSeleccionado;
            item.Cantidad = prodSeleccionado.CantidadPedido;
            item.Observaciones = prodSeleccionado.ObservacionesPedido;
            item.MostrarMedidas = prodSeleccionado.MostrarMedidas;

            //TODO: si viene por aca es que tien talle unico, el backend se encarga de buscar y grabar el TALLE UNICO en la tabla PedidoItemProductos
            var todoBien: boolean = true;


            let _cantidadValidar: number = prodSeleccionado.CantidadPedido;

            if (prodSeleccionado.ProductoStock) {
                  prodSeleccionado.ProductoStock.forEach(pStock => {
                        _cantidadValidar += pStock.CantidadPedido;

                        var itemProd: PedidoItemProducto = new PedidoItemProducto();
                        itemProd.Id = -1;
                        itemProd.IdPedidoItem = -1;
                        itemProd.IdProductoStock = pStock.Id;
                        itemProd.Medida = pStock.Medida;
                        itemProd.Cantidad = pStock.CantidadPedido;

                        item.ItemProductos.push(itemProd);
                  });
            }

            if (_cantidadValidar == 0) {
                  this.showAlert('warning', prodSeleccionado.Id, 'Por favor, indicar cantidad que desea agregar.');
                  this.agregandoAlCarrito = false;
                  todoBien = false;
            }

            if (this.verificarStock) {
                  if (prodSeleccionado.CantidadPedido > prodSeleccionado.Stock) {
                        prodSeleccionado.CantidadPedido = prodSeleccionado.Stock;
                        this.showAlert('warning', prodSeleccionado.Id, 'Stock disponible: ' + prodSeleccionado.Stock.toString());
                        this.agregandoAlCarrito = false;
                        todoBien = false;
                  }
            }

            if (todoBien) {
                  this._pedidoServices.savePedidoItem(item).subscribe(
                        response => {
                              this.agregandoAlCarrito = false;
                              this.pedido = response;
                              prodSeleccionado.ProductoPedido = true;
                              if (this.productoIngresaCantidades) {
                                    $('#modalMedidas').modal('hide');
                                    this.productoIngresaCantidades = null;
                              }
                              this.showAlert('success', prodSeleccionado.Id, 'El producto se agregó correctamente.');
                              this.registrarPedido_pouchDB();
                        },
                        error => {
                              this.agregandoAlCarrito = false;
                              if (this.productoIngresaCantidades) {
                                    $('#modalMedidas').modal('hide');
                                    this.productoIngresaCantidades = null;
                              }
                              this.showAlert('danger', prodSeleccionado.Id, 'Ocurrió un error.');
                              console.log("ERROR::");
                              console.log(<any>error);
                        }
                  );
            }
      }

      ingresarCantidadesPorMedida(
            event: any,
            prod: Producto
      ) {
            event.preventDefault();

            this.productoIngresaCantidades = prod;
            this.descripcionProductoModalCantidades = 'Codigo: ' + prod.Codigo + ' - ' + prod.Descripcion;
            $('#modalMedidas').modal('show');
      }


      sumaCantidad(
            event: any,
            prod: Producto
      ) {
            event.preventDefault();

            if (this.verificarStock) {
                  if (prod.CantidadPedido < prod.Stock) {
                        prod.CantidadPedido++;
                  } else {
                        this.showAlert('warning', prod.Id, 'Stock disponible: ' + prod.Stock.toString());
                  }
            } else {
                  prod.CantidadPedido++;
            }

      }

      restaCantidad(
            event: any,
            prod: Producto
      ) {
            event.preventDefault();
            if (prod.CantidadPedido > 0)
                  prod.CantidadPedido--;
      }

      verificarCantidad(
            prod: Producto
      ) {
            if (this.verificarStock) {
                  if (prod.CantidadPedido > prod.Stock) {
                        this.showAlert('warning', prod.Id, 'Stock disponible: ' + prod.Stock.toString());
                  }
            } else {
                  prod.CantidadPedido = prod.Stock;
            }
      }


      sumaCantidadPorMedida(
            event: any,
            prodStock: ProductoStock
      ) {
            event.preventDefault();

            if (this.verificarStock) {
                  if (prodStock.CantidadPedido < prodStock.StockDisponible) {
                        prodStock.CantidadPedido++;
                  } else {
                        this.showAlertModalMedidas('danger', prodStock.Id, 'Stock disponible: ' + prodStock.StockDisponible.toString());
                  }
            } else {
                  prodStock.CantidadPedido++;
            }

      }

      restaCantidadMedida(
            event: any,
            prodStock: ProductoStock
      ) {
            event.preventDefault();
            if (prodStock.CantidadPedido > 0)
                  prodStock.CantidadPedido--;
      }

      verificarCantidadPorMedida(
            prodStock: ProductoStock
      ) {
            if (this.verificarStock && prodStock.CantidadPedido > prodStock.StockDisponible) {
                  prodStock.CantidadPedido = prodStock.Stock;
                  this.showAlertModalMedidas('warning', prodStock.Id, 'Stock disponible: ' + prodStock.Stock.toString());
            }
      }
      irAlCarrito($event: any) {
            $event.preventDefault();
            this._router.navigate(['/pedido/-1/' + this.idClientePedido]);
      }

      showAlert(
            tipoAlerta: string,
            idProdudto: number,
            mensaje: string
      ) {
            this.tipoAlerta = tipoAlerta;
            this.mensajeError = mensaje;
            this.productIdAlerta = idProdudto;
            $("#alertError_" + idProdudto.toString())
                  .fadeTo(2000, 500)
                  .slideUp(500, function () {
                        $("#alertError_" + idProdudto.toString()).slideUp(500);
                        this.mensajeError = '';
                        this.productIdAlerta = -1;
                  }
                  );
      }

      showAlertModalMedidas(
            tipoAlerta: string,
            idProductoStock: number,
            mensaje: string
      ) {
            this.tipoAlerta = tipoAlerta;
            this.mensajeError = mensaje;
            this.productIdAlertaModalMedida = idProductoStock;
            $("#alertErrorMedidas_" + idProductoStock.toString())
                  .fadeTo(2000, 500)
                  .slideUp(500, function () {
                        $("#alertErrorMedidas_" + idProductoStock.toString()).slideUp(500);
                        this.mensajeError = '';
                        this.productIdAlertaModalMedida = -1;
                  }
                  );
      }

      mostrarPrecios() {

            if (this.mostrasrPreciosSoloRegistrados) {
                  return (this.pedido && this.pedido.Cliente);
            } else {
                  return true;
            }

      }

      getCategoriaCarrito(): string {
            let catego: string = '';

            let categoriaCarrito = localStorage.getItem("catergoriaCarrito");
            switch (categoriaCarrito) {
                  case 'Anillos':
                        catego = 'este%20anillo';
                        break;
                  case 'Aros':
                        catego = 'este%20aro';
                        break;
                  case 'Conjuntos':
                        catego = 'este%20conjunto';
                        break;
                  case 'Dijes':
                        catego = 'este%20dije';
                        break;
                  case 'Pulseras':
                        catego = 'esta%20pulsera';
                        break;
                  case 'Cadenas':
                        catego = 'esta%20cadena';
                        break;
                  case 'Swarovski':
                        catego = 'este%20cristal%20swarovski';
                        break;
                  case 'Casio':
                        catego = 'este%20reloj';
                        break;
                  case 'Pandora':
                        catego = 'esta%20pandora';
                        break;
                  case 'Smartwatch':
                        catego = 'este%20reloj';
                        break;
            }
            return catego;
      }

      enviarWhatsApp(
            $event: any,
            producto: Producto
      ) {
            $event.preventDefault();
            console.log(producto);

            let urlDesktop = 'https://web.whatsapp.com/';
            let urlMobile = 'https://api.whatsapp.com/';


            let mensaje = 'send?phone=' + this.nroWhatsApp + '&text=%20Hola!%20Me%20interesa%20' + this.getCategoriaCarrito() + '!%20(*' + producto.Codigo + ')';
            if (this.isMobile()) {
                  window.open(urlMobile + mensaje, '_blank')
            } else {
                  window.open(urlDesktop + mensaje, '_blank')
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

}
