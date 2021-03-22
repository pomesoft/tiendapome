"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.LoginComponent = void 0;
var core_1 = require("@angular/core");
var LoginComponent = /** @class */ (function () {
    function LoginComponent(_autenticaServices, _pouchDBServices, _router, _clienteService, _pedidoServices) {
        this._autenticaServices = _autenticaServices;
        this._pouchDBServices = _pouchDBServices;
        this._router = _router;
        this._clienteService = _clienteService;
        this._pedidoServices = _pedidoServices;
        this.mensajeError = '';
        this.versionAPP = '';
        this.ingresando = false;
        this.usuario = '';
        this.clave = '';
    }
    LoginComponent.prototype.ngOnInit = function () {
        $("#alertError").hide();
        this.versionAPP = localStorage.getItem("versionAPP") ? localStorage.getItem("versionAPP") : '';
    };
    LoginComponent.prototype.verificarUsuarioBackEnd = function ($event) {
        var _this = this;
        $event.preventDefault();
        if (this.usuario != '' && this.clave != '') {
            this.ingresando = true;
            this._autenticaServices.login(this.usuario, this.clave).subscribe(function (response) {
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
                _this.showAlert(error.error.Message);
                console.error(error);
            });
        }
    };
    LoginComponent.prototype.ocurrioError = function () {
        return this.mensajeError.length > 0;
    };
    LoginComponent.prototype.showAlert = function (mensaje) {
        this.mensajeError = mensaje;
        $("#alertError").fadeTo(2000, 500).slideUp(500, function () {
            $("#alertError").slideUp(1500);
        });
    };
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'login',
            templateUrl: './login.component.html',
            styleUrls: ['./login.component.css']
        })
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
