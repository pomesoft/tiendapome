import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { NgxPaginationModule } from 'node_modules/ngx-pagination/dist/ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NotifierModule, NotifierOptions } from 'node_modules/angular-notifier';

import { ListadoventasComponent } from './listadoventas/listadoventas.component';
import { PagesComponent } from './pages.component';
import { ReciboComponent } from './recibo/recibo.component';
import { DocumentoventaComponent } from './documentoventa/documentoventa.component';
import { SettingtiposComponent } from './settingtipos/settingtipos.component';


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
        PagesComponent,
        ListadoventasComponent,
        ReciboComponent,
        DocumentoventaComponent,
        SettingtiposComponent,
    ],
    exports:[
        ListadoventasComponent,
        ListadoventasComponent,
        ReciboComponent,
        DocumentoventaComponent,
    ],
    imports: [
        CommonModule, 
        FormsModule,
        NgxPaginationModule,
        NotifierModule.withConfig(customNotifierOptions),
        NgbModule,
    ]
})
export class PagesModule { }
