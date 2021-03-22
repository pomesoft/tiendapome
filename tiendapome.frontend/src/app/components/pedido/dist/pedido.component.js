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
exports.PedidoComponent = void 0;
var core_1 = require("@angular/core");
var pedido_1 = require("../../models/pedido");
var pouch_db_services_1 = require("../../services/pouch-db.services");
var pedido_service_1 = require("../../services/pedido.service");
var PedidoComponent = /** @class */ (function () {
    function PedidoComponent(_pedidoServices, _pouchDBServices, _router, _route, _autenticaServices) {
        this._pedidoServices = _pedidoServices;
        this._pouchDBServices = _pouchDBServices;
        this._router = _router;
        this._route = _route;
        this._autenticaServices = _autenticaServices;
        this.pedido = new pedido_1.Pedido();
        this._idPedidoDB = 'PEDIDO_01'; //id pedido del pouchDB / indexedDB
        this.cargandoProductos = true;
        this.mensajeError = '';
        this.tipoAlerta = '';
        this.itemAlerta = -1;
        this.procesando = false;
        this.ESTADO_ITEM_CONFIRTMADO = 1;
        this.ESTADO_ITEM_SIN_STOCK = 2;
        this.verificarStock = false;
        this.productIdAlertaModalMedida = -1;
        this.verTodasLasMedidas = true;
        this.numbers = [];
        this.filasPorPagina = 9;
        this.paginaActual = 1;
        this.entidadElimina = null;
        for (var index = 0; index < 10000; index++) {
            this.numbers.push(index);
        }
    }
    PedidoComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._route.params.subscribe(function (params) {
            _this._IdPedido = +params.idPedido;
            _this._IdCliente = +params.idCliente;
            _this.inicializarControles();
        });
    };
    PedidoComponent.prototype.inicializarControles = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.obtenerPedido(this.paginaActual)
                            .then(function (response) {
                            if (response) {
                                _this.clienteLogin = _this._autenticaServices.getClienteLoguin();
                                _this.pedido = response;
                                console.log('pedido', _this.pedido);
                                // si el pedido esta EN_PROCESO no se verifica el stock
                                if (localStorage.getItem("verificarStock") != null && _this.pedido.Estado.Id < 3) {
                                    _this.verificarStock = localStorage.getItem("verificarStock") == 'SI';
                                }
                                //solo para los pedidos que estan en Solicitados se muestran todas las medidas, para el resto de los estado se muestra boton ocultar/mostrar
                                _this.verTodasLasMedidas = _this.pedido.Estado.Id === 1;
                                _this.registrarPedido_pouchDB();
                            }
                        })["catch"](function (err) {
                            _this.showAlert('warning', 0, 'Ocurrió un error al cargar la página.');
                            console.log(err);
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PedidoComponent.prototype.obtenerPedido = function (pagina) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this._IdCliente != -1) {
                _this._pedidoServices.getPedidoClienteIngresado(_this._IdCliente, -1, -1).subscribe(function (response) {
                    _this.cargandoProductos = false;
                    _this.paginaFinal = (response.CantidadItems / _this.filasPorPagina);
                    response.Items.forEach(function (item) {
                        _this.pedido.Items.push(item);
                    });
                    resolve(response);
                }, function (error) {
                    _this.cargandoProductos = false;
                    reject(error);
                });
            }
            else {
                _this._pedidoServices.getPedidoObtener(_this._IdPedido, -1, -1).subscribe(function (response) {
                    _this.cargandoProductos = false;
                    _this.paginaFinal = (response.CantidadItems / _this.filasPorPagina);
                    response.Items.forEach(function (item) {
                        _this.pedido.Items.push(item);
                    });
                    resolve(response);
                }, function (error) {
                    _this.cargandoProductos = false;
                    reject(error);
                });
            }
        });
    };
    PedidoComponent.prototype.onScroll = function () {
        // if ((this.paginaActual < this.paginaFinal) && !this.cargandoProductos) {
        //       this.cargandoProductos = true;
        //       this.paginaActual++;
        //       this.obtenerPedido(this.paginaActual);
        //       console.log('paginaActual', this.paginaActual);
        // }
    };
    PedidoComponent.prototype.guardar = function ($event, item) {
        var _this = this;
        $event.preventDefault();
        this.procesando = true;
        item.ItemProductos.forEach(function (itemProd) {
            item.Producto.ProductoStock.forEach(function (prodStock) {
                if (prodStock.Id === itemProd.IdProductoStock)
                    prodStock.CantidadPedido = itemProd.Cantidad;
            });
        });
        if (this.pedidoEnProceso()) {
            //si el pedido esta en proceso al grabar se confirma el item
            item.EstadoItem = this.ESTADO_ITEM_CONFIRTMADO;
        }
        this._pedidoServices.savePedidoItem(item).subscribe(function (response) {
            _this.procesando = false;
            if (response) {
                _this.showAlert('success', item.Id, 'El ítem del pedido se actualizó correctamente.');
                _this.inicializarControles();
            }
        }, function (error) {
            _this.procesando = false;
            _this.showAlert('danger', item.Id, 'Ocurrió un error al actualizar el ítem del pedido.');
            console.log(error);
        });
    };
    PedidoComponent.prototype.confirmarEliminacionItem = function ($event, item) {
        $event.preventDefault();
        this.entidadElimina = 'PEDIDO_ITEM';
        this.itemElimina = item;
        $('#modalConfirmaEliminacion').modal('show');
    };
    PedidoComponent.prototype.eliminar = function ($event) {
        var _this = this;
        $event.preventDefault();
        $('#modalConfirmaEliminacion').modal('hide');
        if (this.itemElimina) {
            this._pedidoServices.deletePedidoItem(this.itemElimina.Id).subscribe(function (response) {
                if (response) {
                    _this.showAlert('warning', _this.itemElimina.Id, 'El producto se eliminó correctamente.');
                    _this.inicializarControles();
                    _this.itemElimina = null;
                }
            }, function (error) { console.log(error); });
        }
    };
    PedidoComponent.prototype.cancelarEliminar = function ($event) {
        $event.preventDefault();
        this.itemElimina = null;
        $('#modalConfirmaEliminacion').modal('hide');
    };
    PedidoComponent.prototype.sumaCantidad = function (event, item) {
        event.preventDefault();
        if (this.verificarStock) {
            if (item.Cantidad < item.Producto.Stock) {
                item.Cantidad++;
                this.itemModificado(item);
                this.showAlert('warning', item.Id, 'Guardar cambios...');
            }
            else {
                this.showAlert('warning', item.Id, 'Stock dicponible: ' + item.Producto.Stock.toString());
            }
        }
        else {
            item.Cantidad++;
            this.itemModificado(item);
            this.showAlert('warning', item.Id, 'Guardar cambios...');
        }
    };
    PedidoComponent.prototype.restaCantidad = function (event, item) {
        event.preventDefault();
        if (item.Cantidad > 1)
            item.Cantidad--;
        this.itemModificado(item);
        this.showAlert('warning', item.Id, 'Guardar cambios...');
    };
    PedidoComponent.prototype.cantidadChanged = function (event, item) {
        event.preventDefault();
        if (this.verificarStock) {
            if (item.Cantidad < item.Producto.Stock) {
                this.itemModificado(item);
                if (item.Cantidad == null || item.Cantidad == 0)
                    item.Cantidad = 1;
                this.showAlert('warning', item.Id, 'Guardar cambios...');
            }
            else {
                item.Cantidad = item.Producto.Stock;
                this.showAlert('warning', item.Id, 'Stock dicponible: ' + item.Producto.Stock.toString());
            }
        }
        else {
            this.itemModificado(item);
            if (item.Cantidad == null || item.Cantidad == 0)
                item.Cantidad = 1;
            this.showAlert('warning', item.Id, 'Guardar cambios...');
        }
    };
    PedidoComponent.prototype.mostrarCantidadPorMedida = function (itemProd, prod) {
        var mostrar = true;
        if (this.pedidoIngresado() && itemProd.Cantidad === 0) {
            prod.ProductoStock.forEach(function (item) {
                if (item.Medida.Id === itemProd.Medida.Id) {
                    mostrar = item.StockDisponible > 0;
                }
            });
        }
        return mostrar;
    };
    PedidoComponent.prototype.sumaCantidadPorMedida = function (event, itemMedida, item) {
        event.preventDefault();
        if (this.verificarStock) {
            var prodStock = item.Producto.ProductoStock.filter(function (item) { return item.Id === itemMedida.IdProductoStock; })[0];
            if (itemMedida.Cantidad < prodStock.StockDisponible) {
                itemMedida.Cantidad++;
                this.itemModificado(item);
                this.showAlert('warning', item.Id, 'Guardar cambios...');
            }
            else {
                this.showAlertModalMedidas('warning', itemMedida.Id, 'Stock disponible: ' + prodStock.StockDisponible.toString());
            }
        }
        else {
            itemMedida.Cantidad++;
        }
    };
    PedidoComponent.prototype.restaCantidadMedida = function (event, itemMedida) {
        event.preventDefault();
        if (itemMedida.Cantidad > 0)
            itemMedida.Cantidad--;
    };
    PedidoComponent.prototype.verificarCantidadPorMedida = function (itemMedida, item) {
        if (this.verificarStock) {
            var prodStock = item.Producto.ProductoStock.filter(function (item) { return item.Id === itemMedida.IdProductoStock; })[0];
            if (itemMedida.Cantidad <= prodStock.StockDisponible) {
                this.itemModificado(item);
                this.showAlert('warning', item.Id, 'Guardar cambios...');
            }
            else {
                itemMedida.Cantidad = prodStock.Stock;
                this.showAlertModalMedidas('warning', itemMedida.Id, 'Stock disponible: ' + prodStock.StockDisponible.toString());
            }
        }
        else {
            this.itemModificado(item);
            this.showAlert('warning', item.Id, 'Guardar cambios...');
        }
    };
    PedidoComponent.prototype.onClickVerTodasLasMedidas = function (event) {
        event.preventDefault();
        this.verTodasLasMedidas = !this.verTodasLasMedidas;
    };
    PedidoComponent.prototype.mostrarBotonVerTodasLasMedidas = function (prod) {
        return prod.ProductoStock.length > 1 && this.pedido.Estado.Id > 1;
    };
    PedidoComponent.prototype.showAlertModalMedidas = function (tipoAlerta, idProductoStock, mensaje) {
        this.tipoAlerta = tipoAlerta;
        this.mensajeError = mensaje;
        this.productIdAlertaModalMedida = idProductoStock;
        console.log('productIdAlertaModalMedida', this.productIdAlertaModalMedida);
        $("#alertErrorMedidas_" + idProductoStock.toString())
            .fadeTo(2000, 500)
            .slideUp(500, function () {
            $("#alertErrorMedidas_" + idProductoStock.toString()).slideUp(500);
            this.mensajeError = '';
            this.productIdAlertaModalMedida = -1;
        });
    };
    PedidoComponent.prototype.obsrvacionesChanged = function ($event, item) {
        event.preventDefault();
        this.showAlert('warning', item.Id, 'Guardar cambios...');
    };
    PedidoComponent.prototype.itemModificado = function (item) {
        item.Modificado = true;
        this.registrarPedido_pouchDB();
    };
    PedidoComponent.prototype.estaComprando = function () {
        return this._IdCliente != -1;
    };
    PedidoComponent.prototype.estaArmandoPedido = function () {
        return this._IdPedido != -1;
    };
    PedidoComponent.prototype.pedidoIngresado = function () {
        return this.pedido.Estado != null && this.pedido.Estado.Id == 1; //INGRESADO
    };
    PedidoComponent.prototype.pedidoSolicitado = function () {
        return this.pedido.Estado != null && this.pedido.Estado.Id == 2; //SOLICITADO
    };
    PedidoComponent.prototype.pedidoEnProceso = function () {
        if (this.clienteLogin.Rol && this.clienteLogin.Rol.Id != 3)
            return this.pedido != null && this.pedido.Estado != null && (this.pedido.Estado.Id == 3 || this.pedido.Estado.Id == 8); // EN_PROCESO o PROVEEDOR
        else
            return false;
    };
    PedidoComponent.prototype.usuarioAdministrador = function () {
        if (this.clienteLogin.Rol && this.clienteLogin.Rol.Id != 3)
            return true;
        else
            return false;
    };
    PedidoComponent.prototype.esVentaMayorista = function () {
        var paramsVentaMayorista = localStorage.getItem('paramsVentaMayorista') != null ? localStorage.getItem('paramsVentaMayorista') : 'NO';
        return (paramsVentaMayorista == 'SI');
    };
    PedidoComponent.prototype.registrarEstadoItem = function ($event, item, estadoItem) {
        var _this = this;
        $event.preventDefault();
        item.EstadoItem = estadoItem;
        this._pedidoServices.savePedidoItemCambioEstado(item).subscribe(function (response) {
            if (response) {
                _this.showAlert('success', item.Id, 'El ítem se actualizó correctamente.');
                debugger;
                var _total_1 = 0;
                _this.pedido.Items.forEach(function (pi) {
                    if (pi.Id == response.Id) {
                        pi.Confirmado = response.Confirmado;
                        pi.Subtotal = response.Subtotal;
                    }
                    _total_1 = _total_1 + pi.Subtotal;
                });
                _this.pedido.Total = _total_1;
                _this.registrarPedido_pouchDB();
            }
        }, function (error) { console.log(error); });
    };
    PedidoComponent.prototype.registrarPedido_pouchDB = function () {
        var _this = this;
        this._pouchDBServices.get(this._idPedidoDB)
            .then(function (doc) {
            if (doc) {
                _this.pedido._id = _this._idPedidoDB;
                _this._pouchDBServices.update(_this.pedido);
            }
            else {
                _this._pouchDBServices.put(_this._idPedidoDB, _this.pedido);
            }
        })["catch"](function (err) {
            console.log(err);
            _this._pouchDBServices.put(_this._idPedidoDB, _this.pedido);
        });
    };
    PedidoComponent.prototype.showAlert = function (tipoAlerta, idItem, mensaje) {
        this.productIdAlertaModalMedida = -1;
        this.tipoAlerta = tipoAlerta;
        this.mensajeError = mensaje;
        this.itemAlerta = idItem;
        $("#alertError_" + idItem.toString())
            .fadeTo(2000, 500)
            .slideUp(500, function () {
            $("#alertError_" + idItem.toString()).slideUp(500);
            this.mensajeError = '';
            this.itemAlerta = -1;
        });
    };
    PedidoComponent = __decorate([
        core_1.Component({
            selector: 'pedido',
            templateUrl: './pedido.component.html',
            styleUrls: ['./pedido.component.css'],
            providers: [pouch_db_services_1.PouchDBServices, pedido_service_1.PedidoService]
        })
    ], PedidoComponent);
    return PedidoComponent;
}());
exports.PedidoComponent = PedidoComponent;
