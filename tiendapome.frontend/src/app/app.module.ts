import { HttpClientModule } from '@angular/common/http';
import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'node_modules/ngx-pagination/dist/ngx-pagination';
import { InfiniteScrollModule } from 'node_modules/ngx-infinite-scroll';
import { NotifierModule, NotifierOptions } from 'node_modules/angular-notifier';
import { NgBootstrapFormValidationModule } from 'node_modules/ng-bootstrap-form-validation';
import { ServiceWorkerModule } from '@angular/service-worker';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { PagesModule } from './pages/pages.module';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { MenuproductosComponent } from './components/menuproductos/menuproductos.component';
import { ProductosComponent } from './components/productos/productos.component';


import { ListapreciosComponent } from './components/listaprecios/listaprecios.component';
import { NavbarcarritoComponent } from './components/navbarcarrito/navbarcarrito.component';
import { NavbarbackofficeComponent } from './components/navbarbackoffice/navbarbackoffice.component';
import { HomebackofficeComponent } from './components/homebackoffice/homebackoffice.component';
import { ParametroComponent } from './components/parametro/parametro.component';
import { PedidoComponent } from './components/pedido/pedido.component';
import { SettingproductosComponent } from './components/settingproductos/settingproductos.component';
import { SettingclientesComponent } from './components/settingclientes/settingclientes.component';
import { PedidoslistComponent } from './components/pedidoslist/pedidoslist.component';
import { LoginComponent } from './components/login/login.component';
import { NotificaComponent } from './components/notifica/notifica.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { SettingcotizacionesComponent } from './components/settingcotizaciones/settingcotizaciones.component';
import { NavbarcarritopublicoComponent } from './components/navbarcarritopublico/navbarcarritopublico.component';
import { PedidoslistclientesComponent } from './components/pedidoslistclientes/pedidoslistclientes.component';
import { MantenimientoComponent } from './components/mantenimiento/mantenimiento.component';

/**
 * Custom angular notifier options
 */
const customNotifierOptions: NotifierOptions = {
      position: {
            horizontal: { position: 'left', distance: 12 },
            vertical: { position: 'top', distance: 80, gap: 10 }
      },
      theme: 'material',
      behaviour: { autoHide: 2000, onClick: 'hide', onMouseover: 'pauseAutoHide', showDismissButton: true, stacking: 4 },
      animations: {
            enabled: true,
            show: { preset: 'slide', speed: 300, easing: 'ease' },
            hide: { preset: 'fade', speed: 300, easing: 'ease', offset: 50 },
            shift: { speed: 300, easing: 'ease' },
            overlap: 150
      }
};

@NgModule({
      declarations: [
            AppComponent,
            MenuproductosComponent,
            HomeComponent,
            ProductosComponent,
            ListapreciosComponent,
            NavbarcarritoComponent,
            NavbarbackofficeComponent,
            HomebackofficeComponent,
            ParametroComponent,
            PedidoComponent,
            SettingproductosComponent,
            SettingclientesComponent,
            PedidoslistComponent,
            LoginComponent,
            NotificaComponent,
            RegistrationComponent,
            SettingcotizacionesComponent,
            NavbarcarritopublicoComponent,
            PedidoslistclientesComponent,
            MantenimientoComponent
      ],
      imports: [
            BrowserModule,
            AppRoutingModule,
            FormsModule,
            HttpClientModule,
            NgxPaginationModule,
            ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
            NotifierModule.withConfig(customNotifierOptions),
            NgBootstrapFormValidationModule.forRoot(),
            InfiniteScrollModule,
            NgbModule,
            PagesModule,

      ],
      providers: [
            Title,
      ],
      bootstrap: [ AppComponent ]
})
export class AppModule { }
