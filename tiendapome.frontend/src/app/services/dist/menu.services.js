"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MenuServices = void 0;
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var MenuServices = /** @class */ (function () {
    function MenuServices(_http, _globalService) {
        this._http = _http;
        this._globalService = _globalService;
        this.url = _globalService.url;
        //this.url = sessionStorage.getItem('UrlApi');
    }
    MenuServices.prototype.getMenu = function () {
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url + 'tipo', { headers: headers });
    };
    MenuServices.prototype.getTiposABM = function () {
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url + 'tipo/listarabm', { headers: headers });
    };
    MenuServices.prototype.getItemMenu = function (id) {
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url + 'tipo/' + id, { headers: headers });
    };
    MenuServices.prototype.saveItemMenu = function (item) {
        var params = JSON.stringify(item);
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + 'tipo', params, { headers: headers });
    };
    MenuServices.prototype.deleteItemMenu = function (idTipo) {
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + 'tipo/eliminar?id=' + idTipo, { headers: headers });
    };
    MenuServices.prototype.getItemSubcategoria = function (id) {
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url + 'subcategoria/' + id, { headers: headers });
    };
    MenuServices.prototype.saveCategoria = function (item) {
        var params = JSON.stringify(item);
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + 'categoria', params, { headers: headers });
    };
    MenuServices.prototype.deleteCategoria = function (idCategoria) {
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + 'categoria/eliminar?id=' + idCategoria, { headers: headers });
    };
    MenuServices.prototype.saveSubcategoria = function (item) {
        var params = JSON.stringify(item);
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + 'subcategoria', params, { headers: headers });
    };
    MenuServices.prototype.deleteSubcategoria = function (idSubcategoria) {
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + 'subcategoria/eliminar?id=' + idSubcategoria, { headers: headers });
    };
    MenuServices.prototype.getMedidas = function () {
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url + 'catalogo/medida', { headers: headers });
    };
    MenuServices = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], MenuServices);
    return MenuServices;
}());
exports.MenuServices = MenuServices;
