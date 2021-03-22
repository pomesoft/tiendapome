"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ProductoServices = void 0;
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var ProductoServices = /** @class */ (function () {
    function ProductoServices(_http, _globalService) {
        this._http = _http;
        this._globalService = _globalService;
        this.url = _globalService.url + 'producto';
        //this.url = sessionStorage.getItem('UrlApi') + 'producto';
    }
    ProductoServices.prototype.getProductosABM = function (subCategoria, tipoListado, numeroPagina, cantidadRegistros) {
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        var urlParams;
        urlParams = '/' + subCategoria + '/' + tipoListado + '/' + numeroPagina + '/' + cantidadRegistros;
        //console.log(this.url + '/listarabm' + urlParams);
        return this._http.get(this.url + '/listarabm' + urlParams, { headers: headers });
    };
    //este se utiliza desde el carrito
    ProductoServices.prototype.getProductos = function (conStock, subCategoria, textoBuscar, cliente, numeroPagina, cantidadRegistros) {
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        var urlParams;
        urlParams =
            '/' + conStock +
                '/' + subCategoria +
                '/' + textoBuscar +
                '/' + cliente +
                '/' + numeroPagina +
                '/' + cantidadRegistros;
        //console.log(this.url + '/listarbusqueda' + + urlParams);
        return this._http.get(this.url + '/listarbusqueda' + urlParams, { headers: headers });
    };
    //este se utiliza buscar producto por codigo y devuelva el precio del cliente
    //[Route("api/producto/buscarcodigo/{conStock}/{codigo}/{cliente}")]
    ProductoServices.prototype.getProductoCodigo = function (conStock, codigo, cliente) {
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        var urlParams;
        urlParams = '/' + conStock + '/' + codigo + '/' + cliente;
        console.log(this.url + '/buscarcodigo' + +urlParams);
        return this._http.get(this.url + '/buscarcodigo' + urlParams, { headers: headers });
    };
    ProductoServices.prototype.getAllProductos = function () {
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url, { headers: headers });
    };
    //este buscar se utiliza desde el ABM de Productos
    ProductoServices.prototype.searchProductos = function (buscar, soloCodigo, numeroPagina, cantidadRegistros) {
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        var urlParams;
        urlParams = '/' + buscar +
            '/' + soloCodigo +
            '/' + numeroPagina +
            '/' + cantidadRegistros;
        return this._http.get(this.url + '/buscar' + urlParams, { headers: headers });
    };
    ProductoServices.prototype.getProducto = function (id) {
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url + '/' + id, { headers: headers });
    };
    ProductoServices.prototype.saveProducto = function (prod) {
        var params = JSON.stringify(prod);
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url, params, { headers: headers });
    };
    ProductoServices.prototype.deleteProducto = function (id) {
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        //return this._http.delete(this.url + '/' + id, { headers: headers });
        return this._http.post(this.url + '/eliminar/' + id, { headers: headers });
    };
    ProductoServices.prototype.printListadoProductos = function (idSubcategoria, tipoListado) {
        var urlAPI = 'https://backend.tradingjoyas.com/api/producto/listadoproductos?idSubcategoria=' + idSubcategoria + '&tipoListado=' + tipoListado;
        console.log(urlAPI);
        window.open(urlAPI, '_blank');
    };
    ProductoServices = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], ProductoServices);
    return ProductoServices;
}());
exports.ProductoServices = ProductoServices;
