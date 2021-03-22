"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Routing = exports.AppRoutingProviders = exports.AppRoutingModule = void 0;
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var menuproductos_component_1 = require("./components/menuproductos/menuproductos.component");
var productos_component_1 = require("./components/productos/productos.component");
var listaprecios_component_1 = require("./components/listaprecios/listaprecios.component");
var homebackoffice_component_1 = require("./components/homebackoffice/homebackoffice.component");
var parametro_component_1 = require("./components/parametro/parametro.component");
var pedido_component_1 = require("./components/pedido/pedido.component");
var settingproductos_component_1 = require("./components/settingproductos/settingproductos.component");
var settingclientes_component_1 = require("./components/settingclientes/settingclientes.component");
var pedidoslist_component_1 = require("./components/pedidoslist/pedidoslist.component");
var login_component_1 = require("./components/login/login.component");
var autorizado_guard_1 = require("./guards/autorizado.guard");
var notifica_component_1 = require("./components/notifica/notifica.component");
var registration_component_1 = require("./components/registration/registration.component");
var settingcotizaciones_component_1 = require("./components/settingcotizaciones/settingcotizaciones.component");
var pedidoslistclientes_component_1 = require("./components/pedidoslistclientes/pedidoslistclientes.component");
var mantenimiento_component_1 = require("./components/mantenimiento/mantenimiento.component");
var listadoventas_component_1 = require("./pages/listadoventas/listadoventas.component");
var recibo_component_1 = require("./pages/recibo/recibo.component");
var documentoventa_component_1 = require("./pages/documentoventa/documentoventa.component");
var routes = [
    { path: '', component: menuproductos_component_1.MenuproductosComponent },
    { path: 'home', component: menuproductos_component_1.MenuproductosComponent },
    { path: 'menu', component: menuproductos_component_1.MenuproductosComponent },
    { path: 'menu/:tipo/:categoria', component: menuproductos_component_1.MenuproductosComponent },
    { path: 'carrito', component: menuproductos_component_1.MenuproductosComponent },
    { path: 'productos/:conStock/:subcategoria/:textobuscar', component: productos_component_1.ProductosComponent },
    { path: 'productos/:conStock/:subcategoria/:textobuscar/:reqlanding', component: productos_component_1.ProductosComponent },
    { path: 'pedido/:idPedido/:idCliente', component: pedido_component_1.PedidoComponent, canActivate: [autorizado_guard_1.AutorizadoGuard] },
    { path: 'verpedido/:idPedido/:idCliente', component: pedido_component_1.PedidoComponent, canActivate: [autorizado_guard_1.AutorizadoGuard] },
    { path: 'backoffice', component: homebackoffice_component_1.HomebackofficeComponent, canActivate: [autorizado_guard_1.AutorizadoGuard] },
    { path: 'listasprecio', component: listaprecios_component_1.ListapreciosComponent, canActivate: [autorizado_guard_1.AutorizadoGuard] },
    { path: 'parametro', component: parametro_component_1.ParametroComponent, canActivate: [autorizado_guard_1.AutorizadoGuard] },
    { path: 'productosbo', component: settingproductos_component_1.SettingproductosComponent, canActivate: [autorizado_guard_1.AutorizadoGuard] },
    { path: 'clientesbo', component: settingclientes_component_1.SettingclientesComponent, canActivate: [autorizado_guard_1.AutorizadoGuard] },
    { path: 'pedidoslist', component: pedidoslist_component_1.PedidoslistComponent, canActivate: [autorizado_guard_1.AutorizadoGuard] },
    { path: 'pedidoscliente', component: pedidoslistclientes_component_1.PedidoslistclientesComponent, canActivate: [autorizado_guard_1.AutorizadoGuard] },
    { path: 'cotizacionesbo', component: settingcotizaciones_component_1.SettingcotizacionesComponent, canActivate: [autorizado_guard_1.AutorizadoGuard] },
    { path: 'notifica/:tipo/:clave', component: notifica_component_1.NotificaComponent },
    { path: 'login', component: login_component_1.LoginComponent },
    { path: 'registra', component: registration_component_1.RegistrationComponent },
    { path: 'registra/:reqlanding', component: registration_component_1.RegistrationComponent },
    { path: 'mantenimiento', component: mantenimiento_component_1.MantenimientoComponent },
    { path: 'ventaslist', component: listadoventas_component_1.ListadoventasComponent },
    { path: 'ventaslist/:cargarListados', component: listadoventas_component_1.ListadoventasComponent },
    { path: 'documentoventa/:tipoComprobante', component: documentoventa_component_1.DocumentoventaComponent },
    { path: 'documentoventa/:tipoComprobante/:idDocumentoVenta', component: documentoventa_component_1.DocumentoventaComponent },
    { path: 'recibo', component: recibo_component_1.ReciboComponent },
    { path: 'recibo/:idDocumenotVenta', component: recibo_component_1.ReciboComponent },
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        core_1.NgModule({
            imports: [
                router_1.RouterModule.forRoot(routes, { useHash: true }),
            ],
            exports: [router_1.RouterModule]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());
exports.AppRoutingModule = AppRoutingModule;
exports.AppRoutingProviders = [];
exports.Routing = router_1.RouterModule.forRoot(routes);
