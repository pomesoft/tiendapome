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
exports.NavbarbackofficeComponent = void 0;
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var NavbarbackofficeComponent = /** @class */ (function () {
    function NavbarbackofficeComponent(_pedidoServices, _autenticaService, _parametroServices, _pouchDBServices, _route, _router, _zone) {
        var _this = this;
        this._pedidoServices = _pedidoServices;
        this._autenticaService = _autenticaService;
        this._parametroServices = _parametroServices;
        this._pouchDBServices = _pouchDBServices;
        this._route = _route;
        this._router = _router;
        this._zone = _zone;
        this.mostrarBotonesPedido = false;
        this.mostrarMenuProductos = true;
        this.mostrarMenuFacturacion = true;
        this._idUserDB = 'USER_01';
        this._idPedidoDB = 'PEDIDO_01';
        this._router.events.subscribe(function (val) {
            if (val instanceof router_1.ResolveEnd) {
                _this.mostrarBotonesPedido = val.url.includes('/pedido/');
            }
        });
    }
    NavbarbackofficeComponent.prototype.colapsarMenu = function ($event) {
        $event.preventDefault();
        $('.navbar-collapse').collapse('hide');
        return false;
    };
    NavbarbackofficeComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.carritoCantItems = 0;
        this.carritoImporteTotal = 0;
        this.carritoMoneda = '';
        this._pouchDBServices.cambios();
        this._pouchDBServices.getChangeListener().subscribe(function (data) {
            _this._zone.run(function () {
                console.log('this._zone.run()');
                _this.actualizarInfoCarrito();
            });
        });
        this.inicializarControles();
    };
    NavbarbackofficeComponent.prototype.inicializarControles = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.obtenerParamsMostrarProducto()
                            .then(function (result) {
                            if (result)
                                _this.mostrarMenuProductos = (result == 'SI');
                            return _this.obtenerParamsMostrarFacturacion();
                        })
                            .then(function (result) {
                            if (result)
                                _this.mostrarMenuFacturacion = (result == 'SI');
                        })["catch"](function (err) {
                            console.log(err);
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NavbarbackofficeComponent.prototype.obtenerParamsMostrarProducto = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._parametroServices.getParametroValor('MOSTRAR_PRODUCTOS').subscribe(function (response) {
                if (response) {
                    resolve(response.Valor);
                }
                else {
                    resolve("SI");
                }
            }, function (error) { reject(error); });
        });
    };
    NavbarbackofficeComponent.prototype.obtenerParamsMostrarFacturacion = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._parametroServices.getParametroValor('MOSTRAR_FACTURACION').subscribe(function (response) {
                console.log('response', response);
                if (response) {
                    resolve(response.Valor);
                }
                else {
                    resolve("SI");
                }
            }, function (error) { reject(error); });
        });
    };
    NavbarbackofficeComponent.prototype.actualizarInfoCarrito = function () {
        var _this = this;
        this._pouchDBServices.get(this._idPedidoDB)
            .then(function (doc) {
            if (doc) {
                _this.pedido = doc;
                _this.carritoCantItems = _this.pedido.CantidadItems;
                _this.carritoImporteTotal = _this.pedido.Total;
                _this.carritoMoneda = _this.pedido.Moneda;
                _this.cliente = _this.pedido.Cliente.Nombre + ' ' + _this.pedido.Cliente.Apellido + ' - ' + _this.pedido.Cliente.NombreFantasia;
                _this.leyenda = 'Nro: ' + _this.pedido.Numero.toString() + ' - ' + _this.pedido.Estado.Descripcion;
            }
        });
    };
    NavbarbackofficeComponent.prototype.cerrarSesion = function ($event) {
        var _this = this;
        $event.preventDefault();
        var userLogin = {
            _id: this._idUserDB,
            clienteLogin: null
        };
        this._pouchDBServices.update(userLogin);
        this._autenticaService.logout().subscribe(function (response) { _this._router.navigate(['/carrito']); }, function (error) {
            _this._router.navigate(['/carrito']);
            console.log(error);
        });
    };
    NavbarbackofficeComponent.prototype.pedidoSolicitado = function () {
        return this.pedido != null && this.pedido.Estado != null && this.pedido.Estado.Id == 2; //SOLICITADO
    };
    NavbarbackofficeComponent.prototype.pedidoEnProceso = function () {
        return this.pedido != null && this.pedido.Estado != null && (this.pedido.Estado.Id == 3 || this.pedido.Estado.Id == 8); // EN_PROCESO o PROVEEDOR
    };
    NavbarbackofficeComponent.prototype.finalizarProceso = function ($event) {
        var _this = this;
        $event.preventDefault();
        var itemsValidos = true;
        this.pedido.Items.forEach(function (item) {
            if (!item.Confirmado && !item.SinStock) {
                itemsValidos = false;
                localStorage.setItem("notificaError", 'Todos los items del pedido deben estar Confirmados ó Sin Stock');
                _this._router.navigate(['/notifica/error/PEDIDO_FINALIZA_ARMADO_ERROR']);
            }
        });
        if (itemsValidos) {
            this._pedidoServices.avanzarPedido(this.pedido).subscribe(function (response) {
                if (response) {
                    console.log('avanzarPedido->response', response);
                    if (response.Estado == 1) {
                        localStorage.removeItem("leyendaPedido");
                        _this._router.navigate(['/notifica/success/PEDIDO_FINALIZA_ARMADO']);
                    }
                    else {
                        localStorage.setItem("notificaError", response.Mensaje);
                        _this._router.navigate(['/notifica/error/PEDIDO_FINALIZA_ERROR']);
                    }
                }
            }, function (error) { console.log(error); });
        }
    };
    NavbarbackofficeComponent.prototype.irAlCarrito = function (event) {
        event.preventDefault();
    };
    NavbarbackofficeComponent = __decorate([
        core_1.Component({
            selector: 'navbarbackoffice',
            templateUrl: './navbarbackoffice.component.html',
            styleUrls: ['./navbarbackoffice.component.css']
        })
    ], NavbarbackofficeComponent);
    return NavbarbackofficeComponent;
}());
exports.NavbarbackofficeComponent = NavbarbackofficeComponent;
