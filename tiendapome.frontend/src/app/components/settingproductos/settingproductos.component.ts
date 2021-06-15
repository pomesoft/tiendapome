import { Component, OnInit, TestabilityRegistry } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NotifierService } from 'node_modules/angular-notifier';

import { Tipo } from '../../models/tipo';
import { MovimientoStockDetalle, Producto, ProductoGrupoOrden, ProductoList, ProductoStock, ProductoStockMovimiento, TipoMovimientoStock } from '../../models/producto';
import { Categoria } from '../../models/categoria';
import { Subcategoria } from '../../models/subcategoria';
import { ListaPrecio } from '../../models/listaPrecio';
import { Parametro } from '../../models/parametro';

import { MenuServices } from '../../services/menu.services';
import { ProductoServices } from '../../services/producto.services';
import { ListapreciosServices } from '../../services/listaprecios.services';
import { ArchivoService } from '../../services/archivo.service';
import { ParametroServices } from '../../services/parametro.services';


declare var $: any;

@Component({
      selector: 'settingproductos',
      templateUrl: './settingproductos.component.html',
      styleUrls: ['./settingproductos.component.css']
})
export class SettingproductosComponent implements OnInit {

      public menu: Array<Tipo>;

      public productoSeleccionado: Producto;
      public codigoSeleccionado: string = '';
      public productoStockSeleccionado: ProductoStock;
      public archivoFoto: Array<File>;
      public productoFoto: Producto;

      public tipoSeleccionado: Tipo;
      public categoriaSeleccionada: Categoria;
      public subCategoriaSeleccionada: Subcategoria;

      public grupoOrdenSeleccionado: ProductoGrupoOrden = new ProductoGrupoOrden();;
      public movimientoStockSeleccionado: ProductoStockMovimiento = new ProductoStockMovimiento();

      public listaPrecios: Array<ListaPrecio>;
      public listaCategorias: Array<Categoria>;
      public listaSubcategorias: Array<Subcategoria>;
      public listaGruposOrden: Array<ProductoGrupoOrden>;
      public listaTiposMovimientoStock: Array<TipoMovimientoStock>;
      public listaMovimientosStock: Array<MovimientoStockDetalle>;

      public files: Set<File> = new Set();

      public procesando: boolean = false;

      public buscarPorCodigoChequed: boolean = true;
      public textoBuscarProducto: string = '';

      public modoBusqueda: boolean = false;

      public productos: Array<Producto>;
      public numeroPagina: number = 1;
      public totalFilas: number;


      public listadoProductos: Array<Producto>;
      public numeroPaginaLP: number = 1;
      public totalFilasLP: number;

      public tipoListado: number = 1;

      public agregaEditaProducto: boolean = false;

      public listaPrecioPorPieza: string;

      public mostrarPanelFiltros: boolean = true;

      formGroup: FormGroup;

      constructor(
            private _menuServices: MenuServices,
            private _productosServices: ProductoServices,
            private _listaPreciosServices: ListapreciosServices,
            private _archivoService: ArchivoService,
            private _notifier: NotifierService,
            private _parametroServices: ParametroServices
      ) {
            this.productos = new Array<Producto>();
            this.limpiarCombosSeleccionados();
      }

      limpiarCombosSeleccionados() {
            this.tipoSeleccionado = new Tipo(-1)
            this.categoriaSeleccionada = new Categoria(-1)
            this.subCategoriaSeleccionada = new Subcategoria(-1);
      }

      ngOnInit() {
            this.getMenuTipos();

      }

      inicializarValidaciones() {
            this.formGroup = new FormGroup({
                  Email: new FormControl('', [
                        Validators.required
                  ]),
                  Password: new FormControl('', [
                        Validators.required
                  ])
            });
      }

      getMenuTipos() {
            this._menuServices.getTiposABM().subscribe(
                  response => {
                        if (response) {
                              this.menu = response;
                              console.log('this.menu =>', this.menu);
                              this.getParametroListaPrecioPorPieza();
                        }
                  },
                  error => {
                        console.log("ERROR::");
                        console.log(<any>error);
                  }
            );
      }

