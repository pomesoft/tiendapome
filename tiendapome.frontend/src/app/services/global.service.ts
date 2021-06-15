import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
      providedIn: 'root'
})
export class GlobalService {

      public url: string;
      public TittleIndex: string;

      constructor(
            private _http: HttpClient
      ) {
            if (environment.production) {
                  this.url = `${window.location.origin}/backend/api/`;
            } else {
                  this.url = 'http://localhost:61044/api/';
            }
            this.TittleIndex = '';
      }

      inicializar() {
            // Leer el archivo JSON
            this._http.get('../../assets/data/params.json')
                  .subscribe((resp: any) => {
                        this.url = resp.UrlApi;
                        sessionStorage.setItem('UrlApi', this.url);
                        this.TittleIndex = resp.TittleIndex;
                        console.log(resp);

                  });
      }
}
