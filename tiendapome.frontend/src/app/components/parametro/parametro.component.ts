import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'node_modules/angular-notifier';

import { Parametro } from '../../models/parametro';

import { ParametroServices } from '../../services/parametro.services';

@Component({
      selector: 'parametro',
      templateUrl: './parametro.component.html',
      styleUrls: ['./parametro.component.css'],
      providers: [ParametroServices]
})
export class ParametroComponent implements OnInit {

      public Parametros: Array<Parametro>;

      constructor(
            private _parametroServices: ParametroServices,
            private _notifier: NotifierService
      ) {
            this.Parametros = new Array<Parametro>();
      }

      ngOnInit() {
            this.getParametros();
      }

      getParametros() {
            this._parametroServices.getParametros().subscribe(
                  response => {
                        if (response) {
                              this.Parametros = response;
                        }
                  },
                  error => {
                        console.log("ERROR::");
                        console.log(<any>error);
                  }
            );
      }

      agregarItem($event: any) {
            $event.preventDefault();
            this.Parametros = [];
            this.Parametros.push(new Parametro(-1, '', true, '', '', true));
      }

      guardar(
            item: Parametro,
            $event: any
      ) {

            $event.preventDefault();

            this._parametroServices.saveParametro(item).subscribe(
                  response => {
                        this.showNotification('success', 'El parametro se actualizó correctamente.');
                        this.getParametros();
                  },
                  error => {
                        console.log("ERROR::");
                        console.log(<any>error);
                  }
            );
      }

      public showNotification(type: string, message: string): void {
            this._notifier.notify(type, message);
      }
      public hideOldestNotification(): void {
            this._notifier.hideOldest();
      }
}
