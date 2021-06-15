import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GlobalService } from './global.service';
import { PouchDBServices } from './pouch-db.services';
import { observable } from 'rxjs';

import { Parametro } from '../models/parametro';


@Injectable({
      providedIn: 'root'
})
export class ParametroServices {

      public url: string;
      public _idParamsDB: string = 'PARAMS_01';

      constructor(
            private _http: HttpClient,
            private _pouchDBServices: PouchDBServices,
            private _globalService: GlobalService
      ) {
            this.url = _globalService.url;
            //this.url = sessionStorage.getItem('UrlApi');
      }

      getParametrosApp(): Observable<any> {
            return this._http.get('../../assets/data/params.json');
      }

      getParametroValor(clave: string): Observable<Parametro> {
            const obs$ = new Observable<Parametro>(observer => {
                  let parametro: Parametro = this.parserParametroStorage(clave);
                  observer.next(parametro);
            });
            return obs$;
      }

      parserParametroStorage(clave: string): Parametro {
            let params = sessionStorage.getItem("ParametrosAPP");

            let parametros: Array<Parametro> = JSON.parse(params);
            return parametros.find(item => item.Clave === clave);
      }

      getParametro_MonedaVenta(): string {
            let param: Parametro = this.parserParametroStorage('MONEDA_VENTA');
            if (param.Valor === 'DOLAR_EEUU')
                  return 'USD';
            else
                  return '$';
      }


      obtenerTodosParametros() {
            return new Promise<void>((resolve, reject) => {

                  if (sessionStorage.getItem("ParametrosAPP") != null) {
                        resolve();
                  } else {
                        this.getAllParametros().subscribe(
                              (response: Parametro) => {
                                    console.log("response", response);
                                    if (response) {
                                          sessionStorage.setItem("ParametrosAPP", JSON.stringify(response));
                                    }
                                    resolve();
                              },
                              error => { reject(error); }
                        );
                  }
            });

      }

      getParametros(): Observable<any> {
            let headers = new HttpHeaders().set('Content-Type', 'application/json');
            return this._http.get(this.url + 'parametro', { headers: headers });
      }
      getAllParametros(): Observable<any> {
            let headers = new HttpHeaders().set('Content-Type', 'application/json');
            return this._http.get(this.url + 'parametro/getall', { headers: headers });
      }
      getParametro(id: number): Observable<any> {
            let headers = new HttpHeaders().set('Content-Type', 'application/json');

            return this._http.get(this.url + 'parametro' + '/' + id, { headers: headers });
      }

      saveParametro(parametro: Parametro): Observable<any> {
            let params = JSON.stringify(parametro);
            let headers = new HttpHeaders().set('Content-Type', 'application/json');

            return this._http.post(this.url + 'parametro', params, { headers: headers });
      }

}
