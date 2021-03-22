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
exports.ReciboComponent = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var documentoVenta_1 = require("../../models/documentoVenta");
var ReciboComponent = /** @class */ (function () {
    function ReciboComponent(_router, _route, _autenticaServices, _documentoVentaService, _clienteService, _pedidoService, _notifier) {
        var _this = this;
        this._router = _router;
        this._route = _route;
        this._autenticaServices = _autenticaServices;
        this._documentoVentaService = _documentoVentaService;
        this._clienteService = _clienteService;
        this._pedidoService = _pedidoService;
        this._notifier = _notifier;
        this.titulo = 'Recibo';
        this.procesando = false;
        this.searching = false;
        this.searchFailed = false;
        this.IdDocumenotVenta = -1;
        this.MensajeUsuario = '';
        this.TextoBotonMensajeUsuario = '';
        this.MensajeUsuario_OK = true;
        this.NumeroDocumento = '';
        this.saldoCliente = 0;
        this.saldoPendiente = 0;
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
    ReciboComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._route.params.subscribe(function (params) {
            if (params.idDocumenotVenta)
                _this.IdDocumenotVenta = +params.idDocumenotVenta;
        });
        this.usuarioLogin = this._autenticaServices.getClienteLoguin();
        this.comprobantesPendientes = new Array();
        this.docVenta = new documentoVenta_1.DocumentoVenta();
        this.inicializarControles();
    };
    ReciboComponent.prototype.inicializarControles = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getDocumentoVenta()
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
    ReciboComponent.prototype.getDocumentoVenta = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.IdDocumenotVenta == -1) {
                resolve(new documentoVenta_1.DocumentoVenta());
            }
            else {
                _this._documentoVentaService.getDocumentoVenta(_this.IdDocumenotVenta).subscribe(function (response) { resolve(response); }, function (error) { reject(error); });
            }
        });
    };
    ReciboComponent.prototype.onClickVolver = function (event) {
        event.preventDefault();
        this._router.navigate(['/ventaslist/true']);
    };
    ReciboComponent.prototype.cargarDatos = function (_docVenta) {
        this.docVenta = _docVenta;
        if (this.docVenta.Id == -1 && sessionStorage.getItem("lv_ClienteSeleccionado")) {
            this.docVenta.Cliente = JSON.parse(sessionStorage.getItem("lv_ClienteSeleccionado"));
        }
        console.log('cargarDatos() => this.docVenta', this.docVenta);
        this.clienteSeleccionado = this.docVenta.Cliente;
        this.NumeroDocumento = this.formatNumero(this.docVenta.Numero);
        this.getSaldoCliente();
    };
    ReciboComponent.prototype.onClickGuardar = function (event) {
        event.preventDefault();
        if (this.clienteSeleccionado.Id <= 0) {
            this.showNotification('warning', 'Debe indicar cliente.');
            return;
        }
        this.procesando = true;
        this.docVenta.TipoComprobante.Id = 6;
        this.docVenta.Usuario = this.usuarioLogin;
        this.docVenta.Cliente = this.clienteSeleccionado;
        console.log('this.docVenta', this.docVenta);
        this.guardarDocVenta();
    };
    ReciboComponent.prototype.guardarDocVenta = function () {
        var _this = this;
        this._documentoVentaService.saveDocVenta(this.docVenta).subscribe(function (response) {
            _this.procesando = false;
            if (response) {
                if (_this.IdDocumenotVenta <= 0) {
                    _this._router.navigate(['/recibo/' + response.Id]);
                }
                else {
                    _this.cargarDatos(response);
                }
                _this.MensajeUsuario_OK = true;
                _this.showNotification('success', 'El Recibo se actualizó correctamente.');
            }
        }, function (error) {
            _this.procesando = false;
            _this.showNotification('error', 'Ocurrió un error al actualizar el Recibo.');
            console.log(error);
        });
    };
    ReciboComponent.prototype.onClickComprobantesPendientes = function (event) {
        event.preventDefault();
        this.getSaldoCliente();
    };
    ReciboComponent.prototype.getSaldoCliente = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var idCliente = -1;
            if (!_this.clienteSeleccionado) {
                resolve();
            }
            else {
                _this._documentoVentaService
                    .getSaldoIniciaCliente(_this.clienteSeleccionado.Id, '')
                    .subscribe(function (response) {
                    _this.saldoCliente = response;
                    resolve();
                }, function (error) { reject(error); });
            }
        });
    };
    ReciboComponent.prototype.calcularTotales = function () {
        this.docVenta.Total = 0;
        this.docVenta.DolaresCotizaDolar = 1;
        var _efectivo = 0;
        if (this.docVenta.Efectivo > 0 && this.docVenta.EfectivoCotizaDolar > 0)
            _efectivo = (this.docVenta.Efectivo / this.docVenta.EfectivoCotizaDolar);
        var _dolares = 0;
        if (this.docVenta.Dolares)
            _dolares = this.docVenta.Dolares;
        var _cheques = 0;
        if (this.docVenta.Cheques > 0 && this.docVenta.ChequesCotizaDolar > 0)
            _cheques = (this.docVenta.Cheques / this.docVenta.ChequesCotizaDolar);
        var _tarjeta = 0;
        if (this.docVenta.Tarjeta > 0 && this.docVenta.TarjetaCotizaDolar > 0)
            _tarjeta = (this.docVenta.Tarjeta / this.docVenta.TarjetaCotizaDolar);
        var _mercadoPago = 0;
        if (this.docVenta.MercadoPago > 0 && this.docVenta.MercadoPagoCotizaDolar > 0)
            _mercadoPago = (this.docVenta.MercadoPago / this.docVenta.MercadoPagoCotizaDolar);
        var _deposito = 0;
        if (this.docVenta.DepositoTransferencia > 0 && this.docVenta.DepositoTransferCotizaDolar > 0)
            _deposito = (this.docVenta.DepositoTransferencia / this.docVenta.DepositoTransferCotizaDolar);
        this.docVenta.Total = _efectivo + _dolares + _cheques + _tarjeta + _mercadoPago + _deposito;
        this.saldoPendiente = this.saldoCliente - this.docVenta.Total;
    };
    ReciboComponent.prototype.formatNumero = function (text) {
        var padChar = '0';
        var size = 6;
        return (String(padChar).repeat(size) + text.toString()).substr((size * -1), size);
    };
    ReciboComponent.prototype.showNotification = function (type, message) {
        this._notifier.notify(type, message);
    };
    ReciboComponent.prototype.hideOldestNotification = function () {
        this._notifier.hideOldest();
    };
    ReciboComponent = __decorate([
        core_1.Component({
            selector: 'app-recibo',
            templateUrl: './recibo.component.html',
            styleUrls: ['./recibo.component.css']
        })
    ], ReciboComponent);
    return ReciboComponent;
}());
exports.ReciboComponent = ReciboComponent;