      getParametroListaPrecioPorPieza() {
            this._parametroServices.getParametroValor('LISTA_POR_PIEZA').subscribe(
                  (response: Parametro) => {
                        if (response)
                              this.listaPrecioPorPieza = response.Valor;
                        this.getListaPrecios();
                  },
                  error => { console.log(<any>error); }
            );
      }

      getListaPrecios() {
            this._listaPreciosServices.getListaPreciosVigentes().subscribe(
                  response => {
                        if (response)
                              this.listaPrecios = response;
                        this.getGruposOrden();
                  },
                  error => {
                        console.log("ERROR::");
                        console.log(<any>error);
                  }
            );
      }

      getGruposOrden() {
            this._productosServices.getGruposOrden()
                  .subscribe(
                        response => {
                              if (response)
                                    this.listaGruposOrden = response;
                              this.getTiposMovimientoStock();
                        },
                        error => {
                              console.log("ERROR::");
                              console.log(<any>error);
                        }
                  );
      }

      getTiposMovimientoStock() {
            this.listaTiposMovimientoStock = this._productosServices.getTiposMovimientosStock();
      }

      mostrarProductos(
            $event: any,
            subcategoria: Subcategoria,
            categoria: Categoria,
            tipo: Tipo
      ) {
            $event.preventDefault();

            this.textoBuscarProducto = '';
            /* para menu */
            this.subCategoriaSeleccionada = subcategoria;

            /* combos */
            this.tipoSeleccionado = tipo;
            this.listaCategorias = this.tipoSeleccionado.Categorias;
            this.categoriaSeleccionada = categoria;
            this.listaSubcategorias = this.categoriaSeleccionada.Subcategorias;

            this.modoBusqueda = false;
            this.agregaEditaProducto = false;

            this.obtenerProductos(1);
      }


      obtenerProductos(pagina: number) {

            return new Promise<void>((resolve, reject) => {
                  this._productosServices.getProductosABM(this.subCategoriaSeleccionada.Id, 1, pagina, 10).subscribe(
                        (response: ProductoList) => {
                              if (response) {
                                    this.totalFilas = response.TotalFilas;
                                    this.productos = response.Productos;
                                    this.numeroPagina = pagina;

                                    console.log('this.productos', this.productos);

                                    resolve();
                              }
                        },
                        error => { reject(<any>error); }
                  );
            });

      }


      obtenerListadoProductos(pagina: number) {

            return new Promise<void>((resolve, reject) => {
                  this._productosServices.getProductosABM(this.subCategoriaSeleccionada.Id, this.tipoListado, pagina, 50).subscribe(
                        (response: ProductoList) => {
                              if (response) {
                                    this.totalFilasLP = response.TotalFilas;
                                    this.numeroPaginaLP = pagina;
                                    this.listadoProductos = response.Productos;
                                    resolve();
                              }
                        },
                        error => { reject(<any>error); }
                  );
            });

      }


      onClickListarProductos(
            event: any,
            tipoListado: number
      ) {
            event.preventDefault();

            this.tipoListado = tipoListado;
            this.obtenerListadoProductos(this.numeroPaginaLP);
      }

      busquedaProducto(
            $event: any
      ) {
            $event.preventDefault();
            this.modoBusqueda = true;
            this.busquedaObtenerProductos(this.textoBuscarProducto, this.buscarPorCodigoChequed, 1);
      }

      editarProducto(
            $event: any,
            codigo: string
      ) {
            $event.preventDefault();
            this.agregaEditaProducto = true;
            this.modoBusqueda = false;
            this.busquedaObtenerProductos(codigo, true, 1);
      }

      busquedaObtenerProductos(
            textoBuscarProducto: string,
            buscarPorCodigoChequed: boolean,
            pagina: number
      ) {
            this._productosServices.searchProductos(textoBuscarProducto, buscarPorCodigoChequed, pagina, 10).subscribe(
                  (response: ProductoList) => {
                        if (response) {
                              this.totalFilas = response.TotalFilas;
                              this.productos = response.Productos;
                              this.numeroPagina = pagina;

                              if (this.productos.length > 0) {
                                    this.menu.forEach(item => {
                                          if (item.Id == this.productos[0].IdTipo) {
                                                this.listaCategorias = item.Categorias;
                                                this.listaCategorias.forEach(item => {
                                                      if (item.Id == this.productos[0].IdCategoria)
                                                            this.categoriaSeleccionada = item;
                                                      this.listaSubcategorias = this.categoriaSeleccionada.Subcategorias;
                                                });
                                          }
                                    });
                              }
                        }
                  },
                  error => {
                        this.showNotification('error', 'No se pudo realizar la búsqueda.');
                        console.error(error);
                  }
            );
      }

