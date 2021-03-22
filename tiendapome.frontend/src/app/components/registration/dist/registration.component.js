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
exports.RegistrationComponent = void 0;
var core_1 = require("@angular/core");
var cliente_1 = require("../../models/cliente");
var RegistrationComponent = /** @class */ (function () {
    function RegistrationComponent(_clientesServices, _parametroServices, _router, _autenticaServices, _pouchDBServices) {
        this._clientesServices = _clientesServices;
        this._parametroServices = _parametroServices;
        this._router = _router;
        this._autenticaServices = _autenticaServices;
        this._pouchDBServices = _pouchDBServices;
        this.mensajeAlert = '';
        this.leyendaConfirmaRegistro = '';
        this.leyendaErrorRegistro = '';
        this.mostrarBtnMayorista = false;
        this.ingresando = false;
    }
    RegistrationComponent.prototype.ngOnInit = function () {
        this.cliente = new cliente_1.Cliente();
        this.inicializarControles();
    };
    RegistrationComponent.prototype.inicializarControles = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.obtenerLeyenda()
                            .then(function (result) {
                            _this.leyendaConfirmaRegistro = result.Valor;
                            return _this.obtenerVariableMostrarBtnMayorista();
                        })
                            .then(function (result) {
                            if (result)
                                _this.mostrarBtnMayorista = (result.Valor == 'SI');
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    RegistrationComponent.prototype.obtenerLeyenda = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._parametroServices.getParametroValor('LEYENDA_REGISTRO').subscribe(function (response) { resolve(response); }, function (error) { reject(error); });
        });
    };
    RegistrationComponent.prototype.obtenerVariableMostrarBtnMayorista = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._parametroServices.getParametroValor('REGISTRO_BTN_MAYORISTA').subscribe(function (response) { resolve(response); }, function (error) { reject(error); });
        });
    };
    RegistrationComponent.prototype.registrarUsuarioMayorista = function ($event) {
        $event.preventDefault();
        if (this.cliente) {
            this.cliente.AsignarListaMayorista = true;
            this.actualizarCliente();
        }
    };
    RegistrationComponent.prototype.registrarUsuario = function ($event) {
        $event.preventDefault();
        if (this.cliente) {
            this.cliente.AsignarListaMayorista = false;
            this.actualizarCliente();
        }
    };
    RegistrationComponent.prototype.actualizarCliente = function () {
        var _this = this;
        this.cliente.Rol.Id = 3;
        this.cliente.Vigente = true;
        console.log('this.cliente', this.cliente);
        var validacionOK = true;
        this.leyendaErrorRegistro = '';
        if (!this.cliente.Email || this.cliente.Email == '') {
            validacionOK = false;
            this.todoOK = false;
            this.ocurrioError = false;
            this.leyendaErrorRegistro += 'un email - ';
            $('#modalConfirmaRegistro').modal('show');
        }
        if (!this.cliente.Codigo || this.cliente.Codigo == '') {
            validacionOK = false;
            this.todoOK = false;
            this.ocurrioError = false;
            this.leyendaErrorRegistro += 'una contraseña - ';
            $('#modalConfirmaRegistro').modal('show');
        }
        if (!this.cliente.Celular || this.cliente.Celular == '') {
            validacionOK = false;
            this.todoOK = false;
            this.ocurrioError = false;
            this.leyendaErrorRegistro += 'un celular - ';
            $('#modalConfirmaRegistro').modal('show');
        }
        if (!validacionOK) {
            this.todoOK = false;
            this.ocurrioError = false;
            this.leyendaErrorRegistro = 'Para registrarte en la app insgresá ' + this.leyendaErrorRegistro;
            $('#modalConfirmaRegistro').modal('show');
        }
        else {
            if (this.cliente.Codigo != this.claveRepetida) {
                validacionOK = false;
                this.todoOK = false;
                this.ocurrioError = false;
                this.leyendaErrorRegistro = 'Verificá los datos ingresados, las claves deben ser iguales.';
                $('#modalConfirmaRegistro').modal('show');
            }
            else {
                this._clientesServices.saveCliente(this.cliente).subscribe(function (response) {
                    _this.todoOK = true;
                    $('#modalConfirmaRegistro').modal('show');
                }, function (error) {
                    _this.todoOK = false;
                    _this.ocurrioError = true;
                    console.log(error);
                    _this.leyendaErrorRegistro = error.error.Message;
                    $('#modalConfirmaRegistro').modal('show');
                });
            }
        }
    };
    RegistrationComponent.prototype.cerrarConfirmacion = function ($event) {
        var _this = this;
        $event.preventDefault();
        if (this.todoOK) {
            this.ingresando = true;
            this._autenticaServices.login(this.cliente.Email, this.cliente.Codigo).subscribe(function (response) {
                if (response) {
                    _this.clienteLogin = response;
                    _this._autenticaServices.setClienteLoguin(_this.clienteLogin);
                    _this._autenticaServices.registrarPedido(_this.clienteLogin)
                        .then(function (result) {
                        return _this._autenticaServices.registrarUsuario(_this.clienteLogin);
                    })
                        .then(function (result) {
                        _this.ingresando = false;
                        if (_this.clienteLogin.Rol.Id == 3) {
                            var reqLanding_HashHref = localStorage.getItem('reqLanding_HashHref') ? localStorage.getItem('reqLanding_HashHref') : '';
                            if (reqLanding_HashHref != '')
                                _this._router.navigate(['/' + reqLanding_HashHref.substr(1)]);
                            else
                                _this._router.navigate(['/carrito']);
                        }
                        else
                            _this._router.navigate(['/backoffice']);
                    })["catch"](function (err) {
                        _this.ingresando = false;
                        console.error(err);
                    });
                }
            }, function (error) {
                _this.ingresando = false;
                _this.todoOK = false;
                _this.ocurrioError = true;
                console.log(error);
                _this.leyendaErrorRegistro = error.error.Message;
                $('#modalConfirmaRegistro').modal('show');
            });
        }
    };
    RegistrationComponent = __decorate([
        core_1.Component({
            selector: 'app-registration',
            templateUrl: './registration.component.html',
            styleUrls: ['./registration.component.css']
        })
    ], RegistrationComponent);
    return RegistrationComponent;
}());
exports.RegistrationComponent = RegistrationComponent;
