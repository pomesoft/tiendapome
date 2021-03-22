"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.NavbarcarritoComponent = void 0;
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var pouch_db_services_1 = require("../../services/pouch-db.services");
var NavbarcarritoComponent = /** @class */ (function () {
    function NavbarcarritoComponent(_pedidoServices, _autenticaService, _pouchDBServices, _zone, _route, _router) {
        var _this = this;
        this._pedidoServices = _pedidoServices;
        this._autenticaService = _autenticaService;
        this._pouchDBServices = _pouchDBServices;
        this._zone = _zone;
        this._route = _route;
        this._router = _router;
        this.nombreCliente = '';
        this.mostrarBotonesCarrito = false;
        this.textoSubcategoriaCarrito = '';
        this.mostrarBotonesPedido = false;
        this.mostrarBotonFinalizar = false;
        this.finalizando = false;
        this.soloLecturaPedido = false;
        this._idUserDB = 'USER_01';
        this._idPedidoDB = 'PEDIDO_01';
        this._router.events.subscribe(function (val) {
            if (val instanceof router_1.ResolveEnd) {
                _this.mostrarBotonesPedido = val.url.includes('/pedido/') || val.url.includes('/verpedido/');
                _this.soloLecturaPedido = val.url.includes('/verpedido/');
                _this.mostrarBotonesCarrito = val.url.includes('/productos/');
                if (_this.mostrarBotonesCarrito) {
                    _this.textoSubcategoriaCarrito = localStorage.getItem("subcatergoriaCarrito");
                }
                _this.leyenda = localStorage.getItem("leyendaPedido");
            }
        });
    }
    NavbarcarritoComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.carritoCantItems = 0;
        this.carritoImporteTotal = 0;
        this.carritoMoneda = '';
        this._pouchDBServices.cambios();
        this._pouchDBServices.getChangeListener().subscribe(function (data) {
            _this._zone.run(function () {
                _this.actualizarInfoCarrito();
            });
        });
        this.actualizarInfoCarrito();
    };
    NavbarcarritoComponent.prototype.actualizarInfoCarrito = function () {
        var _this = this;
        this._pouchDBServices.get(this._idPedidoDB)
            .then(function (doc) {
            if (doc) {
                _this.pedido = doc;
                _this.carritoCantItems = _this.pedido.CantidadItems;
                _this.carritoImporteTotal = _this.pedido.Total;
                _this.carritoMoneda = _this.pedido.Moneda;
                _this.idClientePedido = _this.pedido.Cliente.Id;
                _this.nombreCliente = _this.pedido.Cliente.Nombre;
                if (_this.soloLecturaPedido)
                    _this.mostrarBotonFinalizar = false;
                else
                    _this.mostrarBotonFinalizar = _this.pedido.CompraMinima == -1 || _this.pedido.CompraMinima <= _this.pedido.Total;
            }
        });
    };
    NavbarcarritoComponent.prototype.cerrarSesion = function ($event) {
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
    NavbarcarritoComponent.prototype.irAlCarrito = function ($event) {
        $event.preventDefault();
        this._router.navigate(['/pedido/-1/' + this.idClientePedido]);
    };
    NavbarcarritoComponent.prototype.finalizar = function ($event) {
        var _this = this;
        $event.preventDefault();
        this.finalizando = true;
        var itemsValidos = true;
        this.pedido.Items.forEach(function (item) {
            if (item.Cantidad == 0) {
                itemsValidos = false;
                localStorage.setItem("notificaError", 'Por favor verificá las cantidades');
                _this._router.navigate(['/notifica/error/PEDIDO_FINALIZA_ERROR']);
            }
        });
        if (itemsValidos) {
            this._pedidoServices.avanzarPedido(this.pedido).subscribe(function (response) {
                if (response) {
                    _this.finalizando = false;
                    console.log('avanzarPedido->response', response);
                    if (response.Estado == 1) {
                        _this._router.navigate(['/notifica/success/PEDIDO_FINALIZA_OK']);
                        localStorage.removeItem("leyendaPedido");
                    }
                    else {
                        localStorage.setItem("notificaError", response.Mensaje);
                        _this._router.navigate(['/notifica/error/PEDIDO_FINALIZA_ERROR']);
                    }
                }
            }, function (error) {
                _this.finalizando = false;
                localStorage.setItem("notificaError", error.error.message);
                _this._router.navigate(['/notifica/error/PEDIDO_FINALIZA_ERROR']);
                console.log(error);
            });
        }
    };
    NavbarcarritoComponent.prototype.volverAtras = function ($event) {
        $event.preventDefault();
        debugger;
        var IdTipoCarrito = localStorage.getItem("IdTipoCarrito");
        var IdCatergoriaCarrito = localStorage.getItem("IdCategoriaCarrito");
        if (IdTipoCarrito != null)
            this._router.navigate(['/menu/' + IdTipoCarrito + '/-1']);
        else if (IdCatergoriaCarrito != null)
            this._router.navigate(['/menu/-1/' + IdCatergoriaCarrito]);
        else
            this._router.navigate(['/menu']);
    };
    NavbarcarritoComponent = __decorate([
        core_1.Component({
            selector: 'navbarcarrito',
            templateUrl: './navbarcarrito.component.html',
            styleUrls: ['./navbarcarrito.component.css'],
            providers: [pouch_db_services_1.PouchDBServices]
        })
    ], NavbarcarritoComponent);
    return NavbarcarritoComponent;
}());
exports.NavbarcarritoComponent = NavbarcarritoComponent;
