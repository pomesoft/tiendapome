"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SettingproductosComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var tipo_1 = require("../../models/tipo");
var producto_1 = require("../../models/producto");
var categoria_1 = require("../../models/categoria");
var subcategoria_1 = require("../../models/subcategoria");
var listaPrecio_1 = require("../../models/listaPrecio");
var SettingproductosComponent = /** @class */ (function () {
    function SettingproductosComponent(_menuServices, _productosServices, _listaPreciosServices, _archivoService, _notifier, _parametroServices) {
        this._menuServices = _menuServices;
        this._productosServices = _productosServices;
        this._listaPreciosServices = _listaPreciosServices;
        this._archivoService = _archivoService;
        this._notifier = _notifier;
        this._parametroServices = _parametroServices;
        this.grupoOrdenSeleccionado = new producto_1.ProductoGrupoOrden();
        this.files = new Set();
        this.procesando = false;
        this.buscarPorCodigoChequed = true;
        this.textoBuscarProducto = '';
        this.modoBusqueda = false;
        this.numeroPagina = 1;
        this.numeroPaginaLP = 1;
        this.tipoListado = 1;
        this.agregaEditaProducto = false;
        this.mostrarPanelFiltros = true;
        this.productos = new Array();
        this.limpiarCombosSeleccionados();
    }
    ;
    SettingproductosComponent.prototype.limpiarCombosSeleccionados = function () {
        this.tipoSeleccionado = new tipo_1.Tipo(-1);
        this.categoriaSeleccionada = new categoria_1.Categoria(-1);
        this.subCategoriaSeleccionada = new subcategoria_1.Subcategoria(-1);
    };
    SettingproductosComponent.prototype.ngOnInit = function () {
        this.getMenuTipos();
    };
    SettingproductosComponent.prototype.inicializarValidaciones = function () {
        this.formGroup = new forms_1.FormGroup({
            Email: new forms_1.FormControl('', [
                forms_1.Validators.required
            ]),
            Password: new forms_1.FormControl('', [
                forms_1.Validators.required
            ])
        });
    };
    SettingproductosComponent.prototype.getMenuTipos = function () {
        var _this = this;
        this._menuServices.getTiposABM().subscribe(function (response) {
            if (response) {
                _this.menu = response;
                console.log('this.menu =>', _this.menu);
                _this.getParametroListaPrecioPorPieza();
            }
        }, function (error) {
            console.log("ERROR::");
            console.log(error);
        });
    };
    SettingproductosComponent.prototype.getParametroListaPrecioPorPieza = function () {
        var _this = this;
        this._parametroServices.getParametroValor('LISTA_POR_PIEZA').subscribe(function (response) {
            if (response)
                _this.listaPrecioPorPieza = response.Valor;
            _this.getListaPrecios();
        }, function (error) { console.log(error); });
    };
    SettingproductosComponent.prototype.getListaPrecios = function () {
        var _this = this;
        this._listaPreciosServices.getListaPreciosVigentes().subscribe(function (response) {
            if (response)
                _this.listaPrecios = response;
            _this.getGruposOrden();
        }, function (error) {
            console.log("ERROR::");
            console.log(error);
        });
    };
    SettingproductosComponent.prototype.getGruposOrden = function () {
        var _this = this;
        this._productosServices.getGruposOrden()
            .subscribe(function (response) {
            if (response)
                _this.listaGruposOrden = response;
            console.log('this.listaGruposOrden', _this.listaGruposOrden);
        }, function (error) {
            console.log("ERROR::");
            console.log(error);
        });
    };
    SettingproductosComponent.prototype.mostrarProductos = function ($event, subcategoria, categoria, tipo) {
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
    };
    SettingproductosComponent.prototype.obtenerProductos = function (pagina) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._productosServices.getProductosABM(_this.subCategoriaSeleccionada.Id, 1, pagina, 10).subscribe(function (response) {
                if (response) {
                    _this.totalFilas = response.TotalFilas;
                    _this.productos = response.Productos;
                    _this.numeroPagina = pagina;
                    console.log('this.productos', _this.productos);
                    resolve();
                }
            }, function (error) { reject(error); });
        });
    };
    SettingproductosComponent.prototype.obtenerListadoProductos = function (pagina) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._productosServices.getProductosABM(_this.subCategoriaSeleccionada.Id, _this.tipoListado, pagina, 50).subscribe(function (response) {
                if (response) {
                    _this.totalFilasLP = response.TotalFilas;
                    _this.numeroPaginaLP = pagina;
                    _this.listadoProductos = response.Productos;
                    resolve();
                }
            }, function (error) { reject(error); });
        });
    };
    SettingproductosComponent.prototype.onClickListarProductos = function (event, tipoListado) {
        event.preventDefault();
        this.tipoListado = tipoListado;
        this.obtenerListadoProductos(this.numeroPaginaLP);
    };
    SettingproductosComponent.prototype.busquedaProducto = function ($event) {
        $event.preventDefault();
        this.modoBusqueda = true;
        this.busquedaObtenerProductos(this.textoBuscarProducto, this.buscarPorCodigoChequed, 1);
    };
    SettingproductosComponent.prototype.editarProducto = function ($event, codigo) {
        $event.preventDefault();
        this.agregaEditaProducto = true;
        this.modoBusqueda = false;
        this.busquedaObtenerProductos(codigo, true, 1);
    };
    SettingproductosComponent.prototype.busquedaObtenerProductos = function (textoBuscarProducto, buscarPorCodigoChequed, pagina) {
        var _this = this;
        this._productosServices.searchProductos(textoBuscarProducto, buscarPorCodigoChequed, pagina, 10).subscribe(function (response) {
            if (response) {
                _this.totalFilas = response.TotalFilas;
                _this.productos = response.Productos;
                _this.numeroPagina = pagina;
                if (_this.productos.length > 0) {
                    _this.menu.forEach(function (item) {
                        if (item.Id == _this.productos[0].IdTipo) {
                            _this.listaCategorias = item.Categorias;
                            _this.listaCategorias.forEach(function (item) {
                                if (item.Id == _this.productos[0].IdCategoria)
                                    _this.categoriaSeleccionada = item;
                                _this.listaSubcategorias = _this.categoriaSeleccionada.Subcategorias;
                            });
                        }
                    });
                }
            }
        }, function (error) {
            _this.showNotification('error', 'No se pudo realizar la búsqueda.');
            console.error(error);
        });
    };
    SettingproductosComponent.prototype.busquedaListadoProductos = function (textoBuscarProducto, buscarPorCodigoChequed, pagina) {
        var _this = this;
        this._productosServices.searchProductos(textoBuscarProducto, buscarPorCodigoChequed, pagina, 10).subscribe(function (response) {
            if (response) {
                _this.totalFilasLP = response.TotalFilas;
                _this.listadoProductos = response.Productos;
                _this.numeroPaginaLP = pagina;
            }
        }, function (error) {
            _this.showNotification('error', 'No se pudo realizar la búsqueda.');
            console.error(error);
        });
    };
    SettingproductosComponent.prototype.pageChangeProductos = function (pagina) {
        if (this.modoBusqueda)
            this.busquedaObtenerProductos(this.textoBuscarProducto, this.buscarPorCodigoChequed, pagina);
        else
            this.obtenerProductos(pagina);
    };
    SettingproductosComponent.prototype.pageChangeProductosLP = function (pagina) {
        if (this.modoBusqueda)
            this.busquedaObtenerProductos(this.textoBuscarProducto, this.buscarPorCodigoChequed, pagina);
        else
            this.obtenerListadoProductos(pagina);
    };
    SettingproductosComponent.prototype.subirFoto = function ($event, prod) {
        $event.preventDefault();
        this.productoFoto = prod;
    };
    SettingproductosComponent.prototype.cancelarSubirFoto = function ($event) {
        $event.preventDefault();
        this.productoFoto = null;
    };
    SettingproductosComponent.prototype.fileCapturarEvento = function (fileInput) {
        var _this = this;
        this.archivoFoto = fileInput.target.files;
        this.productoFoto.Foto = this.archivoFoto[0].name;
        this.guardarProducto(this.productoFoto)
            .then(function (result) {
            _this._archivoService.postArchivo('/producto/foto', _this.productoFoto.Path + _this.archivoFoto[0].name, _this.archivoFoto[0])
                .then(function (result) {
                console.log('this.agregaEditaProducto => ' + _this.agregaEditaProducto);
                if (!_this.agregaEditaProducto) {
                    _this.productoFoto = null;
                    _this.obtenerProductos(_this.numeroPagina);
                }
                else {
                    _this._productosServices.getProducto(_this.productoFoto.Id).subscribe(function (response) {
                        console.log('response', response);
                        if (response) {
                            _this.productos = new Array();
                            _this.productos.push(response);
                            _this.productoFoto = null;
                        }
                    }, function (error) { console.log(error); });
                }
            })["catch"](function (err) {
                _this.showNotification('error', 'No se pudo subir la foto.');
                console.log(err);
            });
        })["catch"](function (err) {
            console.log(err);
        });
    };
    SettingproductosComponent.prototype.onChangeLista = function (option, producto) {
        this.listaPrecios.forEach(function (lista) {
            if (lista.Id == +option.target.value) {
                producto.ListaPrecio = lista;
            }
        });
    };
    SettingproductosComponent.prototype.onChangeListaTipo = function (option) {
        this.tipoSeleccionado = this.menu.filter(function (item) { return item.Id === +option.target.value; })[0];
        this.listaCategorias = this.tipoSeleccionado.Categorias;
        this.listaSubcategorias = [];
        this.categoriaSeleccionada = new categoria_1.Categoria(-1);
        this.subCategoriaSeleccionada = new subcategoria_1.Subcategoria(-1);
    };
    SettingproductosComponent.prototype.onChangeListaCategpria = function (option) {
        this.categoriaSeleccionada = this.tipoSeleccionado.Categorias.filter(function (item) { return item.Id === +option.target.value; })[0];
        this.listaSubcategorias = this.categoriaSeleccionada.Subcategorias;
        console.log('this.listaSubcategorias', this.listaSubcategorias);
    };
    SettingproductosComponent.prototype.onChangeListaSubcategoria = function (option, producto) {
        this.subCategoriaSeleccionada = this.categoriaSeleccionada.Subcategorias.filter(function (item) { return item.Id === +option.target.value; })[0];
        if (!producto.ProductoStock || producto.ProductoStock.length == 0) {
            producto.ProductoStock = [];
            this.subCategoriaSeleccionada.Medidas.forEach(function (item) {
                var prodStock = new producto_1.ProductoStock();
                prodStock.IdProducto = -1;
                prodStock.Medida = item.Medida;
                prodStock.Stock = 0;
                prodStock.Reservado = 0;
                producto.ProductoStock.push(prodStock);
            });
        }
    };
    SettingproductosComponent.prototype.onChangeCantidadStock = function (producto) {
        producto.StockReal = 0;
        producto.ProductoStock.forEach(function (item) {
            producto.StockReal += item.Stock;
        });
        producto.Stock = producto.StockReal - producto.StockReservado;
    };
    SettingproductosComponent.prototype.onChangeTipoPrecio = function (option, producto) {
        var _this = this;
        if (+option.target.value == 1) {
            //precio por PESO
            producto.ListaPrecio = new listaPrecio_1.ListaPrecio();
        }
        else {
            //precio por PIEZA
            producto.ListaPrecio = this.listaPrecios.filter(function (item) { return item.Codigo === _this.listaPrecioPorPieza; })[0];
        }
    };
    SettingproductosComponent.prototype.guardar = function ($event, item) {
        var _this = this;
        $event.preventDefault();
        this.procesando = true;
        this.guardarProducto(item)
            .then(function (result) {
            if (!_this.agregaEditaProducto) {
                _this.obtenerProductos(_this.numeroPagina);
            }
            else {
                _this.productos = new Array();
                //result.IdCategoria = this.categoriaSeleccionada.Id;
                _this.productos.push(result);
            }
        });
    };
    SettingproductosComponent.prototype.guardarProducto = function (item) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            debugger;
            _this._productosServices.saveProducto(item).subscribe(function (response) {
                _this.procesando = false;
                if (response) {
                    _this.showNotification('success', 'El producto se actualizó correctamente.');
                    resolve(response);
                }
            }, function (error) {
                _this.procesando = false;
                _this.showNotification('error', error.error.Message);
                console.error(error);
                reject(error);
            });
        });
    };
    SettingproductosComponent.prototype.confirmarEliminacion = function ($event, prod) {
        $event.preventDefault();
        this.productoSeleccionado = prod;
        console.log(this.productoSeleccionado);
        $('#modalConfirmaEliminacion').modal('show');
    };
    SettingproductosComponent.prototype.eliminar = function ($event) {
        var _this = this;
        $event.preventDefault();
        $('#modalConfirmaEliminacion').modal('hide');
        if (this.productoSeleccionado) {
            this._productosServices.deleteProducto(this.productoSeleccionado.Id).subscribe(function (response) {
                if (response) {
                    _this.showNotification('error', 'El producto se eliminó correctamente.');
                    _this.productoSeleccionado = null;
                    _this.obtenerProductos(_this.numeroPagina);
                }
            }, function (error) { console.log(error); });
        }
    };
    SettingproductosComponent.prototype.agregar = function ($event) {
        $event.preventDefault();
        this.agregaEditaProducto = true;
        this.modoBusqueda = false;
        this.textoBuscarProducto = '';
        this.totalFilas = 1;
        this.productos = new Array();
        var lp = new listaPrecio_1.ListaPrecio();
        lp.Id = -1;
        var prodNuevo = new producto_1.Producto(-1, '', '', new subcategoria_1.Subcategoria(-1), 0, lp, 0, 0, '', '', 0);
        this.productos.push(prodNuevo);
    };
    SettingproductosComponent.prototype.cancelar = function ($event) {
        $event.preventDefault();
        if (this.subCategoriaSeleccionada.Id > 0)
            this.obtenerProductos(this.numeroPagina);
        else
            this.productos = [];
    };
    SettingproductosComponent.prototype.mostrarOcultarFiltros = function ($event) {
        $event.preventDefault();
        this.mostrarPanelFiltros = !this.mostrarPanelFiltros;
    };
    SettingproductosComponent.prototype.onClickExportarListadoProductos = function ($event) {
        $event.preventDefault();
        if (this.subCategoriaSeleccionada)
            this._productosServices.printListadoProductos(this.subCategoriaSeleccionada.Id, this.tipoListado);
    };
    SettingproductosComponent.prototype.onChangeGrupoOrden = function (option, producto) {
        if (+option.target.value == 9999) {
            this.productoSeleccionado = producto;
            $('#modalGrupoOrden').modal('show');
        }
        else {
            this.listaGruposOrden.forEach(function (lista) {
                if (lista.Id == +option.target.value) {
                    producto.GrupoOrden = lista;
                }
            });
        }
    };
    SettingproductosComponent.prototype.onClickGuardarGrupoOrden = function (event) {
        var _this = this;
        event.preventDefault();
        this.procesando = true;
        if (this.grupoOrdenSeleccionado.Descripcion != '') {
            this._productosServices.saveGrupoOrden(this.grupoOrdenSeleccionado)
                .subscribe(function (response) {
                if (response) {
                    _this.productoSeleccionado.GrupoOrden = response;
                    _this.grupoOrdenSeleccionado = new producto_1.ProductoGrupoOrden();
                    _this._productosServices.getGruposOrden()
                        .subscribe(function (resp) {
                        if (resp)
                            _this.listaGruposOrden = resp;
                        _this.guardarProducto(_this.productoSeleccionado);
                        _this.procesando = false;
                        $('#modalGrupoOrden').modal('hide');
                    }, function (error) {
                        _this.procesando = false;
                        $('#modalGrupoOrden').modal('hide');
                        console.log("ERROR::");
                        console.log(error);
                    });
                }
            }, function (error) {
                _this.procesando = false;
                $('#modalGrupoOrden').modal('hide');
                console.log(error);
            });
        }
    };
    SettingproductosComponent.prototype.showNotification = function (type, message) {
        this._notifier.notify(type, message);
    };
    SettingproductosComponent.prototype.hideOldestNotification = function () {
        this._notifier.hideOldest();
    };
    SettingproductosComponent = __decorate([
        core_1.Component({
            selector: 'settingproductos',
            templateUrl: './settingproductos.component.html',
            styleUrls: ['./settingproductos.component.css']
        })
    ], SettingproductosComponent);
    return SettingproductosComponent;
}());
exports.SettingproductosComponent = SettingproductosComponent;
