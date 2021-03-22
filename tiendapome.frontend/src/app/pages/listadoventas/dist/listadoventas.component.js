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
exports.ListadoventasComponent = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var ListadoventasComponent = /** @class */ (function () {
    function ListadoventasComponent(_router, _route, _autenticaServices, _documentoVentaService, _clienteService, calendar, _notifier) {
        var _this = this;
        this._router = _router;
        this._route = _route;
        this._autenticaServices = _autenticaServices;
        this._documentoVentaService = _documentoVentaService;
        this._clienteService = _clienteService;
        this.calendar = calendar;
        this._notifier = _notifier;
        this.mostrarPanelBotones = false;
        this.numeroPaginaCP = 1;
        this.saldoCP = 0;
        this.numeroPaginaCC = 1;
        this.saldoCC = 0;
        this.ctaCteSinDeuda = true;
        this.saldoInicialClienteCC = 0;
        this.calculoSaldoClienteCC = 0;
        this.numeroPaginaCOB = 1;
        this.saldoCOB = 0;
        this.numeroPaginaCA = 1;
        this.searching = false;
        this.searchFailed = false;
        this.textoConfirmaAnulacion = '';
        this.procesando = false;
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
    ListadoventasComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.fechaDesde = {
            year: this.calendar.getPrev(this.calendar.getToday(), 'm', 1).year,
            month: this.calendar.getPrev(this.calendar.getToday(), 'm', 1).month,
            day: this.calendar.getPrev(this.calendar.getToday(), 'm', 1).day
        };
        this.fechaHasta = {
            year: this.calendar.getToday().year,
            month: this.calendar.getToday().month,
            day: this.calendar.getToday().day
        };
        this.usuarioLogin = this._autenticaServices.getClienteLoguin();
        this._route.params.subscribe(function (params) {
            if (params.cargarListados) {
                _this.clienteSeleccionado = JSON.parse(sessionStorage.getItem("lv_ClienteSeleccionado"));
                _this.cargarListados();
            }
        });
    };
    ListadoventasComponent.prototype.cargarListados = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.cargando = true;
                        return [4 /*yield*/, this.getSaldoInicialCliente()
                                .then(function (result) {
                                return _this.getCuentaCorriente(_this.numeroPaginaCC);
                            })
                                .then(function (result) {
                                return _this.getSaldoActualCliente();
                            })
                                .then(function (result) {
                                return _this.getCobranzas(_this.numeroPaginaCOB);
                            })
                                .then(function (result) {
                                return _this.getComprobantesAnulados(_this.numeroPaginaCA);
                            })
                                .then(function (result) {
                                _this.cargando = false;
                            })["catch"](function (err) {
                                _this.cargando = false;
                                console.log(err);
                                _this.showNotification('error', 'Ocurrió un error al cargar la página.');
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ListadoventasComponent.prototype.aplicarFiltros = function ($event) {
        $event.preventDefault();
        this.cargarListados();
    };
    ListadoventasComponent.prototype.getDocumentosPendientes = function (pagina) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var idCliente = -1;
            if (_this.clienteSeleccionado)
                idCliente = _this.clienteSeleccionado.Id;
            var fDesde = _this.fechaDesde ? _this.fechaDesde.year.toString() + '-' + _this.fechaDesde.month.toString() + '-' + _this.fechaDesde.day.toString() : null;
            var fHasta = _this.fechaHasta ? _this.fechaHasta.year.toString() + '-' + _this.fechaHasta.month.toString() + '-' + _this.fechaHasta.day.toString() : null;
            _this._documentoVentaService
                .getDocumentosVentas(-1, idCliente, fDesde, fHasta, pagina, 10, 1)
                .subscribe(function (response) {
                if (response) {
                    _this.numeroPaginaCP = pagina;
                    _this.totalFilasCP = response.TotalFilas;
                    _this.listadoPendientes = response.DocumentosVenta;
                    _this.saldoCP = 0;
                    _this.listadoPendientes.forEach(function (item) {
                        if (item.TipoComprobante.EsDebe)
                            _this.saldoCP = _this.saldoCP + item.Total;
                        else
                            _this.saldoCP = _this.saldoCP - item.Total;
                    });
                    resolve();
                }
            }, function (error) { reject(error); });
        });
    };
    ListadoventasComponent.prototype.pageChangeCP = function (pagina) {
        this.getDocumentosPendientes(pagina);
    };
    ListadoventasComponent.prototype.getSaldoInicialCliente = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!_this.clienteSeleccionado) {
                resolve();
            }
            else {
                var fDesde = _this.fechaDesde ? _this.fechaDesde.year.toString() + '-' + _this.fechaDesde.month.toString() + '-' + _this.fechaDesde.day.toString() : null;
                _this._documentoVentaService
                    .getSaldoIniciaCliente(_this.clienteSeleccionado.Id, fDesde)
                    .subscribe(function (response) {
                    _this.saldoInicialClienteCC = response;
                    _this.calculoSaldoClienteCC = _this.saldoInicialClienteCC;
                    resolve();
                }, function (error) { reject(error); });
            }
        });
    };
    ListadoventasComponent.prototype.getSaldoActualCliente = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!_this.clienteSeleccionado) {
                resolve();
            }
            else {
                _this._documentoVentaService
                    .getSaldoIniciaCliente(_this.clienteSeleccionado.Id, '')
                    .subscribe(function (response) {
                    _this.saldoCC = response;
                    _this.ctaCteSinDeuda = _this.saldoCC <= 0;
                    resolve();
                }, function (error) { reject(error); });
            }
        });
    };
    ListadoventasComponent.prototype.getCuentaCorriente = function (pagina) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var idCliente = -1;
            if (!_this.clienteSeleccionado) {
                resolve();
            }
            else {
                idCliente = _this.clienteSeleccionado.Id;
                var fDesde = _this.fechaDesde ? _this.fechaDesde.year.toString() + '-' + _this.fechaDesde.month.toString() + '-' + _this.fechaDesde.day.toString() : null;
                var fHasta = _this.fechaHasta ? _this.fechaHasta.year.toString() + '-' + _this.fechaHasta.month.toString() + '-' + _this.fechaHasta.day.toString() : null;
                _this._documentoVentaService
                    .getDocumentosVentas(-1, idCliente, fDesde, fHasta, pagina, 10, -1)
                    .subscribe(function (response) {
                    if (response) {
                        _this.numeroPaginaCC = pagina;
                        _this.totalFilasCC = response.TotalFilas;
                        _this.listadoCtaCte = response.DocumentosVenta;
                        _this.listadoCtaCte.forEach(function (item) {
                            item.Debe = item.TipoComprobante.EsDebe ? item.Total : 0;
                            item.Haber = !item.TipoComprobante.EsDebe ? item.Total : 0;
                            _this.calculoSaldoClienteCC = _this.calculoSaldoClienteCC + item.Debe - item.Haber;
                            item.Saldo = _this.calculoSaldoClienteCC;
                        });
                        resolve();
                    }
                }, function (error) { reject(error); });
            }
        });
    };
    ListadoventasComponent.prototype.pageChangeCC = function (pagina) {
        this.getCuentaCorriente(pagina);
    };
    ListadoventasComponent.prototype.getCobranzas = function (pagina) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var idCliente = -1;
            if (_this.clienteSeleccionado)
                idCliente = _this.clienteSeleccionado.Id;
            var fDesde = _this.fechaDesde ? _this.fechaDesde.year.toString() + '-' + _this.fechaDesde.month.toString() + '-' + _this.fechaDesde.day.toString() : null;
            var fHasta = _this.fechaHasta ? _this.fechaHasta.year.toString() + '-' + _this.fechaHasta.month.toString() + '-' + _this.fechaHasta.day.toString() : null;
            _this._documentoVentaService
                .getDocumentosVentas(-1, idCliente, fDesde, fHasta, pagina, 10, 2)
                .subscribe(function (response) {
                if (response) {
                    _this.numeroPaginaCOB = pagina;
                    _this.totalFilasCOB = response.TotalFilas;
                    _this.listadoCobranzas = response.DocumentosVenta;
                    _this.saldoCOB = 0;
                    _this.listadoCobranzas.forEach(function (item) {
                        _this.saldoCOB = _this.saldoCOB + item.Total;
                    });
                    resolve();
                }
            }, function (error) { reject(error); });
        });
    };
    ListadoventasComponent.prototype.pageChangeCOB = function (pagina) {
        this.getCobranzas(pagina);
    };
    ListadoventasComponent.prototype.getComprobantesAnulados = function (pagina) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var idCliente = -1;
            if (_this.clienteSeleccionado)
                idCliente = _this.clienteSeleccionado.Id;
            var fDesde = _this.fechaDesde ? _this.fechaDesde.year.toString() + '-' + _this.fechaDesde.month.toString() + '-' + _this.fechaDesde.day.toString() : null;
            var fHasta = _this.fechaHasta ? _this.fechaHasta.year.toString() + '-' + _this.fechaHasta.month.toString() + '-' + _this.fechaHasta.day.toString() : null;
            _this._documentoVentaService
                .getDocumentosVentas(-1, idCliente, fDesde, fHasta, pagina, 10, 3)
                .subscribe(function (response) {
                if (response) {
                    _this.numeroPaginaCA = pagina;
                    _this.totalFilasCA = response.TotalFilas;
                    _this.listadoAnulados = response.DocumentosVenta;
                    resolve();
                }
            }, function (error) { reject(error); });
        });
    };
    ListadoventasComponent.prototype.pageChangeCA = function (pagina) {
        this.getComprobantesAnulados(pagina);
    };
    ListadoventasComponent.prototype.mostrarOcultarPanelBotones = function ($event) {
        $event.preventDefault();
        this.mostrarPanelBotones = !this.mostrarPanelBotones;
    };
    ListadoventasComponent.prototype.onClickNotaPedido = function (event) {
        event.preventDefault();
        this.guardarFiltros();
        this._router.navigate(['/documentoventa/1']);
    };
    ListadoventasComponent.prototype.onClickNotaCredito = function (event) {
        event.preventDefault();
        this.guardarFiltros();
        this._router.navigate(['/documentoventa/2']);
    };
    ListadoventasComponent.prototype.onClickRecibo = function (event) {
        event.preventDefault();
        this.guardarFiltros();
        this._router.navigate(['/recibo/']);
    };
    ListadoventasComponent.prototype.onClickAjustePositivo = function (event) {
        event.preventDefault();
        this.guardarFiltros();
        this._router.navigate(['/documentoventa/4']);
    };
    ListadoventasComponent.prototype.onClickAjusteNegativo = function (event) {
        event.preventDefault();
        this.guardarFiltros();
        this._router.navigate(['/documentoventa/5']);
    };
    ListadoventasComponent.prototype.verComprobante = function (event, item) {
        event.preventDefault();
        this.guardarFiltros();
        if (item.TipoComprobante.Id === 6)
            this._router.navigate(['/recibo/' + item.Id]);
        else
            this._router.navigate(['/documentoventa/' + item.TipoComprobante.Id + '/' + item.Id]);
    };
    ListadoventasComponent.prototype.imprimirComprobante = function (event, item) {
        event.preventDefault();
        if (item.TipoComprobante.Id != 6)
            this._documentoVentaService.printNotaPedido(item.Id);
    };
    ListadoventasComponent.prototype.guardarFiltros = function () {
        if (this.clienteSeleccionado)
            sessionStorage.setItem("lv_ClienteSeleccionado", JSON.stringify(this.clienteSeleccionado));
        else
            sessionStorage.removeItem("lv_ClienteSeleccionado");
    };
    ListadoventasComponent.prototype.formatNumero = function (text) {
        var padChar = '0';
        var size = 5;
        return (String(padChar).repeat(size) + text.toString()).substr((size * -1), size);
    };
    ListadoventasComponent.prototype.estaVencido = function (item) {
        return item.DiasVencido > 15;
    };
    ListadoventasComponent.prototype.formatFechaToString = function (fecha) {
        var dd = String(fecha.getDate()).padStart(2, '0');
        var mm = String(fecha.getMonth() + 1).padStart(2, '0');
        var yyyy = fecha.getFullYear();
        return mm + '/' + dd + '/' + yyyy;
    };
    ListadoventasComponent.prototype.onClickExportarCtaCte = function ($event) {
        $event.preventDefault();
        var fDesde = this.fechaDesde ? this.fechaDesde.year.toString() + '-' + this.fechaDesde.month.toString() + '-' + this.fechaDesde.day.toString() : null;
        var fHasta = this.fechaHasta ? this.fechaHasta.year.toString() + '-' + this.fechaHasta.month.toString() + '-' + this.fechaHasta.day.toString() : null;
        this._documentoVentaService.printCtaCte(this.clienteSeleccionado.Id, fDesde, fHasta);
    };
    ListadoventasComponent.prototype.onClickConfirmarAnularComprobante = function ($event, item) {
        $event.preventDefault();
        this.docVentaProcesar = item;
        this.textoConfirmaAnulacion = '¿Desea anular el comprobante: ' + this.docVentaProcesar.TipoComprobante.Descripcion + ' ' + this.formatNumero(this.docVentaProcesar.Numero) + '?';
        $('#modalConfirmaAnular').modal('show');
    };
    ListadoventasComponent.prototype.onClickDeshacerAnulado = function ($event, item) {
        $event.preventDefault();
        this.docVentaProcesar = item;
        this.textoConfirmaAnulacion = '¿Deshacer anulación del comprobante: ' + this.docVentaProcesar.TipoComprobante.Descripcion + ' ' + this.formatNumero(this.docVentaProcesar.Numero) + '?';
        $('#modalConfirmaAnular').modal('show');
    };
    ListadoventasComponent.prototype.onClickAnularComprobante = function ($event) {
        var _this = this;
        $event.preventDefault();
        if (this.docVentaProcesar) {
            //usamos el mismo modal para confirmar anular y deshacer
            if (this.docVentaProcesar.Anulado)
                this.docVentaProcesar.Anulado = false;
            else
                this.docVentaProcesar.Anulado = true;
            this.procesando = true;
            this._documentoVentaService.saveComprobanteAnulado(this.docVentaProcesar)
                .subscribe(function (response) {
                _this.procesando = false;
                _this.cargarListados();
                _this.showNotification('success', 'El comprobante se actualizó correctamente.');
                $('#modalConfirmaAnular').modal('hide');
            }, function (error) {
                _this.procesando = false;
                _this.showNotification('error', 'Ocurrió un error al actualizar el comprobante.');
                $('#modalConfirmaAnular').modal('hide');
                console.log(error);
            });
        }
    };
    ListadoventasComponent.prototype.onClickLimpiarCliente = function (event) {
        event.preventDefault();
        this.clienteSeleccionado = null;
        this.listadoCtaCte = [];
        this.listadoCobranzas = [];
        this.listadoAnulados = [];
    };
    ListadoventasComponent.prototype.colapsarMenu = function ($event) {
        $event.preventDefault();
        $('.navbar-collapse').collapse('hide');
        return false;
    };
    ListadoventasComponent.prototype.showNotification = function (type, message) {
        this._notifier.notify(type, message);
    };
    ListadoventasComponent.prototype.hideOldestNotification = function () {
        this._notifier.hideOldest();
    };
    ListadoventasComponent = __decorate([
        core_1.Component({
            selector: 'app-listadoventas',
            templateUrl: './listadoventas.component.html',
            styleUrls: ['./listadoventas.component.css']
        })
    ], ListadoventasComponent);
    return ListadoventasComponent;
}());
exports.ListadoventasComponent = ListadoventasComponent;
