import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { MenuproductosComponent } from './components/menuproductos/menuproductos.component';
import { ProductosComponent } from './components/productos/productos.component';
import { ListapreciosComponent } from './components/listaprecios/listaprecios.component';
import { HomebackofficeComponent } from './components/homebackoffice/homebackoffice.component';
import { ParametroComponent } from './components/parametro/parametro.component';
import { PedidoComponent } from './components/pedido/pedido.component';
import { SettingproductosComponent } from './components/settingproductos/settingproductos.component';
import { SettingclientesComponent } from './components/settingclientes/settingclientes.component';
import { PedidoslistComponent } from './components/pedidoslist/pedidoslist.component';
import { LoginComponent } from './components/login/login.component';
import { AutorizadoGuard } from './guards/autorizado.guard';
import { NotificaComponent } from './components/notifica/notifica.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { SettingcotizacionesComponent } from './components/settingcotizaciones/settingcotizaciones.component';
import { PedidoslistclientesComponent } from './components/pedidoslistclientes/pedidoslistclientes.component';
import { MantenimientoComponent } from './components/mantenimiento/mantenimiento.component';

import { ListadoventasComponent } from './pages/listadoventas/listadoventas.component';
import { ReciboComponent } from './pages/recibo/recibo.component';
import { DocumentoventaComponent } from './pages/documentoventa/documentoventa.component';
import { SettingtiposComponent } from './pages/settingtipos/settingtipos.component';




const routes: Routes = [
      { path: '', component: MenuproductosComponent },
      { path: 'home', component: MenuproductosComponent },

      { path: 'menu', component: MenuproductosComponent },
      { path: 'menu/:tipo/:categoria', component: MenuproductosComponent },

      { path: 'carrito', component: MenuproductosComponent },

      { path: 'productos/:conStock/:subcategoria/:textobuscar', component: ProductosComponent },
      { path: 'productos/:conStock/:subcategoria/:textobuscar/:reqlanding', component: ProductosComponent },


      { path: 'pedido/:idPedido/:idCliente', component: PedidoComponent, canActivate: [AutorizadoGuard] },
      { path: 'verpedido/:idPedido/:idCliente', component: PedidoComponent, canActivate: [AutorizadoGuard] },

      { path: 'backoffice', component: HomebackofficeComponent, canActivate: [AutorizadoGuard] },
      { path: 'listasprecio', component: ListapreciosComponent, canActivate: [AutorizadoGuard] },
      { path: 'parametro', component: ParametroComponent, canActivate: [AutorizadoGuard] },
      { path: 'productosbo', component: SettingproductosComponent, canActivate: [AutorizadoGuard] },
      { path: 'clientesbo', component: SettingclientesComponent, canActivate: [AutorizadoGuard] },

      { path: 'pedidoslist', component: PedidoslistComponent, canActivate: [AutorizadoGuard] },
      { path: 'pedidoscliente', component: PedidoslistclientesComponent, canActivate: [AutorizadoGuard] },

      { path: 'cotizacionesbo', component: SettingcotizacionesComponent, canActivate: [AutorizadoGuard] },

      { path: 'notifica/:tipo/:clave', component: NotificaComponent },
      { path: 'login', component: LoginComponent },
      { path: 'registra', component: RegistrationComponent },
      { path: 'registra/:reqlanding', component: RegistrationComponent },

      { path: 'mantenimiento', component: MantenimientoComponent },


      { path: 'ventaslist', component: ListadoventasComponent },
      { path: 'ventaslist/:cargarListados', component: ListadoventasComponent },      
      { path: 'documentoventa/:tipoComprobante', component: DocumentoventaComponent },
      { path: 'documentoventa/:tipoComprobante/:idDocumentoVenta', component: DocumentoventaComponent },
      { path: 'recibo', component: ReciboComponent },
      { path: 'recibo/:idDocumenotVenta', component: ReciboComponent },

      { path: 'tipos', component: SettingtiposComponent },

];

@NgModule({
      imports: [
            RouterModule.forRoot(routes, { useHash: true }),
      ],
      exports: [RouterModule]
})
export class AppRoutingModule { }
export const AppRoutingProviders: any[] = [];
export const Routing: ModuleWithProviders = RouterModule.forRoot(routes);