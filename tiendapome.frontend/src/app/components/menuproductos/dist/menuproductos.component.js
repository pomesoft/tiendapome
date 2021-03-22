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
exports.MenuproductosComponent = void 0;
var core_1 = require("@angular/core");
var menu_services_1 = require("../../services/menu.services");
var MenuproductosComponent = /** @class */ (function () {
    function MenuproductosComponent(_menuServices, _pouchDBServices, _pedidoServices, _parametroServices, _route, _router, _autenticaServices) {
        this._menuServices = _menuServices;
        this._pouchDBServices = _pouchDBServices;
        this._pedidoServices = _pedidoServices;
        this._parametroServices = _parametroServices;
        this._route = _route;
        this._router = _router;
        this._autenticaServices = _autenticaServices;
        this.cargandoProductos = true;
        this.mostrarWhatsApp = true;
        this.textoBuscarProducto = '';
        this.nuevaVersionAPP = '';
        this._idPedidoDB = 'PEDIDO_01';
        this._idUserDB = 'USER_01';
        this.listarTipos = true;
        this.listarCategorias = false;
        this.listarSubcategorias = false;
        this.subcatergoriaCarrito = '';
    }
    MenuproductosComponent.prototype.ngOnInit = function () {
        this.inicializarControles();
    };
    MenuproductosComponent.prototype.inicializarControles = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._parametroServices.obtenerTodosParametros()
                            .then(function (result) {
                            _this.verificarVersionAPP();
                        })
                            .then(function (result) {
                            return _this.obtenerLeyenda();
                        })
                            .then(function (result) {
                            return _this.obtenerNroWhatApp();
                        })
                            .then(function (result) {
                            return _this.getMenu();
                        })
                            .then(function (result) {
                            if (result) {
                                _this.menu = result;
                                _this.cargandoProductos = false;
                                _this._route.params.subscribe(function (params) {
                                    if (params.tipo != null && +params.tipo > 0) {
                                        var tipoRouting = _this.menu.find(function (tipo) { return tipo.Id === +params.tipo; });
                                        if (tipoRouting != null)
                                            _this.mostrarItemsCategorias(tipoRouting);
                                    }
                                    else if (params.categoria != null && +params.categoria > 0) {
                                        _this.menu.forEach(function (tipo) {
                                            var categoriaRouting = tipo.Categorias.find(function (catego) { return catego.Id === +params.categoria; });
                                            if (categoriaRouting != null) {
                                                _this.tipoSeleccionado = tipo;
                                                _this.categoriaSeleccionada = categoriaRouting;
                                                _this.mostrarItemsSubcategorias(categoriaRouting);
                                            }
                                        });
                                    }
                                });
                            }
                            return _this.getUserPouchDB();
                        })
                            .then(function (result) {
                            return _this.verificarPedido();
                        })
                            .then(function (result) {
                            return _this.mostrarBannerBienvenida();
                        }).then(function (result) {
                            return _this.mostrarBannerPromo();
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MenuproductosComponent.prototype.getUserPouchDB = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!_this._autenticaServices.getClienteLoguin()) {
                resolve();
            }
            else {
                _this.clienteLogin = _this._autenticaServices.getClienteLoguin();
                resolve();
            }
        });
    };
    MenuproductosComponent.prototype.getMenu = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._menuServices.getMenu().subscribe(function (response) { resolve(response); }, function (error) { reject(error); });
        });
    };
    MenuproductosComponent.prototype.mostrarBannerBienvenida = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this._autenticaServices.getClienteLoguin()) {
                resolve();
            }
            else {
                _this._parametroServices.getParametroValor('MOSTRAR_BANNER_BIENVENIDA').subscribe(function (response) {
                    if (response) {
                        $('#modalBannerBienvenida').modal('show');
                    }
                    resolve();
                }, function (error) {
                    console.log(error);
                    resolve();
                });
            }
        });
    };
    MenuproductosComponent.prototype.mostrarBannerPromo = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            //Si ya hizo click en Quiero ver la promo
            var promoVigenteVista = localStorage.getItem("promoVigenteVista") ? localStorage.getItem("promoVigenteVista") : '';
            _this._parametroServices.getParametroValor('MOSTRAR_BANNER_PROMO').subscribe(function (response) {
                if (response && response.Valor != promoVigenteVista) {
                    _this.imagenBannerPromo = response.Valor;
                    $('#modalBannerPromo').modal('show');
                }
                resolve();
            }, function (error) {
                console.log(error);
                resolve();
            });
        });
    };
    MenuproductosComponent.prototype.obtenerLeyenda = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            localStorage.removeItem("leyendaPedido");
            _this._parametroServices.getParametroValor('LEYENDA_PEDIDO').subscribe(function (response) {
                if (response) {
                    localStorage.setItem("leyendaPedido", response.Valor);
                }
                resolve();
            }, function (error) {
                console.log(error);
                resolve();
            });
        });
    };
    MenuproductosComponent.prototype.verificarVersionAPP = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._parametroServices.getParametroValor('VERSION_APP').subscribe(function (response) {
                if (response) {
                    var versionAPP = localStorage.getItem("versionAPP") ? localStorage.getItem("versionAPP") : '';
                    console.log('versionAPP', versionAPP);
                    if (versionAPP != '' && versionAPP != response.Valor) {
                        _this.nuevaVersionAPP = response.Valor;
                        $('#modalUpdate').modal('show');
                    }
                }
                resolve();
            }, function (error) { reject(error); });
        });
    };
    MenuproductosComponent.prototype.actualizarVersion = function ($event) {
        $event.preventDefault();
        localStorage.setItem("versionAPP", this.nuevaVersionAPP);
        $('#modalUpdate').modal('hide');
        window.location.reload();
    };
    MenuproductosComponent.prototype.obtenerNroWhatApp = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.mostrarWhatsApp = false;
            localStorage.removeItem("numeroWhatsApp");
            _this._parametroServices.getParametroValor('NRO_VENTAS_WHATSAPP').subscribe(function (response) {
                if (response) {
                    _this.mostrarWhatsApp = response.Valor.length > 0;
                    localStorage.setItem("numeroWhatsApp", response.Valor);
                }
                resolve();
            }, function (error) {
                console.log(error);
                resolve();
            });
        });
    };
    MenuproductosComponent.prototype.verificarPedido = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.clienteLogin) {
                _this._pedidoServices.getPedidoClienteIngresado(_this.clienteLogin.Id, -1, -1).subscribe(function (response) {
                    if (response) {
                        _this.pedido = response;
                        _this.registrarPedido_pouchDB();
                    }
                    resolve();
                }, function (error) {
                    console.log(error);
                    resolve();
                });
            }
            else {
                resolve();
            }
        });
    };
    MenuproductosComponent.prototype.registrarPedido_pouchDB = function () {
        var _this = this;
        this._pouchDBServices.get(this._idPedidoDB)
            .then(function (doc) {
            if (doc) {
                _this.pedido._id = _this._idPedidoDB;
                _this._pouchDBServices.update(_this.pedido);
            }
        })["catch"](function (err) {
            if (err.status == 404) {
                _this._pouchDBServices.put(_this._idPedidoDB, _this.pedido);
            }
            else {
                console.log(err);
            }
        });
    };
    MenuproductosComponent.prototype.mostrarProductos = function ($event, subcategoria) {
        $event.preventDefault();
        this.mostrarPantallaProductos(subcategoria);
    };
    MenuproductosComponent.prototype.mostrarPantallaProductos = function (subcategoria) {
        if (this.categoriaSeleccionada.Descripcion.trim() != subcategoria.Descripcion.trim())
            this.subcatergoriaCarrito += ' - ' + subcategoria.Descripcion;
        localStorage.setItem("subcatergoriaCarrito", this.subcatergoriaCarrito);
        localStorage.setItem("catergoriaCarrito", this.categoriaSeleccionada.Descripcion);
        //estas dos variables son para manejar el boton ATRAS
        localStorage.removeItem("IdTipoCarrito");
        localStorage.setItem("IdCategoriaCarrito", this.categoriaSeleccionada.Id.toString());
        this.textoBuscarProducto = '""';
        this._router.navigate(['/productos/true/' + subcategoria.Id + '/' + this.textoBuscarProducto]);
    };
    //TODO: la subcategoria que esta en promo deberia estar parametrizada
    MenuproductosComponent.prototype.mostrarProductosPromo = function (event) {
        event.preventDefault();
        localStorage.setItem("promoVigenteVista", this.imagenBannerPromo);
        $('#modalBannerPromo').modal('hide');
        // this.textoBuscarProducto = 'Anillos en promo';
        // localStorage.setItem("subcatergoriaCarrito", this.textoBuscarProducto);
        // this._router.navigate(['/productos/true/-1/' + this.textoBuscarProducto]);
    };
    MenuproductosComponent.prototype.busquedaProducto = function ($event) {
        $event.preventDefault();
        if (this.textoBuscarProducto.trim().length > 0) {
            localStorage.setItem("subcatergoriaCarrito", this.textoBuscarProducto);
            this._router.navigate(['/productos/true/-1/' + this.textoBuscarProducto]);
        }
    };
    MenuproductosComponent.prototype.mostrarCategoria = function (categoria) {
        var mostrar = true;
        categoria.Subcategorias.forEach(function (item) {
            mostrar = item.CantidadProductos > 0;
            if (mostrar)
                return mostrar;
        });
        return mostrar;
    };
    MenuproductosComponent.prototype.volverTipos = function ($event) {
        $event.preventDefault();
        this.listarTipos = true;
        this.listarCategorias = false;
        this.listarSubcategorias = false;
    };
    MenuproductosComponent.prototype.volverCategorias = function ($event) {
        $event.preventDefault();
        this.listarTipos = false;
        this.listarCategorias = true;
        this.listarSubcategorias = false;
    };
    MenuproductosComponent.prototype.mostrarCategorias = function ($event, tipo) {
        $event.preventDefault();
        this.mostrarItemsCategorias(tipo);
    };
    MenuproductosComponent.prototype.mostrarItemsCategorias = function (tipo) {
        this.tipoSeleccionado = tipo;
        if (this.tipoSeleccionado.Categorias.length === 1) {
            this.mostrarItemsSubcategorias(this.tipoSeleccionado.Categorias[0]);
        }
        else {
            this.subcatergoriaCarrito = tipo.Descripcion + ' - ';
            this.listarTipos = false;
            this.listarCategorias = true;
            this.listarSubcategorias = false;
        }
    };
    MenuproductosComponent.prototype.mostrarSubcategorias = function ($event, categoria) {
        $event.preventDefault();
        this.mostrarItemsSubcategorias(categoria);
    };
    MenuproductosComponent.prototype.mostrarItemsSubcategorias = function (categoria) {
        localStorage.removeItem("IdCategoriaCarrito");
        if (this.tipoSeleccionado)
            localStorage.setItem("IdTipoCarrito", this.tipoSeleccionado.Id.toString());
        this.categoriaSeleccionada = categoria;
        if (this.tipoSeleccionado.Descripcion.trim() != categoria.Descripcion.trim())
            this.subcatergoriaCarrito = this.tipoSeleccionado.Descripcion + ' - ' + categoria.Descripcion;
        else
            this.subcatergoriaCarrito = this.tipoSeleccionado.Descripcion;
        this.listadoSubcategorias = this.categoriaSeleccionada.Subcategorias.filter(function (item) { return item.Visible === true; });
        this.listarTipos = false;
        this.listarCategorias = false;
        this.listarSubcategorias = true;
        // if (this.listadoSubcategorias && this.listadoSubcategorias.length == 1) {
        //       this.mostrarPantallaProductos(this.listadoSubcategorias[0]);
        // } else {
        // }
    };
    MenuproductosComponent.prototype.enviarWhatsApp = function ($event) {
        $event.preventDefault();
        var urlDesktop = 'https://web.whatsapp.com/';
        var urlMobile = 'https://api.whatsapp.com/';
        var mensaje = 'send?phone=' + localStorage.getItem("numeroWhatsApp") + '&text=%20';
        //let mensaje = 'send?phone=5493624098916&text=%20';
        if (this.isMobile()) {
            window.open(urlMobile + mensaje, '_blank');
        }
        else {
            window.open(urlDesktop + mensaje, '_blank');
        }
    };
    MenuproductosComponent.prototype.isMobile = function () {
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
    MenuproductosComponent = __decorate([
        core_1.Component({
            selector: 'menuproductos',
            templateUrl: './menuproductos.component.html',
            styleUrls: ['./menuproductos.component.css'],
            providers: [menu_services_1.MenuServices]
        })
    ], MenuproductosComponent);
    return MenuproductosComponent;
}());
exports.MenuproductosComponent = MenuproductosComponent;
