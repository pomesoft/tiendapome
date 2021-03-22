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
exports.PedidoslistComponent = void 0;
var core_1 = require("@angular/core");
var pedido_1 = require("../../models/pedido");
var cliente_1 = require("../../models/cliente");
var PedidoslistComponent = /** @class */ (function () {
    function PedidoslistComponent(_pedidoService, _clienteService, _parametroServices, _pouchDBServices, _notifier, _router) {
        this._pedidoService = _pedidoService;
        this._clienteService = _clienteService;
        this._parametroServices = _parametroServices;
        this._pouchDBServices = _pouchDBServices;
        this._notifier = _notifier;
        this._router = _router;
        this.titulo = 'Bandeja de pedidos';
        this.mostrarReenviarPedidoProveedor = false;
        this.reenviandoAProveedor = false;
        this.finalizandoPedido = false;
        this.mostrarFinalizarPedido = false;
        this.mostrarLiberarStockPedido = false;
        this.liberandoStock = false;
        this.mensajeUsuario_OK = false;
        this.textoMensajeUsuario = '';
        this.textoBotonMensajeUsuario = 'Aceptar';
        this.mostrarPanelFiltros = true;
        this.cargando = false;
        this._idPedidoDB = 'PEDIDO_01'; //id pedido del pouchDB / indexedDB
        this.numeroPagina = 1;
        this.clienteSeleccionado = -1;
        this.fechaDesde = '';
        this.fechaHasta = '';
    }
    PedidoslistComponent.prototype.ngOnInit = function () {
        this.inicializarControles();
    };
    PedidoslistComponent.prototype.inicializarControles = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getEstados()
                            .then(function (result) {
                            if (result)
                                _this.Estados = result;
                            return _this.obtenerParamsVentaMayorista();
                        })
                            .then(function (result) {
                            var paramsVentaMayorista = localStorage.getItem('paramsVentaMayorista') != null ? localStorage.getItem('paramsVentaMayorista') : 'NO';
                            _this.mostrarReenviarPedidoProveedor = (paramsVentaMayorista == 'NO');
                            _this.mostrarFinalizarPedido = (paramsVentaMayorista == 'NO');
                            _this.mostrarLiberarStockPedido = (paramsVentaMayorista == 'SI');
                            return _this.getClientes();
                        })
                            .then(function (result) {
                            if (result)
                                _this.cargarClientes(result);
                            _this.getPedidos(_this.numeroPagina);
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
    PedidoslistComponent.prototype.getEstados = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._pedidoService.getEstados().subscribe(function (response) { resolve(response); }, function (error) { reject(error); });
        });
    };
    PedidoslistComponent.prototype.obtenerParamsVentaMayorista = function () {
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
                resolve();
            }, function (error) { reject(error); });
            // } else {
            //       resolve();
            // }
        });
    };
    PedidoslistComponent.prototype.getClientes = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._clienteService.getClientes().subscribe(function (response) { resolve(response); }, function (error) { reject(error); });
        });
    };
    PedidoslistComponent.prototype.getPedidos = function (pagina) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._pedidoService
                .getPedidosListPaginado(_this.selectedOptions(), _this.clienteSeleccionado, _this.fechaDesde, _this.fechaHasta, pagina, 20).subscribe(function (response) {
                if (response) {
                    _this.numeroPagina = pagina;
                    _this.totalFilas = response.TotalFilas;
                    _this.Pedidos = response.Pedidos;
                    resolve();
                }
            }, function (error) { reject(error); });
        });
    };
    PedidoslistComponent.prototype.pageChange = function (pagina) {
        this.getPedidos(pagina);
    };
    PedidoslistComponent.prototype.cargarClientes = function (result) {
        var _this = this;
        var clientesResult = result;
        this.Clientes = new Array();
        var cli = new cliente_1.Cliente();
        cli.Id = -1;
        cli.Email = 'Cliente';
        cli.Nombre = '';
        cli.Apellido = '';
        this.Clientes.push(cli);
        clientesResult.forEach(function (cli) {
            _this.Clientes.push(cli);
        });
    };
    PedidoslistComponent.prototype.selectedOptions = function () {
        var values = this.Estados.filter(function (opt) { return opt.Chequed; }).map(function (opt) { return opt.Id; });
        var valuesReturn = '';
        values.forEach(function (item) {
            valuesReturn += item.toString() + ',';
        });
        return valuesReturn;
    };
    PedidoslistComponent.prototype.aplicarFiltros = function ($event) {
        var _this = this;
        $event.preventDefault();
        this.cargando = true;
        this.getPedidos(this.numeroPagina)
            .then(function (result) {
            _this.cargando = false;
        })["catch"](function (err) {
            _this.cargando = false;
            _this.showNotification('error', 'Ocurrió un error al cargar la página.');
            console.log(err);
        });
    };
    PedidoslistComponent.prototype.editarItem = function ($event, item) {
        $event.preventDefault();
        this._router.navigate(['/pedido/' + item.Id + '/-1']);
    };
    PedidoslistComponent.prototype.procesarPedido = function ($event, item) {
        var _this = this;
        $event.preventDefault();
        //EN_PROCESO
        var estado = new pedido_1.Estado();
        estado.Id = 3;
        item.Estado = estado;
        this._pedidoService.savePedido(item).subscribe(function (response) {
            if (response) {
                console.log('response -> ', response);
                _this.registrarPedido_pouchDB(item);
                _this._router.navigate(['/pedido/' + item.Id + '/-1']);
            }
        }, function (error) { console.log(error); });
    };
    PedidoslistComponent.prototype.confirmarCancelacion = function ($event, item) {
        $event.preventDefault();
        this.pedidoProcesar = item;
        this.textoConfirmaCancelar = '¿Desea cancelar el pedido ' + this.pedidoProcesar.Numero + ' de ' + this.pedidoProcesar.Cliente.Email + '?';
        $('#modalConfirmaCancelar').modal('show');
    };
    PedidoslistComponent.prototype.cancelarPedido = function ($event) {
        var _this = this;
        $event.preventDefault();
        debugger;
        this._pedidoService.cancelarPedido(this.pedidoProcesar.Id).subscribe(function (response) {
            $('#modalConfirmaCancelar').modal('hide');
            _this.aplicarFiltros($event);
        }, function (error) { console.log(error); });
    };
    PedidoslistComponent.prototype.confirmarReenvioAlProveedor = function ($event, item) {
        $event.preventDefault();
        this.pedidoProcesar = item;
        this.textoReenvioProveedor = '¿Desea reenviar al proveedor el pedido ' + this.pedidoProcesar.Numero + ' de ' + this.pedidoProcesar.Cliente.Email + '?';
        $('#modalConfirmaProveedor').modal('show');
    };
    PedidoslistComponent.prototype.reenviarAlProveedor = function ($event) {
        var _this = this;
        $event.preventDefault();
        this.reenviandoAProveedor = true;
        //8 - PROVEEDOR
        var estado = new pedido_1.Estado();
        estado.Id = 8;
        this.pedidoProcesar.Estado = estado;
        this._pedidoService.savePedidoProveedor(this.pedidoProcesar).subscribe(function (response) {
            _this.mensajeUsuario_OK = true;
            _this.textoMensajeUsuario = 'El pedido ' + _this.pedidoProcesar.Numero + ' de ' + _this.pedidoProcesar.Cliente.Email + ' se reenvió al proveedor correctamente.';
            $('#modalMensajes').modal('show');
            $('#modalConfirmaProveedor').modal('hide');
            _this.reenviandoAProveedor = false;
            _this.aplicarFiltros($event);
        }, function (error) {
            _this.mensajeUsuario_OK = true;
            $('#modalConfirmaProveedor').modal('hide');
            _this.reenviandoAProveedor = false;
            _this.textoMensajeUsuario = 'Ocurrió un error al reenviar el pedido.';
            $('#modalMensajes').modal('show');
            console.log(error);
        });
    };
    PedidoslistComponent.prototype.confirmarFinalizarPedido = function ($event, item) {
        $event.preventDefault();
        this.pedidoProcesar = item;
        $('#modalConfirmaFinalizar').modal('show');
    };
    PedidoslistComponent.prototype.finalizarPedido = function ($event) {
        var _this = this;
        $event.preventDefault();
        this.finalizandoPedido = true;
        //4	FINALIZADO
        var estado = new pedido_1.Estado();
        estado.Id = 4;
        this.pedidoProcesar.Estado = estado;
        this._pedidoService.savePedido(this.pedidoProcesar).subscribe(function (response) {
            _this.mensajeUsuario_OK = true;
            _this.textoMensajeUsuario = 'El pedido ' + _this.pedidoProcesar.Numero + ' de ' + _this.pedidoProcesar.Cliente.Email + ' se finalizó correctamente.';
            $('#modalMensajes').modal('show');
            $('#modalConfirmaFinalizar').modal('hide');
            _this.finalizandoPedido = false;
            _this.aplicarFiltros($event);
        }, function (error) {
            _this.mensajeUsuario_OK = true;
            $('#modalConfirmaFinalizar').modal('hide');
            _this.finalizandoPedido = false;
            _this.textoMensajeUsuario = 'Ocurrió un error al finalizar el pedido.';
            $('#modalMensajes').modal('show');
            console.log(error);
        });
    };
    PedidoslistComponent.prototype.confirmarLiberarStock = function ($event, item) {
        $event.preventDefault();
        this.pedidoProcesar = item;
        this.textoLiberarStock = '¿Desea liberar el Stock del pedido ' + this.pedidoProcesar.Numero + ' de ' + this.pedidoProcesar.Cliente.Email + '?';
        $('#modalConfirmaLiberarStock').modal('show');
    };
    PedidoslistComponent.prototype.liberarStock = function ($event) {
        var _this = this;
        $event.preventDefault();
        this.liberandoStock = true;
        this._pedidoService.liberarStockPedido(this.pedidoProcesar.Id).subscribe(function (response) {
            _this.mensajeUsuario_OK = true;
            _this.textoMensajeUsuario = 'El pedido ' + _this.pedidoProcesar.Numero + ' de ' + _this.pedidoProcesar.Cliente.Email + ' liberó el stock correctamente.';
            $('#modalMensajes').modal('show');
            $('#modalConfirmaLiberarStock').modal('hide');
            _this.liberandoStock = false;
            _this.aplicarFiltros($event);
        }, function (error) {
            _this.mensajeUsuario_OK = true;
            $('#modalConfirmaLiberarStock').modal('hide');
            _this.liberandoStock = false;
            _this.textoMensajeUsuario = 'Ocurrió un error al finalizar el pedido.';
            $('#modalMensajes').modal('show');
            console.log(error);
        });
    };
    PedidoslistComponent.prototype.exportarListadoEtiquetas = function (event, item) {
        event.preventDefault();
        this._pedidoService.exportListadoEtiquetas(item.Id);
    };
    PedidoslistComponent.prototype.cobrarComisionApp = function (item) {
        return item.Cliente.ComisionApp != null && item.Cliente.ComisionApp > 0 && item.IdPedidoMinorista > 0;
    };
    PedidoslistComponent.prototype.registrarPedido_pouchDB = function (pedido) {
        var _this = this;
        this._pouchDBServices.get(this._idPedidoDB)
            .then(function (doc) {
            if (doc) {
                console.log('_pouchDBServices.update -> ', pedido);
                pedido._id = _this._idPedidoDB;
                _this._pouchDBServices.update(pedido);
            }
            else {
                console.log('_pouchDBServices.put -> ', pedido);
                _this._pouchDBServices.put(_this._idPedidoDB, pedido);
            }
        });
    };
    PedidoslistComponent.prototype.mostrarOcultarFiltros = function ($event) {
        $event.preventDefault();
        this.mostrarPanelFiltros = !this.mostrarPanelFiltros;
    };
    PedidoslistComponent.prototype.enviarWhatsApp = function ($event, cliente) {
        $event.preventDefault();
        if (cliente && cliente.Celular) {
            var urlDesktop = 'https://web.whatsapp.com/';
            var urlMobile = 'https://api.whatsapp.com/';
            var mensaje = 'send?phone=549' + cliente.Celular + '&text=%20';
            //let mensaje = 'send?phone=5493624098916&text=%20';
            if (this.isMobile()) {
                window.open(urlMobile + mensaje, '_blank');
            }
            else {
                window.open(urlDesktop + mensaje, '_blank');
            }
        }
    };
    PedidoslistComponent.prototype.isMobile = function () {
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
    PedidoslistComponent.prototype.showNotification = function (type, message) {
        this._notifier.notify(type, message);
    };
    PedidoslistComponent.prototype.hideOldestNotification = function () {
        this._notifier.hideOldest();
    };
    PedidoslistComponent = __decorate([
        core_1.Component({
            selector: 'app-pedidoslist',
            templateUrl: './pedidoslist.component.html',
            styleUrls: ['./pedidoslist.component.css']
        })
    ], PedidoslistComponent);
    return PedidoslistComponent;
}());
exports.PedidoslistComponent = PedidoslistComponent;
