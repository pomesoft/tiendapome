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
exports.DocumentoventaComponent = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var documentoVenta_1 = require("../../models/documentoVenta");
var DocumentoventaComponent = /** @class */ (function () {
    function DocumentoventaComponent(_router, _route, _autenticaServices, _documentoVentaService, _clienteService, _pedidoService, _productosServices, _notifier) {
        var _this = this;
        this._router = _router;
        this._route = _route;
        this._autenticaServices = _autenticaServices;
        this._documentoVentaService = _documentoVentaService;
        this._clienteService = _clienteService;
        this._pedidoService = _pedidoService;
        this._productosServices = _productosServices;
        this._notifier = _notifier;
        this.IdTipoComprobante = -1;
        this.IdDocumentoVenta = -1;
        this.titulo = 'Nota de Pedido';
        this.procesando = false;
        this.searching = false;
        this.searchFailed = false;
        this.MensajeUsuario = '';
        this.TextoBotonMensajeUsuario = '';
        this.MensajeUsuario_OK = true;
        this.NumeroDocumento = '';
        this.NumeroPedidoFacturado = '';
        this.HabilitarSeleccionPedidos = true;
        this.HabilitarSeleccionProductos = true;
        this.textoConfirmaEliminarItem = '';
        this.codigoProducto = '';
        this.buscarCliente = function (text$) {
            return text$.pipe(operators_1.debounceTime(300), operators_1.distinctUntilChanged(), operators_1.tap(function () { return _this.searching = true; }), operators_1.switchMap(function (term) {
                return _this._clienteService.searchClientes(term).pipe(operators_1.tap(function () { return _this.searchFailed = false; }), operators_1.catchError(function () {
                    _this.searchFailed = true;
                    return rxjs_1.of([]);
                }));
            }), operators_1.tap(function () { return _this.searching = false; }));
        };
        this.formatterCliente = function (item) { return item.ClienteList; };
    }
    DocumentoventaComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._route.params.subscribe(function (params) {
            if (params.tipoComprobante)
                _this.IdTipoComprobante = +params.tipoComprobante;
            if (params.idDocumentoVenta)
                _this.IdDocumentoVenta = +params.idDocumentoVenta;
        });
        this.usuarioLogin = this._autenticaServices.getClienteLoguin();
        this.docVentaItem = new documentoVenta_1.DocumentoVentaItem();
        this.pedidosFinalizados = new Array();
        this.inicializarControles();
    };
    DocumentoventaComponent.prototype.inicializarControles = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getTipoComprobante()
                            .then(function (result) {
                            _this.tipoComprobante = result;
                            return _this.getDocumentoVenta();
                        })
                            .then(function (result) {
                            _this.cargarDatos(result);
                        })["catch"](function (err) {
                            _this.showNotification('error', 'Ocurrió un error al cargar la página.');
                            console.log(err);
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DocumentoventaComponent.prototype.getTipoComprobante = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._documentoVentaService.getTipoComprobante(_this.IdTipoComprobante)
                .subscribe(function (response) { resolve(response); }, function (error) { reject(error); });
        });
    };
    DocumentoventaComponent.prototype.getDocumentoVenta = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.IdDocumentoVenta == -1) {
                resolve(new documentoVenta_1.DocumentoVenta());
            }
            else {
                _this._documentoVentaService.getDocumentoVenta(_this.IdDocumentoVenta).subscribe(function (response) { resolve(response); }, function (error) { reject(error); });
            }
        });
    };
    DocumentoventaComponent.prototype.onClickVolver = function (event) {
        event.preventDefault();
        this._router.navigate(['/ventaslist/true']);
    };
    DocumentoventaComponent.prototype.onClickAgregarItem = function (event) {
        event.preventDefault();
        this.docVentaItem = new documentoVenta_1.DocumentoVentaItem();
        $('#modalItemManual').modal('show');
    };
    DocumentoventaComponent.prototype.onClickEditarItem = function (event, item) {
        event.preventDefault();
        this.docVentaItem = item;
        $('#modalItemManual').modal('show');
    };
    DocumentoventaComponent.prototype.onClickEliminarItem = function (event, item) {
        event.preventDefault();
        this.docVentaItem = item;
        this.textoConfirmaEliminarItem = '¿Desea eliminar el ítem: ' + this.docVentaItem.Descripcion + '?';
        $('#modalConfirmaEliminarItem').modal('show');
    };
    DocumentoventaComponent.prototype.EliminarItemPedido = function (event) {
        var _this = this;
        if (this.docVentaItem != null && this.docVentaItem.Descripcion.trim().length > 0 && this.docVentaItem.Precio > 0) {
            this._documentoVentaService.deleteItemNotaPedido(this.docVentaItem).subscribe(function (response) {
                if (response) {
                    _this.cargarDatos(response);
                    _this.showNotification('success', 'El ítem se eliminó correctamente.');
                    $('#modalConfirmaEliminarItem').modal('hide');
                }
            }, function (error) {
                _this.procesando = false;
                _this.showNotification('error', 'Ocurrió un error al actualizar la Nota de Pedido.');
                console.log(error);
            });
        }
    };
    DocumentoventaComponent.prototype.cargarDatos = function (_docVenta) {
        this.docVenta = _docVenta;
        if (this.docVenta.Id == -1 && sessionStorage.getItem("lv_ClienteSeleccionado")) {
            this.docVenta.Cliente = JSON.parse(sessionStorage.getItem("lv_ClienteSeleccionado"));
        }
        //Si se esta creando el documento se asigna el tipo que se recibe como parametro
        if (this.docVenta.TipoComprobante.Id == -1) {
            this.docVenta.TipoComprobante = this.tipoComprobante;
        }
        console.log('cargarDatos() => this.docVenta', this.docVenta);
        this.titulo = this.docVenta.TipoComprobante.Descripcion;
        this.clienteSeleccionado = this.docVenta.Cliente;
        this.NumeroDocumento = this.formatNumero(this.docVenta.Numero);
        if (this.docVenta.NumeroPedido)
            this.NumeroPedidoFacturado = this.formatNumero(this.docVenta.NumeroPedido);
        else
            this.NumeroPedidoFacturado = '';
        //la seleccion de pedidos se habilita solo para NOTA DE PEDIDO y si no se selecciono ningun pedido aun   
        this.HabilitarSeleccionPedidos = this.docVenta.TipoComprobante.Id == 1 && this.NumeroPedidoFacturado == '';
        //la seleccion de productos se habilita solo para NOTA DE PEDIDO y NOTA DE CREDITO
        this.HabilitarSeleccionProductos = this.docVenta.TipoComprobante.Id < 3;
    };
    DocumentoventaComponent.prototype.onClickGuardarItem = function (event) {
        var _this = this;
        event.preventDefault();
        if (this.docVentaItem.Descripcion.trim().length > 0 && this.docVentaItem.Precio > 0) {
            if (!this.docVenta.Items)
                this.docVenta.Items = new Array();
            this.docVentaItem.IdVenta = this.docVenta.Id;
            if (this.docVentaItem.NroItem <= 0)
                this.docVentaItem.NroItem = this.docVenta.Items.length + 1;
            if (this.docVentaItem.Id == -1)
                this.docVenta.Items.push(this.docVentaItem);
            this._documentoVentaService.saveDocVenta(this.docVenta).subscribe(function (response) {
                _this.procesando = false;
                if (response) {
                    _this.cargarDatos(response);
                    _this.showNotification('success', 'La Nota de Pedido se actualizó correctamente.');
                    $('#modalItemManual').modal('hide');
                }
            }, function (error) {
                _this.procesando = false;
                _this.showNotification('error', 'Ocurrió un error al actualizar la Nota de Pedido.');
                console.log(error);
            });
        }
    };
    DocumentoventaComponent.prototype.onClickGuardarItemProducto = function (event) {
        var _this = this;
        event.preventDefault();
        this.procesando = true;
        if (this.productoSeleccionado) {
            this.productoSeleccionado.IdDocumentoVenta = this.docVenta.Id;
            this._documentoVentaService.saveNotaPedidoFacturarProducto(this.productoSeleccionado).subscribe(function (response) {
                _this.procesando = false;
                if (response) {
                    _this.cargarDatos(response);
                    _this.showNotification('success', 'La Nota de Pedido se actualizó correctamente.');
                    $('#modalItemProducto').modal('hide');
                }
            }, function (error) {
                _this.procesando = false;
                _this.showNotification('error', 'Ocurrió un error al actualizar la Nota de Pedido.');
                console.log(error);
            });
        }
    };
    DocumentoventaComponent.prototype.calcularTotales = function () {
        var _this = this;
        this.docVenta.Gravado = 0;
        this.docVenta.Total = 0;
        if (!this.docVenta.Descuento)
            this.docVenta.Descuento = 0;
        this.docVenta.Items.forEach(function (item) {
            _this.docVenta.Gravado = _this.docVenta.Gravado + item.Precio;
        });
        this.docVenta.Total = this.docVenta.Gravado - this.docVenta.Descuento;
    };
    DocumentoventaComponent.prototype.onModelChangeCalcularTotalItem = function () {
        if (this.docVentaItem.Cantidad > 0 && this.docVentaItem.PrecioUnitario > 0) {
            this.docVentaItem.Precio = this.docVentaItem.Cantidad * this.docVentaItem.PrecioUnitario;
        }
    };
    DocumentoventaComponent.prototype.onClickGuardar = function (event) {
        event.preventDefault();
        if (this.clienteSeleccionado.Id <= 0) {
            this.showNotification('warning', 'Debe indicar cliente.');
            return;
        }
        this.procesando = true;
        //this.docVenta.IdTipoComprobanteGenerar = 1; // 1 - Nota de Pedido
        this.docVenta.Usuario = this.usuarioLogin;
        this.docVenta.Cliente = this.clienteSeleccionado;
        this.guardarDocVenta();
    };
    DocumentoventaComponent.prototype.guardarDocVenta = function () {
        var _this = this;
        this._documentoVentaService.saveDocVenta(this.docVenta).subscribe(function (response) {
            _this.procesando = false;
            if (response) {
                _this.MensajeUsuario_OK = true;
                _this.showNotification('success', 'La Nota de Pedido se actualizó correctamente.');
                if (_this.IdDocumentoVenta <= 0) {
                    _this._router.navigate(['/documentoventa/' + _this.IdTipoComprobante + '/' + response.Id]);
                }
                else {
                    _this.cargarDatos(response);
                }
            }
        }, function (error) {
            _this.procesando = false;
            _this.showNotification('error', 'Ocurrió un error al actualizar la Nota de Pedido.');
            console.log(error);
        });
    };
    DocumentoventaComponent.prototype.onClickImprimir = function (event) {
        event.preventDefault();
        this._documentoVentaService.printNotaPedido(this.docVenta.Id);
    };
    DocumentoventaComponent.prototype.onClickAgregarItemsPedido = function (event) {
        var _this = this;
        event.preventDefault();
        if (this.clienteSeleccionado) {
            this._pedidoService
                .getPedidosListPaginado('4', this.clienteSeleccionado.Id, '', '', 1, 20)
                .subscribe(function (response) {
                if (response) {
                    _this.pedidosFinalizados = response.Pedidos;
                    $('#modalItemPedido').modal('show');
                }
            }, function (error) {
                _this.showNotification('error', 'Ocurrió un error al consultar pedidos finalizados del cliente.');
                console.log(error);
            });
        }
    };
    DocumentoventaComponent.prototype.onClickAgregarItemsProducto = function (event) {
        event.preventDefault();
        this.codigoProducto = '';
        this.docVentaItem = new documentoVenta_1.DocumentoVentaItem();
        this.productoSeleccionado = null;
        $('#modalItemProducto').modal('show');
    };
    DocumentoventaComponent.prototype.busquedaProducto = function (event) {
        var _this = this;
        this.procesando = true;
        this.productoSeleccionado = null;
        if (this.codigoProducto != '' && this.clienteSeleccionado) {
            this._productosServices.getProductoCodigo(true, this.codigoProducto, this.clienteSeleccionado.Id)
                .subscribe(function (response) {
                if (response)
                    _this.productoSeleccionado = response;
                _this.procesando = false;
            }, function (error) {
                _this.procesando = false;
                if (error.status == 404)
                    _this.showNotification('warning', 'No existe el producto buscado.');
                else
                    _this.showNotification('error', 'No se pudo realizar la búsqueda.');
                console.error(error);
            });
        }
    };
    DocumentoventaComponent.prototype.sumaCantidadPorMedida = function (event, prodStock) {
        event.preventDefault();
        prodStock.CantidadPedido++;
    };
    DocumentoventaComponent.prototype.restaCantidadMedida = function (event, prodStock) {
        event.preventDefault();
        if (prodStock.CantidadPedido > 0)
            prodStock.CantidadPedido--;
    };
    DocumentoventaComponent.prototype.onClickGuardarItemsPedido = function (event, pedido) {
        var _this = this;
        event.preventDefault();
        this.procesando = true;
        this.docVenta.IdPedido = pedido.Id;
        this._documentoVentaService.saveNotaPedidoFacturarPedido(this.docVenta).subscribe(function (response) {
            _this.procesando = false;
            if (response) {
                _this.cargarDatos(response);
                _this.MensajeUsuario_OK = true;
                _this.showNotification('success', 'La Nota de Pedido se actualizó correctamente.');
            }
        }, function (error) {
            _this.procesando = false;
            _this.showNotification('error', 'Ocurrió un error al actualizar la Nota de Pedido.');
            console.log(error);
        });
        $('#modalItemPedido').modal('hide');
    };
    DocumentoventaComponent.prototype.formatNumero = function (text) {
        var padChar = '0';
        var size = 5;
        return (String(padChar).repeat(size) + text.toString()).substr((size * -1), size);
    };
    DocumentoventaComponent.prototype.showNotification = function (type, message) {
        this._notifier.notify(type, message);
    };
    DocumentoventaComponent.prototype.hideOldestNotification = function () {
        this._notifier.hideOldest();
    };
    DocumentoventaComponent = __decorate([
        core_1.Component({
            selector: 'app-documentoventa',
            templateUrl: './documentoventa.component.html',
            styleUrls: ['./documentoventa.component.css']
        })
    ], DocumentoventaComponent);
    return DocumentoventaComponent;
}());
exports.DocumentoventaComponent = DocumentoventaComponent;
