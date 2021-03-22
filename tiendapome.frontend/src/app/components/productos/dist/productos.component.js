"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.ProductosComponent = void 0;
var core_1 = require("@angular/core");
var pedido_1 = require("../../models/pedido");
var pouch_db_services_1 = require("../../services/pouch-db.services");
var producto_services_1 = require("../../services/producto.services");
var pedido_service_1 = require("../../services/pedido.service");
var ProductosComponent = /** @class */ (function () {
    function ProductosComponent(_productosServices, _pedidoServices, _pouchDBServices, _zone, _route, _router, _menuServices, _autenticaServices, _parametroServices) {
        this._productosServices = _productosServices;
        this._pedidoServices = _pedidoServices;
        this._pouchDBServices = _pouchDBServices;
        this._zone = _zone;
        this._route = _route;
        this._router = _router;
        this._menuServices = _menuServices;
        this._autenticaServices = _autenticaServices;
        this._parametroServices = _parametroServices;
        this.descripcionProductoModalCantidades = '';
        this.clienteConListaAsignada = false;
        this.ventaMayorista = false;
        this.verificarStock = false;
        this.mostrasrPreciosSoloRegistrados = false;
        this.textoBuscar = '';
        this.cargandoProductos = true;
        this.agregandoAlCarrito = false;
        this.mensajeError = '';
        this.tipoAlerta = '';
        this.productIdAlerta = -1;
        this.productIdAlertaModalMedida = -1;
        this.subcategoriaEnPromo = 101;
        this.porcentajeEnPromo = 12;
        this.toLoad = false;
        this._idPedidoDB = 'PEDIDO_01'; //id pedido del pouchDB / indexedDB
        this.nroWhatsApp = '';
        this.filasPorPagina = 9;
        this.paginaActual = 1;
        this.productos = new Array();
        this.idClientePedido = -1;
    }
    ProductosComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (window.location.hash.endsWith('jqmlndng1973')) {
            //console.log('window.location.hash', window.location.hash);
            localStorage.setItem('subcatergoriaCarrito', '');
            localStorage.setItem('reqLanding_HashHref', window.location.hash);
        }
        else {
            localStorage.removeItem('reqLanding_HashHref');
        }
        this._route.params.subscribe(function (params) {
            _this.conStock = params.conStock;
            _this.idSubcategoria = +params.subcategoria;
            _this.textoBuscar = params.textobuscar;
            _this.inicializarControles();
        });
    };
    ProductosComponent.prototype.inicializarControles = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._parametroServices.obtenerTodosParametros()
                            .then(function (result) {
                            return _this.obtenerParamsVentaMayorista();
                        })
                            .then(function (result) {
                            return _this.obtenerParamsVerificarStock();
                        })
                            .then(function (result) {
                            return _this.obtenerParamsNroVentasWhatApp();
                        })
                            .then(function (result) {
                            return _this.obtenerPedido();
                        })
                            .then(function (result) {
                            if (result) {
                                _this.pedido = result;
                                return _this.registrarPedido_pouchDB();
                            }
                        })
                            .then(function (result) {
                            return _this.obtenerParamsMostrarPreciosSoloRegistrados();
                        })
                            .then(function (result) {
                            return _this.obtenerProductos(_this.paginaActual);
                        })["catch"](function (err) {
                            _this.showAlert('danger', 0, 'Ocurrió un error al cargar la página.');
                            console.log(err);
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProductosComponent.prototype.obtenerParamsVentaMayorista = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            //if (localStorage.getItem('paramsVentaMayorista') == null) {
            _this._parametroServices.getParametroValor('VENTA_MAYORISTA').subscribe(function (response) {
                if (response) {
                    localStorage.setItem('paramsVentaMayorista', response.Valor);
                }
                else {
                    localStorage.removeItem('paramsVentaMayorista');
                }
                resolve(true);
            }, function (error) { reject(error); });
            // } else {
            //       resolve(true);
            // }
        });
    };
    ProductosComponent.prototype.obtenerParamsMostrarPreciosSoloRegistrados = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            localStorage.removeItem('paramsMostrarPreciosSoloRegistrados');
            _this.mostrasrPreciosSoloRegistrados = false;
            _this._parametroServices.getParametroValor('MOSTRAR_PRECIOS_SOLO_REGISTRADOS').subscribe(function (response) {
                if (response) {
                    localStorage.setItem("paramsMostrarPreciosSoloRegistrados", response.Valor != null ? response.Valor : 'NO');
                    _this.mostrasrPreciosSoloRegistrados = localStorage.getItem("paramsMostrarPreciosSoloRegistrados") == 'SI';
                }
                else {
                }
                resolve(true);
            }, function (error) { reject(error); });
        });
    };
    ProductosComponent.prototype.obtenerParamsVerificarStock = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.verificarStock = false;
            localStorage.removeItem("verificarStock");
            _this._parametroServices.getParametroValor('VERIFICAR_STCOK').subscribe(function (response) {
                if (response) {
                    localStorage.setItem("verificarStock", response.Valor != null ? response.Valor : 'NO');
                    _this.verificarStock = localStorage.getItem("verificarStock") == 'SI';
                }
                resolve(true);
            }, function (error) {
                console.log(error);
                resolve(true);
            });
        });
    };
    ProductosComponent.prototype.obtenerParamsNroVentasWhatApp = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._parametroServices.getParametroValor('NRO_VENTAS_WHATSAPP')
                .subscribe(function (response) {
                if (response) {
                    _this.nroWhatsApp = response.Valor;
                }
                resolve(true);
            }, function (error) { reject(error); });
        });
    };
    ProductosComponent.prototype.obtenerPedido = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var clienteLogin = _this._autenticaServices.getClienteLoguin();
            if (clienteLogin) {
                _this.idClientePedido = clienteLogin.Id;
                var paramsVentaMayorista = localStorage.getItem('paramsVentaMayorista') != null ? localStorage.getItem('paramsVentaMayorista') : 'NO';
                _this.ventaMayorista = (clienteLogin.ListasPrecioAsignada && paramsVentaMayorista == 'SI');
                _this.clienteConListaAsignada = clienteLogin.ListasPrecioAsignada;
                _this._pedidoServices.getPedidoClienteIngresado(_this.idClientePedido, -1, -1).subscribe(function (response) { resolve(response); }, function (error) { reject(error); });
            }
            else {
                resolve(false);
            }
        });
    };
    ProductosComponent.prototype.registrarPedido_pouchDB = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._pouchDBServices.get(_this._idPedidoDB)
                .then(function (doc) {
                if (doc) {
                    _this.pedido._id = _this._idPedidoDB;
                    _this._pouchDBServices.update(_this.pedido);
                }
                resolve(true);
            })["catch"](function (err) {
                if (err.status == 404) {
                    _this._pouchDBServices.put(_this._idPedidoDB, _this.pedido);
                }
                else {
                    console.log(err);
                }
                resolve(true);
            });
        });
    };
    ProductosComponent.prototype.obtenerSubcategoria = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._menuServices.getItemSubcategoria(_this.idSubcategoria).subscribe(function (response) {
                _this.subcategoria = response;
                resolve(response);
            }, function (error) { reject(error); });
        });
    };
    ProductosComponent.prototype.obtenerProductos = function (pagina) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var idCliente = -1;
            if (_this.pedido)
                idCliente = _this.pedido.Cliente.Id;
            _this._productosServices.getProductos(_this.conStock, _this.idSubcategoria, _this.textoBuscar, idCliente, pagina, _this.filasPorPagina).subscribe(function (response) {
                _this.cargandoProductos = false;
                _this.paginaFinal = (response.TotalFilas / _this.filasPorPagina);
                _this.paginaActual = pagina;
                response.Productos.forEach(function (item) {
                    if (idCliente > 0) {
                        var itemPedido = _this.pedido.Items.find(function (ip) { return ip.Producto.Id === item.Id; });
                        if (itemPedido) {
                            item.ProductoPedido = true;
                            item.CantidadPedido = itemPedido.Cantidad;
                        }
                        else {
                            item.ProductoPedido = false;
                            item.CantidadPedido = 0;
                        }
                    }
                    _this.productos.push(item);
                });
                console.log('productos cargados', _this.productos);
                resolve(true);
            }, function (error) {
                _this.cargandoProductos = false;
                reject(error);
            });
        });
    };
    ProductosComponent.prototype.onScroll = function () {
        if ((this.paginaActual < this.paginaFinal) && !this.cargandoProductos) {
            this.cargandoProductos = true;
            this.paginaActual++;
            this.obtenerProductos(this.paginaActual);
            // console.log('this.paginaActual', this.paginaActual);
            // console.log('this.paginaFinal', this.paginaFinal);
        }
    };
    ProductosComponent.prototype.tieneFoto = function (prod) {
        return prod.Foto != null && prod.Foto.length > 0;
    };
    ProductosComponent.prototype.addCarrito = function ($event, prodSeleccionado) {
        var _this = this;
        $event.preventDefault();
        this.agregandoAlCarrito = true;
        var item = new pedido_1.PedidoItem();
        item.Id = -1;
        item.IdPedido = this.pedido.Id;
        item.Producto = prodSeleccionado;
        item.Cantidad = prodSeleccionado.CantidadPedido;
        item.Observaciones = prodSeleccionado.ObservacionesPedido;
        item.MostrarMedidas = prodSeleccionado.MostrarMedidas;
        //TODO: si viene por aca es que tien talle unico, el backend se encarga de buscar y grabar el TALLE UNICO en la tabla PedidoItemProductos
        var todoBien = true;
        var _cantidadValidar = prodSeleccionado.CantidadPedido;
        if (prodSeleccionado.ProductoStock) {
            prodSeleccionado.ProductoStock.forEach(function (pStock) {
                _cantidadValidar += pStock.CantidadPedido;
                var itemProd = new pedido_1.PedidoItemProducto();
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
            this._pedidoServices.savePedidoItem(item).subscribe(function (response) {
                _this.agregandoAlCarrito = false;
                _this.pedido = response;
                prodSeleccionado.ProductoPedido = true;
                if (_this.productoIngresaCantidades) {
                    $('#modalMedidas').modal('hide');
                    _this.productoIngresaCantidades = null;
                }
                _this.showAlert('success', prodSeleccionado.Id, 'El producto se agregó correctamente.');
                _this.registrarPedido_pouchDB();
            }, function (error) {
                _this.agregandoAlCarrito = false;
                if (_this.productoIngresaCantidades) {
                    $('#modalMedidas').modal('hide');
                    _this.productoIngresaCantidades = null;
                }
                _this.showAlert('danger', prodSeleccionado.Id, 'Ocurrió un error.');
                console.log("ERROR::");
                console.log(error);
            });
        }
    };
    ProductosComponent.prototype.ingresarCantidadesPorMedida = function (event, prod) {
        event.preventDefault();
        this.productoIngresaCantidades = prod;
        this.descripcionProductoModalCantidades = 'Codigo: ' + prod.Codigo + ' - ' + prod.Descripcion;
        $('#modalMedidas').modal('show');
    };
    ProductosComponent.prototype.sumaCantidad = function (event, prod) {
        event.preventDefault();
        if (this.verificarStock) {
            if (prod.CantidadPedido < prod.Stock) {
                prod.CantidadPedido++;
            }
            else {
                this.showAlert('warning', prod.Id, 'Stock disponible: ' + prod.Stock.toString());
            }
        }
        else {
            prod.CantidadPedido++;
        }
    };
    ProductosComponent.prototype.restaCantidad = function (event, prod) {
        event.preventDefault();
        if (prod.CantidadPedido > 0)
            prod.CantidadPedido--;
    };
    ProductosComponent.prototype.verificarCantidad = function (prod) {
        if (this.verificarStock) {
            if (prod.CantidadPedido > prod.Stock) {
                this.showAlert('warning', prod.Id, 'Stock disponible: ' + prod.Stock.toString());
            }
        }
        else {
            prod.CantidadPedido = prod.Stock;
        }
    };
    ProductosComponent.prototype.sumaCantidadPorMedida = function (event, prodStock) {
        event.preventDefault();
        if (this.verificarStock) {
            if (prodStock.CantidadPedido < prodStock.StockDisponible) {
                prodStock.CantidadPedido++;
            }
            else {
                this.showAlertModalMedidas('danger', prodStock.Id, 'Stock disponible: ' + prodStock.StockDisponible.toString());
            }
        }
        else {
            prodStock.CantidadPedido++;
        }
    };
    ProductosComponent.prototype.restaCantidadMedida = function (event, prodStock) {
        event.preventDefault();
        if (prodStock.CantidadPedido > 0)
            prodStock.CantidadPedido--;
    };
    ProductosComponent.prototype.verificarCantidadPorMedida = function (prodStock) {
        if (this.verificarStock && prodStock.CantidadPedido > prodStock.StockDisponible) {
            prodStock.CantidadPedido = prodStock.Stock;
            this.showAlertModalMedidas('warning', prodStock.Id, 'Stock disponible: ' + prodStock.Stock.toString());
        }
    };
    ProductosComponent.prototype.irAlCarrito = function ($event) {
        $event.preventDefault();
        this._router.navigate(['/pedido/-1/' + this.idClientePedido]);
    };
    ProductosComponent.prototype.showAlert = function (tipoAlerta, idProdudto, mensaje) {
        this.tipoAlerta = tipoAlerta;
        this.mensajeError = mensaje;
        this.productIdAlerta = idProdudto;
        $("#alertError_" + idProdudto.toString())
            .fadeTo(2000, 500)
            .slideUp(500, function () {
            $("#alertError_" + idProdudto.toString()).slideUp(500);
            this.mensajeError = '';
            this.productIdAlerta = -1;
        });
    };
    ProductosComponent.prototype.showAlertModalMedidas = function (tipoAlerta, idProductoStock, mensaje) {
        this.tipoAlerta = tipoAlerta;
        this.mensajeError = mensaje;
        this.productIdAlertaModalMedida = idProductoStock;
        $("#alertErrorMedidas_" + idProductoStock.toString())
            .fadeTo(2000, 500)
            .slideUp(500, function () {
            $("#alertErrorMedidas_" + idProductoStock.toString()).slideUp(500);
            this.mensajeError = '';
            this.productIdAlertaModalMedida = -1;
        });
    };
    ProductosComponent.prototype.mostrarPrecios = function () {
        if (this.mostrasrPreciosSoloRegistrados) {
            return (this.pedido && this.pedido.Cliente);
        }
        else {
            return true;
        }
    };
    ProductosComponent.prototype.getCategoriaCarrito = function () {
        var catego = '';
        var categoriaCarrito = localStorage.getItem("catergoriaCarrito");
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
    };
    ProductosComponent.prototype.enviarWhatsApp = function ($event, producto) {
        $event.preventDefault();
        console.log(producto);
        var urlDesktop = 'https://web.whatsapp.com/';
        var urlMobile = 'https://api.whatsapp.com/';
        var mensaje = 'send?phone=' + this.nroWhatsApp + '&text=%20Hola!%20Me%20interesa%20' + this.getCategoriaCarrito() + '!%20(*' + producto.Codigo + ')';
        if (this.isMobile()) {
            window.open(urlMobile + mensaje, '_blank');
        }
        else {
            window.open(urlDesktop + mensaje, '_blank');
        }
    };
    ProductosComponent.prototype.isMobile = function () {
        if (sessionStorage.desktop)
            return false;
        else if (localStorage.mobile)
            return true;
        var mobile = ['iphone', 'ipad', 'android', 'blackberry', 'nokia', 'opera mini', 'windows mobile', 'windows phone', 'iemobile'];
        for (var i in mobile)
            if (navigator.userAgent.toLowerCase().indexOf(mobile[i].toLowerCase()) > 0)
                return true;
        return false;
    };
    ProductosComponent = __decorate([
        core_1.Component({
            selector: 'productos',
            templateUrl: './productos.component.html',
            styleUrls: ['./productos.component.css'],
            providers: [pouch_db_services_1.PouchDBServices, producto_services_1.ProductoServices, pedido_service_1.PedidoService]
        })
    ], ProductosComponent);
    return ProductosComponent;
}());
exports.ProductosComponent = ProductosComponent;
