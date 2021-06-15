"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PedidoService = void 0;
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var PedidoService = /** @class */ (function () {
    function PedidoService(_http, _globalService) {
        this._http = _http;
        this._globalService = _globalService;
        this.url = _globalService.url;
        //this.url = sessionStorage.getItem('UrlApi');
    }
    PedidoService.prototype.getPedido = function (id) {
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        console.log('this.urlpedido/id', this.url + 'pedido/' + id);
        return this._http.get(this.url + 'pedido/' + id, { headers: headers });
    };
    PedidoService.prototype.getPedidoObtener = function (id, numeroPagina, cantidadRegistros) {
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        var urlParams = '/' + id + '/' + numeroPagina + '/' + cantidadRegistros;
        return this._http.get(this.url + 'pedido/obtener' + urlParams, { headers: headers });
    };
    PedidoService.prototype.getPedidoClienteIngresado = function (idCliente, numeroPagina, cantidadRegistros) {
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        var urlParams = '/' + idCliente;
        console.log(this.url + 'pedido/cliente' + urlParams);
        return this._http.get(this.url + 'pedido/cliente' + urlParams, { headers: headers });
    };
    PedidoService.prototype.savePedido = function (pedido) {
        var params = JSON.stringify(pedido);
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + 'pedido', params, { headers: headers });
    };
    PedidoService.prototype.savePedidoProveedor = function (pedido) {
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + 'Pedido/Proveedor/' + pedido.Id, { headers: headers });
    };
    PedidoService.prototype.savePedidoItem = function (item) {
        var params = JSON.stringify(item);
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + 'pedidoitem', params, { headers: headers });
    };
    PedidoService.prototype.savePedidoItemCambioEstado = function (item) {
        var params = JSON.stringify(item);
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + 'pedidoitem/cambioestado', params, { headers: headers });
    };
    PedidoService.prototype.deletePedidoItem = function (id) {
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + 'pedidoitem/eliminar/' + id, { headers: headers });
    };
    PedidoService.prototype.avanzarPedido = function (pedido) {
        var params = JSON.stringify(pedido);
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + 'pedido/avanzar', params, { headers: headers });
    };
    PedidoService.prototype.crearPedido = function (idCliente) {
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + 'pedido/crear/' + idCliente, { headers: headers });
    };
    PedidoService.prototype.liberarStockPedido = function (idPedido) {
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + 'pedido/liberarstock/' + idPedido, { headers: headers });
    };
    PedidoService.prototype.cancelarPedido = function (idPedido) {
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + 'pedido/cancelar/' + idPedido, { headers: headers });
    };
    PedidoService.prototype.getPedidosList = function (estados, idCliente, fechaDesde, fechaHasta) {
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        var paramEstados = 'estados=' + estados;
        var paramCliente = '&idCliente=' + idCliente;
        var paramDesde = '&fechaDesde=' + fechaDesde;
        var paramHasta = '&fechaHasta=' + fechaHasta;
        console.log(this.url + 'pedido/List?' + paramEstados + paramCliente + paramDesde + paramHasta);
        return this._http.get(this.url + 'pedido/List?' + paramEstados + paramCliente + paramDesde + paramHasta, { headers: headers });
    };
    PedidoService.prototype.getPedidosListPaginado = function (estados, idCliente, fechaDesde, fechaHasta, numeroPagina, cantidadRegistros) {
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        var paramEstados = 'estados=' + estados;
        var paramCliente = '&idCliente=' + idCliente;
        var paramDesde = '&fechaDesde=' + fechaDesde;
        var paramHasta = '&fechaHasta=' + fechaHasta;
        var paramsPagina = '&numeroPagina=' + numeroPagina;
        var paramsRegistros = '&cantidadRegistros=' + cantidadRegistros;
        var urlAPI = this.url + 'pedido/ListPaginado?' + paramEstados + paramCliente + paramDesde + paramHasta + paramsPagina + paramsRegistros;
        console.log(urlAPI);
        return this._http.get(urlAPI, { headers: headers });
    };
    PedidoService.prototype.getEstados = function () {
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url + 'catalogo/estados', { headers: headers });
    };
    PedidoService.prototype.exportListadoEtiquetas = function (idPedido) {
        var urlAPI = 'https://tradingjoyas.com/backend/api/pedido/listadoetiquetas?idPedido=' + idPedido;
        console.log(urlAPI);
        window.open(urlAPI, '_blank');
    };
    PedidoService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], PedidoService);
    return PedidoService;
}());
exports.PedidoService = PedidoService;
