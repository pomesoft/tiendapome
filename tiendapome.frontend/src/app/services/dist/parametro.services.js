"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ParametroServices = void 0;
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var ParametroServices = /** @class */ (function () {
    function ParametroServices(_http, _pouchDBServices, _globalService) {
        this._http = _http;
        this._pouchDBServices = _pouchDBServices;
        this._globalService = _globalService;
        this._idParamsDB = 'PARAMS_01';
        this.url = _globalService.url;
        //this.url = sessionStorage.getItem('UrlApi');
    }
    ParametroServices.prototype.getParametrosApp = function () {
        return this._http.get('../../assets/data/params.json');
    };
    ParametroServices.prototype.getParametroValor = function (clave) {
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url + 'parametro' + '/valor/' + clave, { headers: headers });
    };
    ParametroServices.prototype.getParametroValorCache = function (clave) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var paramReturn;
            _this._pouchDBServices.get(_this._idParamsDB)
                .the(function (doc) {
                if (doc) {
                    console.log('getParametroValorCache() => doc', doc);
                    resolve();
                }
                else {
                    _this.getAllParametros()
                        .then(function (response) {
                        console.log('getParametroValorCache() => response', response);
                        resolve();
                    })["catch"](function (err) { return console.error(err); });
                }
            })["catch"](function (err) {
                if (err.status == 404) {
                    _this.getAllParametros()
                        .then(function (response) {
                        console.log('getParametroValorCache() => response', response);
                        resolve();
                    })["catch"](function (err) { return console.error(err); });
                }
                else {
                    reject(err);
                }
            });
        });
    };
    ParametroServices.prototype.getAllParametros = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getParametros().subscribe(function (response) {
                _this._pouchDBServices.get(_this._idParamsDB)
                    .then(function (doc) {
                    if (doc) {
                        response._id = _this._idParamsDB;
                        _this._pouchDBServices.update(response);
                    }
                    else {
                        _this._pouchDBServices.put(_this._idParamsDB, response);
                    }
                    resolve(response);
                })["catch"](function (err) {
                    if (err.status == 404) {
                        _this._pouchDBServices.put(_this._idParamsDB, response);
                        resolve(response);
                    }
                    else {
                        reject(err);
                    }
                });
            }, function (error) { reject(error); });
        });
    };
    ParametroServices.prototype.getParametros = function () {
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url + 'parametro', { headers: headers });
    };
    ParametroServices.prototype.getParametro = function (id) {
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url + 'parametro' + '/' + id, { headers: headers });
    };
    ParametroServices.prototype.saveParametro = function (parametro) {
        var params = JSON.stringify(parametro);
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + 'parametro', params, { headers: headers });
    };
    ParametroServices = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], ParametroServices);
    return ParametroServices;
}());
exports.ParametroServices = ParametroServices;