      busquedaListadoProductos(
            textoBuscarProducto: string,
            buscarPorCodigoChequed: boolean,
            pagina: number
      ) {
            this._productosServices.searchProductos(textoBuscarProducto, buscarPorCodigoChequed, pagina, 10).subscribe(
                  (response: ProductoList) => {
                        if (response) {
                              this.totalFilasLP = response.TotalFilas;
                              this.listadoProductos = response.Productos;
                              this.numeroPaginaLP = pagina;
                        }
                  },
                  error => {
                        this.showNotification('error', 'No se pudo realizar la búsqueda.');
                        console.error(error);
                  }
            );
      }


      pageChangeProductos(pagina: number) {
            if (this.modoBusqueda)
                  this.busquedaObtenerProductos(this.textoBuscarProducto, this.buscarPorCodigoChequed, pagina);
            else
                  this.obtenerProductos(pagina);
      }

      pageChangeProductosLP(pagina: number) {
            if (this.modoBusqueda)
                  this.busquedaObtenerProductos(this.textoBuscarProducto, this.buscarPorCodigoChequed, pagina);
            else
                  this.obtenerListadoProductos(pagina);
      }

      subirFoto(
            $event: any,
            prod: Producto
      ) {
            $event.preventDefault();
            this.productoFoto = prod;
      }


      cancelarSubirFoto(
            $event: any
      ) {
            $event.preventDefault();
            this.productoFoto = null;
      }

      fileCapturarEvento(
            fileInput: any
      ) {
            this.archivoFoto = <Array<File>>fileInput.target.files;
            this.productoFoto.Foto = this.archivoFoto[0].name;

            this.guardarProducto(this.productoFoto)
                  .then(result => {
                        this._archivoService.postArchivo('/producto/foto', this.productoFoto.Path + this.archivoFoto[0].name, this.archivoFoto[0])
                              .then(result => {
                                    console.log('this.agregaEditaProducto => ' + this.agregaEditaProducto);
                                    if (!this.agregaEditaProducto) {
                                          this.productoFoto = null;
                                          this.obtenerProductos(this.numeroPagina);
                                    }
                                    else {
                                          this._productosServices.getProducto(this.productoFoto.Id).subscribe(
                                                (response: Producto) => {
                                                      console.log('response', response);
                                                      if (response) {
                                                            this.productos = new Array<Producto>();
                                                            this.productos.push(response);
                                                            this.productoFoto = null;
                                                      }
                                                },
                                                error => { console.log(<any>error); }
                                          );
                                    }
                              })
                              .catch(err => {
                                    this.showNotification('error', 'No se pudo subir la foto.');
                                    console.log(err)
                              });
                  })
                  .catch(err => {
                        console.log(err)
                  });

      }

      onChangeLista(
            option: any,
            producto: Producto
      ) {
            this.listaPrecios.forEach(lista => {
                  if (lista.Id == +option.target.value) {
                        producto.ListaPrecio = <ListaPrecio>lista;
                  }
            });
      }


      onChangeListaTipo(
            option: any,
      ) {
            this.tipoSeleccionado = this.menu.filter(item => item.Id === +option.target.value)[0];
            this.listaCategorias = this.tipoSeleccionado.Categorias;
            this.listaSubcategorias = [];
            this.categoriaSeleccionada = new Categoria(-1);
            this.subCategoriaSeleccionada = new Subcategoria(-1);
      }

      onChangeListaCategpria(
            option: any,
      ) {
            this.categoriaSeleccionada = this.tipoSeleccionado.Categorias.filter(item => item.Id === +option.target.value)[0];
            this.listaSubcategorias = this.categoriaSeleccionada.Subcategorias;
            console.log('this.listaSubcategorias', this.listaSubcategorias);
      }

