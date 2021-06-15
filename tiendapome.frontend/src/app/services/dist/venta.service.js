"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.DocumentoVentaService = void 0;
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var DocumentoVentaService = /** @class */ (function () {
    function DocumentoVentaService(_http, _globalService) {
        this._http = _http;
        this._globalService = _globalService;
        this.headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        this.url = _globalService.url;
    }
    DocumentoVentaService.prototype.getDocumentosVentas = function (idUsuario, idCliente, fechaDesde, fechaHasta, numeroPagina, cantidadRegistros, tipoListado) {
        var paramsPagina = 'numeroPagina=' + numeroPagina;
        var paramsRegistros = '&cantidadRegistros=' + cantidadRegistros;
        var paramDesde = '&fechaDesde=' + fechaDesde;
        var paramHasta = '&fechaHasta=' + fechaHasta;
        var paramUsuario = '&idUsuario=' + idUsuario;
        var paramCliente = '&idCliente=' + idCliente;
        var paramDocsPendientes = '&tipoListado=' + tipoListado;
        var urlAPI = this.url + 'venta/listpaginado?' + paramsPagina + paramsRegistros + paramDesde + paramHasta + paramUsuario + paramCliente + paramDocsPendientes;
        //console.log(urlAPI);
        return this._http.get(urlAPI, { headers: this.headers });
    };
    DocumentoVentaService.prototype.getSaldoIniciaCliente = function (idCliente, fecha) {
        var paramCliente = 'idCliente=' + idCliente;
        var paramDesde = '&fecha=' + fecha;
        var urlAPI = this.url + 'venta/saldoinicialcliente?' + paramCliente + paramDesde;
        console.log(urlAPI);
        return this._http.get(urlAPI, { headers: this.headers });
    };
    DocumentoVentaService.prototype.getDocumentoVenta = function (id) {
        return this._http.get(this.url + 'venta/' + id, { headers: this.headers });
    };
    DocumentoVentaService.prototype.saveDocVenta = function (docVenta) {
        var params = JSON.stringify(docVenta);
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + 'venta', params, { headers: headers });
    };
    DocumentoVentaService.prototype.saveItemNotaPedido = function (item) {
        var params = JSON.stringify(item);
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + 'venta/item', params, { headers: headers });
    };
    DocumentoVentaService.prototype.deleteItemNotaPedido = function (item) {
        var params = JSON.stringify(item);
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        console.log(this.url + 'venta/eliminaritem');
        return this._http.post(this.url + 'venta/eliminaritem', params, { headers: headers });
    };
    DocumentoVentaService.prototype.saveNotaPedidoFacturarPedido = function (docVenta) {
        var params = JSON.stringify(docVenta);
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + 'venta/facturarpedido', params, { headers: headers });
    };
    DocumentoVentaService.prototype.saveNotaPedidoFacturarProducto = function (producto) {
        var params = JSON.stringify(producto);
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + 'venta/facturarproducto', params, { headers: headers });
    };
    DocumentoVentaService.prototype.saveComprobanteAnulado = function (docVenta) {
        var params = JSON.stringify(docVenta);
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + 'venta/anular', params, { headers: headers });
    };
    DocumentoVentaService.prototype.getTipoComprobante = function (idTipoComprobante) {
        var urlAPI = this.url + 'venta/tipocomprobate/' + idTipoComprobante;
        console.log(urlAPI);
        return this._http.get(urlAPI, { headers: this.headers });
    };
    DocumentoVentaService.prototype.printNotaPedido = function (idVenta) {
        //let urlAPI: string = 'https://tiendapome.com.ar/api/venta/imprimirnp?idVenta=' + idVenta
        var urlAPI = 'https://tradingjoyas.com/backend/api/venta/imprimirnp?idVenta=' + idVenta;
        console.log(urlAPI);
        window.open(urlAPI, '_blank');
    };
    DocumentoVentaService.prototype.printCtaCte = function (idCliente, fechaDesde, fechaHasta) {
        var urlAPI = 'https://tradingjoyas.com/backend/api/venta/exportctacte?fechaDesde=' + fechaDesde + '&fechaHasta=' + fechaHasta + '&idCliente=' + idCliente;
        console.log(urlAPI);
        window.open(urlAPI, '_blank');
    };
    DocumentoVentaService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], DocumentoVentaService);
    return DocumentoVentaService;
}());
exports.DocumentoVentaService = DocumentoVentaService;
