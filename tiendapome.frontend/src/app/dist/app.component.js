"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppComponent = void 0;
var core_1 = require("@angular/core");
var AppComponent = /** @class */ (function () {
    function AppComponent(_route, _autenticaService, _parametroServices, _router, _zone, _pouchDBServices) {
        this._route = _route;
        this._autenticaService = _autenticaService;
        this._parametroServices = _parametroServices;
        this._router = _router;
        this._zone = _zone;
        this._pouchDBServices = _pouchDBServices;
        this.title = 'tiendapome';
        this._idUserDB = 'USER_01';
        this.textoBuscar = '';
        this.panelInstalar = true;
        this.textIOS = '';
        this.reqLanding = false;
        // this._globalService.inicializar();
        // this._titleService.setTitle( this._globalService.TittleIndex );
    }
    AppComponent.prototype.onbeforeinstallprompt = function (e) {
        console.log(e);
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        this.deferredPrompt = e;
        //si estamos con un celular
        //if (this.isMobile() && !this.appInstalada()) {
        if (this.isMobile()) {
            $('#modalInstall').modal('show');
        }
    };
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.reqLanding = window.location.hash.endsWith('jqmlndng1973');
        if (window.location.protocol != 'https:' && window.location.hostname != 'localhost') {
            window.location.href = 'https://' + window.location.hostname + window.location.pathname + window.location.hash;
        }
        else {
            this.verificarInstalacionIPhone();
            this.clienteLogin = null;
            this.identificado = false;
            this._pouchDBServices.cambios();
            this._pouchDBServices.getChangeListener().subscribe(function (data) {
                _this._zone.run(function () {
                    //this._router.navigate(['/mantenimiento']);
                    _this.verificarUsuario();
                });
            });
            this.verificarUsuario();
        }
    };
    AppComponent.prototype.appInstalada = function () {
        var versionAPP = localStorage.getItem("versionAPP") ? localStorage.getItem("versionAPP") : '';
        return (versionAPP != '');
    };
    AppComponent.prototype.verificarInstalacionIPhone = function () {
        //si estamos con un celular y no esta instalada
        if (this.isMobile() && !this.appInstalada()) {
            var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            if (isIOS) {
                this.textIOS = navigator.userAgent + 'isIOS => ' + (isIOS ? 'true' : 'false');
                $('#modalIPhone').modal('show');
            }
        }
    };
    AppComponent.prototype.instalarAPP = function (event) {
        var _this = this;
        event.preventDefault();
        localStorage.setItem('versionAPP', 'VERSION_INICIAL');
        $('#modalInstall').modal('hide');
        // Show the prompt
        this.deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        this.deferredPrompt.userChoice
            .then(function (choiceResult) {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
            }
            else {
                console.log('User dismissed the A2HS prompt');
            }
            _this.deferredPrompt = null;
        });
    };
    AppComponent.prototype.cancelarInstalacionANDROID = function (event) {
        event.preventDefault();
        localStorage.setItem('versionAPP', 'VERSION_INICIAL');
        $('#modalInstall').modal('hide');
    };
    AppComponent.prototype.cancelarInstalacionIOS = function (event) {
        event.preventDefault();
        localStorage.setItem('versionAPP', 'VERSION_INICIAL');
        $('#modalIPhone').modal('hide');
    };
    //por defecto que entre al carrito
    AppComponent.prototype.esRolCliente = function () {
        var valor = false;
        if (this.clienteLogin)
            valor = (this.clienteLogin.Rol.Id == 3);
        return valor;
    };
    //por defecto que entre al carrito
    AppComponent.prototype.esRolAdministrador = function () {
        var valor = false;
        if (this.clienteLogin)
            valor = (this.clienteLogin.Rol.Id == 1);
        return valor;
    };
    AppComponent.prototype.verificarUsuario = function () {
        this.clienteLogin = this._autenticaService.getClienteLoguin();
        if (this.clienteLogin != null) {
            this.identificado = true;
        }
        else {
            this.identificado = false;
            if (!this.reqLanding)
                this._router.navigate(['/carrito']);
        }
    };
    AppComponent.prototype.irAlCarrito = function ($event) {
        $event.preventDefault();
        this._router.navigate(['/pedido/-1/' + this.clienteLogin.Id]);
    };
    AppComponent.prototype.cerrarSesion = function ($event) {
        var _this = this;
        $event.preventDefault();
        this.clienteLogin = null;
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
    AppComponent.prototype.enviarWhatsApp = function ($event) {
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
    AppComponent.prototype.isMobile = function () {
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
    __decorate([
        core_1.HostListener('window:beforeinstallprompt', ['$event'])
    ], AppComponent.prototype, "onbeforeinstallprompt");
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app-root',
            templateUrl: './app.component.html',
            styleUrls: ['./app.component.css']
        })
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