      onChangeListaSubcategoria(
            option: any,
            producto: Producto
      ) {
            this.subCategoriaSeleccionada = this.categoriaSeleccionada.Subcategorias.filter(item => item.Id === +option.target.value)[0];

            if (!producto.ProductoStock || producto.ProductoStock.length == 0) {
                  producto.ProductoStock = [];
                  this.subCategoriaSeleccionada.Medidas.forEach(item => {
                        var prodStock = new ProductoStock();
                        prodStock.IdProducto = -1;
                        prodStock.Medida = item.Medida;
                        prodStock.Stock = 0;
                        prodStock.Reservado = 0;
                        producto.ProductoStock.push(prodStock);
                  });
            }
      }

      onChangeCantidadStock(
            producto: Producto
      ) {
            producto.StockReal = 0;
            producto.ProductoStock.forEach(item => {
                  producto.StockReal += item.Stock;
            });
            producto.Stock = producto.StockReal - producto.StockReservado;
      }

      onChangeTipoPrecio(
            option: any,
            producto: Producto
      ) {
            if (+option.target.value == 1) {
                  //precio por PESO
                  producto.ListaPrecio = new ListaPrecio();
            } else {
                  //precio por PIEZA
                  producto.ListaPrecio = this.listaPrecios.filter(item => item.Codigo === this.listaPrecioPorPieza)[0];
            }
      }

      guardar(
            $event: any,
            item: Producto
      ) {
            $event.preventDefault();
            this.procesando = true;
            this.guardarProducto(item)
                  .then((result: Producto) => {
                        if (!this.agregaEditaProducto) {
                              this.obtenerProductos(this.numeroPagina);
                        }
                        else {
                              this.productos = new Array<Producto>();
                              //result.IdCategoria = this.categoriaSeleccionada.Id;
                              this.productos.push(result);
                        }
                  });
      }

      guardarProducto(item: Producto) {
            return new Promise((resolve, reject) => {
                  this._productosServices.saveProducto(item).subscribe(
                        response => {
                              this.procesando = false;
                              if (response) {
                                    this.showNotification('success', 'El producto se actualizó correctamente.');
                                    resolve(response);
                              }
                        },
                        error => {
                              this.procesando = false;
                              this.showNotification('error', <any>error.error.Message);
                              console.error(<any>error);
                              reject(error);
                        }
                  );
            });
      }


      confirmarEliminacion(
            $event: any,
            prod: Producto
      ) {
            $event.preventDefault();
            this.productoSeleccionado = prod;
            console.log(this.productoSeleccionado);
            $('#modalConfirmaEliminacion').modal('show');
      }

      eliminar(
            $event: any
      ) {
            $event.preventDefault();
            $('#modalConfirmaEliminacion').modal('hide');

            if (this.productoSeleccionado) {
                  this._productosServices.deleteProducto(this.productoSeleccionado.Id).subscribe(
                        response => {
                              if (response) {
                                    this.showNotification('error', 'El producto se eliminó correctamente.');
                                    this.productoSeleccionado = null;
                                    this.obtenerProductos(this.numeroPagina)
                              }
                        },
                        error => { console.log(<any>error); }
                  );
            }
      }

      agregar(
            $event: any
      ) {
            $event.preventDefault();

            this.agregaEditaProducto = true;
            this.modoBusqueda = false;
            this.textoBuscarProducto = '';
            this.totalFilas = 1;

            this.productos = new Array<Producto>();
            var lp: ListaPrecio = new ListaPrecio();
            lp.Id = -1;

            var prodNuevo = new Producto(-1, '', '', new Subcategoria(-1), 0, lp, 0, 0, '', '', 0);
            this.productos.push(prodNuevo);

            this.numeroPagina = 1;
      }

      cancelar(
            $event: any
      ) {
            $event.preventDefault();
            if (this.subCategoriaSeleccionada.Id > 0)
                  this.obtenerProductos(this.numeroPagina);
            else
                  this.productos = [];
      }

      mostrarOcultarFiltros(
            $event: any
      ) {
            $event.preventDefault();
            this.mostrarPanelFiltros = !this.mostrarPanelFiltros;
      }

      onClickExportarListadoProductos($event: any) {
            $event.preventDefault();

            if (this.subCategoriaSeleccionada)
                  this._productosServices.printListadoProductos(this.subCategoriaSeleccionada.Id, this.tipoListado);
      }



      onChangeGrupoOrden(
            option: any,
            producto: Producto
      ) {
            if (+option.target.value == 9999) {
                  this.productoSeleccionado = producto;
                  $('#modalGrupoOrden').modal('show');
            } else {
                  this.listaGruposOrden.forEach(lista => {
                        if (lista.Id == +option.target.value) {
                              producto.GrupoOrden = <ProductoGrupoOrden>lista;
                        }
                  });
            }
      }

      onClickGuardarGrupoOrden(
            event: any
      ) {
            event.preventDefault();

            this.procesando = true;

            if (this.grupoOrdenSeleccionado.Descripcion != '') {
                  this._productosServices.saveGrupoOrden(this.grupoOrdenSeleccionado)
                        .subscribe(
                              response => {
                                    if (response) {
                                          this.productoSeleccionado.GrupoOrden = response;

                                          this.grupoOrdenSeleccionado = new ProductoGrupoOrden();
                                          this.procesando = false;
                                          $('#modalGrupoOrden').modal('hide');

                                          this._productosServices.getGruposOrden()
                                                .subscribe(
                                                      resp => {
                                                            if (resp)
                                                                  this.listaGruposOrden = resp;
                                                            this.guardarProducto(this.productoSeleccionado);
                                                      },
                                                      error => {
                                                            console.log("ERROR::");
                                                            console.log(<any>error);
                                                      }
                                                );
                                    }
                              },
                              error => {
                                    this.procesando = false;
                                    $('#modalGrupoOrden').modal('hide');
                                    console.log(<any>error);
                              }
                        );
            }
      }


      onChangeListaTipoMovimientoStock(
            option: any
      ) {
            this.movimientoStockSeleccionado.TipoMovimiento = this.listaTiposMovimientoStock.find(item => item.Id === +option.target.value);
      }

      onClickMovimientoStock(
            event: any,
            itemStock: ProductoStock,
            codigo: string
      ) {
            event.preventDefault();
            this.movimientoStockSeleccionado = new ProductoStockMovimiento();
            this.movimientoStockSeleccionado.IdProductoStock = itemStock.Id;
            this.productoStockSeleccionado = itemStock;
            this.codigoSeleccionado = codigo;

            console.log('this.movimientoStockSeleccionado', this.movimientoStockSeleccionado)

            this._productosServices.getProductoMovimientosStock(itemStock.Id)
                  .subscribe(
                        resp => {
                              if (resp)
                                    this.listaMovimientosStock = resp;
                              else
                                    this.listaMovimientosStock = new Array<MovimientoStockDetalle>();
                              console.log('this.listaMovimientosStock', this.listaMovimientosStock);

                              $('#modalMovimientoStock').modal('show');
                        },
                        error => {
                              console.log("ERROR::");
                              console.log(<any>error);
                        }
                  );

      }

      onClickGuardarMovimientoStock(
            event: any
      ) {
            event.preventDefault();

            if (this.movimientoStockSeleccionado && this.movimientoStockSeleccionado.TipoMovimiento.Id != -1 && this.movimientoStockSeleccionado.Cantidad > 0) {
                  this.procesando = true;
                  this._productosServices.saveMovimientoStock(this.movimientoStockSeleccionado)
                        .subscribe(
                              (response: Producto) => {
                                    if (response) {
                                          console.log('response', response);

                                          this.procesando = false;
                                          $('#modalMovimientoStock').modal('hide');

                                          for (let i = 0; i < this.productos.length; i++) {
                                                if (this.productos[i].Id == response.Id) {
                                                      this.productos[i] = response;
                                                }
                                          }
                                          // if (this.textoBuscarProducto != '')
                                          //       this.busquedaProducto(event);
                                          // else
                                          //       this.obtenerProductos(this.numeroPagina);

                                    }
                              },
                              error => {
                                    this.procesando = false;
                                    $('#modalGrupoOrden').modal('hide');
                                    console.log(<any>error);
                              }
                        );
            }
      }

      onClickDescargarMovimientoStock(
            event: any
      ) {
            event.preventDefault();
            this._productosServices.exportMovimientosStockDetalle(this.movimientoStockSeleccionado.IdProductoStock);
      }

      public showNotification(type: string, message: string): void {
            this._notifier.notify(type, message);
      }
      public hideOldestNotification(): void {
            this._notifier.hideOldest();
      }

}
